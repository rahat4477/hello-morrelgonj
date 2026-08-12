/**
 * Remove solid background (e.g. black or white background) from canvas to make it transparent PNG
 */
export function removeSolidBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tolerance: number = 45
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Sample top-left corner
  const tlR = data[0];
  const tlG = data[1];
  const tlB = data[2];
  const tlA = data[3];

  // If corner is not already transparent
  if (tlA > 10) {
    const isDark = tlR < 65 && tlG < 65 && tlB < 65;
    const isLight = tlR > 200 && tlG > 200 && tlB > 200;

    if (isDark || isLight) {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a === 0) continue;

        const diffR = Math.abs(r - tlR);
        const diffG = Math.abs(g - tlG);
        const diffB = Math.abs(b - tlB);

        if (diffR <= tolerance && diffG <= tolerance && diffB <= tolerance) {
          data[i + 3] = 0; // Make transparent
        } else if (diffR <= tolerance + 20 && diffG <= tolerance + 20 && diffB <= tolerance + 20) {
          // Soft edge feathering
          const maxDiff = Math.max(diffR, diffG, diffB);
          const ratio = (maxDiff - tolerance) / 20;
          data[i + 3] = Math.round(a * Math.min(1, Math.max(0, ratio)));
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
  }
}

/**
 * Compress and downscale an image file or data URL to fit comfortably within Firestore's limit.
 * Automatically removes solid black or white background to return a true transparent PNG data URL.
 */
export async function compressImage(
  input: File | string,
  maxDimension: number = 300,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const processCanvas = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve(typeof input === 'string' ? input : '');
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      // Remove solid black/white backgrounds automatically
      removeSolidBackground(ctx, width, height);

      // Always use PNG to preserve alpha channel transparency
      const compressedDataUrl = canvas.toDataURL('image/png');
      resolve(compressedDataUrl);
    };

    img.onload = processCanvas;
    img.onerror = (err) => {
      console.warn('Image compression failed, fallback to raw input:', err);
      if (typeof input === 'string') resolve(input);
      else reject(err);
    };

    if (typeof input === 'string') {
      img.src = input;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('FileReader returned empty result'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(input);
    }
  });
}

/**
 * Helper to process any image URL/dataUrl and return a transparent PNG version.
 */
export async function ensureTransparentLogo(imageSrc: string): Promise<string> {
  if (!imageSrc) return imageSrc;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve(imageSrc);
        return;
      }
      ctx.drawImage(img, 0, 0);
      removeSolidBackground(ctx, img.width, img.height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

