import { GoogleGenAI } from "@google/genai";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { parseArgs } from "util";

// Load .env file if GEMINI_API_KEY is not already in the environment
if (!process.env.GEMINI_API_KEY) {
  const envPath = join(process.cwd(), ".env");
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split(/\r?\n/)) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("#")) continue;
      const eqIndex = trimmedLine.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmedLine.slice(0, eqIndex).trim();
      const value = trimmedLine.slice(eqIndex + 1).trim();
      if (key) {
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
}

const { values } = parseArgs({
  options: {
    prompt: { type: "string" },
    resolution: { type: "string", default: "1K" },
    "aspect-ratio": { type: "string", default: "1:1" },
    "reference-image": { type: "string", multiple: true },
  },
});

const prompt = values.prompt;
const resolution = values.resolution || "1K";
const aspectRatio = values["aspect-ratio"] || "1:1";
const referenceImagePaths = values["reference-image"]
  ? Array.isArray(values["reference-image"])
    ? values["reference-image"]
    : [values["reference-image"]]
  : [];

if (!prompt) {
  console.error("Error: --prompt is required");
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY environment variable is not set");
  process.exit(1);
}

const validResolutions = ["1K", "2K", "4K"];
if (!validResolutions.includes(resolution)) {
  console.error(`Error: Invalid resolution "${resolution}". Must be one of: ${validResolutions.join(", ")}`);
  process.exit(1);
}

const validAspectRatios = ["1:1", "16:9", "9:16", "21:9"];
if (!validAspectRatios.includes(aspectRatio)) {
  console.error(`Error: Invalid aspect ratio "${aspectRatio}". Must be one of: ${validAspectRatios.join(", ")}`);
  process.exit(1);
}

const outputDir = join(process.cwd(), "public", "generated-images");
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const ai = new GoogleGenAI({ apiKey });

async function generate() {
  console.log(`Generating image...`);
  console.log(`  Prompt: "${prompt}"`);
  console.log(`  Resolution: ${resolution}`);
  console.log(`  Aspect ratio: ${aspectRatio}`);
  console.log();

  const parts = [];
  for (const refPath of referenceImagePaths) {
    const ext = refPath.split(".").pop().toLowerCase();
    const mimeType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "png" ? "image/png" : "image/jpeg";
    const imageData = readFileSync(refPath).toString("base64");
    parts.push({ inlineData: { mimeType, data: imageData } });
    console.log(`  Reference image: ${refPath}`);
  }
  parts.push({ text: prompt });

  const response = await ai.models.generateContentStream({
    model: "gemini-3.1-flash-image-preview",
    contents: [
      {
        role: "user",
        parts,
      },
    ],
    config: {
      thinkingConfig: {
        thinkingLevel: "MINIMAL",
      },
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: resolution,
      },
      responseModalities: ["IMAGE", "TEXT"],
    },
  });

  let fileIndex = 0;

  for await (const chunk of response) {
    if (!chunk.candidates?.[0]?.content?.parts) continue;

    for (const part of chunk.candidates[0].content.parts) {
      if (part.inlineData?.data) {
        const mimeType = part.inlineData.mimeType || "image/png";
        const ext = mimeType === "image/jpeg" ? ".jpg" : mimeType === "image/webp" ? ".webp" : ".png";

        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
        const random = Math.random().toString(36).slice(2, 6);
        const fileName = `img-${timestamp}-${random}${fileIndex > 0 ? `-${fileIndex}` : ""}${ext}`;
        const filePath = join(outputDir, fileName);

        const buffer = Buffer.from(part.inlineData.data, "base64");
        writeFileSync(filePath, buffer);

        console.log(`Image saved: public/generated-images/${fileName}`);
        console.log(`Dev server URL: /generated-images/${fileName}`);
        fileIndex++;
      } else if (part.text) {
        console.log(`Model response: ${part.text}`);
      }
    }
  }

  if (fileIndex === 0) {
    console.log("Warning: No image was generated. The model may have returned only text.");
  }
}

generate().catch((err) => {
  console.error("Generation failed:", err.message || err);
  process.exit(1);
});
