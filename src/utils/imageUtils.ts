/**
  * Remove solid background (e.g. black or white background) from canvas to make it transparent PNG
  * Only removes background pixels at the outer boundaries to protect interior logo details/text.
  */
 export function removeSolidBackground(
   ctx: CanvasRenderingContext2D,
   width: number,
   height: number,
   tolerance: number = 35
 ) {
   const imgData = ctx.getImageData(0, 0, width, height);
   const data = imgData.data;
 
   // Sample top-left corner
   const tlR = data[0];
   const tlG = data[1];
   const tlB = data[2];
   const tlA = data[3];
 
   // Only process if top-left corner is fully solid dark/black or solid light/white
   if (tlA > 200) {
     const isDark = tlR < 40 && tlG < 40 && tlB < 40;
     const isLight = tlR > 220 && tlG > 220 && tlB > 220;
 
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
         }
       }
       ctx.putImageData(imgData, 0, 0);
     }
   }
 }
 
 /**
  * Compress and downscale an image file or data URL to fit comfortably within Firestore's limit
  * while preserving crystal-clear HD resolution (up to 1200px max dimension).
  */
 export async function compressImage(
   input: File | string,
   maxDimension: number = 1200,
   quality: number = 0.95
 ): Promise<string> {
   return new Promise((resolve, reject) => {
     // If input is a File and under 500KB, read directly as data URL to preserve 100% original pixel quality
     if (input instanceof File && input.size < 500 * 1024) {
       const reader = new FileReader();
       reader.onload = (e) => {
         if (e.target?.result) {
           resolve(e.target.result as string);
         } else {
           reject(new Error('FileReader empty'));
         }
       };
       reader.onerror = reject;
       reader.readAsDataURL(input);
       return;
     }
 
     const img = new Image();
 
     const processCanvas = () => {
       let width = img.width;
       let height = img.height;
 
       // Only downscale if larger than maxDimension
       if (width > maxDimension || height > maxDimension) {
         if (width > height) {
           height = Math.round((height * maxDimension) / width);
           width = maxDimension;
         } else {
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
 
       ctx.imageSmoothingEnabled = true;
       ctx.imageSmoothingQuality = 'high';
 
       ctx.drawImage(img, 0, 0, width, height);
 
       // Always use high-quality PNG to preserve alpha channel transparency
       const compressedDataUrl = canvas.toDataURL('image/png', quality);
       resolve(compressedDataUrl);
     };
 
     img.onload = processCanvas;
     img.onerror = (err) => {
       console.warn('Image processing failed, fallback to raw input:', err);
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
       ctx.imageSmoothingEnabled = true;
       ctx.imageSmoothingQuality = 'high';
       ctx.drawImage(img, 0, 0);
       removeSolidBackground(ctx, img.width, img.height);
       resolve(canvas.toDataURL('image/png'));
     };
     img.onerror = () => resolve(imageSrc);
     img.src = imageSrc;
   });
 }

