import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const badgesDir = path.join(__dirname, '../public/badges');

async function processImages() {
    try {
        const files = fs.readdirSync(badgesDir).filter(f => f.endsWith('.png'));

        for (const file of files) {
            const filePath = path.join(badgesDir, file);
            const tempPath = path.join(badgesDir, `temp_${file}`);

            // 1. Read image
            // 2. Threshold for white background -> make transparent
            // Simple approach: linear color distance
            // Sharp doesn't have a direct "magic wand" but we can try boolean operations or ensure alpha channel exists.
            // A more robust way with sharp is creating a mask if we know the background is pure white.
            // Let's assume near-white.

            // NOTE: Sharp's `ensureAlpha` adds alpha channel if missing.
            // To effectively remove background we might need pixel manipulation which is hard in pure sharp without raw buffer access.
            // Let's use raw buffer access.

            const { data, info } = await sharp(filePath)
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true });

            const pixelArray = new Uint8ClampedArray(data);
            const threshold = 250; // Near white

            for (let i = 0; i < pixelArray.length; i += 4) {
                const r = pixelArray[i];
                const g = pixelArray[i + 1];
                const b = pixelArray[i + 2];
                // alpha is [i+3]

                if (r > threshold && g > threshold && b > threshold) {
                    pixelArray[i + 3] = 0; // Transparent
                }
            }

            await sharp(pixelArray, {
                raw: {
                    width: info.width,
                    height: info.height,
                    channels: 4
                }
            })
                .png()
                .toFile(tempPath);

            // Replace original
            fs.unlinkSync(filePath);
            fs.renameSync(tempPath, filePath);
            console.log(`Processed ${file}`);
        }
        console.log('All images processed.');
    } catch (err) {
        console.error('Error processing images:', err);
    }
}

processImages();
