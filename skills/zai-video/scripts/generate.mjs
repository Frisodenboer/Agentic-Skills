import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join, isAbsolute } from "path";
import { parseArgs } from "util";

// Load .env file if ZHIPU_API_KEY is not already in the environment
if (!process.env.ZHIPU_API_KEY) {
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
    model: { type: "string", default: "cogvideox-3" },
    quality: { type: "string", default: "quality" },
    "with-audio": { type: "boolean", default: false },
    "image-url": { type: "string", multiple: true },
    size: { type: "string" },
    fps: { type: "string" },
    duration: { type: "string" },
    "output-dir": { type: "string" },
  },
});

const prompt = values.prompt;
const model = values.model || "cogvideox-3";
const quality = values.quality || "quality";
const withAudio = values["with-audio"] || false;
const imageUrls = values["image-url"] || [];
const size = values.size;
const fps = values.fps;
const duration = values.duration;

if (!prompt && imageUrls.length === 0) {
  console.error("Error: at least one of --prompt or --image-url is required");
  process.exit(1);
}

const apiKey = process.env.ZHIPU_API_KEY;
if (!apiKey) {
  console.error("Error: ZHIPU_API_KEY environment variable is not set");
  process.exit(1);
}

const validQualities = ["speed", "quality"];
if (!validQualities.includes(quality)) {
  console.error(`Error: Invalid quality "${quality}". Must be one of: ${validQualities.join(", ")}`);
  process.exit(1);
}

const validSizes = ["1280x720", "720x1280", "1024x1024", "1920x1080", "1080x1920", "2048x1080", "3840x2160"];
if (size && !validSizes.includes(size)) {
  console.error(`Error: Invalid size "${size}". Must be one of: ${validSizes.join(", ")}`);
  process.exit(1);
}

if (fps && !["30", "60"].includes(fps)) {
  console.error(`Error: Invalid fps "${fps}". Must be 30 or 60.`);
  process.exit(1);
}

if (duration && !["5", "10"].includes(duration)) {
  console.error(`Error: Invalid duration "${duration}". Must be 5 or 10.`);
  process.exit(1);
}

const defaultOutputDir = join("information", "video");
const outputDirArg = values["output-dir"] || defaultOutputDir;
const outputDir = isAbsolute(outputDirArg) ? outputDirArg : join(process.cwd(), outputDirArg);
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
const publicMatch = outputDir.replace(/\\/g, "/").match(/\/public\/(.+)$/);
const publicUrlBase = publicMatch ? `/${publicMatch[1]}` : null;

const BASE = "https://api.z.ai/api/paas/v4";

// Resolve image inputs: pass through http(s) URLs, convert local files to base64 data URIs.
function resolveImage(input) {
  if (/^https?:\/\//i.test(input) || input.startsWith("data:")) return input;
  const path = isAbsolute(input) ? input : join(process.cwd(), input);
  if (!existsSync(path)) {
    console.error(`Error: image not found (not a URL and no such file): ${input}`);
    process.exit(1);
  }
  const buf = readFileSync(path);
  const ext = path.toLowerCase().split(".").pop();
  const mime = ext === "png" ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

async function submitTask() {
  const body = { model };
  if (prompt) body.prompt = prompt;
  if (quality) body.quality = quality;
  if (withAudio) body.with_audio = true;
  if (imageUrls.length > 0) body.image_url = imageUrls.map(resolveImage);
  if (size) body.size = size;
  if (fps) body.fps = parseInt(fps, 10);
  if (duration) body.duration = parseInt(duration, 10);

  const response = await fetch(`${BASE}/videos/generations`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept-Language": "en-US,en",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Submit error (${response.status}): ${errorText}`);
    process.exit(1);
  }

  const data = await response.json();
  if (!data.id) {
    console.error("Error: API returned no task id.");
    console.error("Full response:", JSON.stringify(data, null, 2));
    process.exit(1);
  }
  return data.id;
}

async function pollResult(taskId) {
  const maxAttempts = 120; // up to ~20 min at 10s intervals
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(`${BASE}/async-result/${taskId}`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept-Language": "en-US,en",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Poll error (${response.status}): ${errorText}`);
      process.exit(1);
    }

    const data = await response.json();
    const status = data.task_status;

    if (status === "SUCCESS") return data;
    if (status === "FAIL") {
      console.error("Generation failed.");
      console.error("Full response:", JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log(`  Status: ${status || "PROCESSING"} (attempt ${attempt}/${maxAttempts}), waiting 10s...`);
    await new Promise((r) => setTimeout(r, 10000));
  }
  console.error("Error: timed out waiting for video generation.");
  process.exit(1);
}

async function downloadVideo(url, taskId) {
  console.log("Downloading generated video...");
  let res;
  const maxRetries = 8;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    res = await fetch(url);
    if (res.ok) break;
    if (attempt < maxRetries && (res.status === 404 || res.status === 403 || res.status === 503)) {
      console.log(`  Video not ready yet (attempt ${attempt}/${maxRetries}), waiting 8s...`);
      await new Promise((r) => setTimeout(r, 8000));
    } else {
      console.error(`Error downloading video (${res.status}): ${res.statusText}`);
      process.exit(1);
    }
  }
  const buffer = Buffer.from(await res.arrayBuffer());

  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 6);
  const fileName = `zai-${timestamp}-${random}.mp4`;
  const filePath = join(outputDir, fileName);
  writeFileSync(filePath, buffer);

  console.log(`Video saved: ${filePath}`);
  if (publicUrlBase) console.log(`Dev server URL: ${publicUrlBase}/${fileName}`);
  return filePath;
}

async function main() {
  console.log("Generating video with Z.AI (CogVideoX)...");
  if (prompt) console.log(`  Prompt: "${prompt}"`);
  console.log(`  Model: ${model}`);
  console.log(`  Quality: ${quality}`);
  if (withAudio) console.log(`  Audio: on`);
  if (imageUrls.length > 0) console.log(`  Images: ${imageUrls.join(", ")}`);
  if (size) console.log(`  Size: ${size}`);
  if (fps) console.log(`  FPS: ${fps}`);
  if (duration) console.log(`  Duration: ${duration}s`);
  console.log();

  const taskId = await submitTask();
  console.log(`Task submitted. ID: ${taskId}`);
  console.log("Polling for result (video generation can take several minutes)...");

  const result = await pollResult(taskId);

  const videos = result.video_result;
  if (!videos || videos.length === 0 || !videos[0].url) {
    console.error("Error: result contained no video URL.");
    console.error("Full response:", JSON.stringify(result, null, 2));
    process.exit(1);
  }

  await downloadVideo(videos[0].url, taskId);
  if (videos[0].cover_image_url) {
    console.log(`Cover image URL (temporary): ${videos[0].cover_image_url}`);
  }
}

main().catch((err) => {
  console.error("Generation failed:", err.message || err);
  process.exit(1);
});
