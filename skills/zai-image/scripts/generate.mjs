import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
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
      if (key) {
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
}

const { values } = parseArgs({
  options: {
    prompt: { type: "string" },
    model: { type: "string", default: "glm-image" },
    size: { type: "string", default: "1280x1280" },
    quality: { type: "string", default: "hd" },
  },
});

const prompt = values.prompt;
const model = values.model || "glm-image";
const size = values.size || "1280x1280";
const quality = values.quality || "hd";

if (!prompt) {
  console.error("Error: --prompt is required");
  process.exit(1);
}

const apiKey = process.env.ZHIPU_API_KEY;
if (!apiKey) {
  console.error("Error: ZHIPU_API_KEY environment variable is not set");
  process.exit(1);
}

const validModels = ["glm-image", "cogview-4-250304"];
if (!validModels.includes(model)) {
  console.error(`Error: Invalid model "${model}". Must be one of: ${validModels.join(", ")}`);
  process.exit(1);
}

const validQualities = ["hd", "standard"];
if (!validQualities.includes(quality)) {
  console.error(`Error: Invalid quality "${quality}". Must be one of: ${validQualities.join(", ")}`);
  process.exit(1);
}

// Validate size format: WxH where both are numbers divisible by 32 (glm-image) or 16 (cogview)
const sizeMatch = size.match(/^(\d+)x(\d+)$/i);
if (!sizeMatch) {
  console.error(`Error: Invalid size format "${size}". Use format WxH, e.g. "1280x1280".`);
  process.exit(1);
}
const [, widthStr, heightStr] = sizeMatch;
const width = parseInt(widthStr, 10);
const height = parseInt(heightStr, 10);

// Pre-defined sizes that bypass custom validation constraints
const glmRecommendedSizes = ["1280x1280", "1568x1056", "1056x1568", "1472x1088", "1088x1472", "1728x960", "960x1728"];
const cogviewRecommendedSizes = ["1024x1024", "768x1344", "864x1152", "1344x768", "1152x864", "1440x720", "720x1440"];

if (model === "glm-image") {
  const isRecommended = glmRecommendedSizes.includes(size.toLowerCase());
  if (!isRecommended) {
    // Custom size: validate constraints
    const divisibleBy = 32;
    const minDim = 1024;
    const maxDim = 2048;
    const maxPixels = Math.pow(2, 22);
    if (width < minDim || width > maxDim || height < minDim || height > maxDim) {
      console.error(`Error: glm-image custom dimensions must be between ${minDim}px and ${maxDim}px. Got ${width}x${height}.`);
      process.exit(1);
    }
    if (width % divisibleBy !== 0 || height % divisibleBy !== 0) {
      console.error(`Error: glm-image custom dimensions must be divisible by ${divisibleBy}. Got ${width}x${height}.`);
      process.exit(1);
    }
    if (width * height > maxPixels) {
      console.error(`Error: glm-image total pixels must not exceed ${maxPixels} (${width * height} given).`);
      process.exit(1);
    }
  }
} else {
  const isRecommended = cogviewRecommendedSizes.includes(size.toLowerCase());
  if (!isRecommended) {
    const divisibleBy = 16;
    const minDim = 512;
    const maxDim = 2048;
    const maxPixels = Math.pow(2, 21);
    if (width < minDim || width > maxDim || height < minDim || height > maxDim) {
      console.error(`Error: cogview-4-250304 custom dimensions must be between ${minDim}px and ${maxDim}px. Got ${width}x${height}.`);
      process.exit(1);
    }
    if (width % divisibleBy !== 0 || height % divisibleBy !== 0) {
      console.error(`Error: cogview-4-250304 custom dimensions must be divisible by ${divisibleBy}. Got ${width}x${height}.`);
      process.exit(1);
    }
    if (width * height > maxPixels) {
      console.error(`Error: cogview-4-250304 total pixels must not exceed ${maxPixels} (${width * height} given).`);
      process.exit(1);
    }
  }
}

const outputDir = join(process.cwd(), "public", "generated-images");
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

async function generate() {
  console.log(`Generating image with Zhipu AI...`);
  console.log(`  Prompt: "${prompt}"`);
  console.log(`  Model: ${model}`);
  console.log(`  Size: ${size}`);
  console.log(`  Quality: ${quality}`);
  console.log();

  const response = await fetch("https://api.z.ai/api/paas/v4/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, prompt, size, quality }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API error (${response.status}): ${errorText}`);
    process.exit(1);
  }

  const data = await response.json();

  if (!data.data || data.data.length === 0 || !data.data[0].url) {
    console.error("Error: API returned no image URL.");
    console.error("Full response:", JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const imageUrl = data.data[0].url;

  // Log content filter info if present
  if (data.content_filter && data.content_filter.length > 0) {
    for (const filter of data.content_filter) {
      if (filter.level < 3) {
        console.warn(`Content filter [${filter.role}]: severity level ${filter.level} (0=most severe)`);
      }
    }
  }

  // Download the image from the temporary URL (with retries — image may still be processing)
  console.log("Downloading generated image...");
  let imageResponse;
  const maxRetries = 6;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    imageResponse = await fetch(imageUrl);
    if (imageResponse.ok) break;
    if (attempt < maxRetries && (imageResponse.status === 404 || imageResponse.status === 503)) {
      console.log(`  Image not ready yet (attempt ${attempt}/${maxRetries}), waiting 5s...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      console.error(`Error downloading image (${imageResponse.status}): ${imageResponse.statusText}`);
      process.exit(1);
    }
  }

  const buffer = Buffer.from(await imageResponse.arrayBuffer());

  // Determine extension from content type
  const contentType = imageResponse.headers.get("content-type") || "image/png";
  const ext = contentType.includes("jpeg") || contentType.includes("jpg") ? ".jpg"
    : contentType.includes("webp") ? ".webp"
    : ".png";

  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 6);
  const fileName = `zai-${timestamp}-${random}${ext}`;
  const filePath = join(outputDir, fileName);

  writeFileSync(filePath, buffer);

  console.log(`Image saved: public/generated-images/${fileName}`);
  console.log(`Dev server URL: /generated-images/${fileName}`);
}

generate().catch((err) => {
  console.error("Generation failed:", err.message || err);
  process.exit(1);
});
