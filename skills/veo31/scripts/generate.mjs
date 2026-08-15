import { GoogleGenAI } from "@google/genai";
import { mkdirSync, existsSync, readFileSync } from "fs";
import { join, isAbsolute } from "path";
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
      if (key && !process.env[key]) process.env[key] = value;
    }
  }
}

const { values } = parseArgs({
  options: {
    prompt: { type: "string" },
    image: { type: "string" },
    // Full high-performance Veo 3.1 (NOT the lite preview). This is the premium/expensive model.
    model: { type: "string", default: "veo-3.1-generate-preview" },
    "aspect-ratio": { type: "string", default: "16:9" },
    resolution: { type: "string", default: "1080p" },
    duration: { type: "string", default: "8" },
    "number-of-videos": { type: "string", default: "1" },
    "person-generation": { type: "string" },
    "negative-prompt": { type: "string" },
    "output-dir": { type: "string" },
    filename: { type: "string" },
  },
});

const prompt = values.prompt;
const imagePath = values.image;
const model = values.model || "veo-3.1-generate-preview";
const aspectRatio = values["aspect-ratio"] || "16:9";
const resolution = values.resolution || "1080p";
const duration = parseInt(values.duration || "8", 10);
const numberOfVideos = parseInt(values["number-of-videos"] || "1", 10);
const personGeneration = values["person-generation"];
const negativePrompt = values["negative-prompt"];

if (!prompt && !imagePath) {
  console.error("Error: at least one of --prompt or --image is required");
  process.exit(1);
}

// For image-to-video, read the still and base64-encode it as the first frame.
let imagePart = null;
if (imagePath) {
  const resolved = isAbsolute(imagePath) ? imagePath : join(process.cwd(), imagePath);
  if (!existsSync(resolved)) {
    console.error(`Error: image not found: ${imagePath}`);
    process.exit(1);
  }
  const ext = resolved.toLowerCase().split(".").pop();
  const mimeType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  imagePart = { imageBytes: readFileSync(resolved).toString("base64"), mimeType };
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY environment variable is not set");
  process.exit(1);
}

const validAspectRatios = ["16:9", "16:10"];
if (!validAspectRatios.includes(aspectRatio)) {
  console.error(`Error: Invalid aspect ratio "${aspectRatio}". Must be one of: ${validAspectRatios.join(", ")}`);
  process.exit(1);
}

const validResolutions = ["720p", "1080p", "4k"];
if (!validResolutions.includes(resolution)) {
  console.error(`Error: Invalid resolution "${resolution}". Must be one of: ${validResolutions.join(", ")}`);
  process.exit(1);
}

if (!Number.isInteger(duration) || duration < 5 || duration > 8) {
  console.error(`Error: Invalid duration "${values.duration}". Must be an integer 5-8 (seconds).`);
  process.exit(1);
}

if (!Number.isInteger(numberOfVideos) || numberOfVideos < 1 || numberOfVideos > 4) {
  console.error(`Error: Invalid --number-of-videos "${values["number-of-videos"]}". Must be 1-4.`);
  process.exit(1);
}

const validPersonGeneration = ["dont_allow", "allow_adult", "allow_all"];
if (personGeneration && !validPersonGeneration.includes(personGeneration)) {
  console.error(`Error: Invalid --person-generation "${personGeneration}". Must be one of: ${validPersonGeneration.join(", ")}`);
  process.exit(1);
}

const defaultOutputDir = join("information", "veo video");
const outputDirArg = values["output-dir"] || defaultOutputDir;
const outputDir = isAbsolute(outputDirArg) ? outputDirArg : join(process.cwd(), outputDirArg);
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
const publicMatch = outputDir.replace(/\\/g, "/").match(/\/public\/(.+)$/);
const publicUrlBase = publicMatch ? `/${publicMatch[1]}` : null;

const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "v1beta" } });

async function main() {
  console.log("Generating video with Veo 3.1 (high performance — PREMIUM/EXPENSIVE model)...");
  if (prompt) console.log(`  Prompt: "${prompt}"`);
  if (imagePath) console.log(`  Image (first frame): ${imagePath}`);
  console.log(`  Mode: ${imagePart ? "image-to-video" : "text-to-video"}`);
  console.log(`  Model: ${model}`);
  console.log(`  Aspect ratio: ${aspectRatio}`);
  console.log(`  Resolution: ${resolution}`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  Number of videos: ${numberOfVideos}`);
  if (personGeneration) console.log(`  Person generation: ${personGeneration}`);
  if (negativePrompt) console.log(`  Negative prompt: "${negativePrompt}"`);
  console.log();

  const config = {
    aspectRatio,
    resolution,
    durationSeconds: duration,
    numberOfVideos,
  };
  if (personGeneration) config.personGeneration = personGeneration;
  if (negativePrompt) config.negativePrompt = negativePrompt;

  const request = { model, config };
  if (prompt) request.prompt = prompt;
  if (imagePart) request.image = imagePart;

  let operation = await ai.models.generateVideos(request);
  console.log(`Task submitted. Operation: ${operation.name || "(pending)"}`);
  console.log("Polling for result (video generation can take several minutes)...");

  const maxAttempts = 120; // up to ~20 min at 10s intervals
  let attempt = 0;
  while (!operation.done) {
    attempt++;
    if (attempt > maxAttempts) {
      console.error("Error: timed out waiting for video generation.");
      process.exit(1);
    }
    console.log(`  Not done yet (attempt ${attempt}/${maxAttempts}), waiting 10s...`);
    await new Promise((r) => setTimeout(r, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  if (operation.error) {
    console.error("Generation failed.");
    console.error("Full error:", JSON.stringify(operation.error, null, 2));
    process.exit(1);
  }

  const generatedVideos = operation.response?.generatedVideos;
  if (!generatedVideos || generatedVideos.length === 0) {
    console.error("Error: no videos were generated.");
    console.error("Full response:", JSON.stringify(operation.response, null, 2));
    process.exit(1);
  }

  console.log(`Generated ${generatedVideos.length} video(s).`);

  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 6);

  // Optional custom base name (strip any extension); falls back to a timestamped name.
  const customBase = values.filename ? values.filename.replace(/\.mp4$/i, "") : null;

  for (let n = 0; n < generatedVideos.length; n++) {
    const video = generatedVideos[n].video;
    const suffix = generatedVideos.length > 1 ? `-${n}` : "";
    const fileName = customBase
      ? `${customBase}${suffix}.mp4`
      : `veo31-${timestamp}-${random}${suffix}.mp4`;
    const filePath = join(outputDir, fileName);

    console.log(`Downloading video ${n + 1}/${generatedVideos.length}...`);
    await ai.files.download({ file: video, downloadPath: filePath });

    console.log(`Video saved: ${filePath}`);
    if (publicUrlBase) console.log(`Dev server URL: ${publicUrlBase}/${fileName}`);
  }
}

main().catch((err) => {
  console.error("Generation failed:", err.message || err);
  process.exit(1);
});
