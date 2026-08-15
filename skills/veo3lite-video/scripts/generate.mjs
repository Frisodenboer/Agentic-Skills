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
    // Model variants:
    //   veo-3.1-generate-preview      — full Veo 3.1 (720p / 1080p / 4K, native audio)  [DEFAULT]
    //   veo-3.1-fast-generate-preview — same capabilities, optimised for speed
    //   veo-3.1-lite-generate-preview — cheaper, 720p / 1080p only (no 4K)
    model: { type: "string", default: "veo-3.1-generate-preview" },
    "aspect-ratio": { type: "string", default: "16:9" },
    resolution: { type: "string", default: "720p" },
    duration: { type: "string", default: "8" },
    "number-of-videos": { type: "string", default: "1" },
    "person-generation": { type: "string" },
    "output-dir": { type: "string" },
    filename: { type: "string" },
  },
});

const prompt = values.prompt;
const imagePath = values.image;
const model = values.model || "veo-3.1-generate-preview";
const aspectRatio = values["aspect-ratio"] || "16:9";
const resolution = values.resolution || "720p";
const duration = parseInt(values.duration || "8", 10);
const numberOfVideos = parseInt(values["number-of-videos"] || "1", 10);
const personGeneration = values["person-generation"];

if (!prompt && !imagePath) {
  console.error("Error: at least one of --prompt or --image is required");
  process.exit(1);
}

// --- Model validation ---
const validModels = [
  "veo-3.1-generate-preview",
  "veo-3.1-fast-generate-preview",
  "veo-3.1-lite-generate-preview",
];
if (!validModels.includes(model)) {
  console.error(`Error: Unknown model "${model}". Valid options:\n  ${validModels.join("\n  ")}`);
  process.exit(1);
}

const isLite = model.includes("lite");

// --- Resolution validation ---
const validResolutions = ["720p", "1080p", "4k"];
if (!validResolutions.includes(resolution)) {
  console.error(`Error: Invalid resolution "${resolution}". Must be one of: ${validResolutions.join(", ")}`);
  process.exit(1);
}
if (isLite && resolution === "4k") {
  console.error(
    'Error: Veo 3.1 Lite does not support 4K.\n' +
    '  Use --resolution "1080p" or "720p" for Lite, or switch to the full model:\n' +
    '  --model "veo-3.1-generate-preview" --resolution "4k"'
  );
  process.exit(1);
}

// --- Aspect ratio validation ---
const validAspectRatios = ["16:9", "9:16"];
if (!validAspectRatios.includes(aspectRatio)) {
  console.error(`Error: Invalid aspect ratio "${aspectRatio}". Must be one of: ${validAspectRatios.join(", ")}`);
  process.exit(1);
}

// --- Duration validation ---
// API accepts 4, 6, or 8 seconds. 1080p and 4K require exactly 8s.
const validDurations = [4, 6, 8];
if (!validDurations.includes(duration)) {
  console.error(`Error: Invalid duration "${values.duration}". Must be 4, 6, or 8 seconds.`);
  process.exit(1);
}
if ((resolution === "1080p" || resolution === "4k") && duration !== 8) {
  console.error(`Error: ${resolution} resolution requires exactly 8 seconds. Add --duration 8.`);
  process.exit(1);
}

// --- numberOfVideos validation ---
if (!Number.isInteger(numberOfVideos) || numberOfVideos < 1 || numberOfVideos > 4) {
  console.error(`Error: Invalid --number-of-videos "${values["number-of-videos"]}". Must be 1–4.`);
  process.exit(1);
}

// --- personGeneration validation ---
const validPersonGeneration = ["dont_allow", "allow_adult", "allow_all"];
if (personGeneration && !validPersonGeneration.includes(personGeneration)) {
  console.error(`Error: Invalid --person-generation "${personGeneration}". Must be one of: ${validPersonGeneration.join(", ")}`);
  process.exit(1);
}

// --- Image input ---
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

const defaultOutputDir = join("information", "veo video");
const outputDirArg = values["output-dir"] || defaultOutputDir;
const outputDir = isAbsolute(outputDirArg) ? outputDirArg : join(process.cwd(), outputDirArg);
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
const publicMatch = outputDir.replace(/\\/g, "/").match(/\/public\/(.+)$/);
const publicUrlBase = publicMatch ? `/${publicMatch[1]}` : null;

const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "v1beta" } });

// Human-readable model label for log output
const modelLabel =
  model === "veo-3.1-lite-generate-preview" ? "Veo 3.1 Lite" :
  model === "veo-3.1-fast-generate-preview" ? "Veo 3.1 Fast" :
  "Veo 3.1";

// Output filename prefix
const filePrefix =
  model === "veo-3.1-lite-generate-preview" ? "veo3lite" :
  model === "veo-3.1-fast-generate-preview" ? "veo3fast" :
  "veo3";

async function main() {
  console.log(`Generating video with ${modelLabel}...`);
  if (prompt) console.log(`  Prompt: "${prompt}"`);
  if (imagePath) console.log(`  Image (first frame): ${imagePath}`);
  console.log(`  Mode: ${imagePart ? "image-to-video" : "text-to-video"}`);
  console.log(`  Model: ${model}`);
  console.log(`  Aspect ratio: ${aspectRatio}`);
  console.log(`  Resolution: ${resolution}`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  Number of videos: ${numberOfVideos}`);
  if (personGeneration) console.log(`  Person generation: ${personGeneration}`);
  console.log();

  const config = {
    aspectRatio,
    resolution,
    durationSeconds: duration,
    numberOfVideos,
  };
  if (personGeneration) config.personGeneration = personGeneration;

  const request = { model, config };
  if (prompt) request.prompt = prompt;
  if (imagePart) request.image = imagePart;

  let operation = await ai.models.generateVideos(request);
  console.log(`Task submitted. Operation: ${operation.name || "(pending)"}`);
  console.log("Polling for result (video generation can take several minutes)...");

  const maxAttempts = 120;
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

  const customBase = values.filename ? values.filename.replace(/\.mp4$/i, "") : null;

  for (let n = 0; n < generatedVideos.length; n++) {
    const video = generatedVideos[n].video;
    const suffix = generatedVideos.length > 1 ? `-${n}` : "";
    const fileName = customBase
      ? `${customBase}${suffix}.mp4`
      : `${filePrefix}-${timestamp}-${random}${suffix}.mp4`;
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
