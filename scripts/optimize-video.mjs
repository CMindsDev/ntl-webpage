import { createWriteStream } from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { spawn } from 'node:child_process';
import sharp from 'sharp';

const sourceUrl = process.env.REGENERA_VIDEO_URL || 'https://pub-c9d9bba411f444e5a7d61a43c6e28f11.r2.dev/emprendimiento/video/regenera.mp4';
const root = process.cwd();
const tmpDir = path.join(root, 'tmp');
const outputDir = path.join(root, 'public', 'assets', 'regenera');
const sourcePath = path.join(tmpDir, 'regenera-source.mp4');
const outputVideo = path.join(outputDir, 'regenera.mp4');
const posterJpg = path.join(tmpDir, 'regenera-poster.jpg');
const outputPoster = path.join(outputDir, 'regenera-poster.webp');

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function download() {
  await fs.mkdir(tmpDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  const response = await fetch(sourceUrl);
  if (!response.ok || !response.body) {
    throw new Error(`Could not download video: ${response.status} ${response.statusText}`);
  }

  await pipeline(response.body, createWriteStream(sourcePath));
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

await download();

await run('ffmpeg', [
  '-y',
  '-i', sourcePath,
  '-vf', "scale='min(1280,iw)':-2",
  '-c:v', 'libx264',
  '-preset', 'medium',
  '-crf', '28',
  '-profile:v', 'high',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  '-c:a', 'aac',
  '-b:a', '96k',
  '-ac', '2',
  outputVideo,
]);

await run('ffmpeg', [
  '-y',
  '-ss', '3',
  '-i', outputVideo,
  '-frames:v', '1',
  '-vf', 'scale=1280:-2',
  '-q:v', '5',
  '-update', '1',
  posterJpg,
]);

await sharp(posterJpg)
  .resize({ width: 1280, withoutEnlargement: true })
  .webp({ quality: 64, effort: 6 })
  .toFile(outputPoster);

const sourceStats = await fs.stat(sourcePath);
const videoStats = await fs.stat(outputVideo);
const posterStats = await fs.stat(outputPoster);

console.log(`Video: ${formatBytes(sourceStats.size)} -> ${formatBytes(videoStats.size)}`);
console.log(`Poster: ${formatBytes(posterStats.size)}`);