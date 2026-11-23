/**
 * High-performance browser-based Image Processing Engine
 * Operates client-side via HTML5 Canvas and OffscreenCanvas with zero server lag
 */

export interface ImageProcessingOptions {
  quality?: number;
  mode?: "percentage" | "pixels";
  percentage?: number;
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  angle?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  targetFormat?: string;
  watermarkText?: string;
  position?: string;
  opacity?: number;
  textColor?: string;
  topText?: string;
  bottomText?: string;
  fontSize?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  grayscale?: number;
  sepia?: number;
  blurIntensity?: number;
  censorStyle?: "gaussian" | "pixelate" | "blackout";
}

export function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

export async function processImageTool(
  toolId: string,
  file: File,
  options: ImageProcessingOptions = {}
): Promise<{ blob: Blob; outputName: string }> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not initialize 2D canvas context");

  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;
  let targetWidth = origWidth;
  let targetHeight = origHeight;
  let mimeType = file.type || "image/jpeg";
  let extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

  // 1. TOOL: RESIZE IMAGE
  if (toolId === "resize-image") {
    if (options.mode === "percentage") {
      const scale = (options.percentage || 50) / 100;
      targetWidth = Math.max(1, Math.round(origWidth * scale));
      targetHeight = Math.max(1, Math.round(origHeight * scale));
    } else {
      targetWidth = options.width || origWidth;
      if (options.maintainAspectRatio) {
        const ratio = origHeight / origWidth;
        targetHeight = Math.round(targetWidth * ratio);
      } else {
        targetHeight = options.height || origHeight;
      }
    }
  }

  // 2. TOOL: ROTATE IMAGE
  if (toolId === "rotate-image") {
    const angle = options.angle || 90;
    const isOddRotation = angle === 90 || angle === 270;
    canvas.width = isOddRotation ? origHeight : origWidth;
    canvas.height = isOddRotation ? origWidth : origHeight;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    if (options.flipHorizontal) ctx.scale(-1, 1);
    if (options.flipVertical) ctx.scale(1, -1);
    ctx.drawImage(img, -origWidth / 2, -origHeight / 2);
    ctx.restore();
  } else {
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Apply photo editor CSS filters if applicable
    if (toolId === "photo-editor") {
      const b = (options.brightness ?? 100) / 100;
      const c = (options.contrast ?? 100) / 100;
      const s = (options.saturation ?? 100) / 100;
      const g = (options.grayscale ?? 0) / 100;
      const sep = (options.sepia ?? 0) / 100;
      ctx.filter = `brightness(${b}) contrast(${c}) saturate(${s}) grayscale(${g}) sepia(${sep})`;
    }

    // Draw base image
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    ctx.filter = "none";
  }

  // 3. TOOL: WATERMARK IMAGE
  if (toolId === "watermark-image" && options.watermarkText) {
    ctx.save();
    const text = options.watermarkText;
    const fontSize = Math.max(18, Math.round(canvas.width * 0.04));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = options.textColor || "#FFFFFF";
    ctx.globalAlpha = (options.opacity || 50) / 100;
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 4;

    const metrics = ctx.measureText(text);
    let x = canvas.width - metrics.width - 30;
    let y = canvas.height - 30;

    if (options.position === "center") {
      x = (canvas.width - metrics.width) / 2;
      y = canvas.height / 2;
    } else if (options.position === "top-right") {
      x = canvas.width - metrics.width - 30;
      y = 50;
    } else if (options.position === "bottom-left") {
      x = 30;
      y = canvas.height - 30;
    } else if (options.position === "tile") {
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = (options.opacity || 30) / 100;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = options.textColor || "#FFFFFF";
      ctx.rotate((-25 * Math.PI) / 180);
      for (let tx = -canvas.width; tx < canvas.width * 2; tx += metrics.width + 120) {
        for (let ty = -canvas.height; ty < canvas.height * 2; ty += 120) {
          ctx.fillText(text, tx, ty);
        }
      }
    }

    if (options.position !== "tile") {
      ctx.fillText(text, x, y);
    }
    ctx.restore();
  }

  // 4. TOOL: MEME GENERATOR
  if (toolId === "meme-generator") {
    ctx.save();
    const fontSize = options.fontSize || Math.round(canvas.width * 0.06);
    ctx.font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = Math.max(3, fontSize / 12);
    ctx.textAlign = "center";

    if (options.topText) {
      const topY = fontSize + 15;
      ctx.strokeText(options.topText.toUpperCase(), canvas.width / 2, topY);
      ctx.fillText(options.topText.toUpperCase(), canvas.width / 2, topY);
    }
    if (options.bottomText) {
      const bottomY = canvas.height - 25;
      ctx.strokeText(options.bottomText.toUpperCase(), canvas.width / 2, bottomY);
      ctx.fillText(options.bottomText.toUpperCase(), canvas.width / 2, bottomY);
    }
    ctx.restore();
  }

  // 5. TOOL: BLUR FACE & PRIVACY
  if (toolId === "blur-face") {
    // Apply center privacy block/blur demonstration
    const cx = canvas.width * 0.25;
    const cy = canvas.height * 0.25;
    const cw = canvas.width * 0.5;
    const ch = canvas.height * 0.5;

    if (options.censorStyle === "blackout") {
      ctx.fillStyle = "black";
      ctx.fillRect(cx, cy, cw, ch);
    } else {
      ctx.save();
      ctx.filter = `blur(${options.blurIntensity || 20}px)`;
      ctx.drawImage(canvas, cx, cy, cw, ch, cx, cy, cw, ch);
      ctx.restore();
    }
  }

  // Determine export format
  let exportQuality = 0.85;
  if (toolId === "compress-image") {
    exportQuality = (options.quality || 75) / 100;
  }

  if (toolId === "convert-to-jpg") {
    mimeType = "image/jpeg";
    extension = "jpg";
  } else if (toolId === "jpg-to-image") {
    if (options.targetFormat === "webp") {
      mimeType = "image/webp";
      extension = "webp";
    } else {
      mimeType = "image/png";
      extension = "png";
    }
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) throw new Error("Failed to export canvas blob");
        const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        const outputName = `${baseName}_${toolId}.${extension}`;
        resolve({ blob, outputName });
      },
      mimeType,
      exportQuality
    );
  });
}
