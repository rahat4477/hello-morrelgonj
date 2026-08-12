/**
 * Compress and downscale an image file or data URL to fit comfortably within Firestore's 1MB limit.
 * Resizes max dimension to e.g. 300px for logos or 128px for favicons, returning a compact base64 JPEG string.
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

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof input === 'string' ? input : '');
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      // Convert to compressed JPEG data URL
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
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
