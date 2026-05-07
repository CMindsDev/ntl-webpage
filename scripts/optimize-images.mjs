import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const assetsDir = path.join(root, 'public', 'assets');

const profiles = [
  {
    name: 'story thumbnails',
    test: (file) => file.includes('/historias/'),
    width: 360,
    quality: 54,
  },
  {
    name: 'small masked people',
    test: (file) => file.includes('/CEIBA/ceiba-persona-') || file.includes('/regenera/fan_'),
    width: 420,
    quality: 58,
  },
  {
    name: 'home gallery and cards',
    test: (file) => file.includes('/images/gallery-'),
    width: 900,
    quality: 60,
  },
  {
    name: 'ceiba gallery',
    test: (file) => file.includes('/CEIBA/galeria-ceiba-'),
    width: 760,
    quality: 60,
  },
  {
    name: 'studio gallery',
    test: (file) => file.includes('/Studio/studio-gallery-'),
    width: 900,
    quality: 60,
  },
  {
    name: 'hero subjects',
    test: (file) => (
      file.endsWith('/images/colibri.webp') ||
      file.endsWith('/images/ecos-subject.webp') ||
      file.endsWith('/regenera/people-regen.webp') ||
      file.endsWith('/CEIBA/lina-subject.webp') ||
      file.endsWith('/Studio/subject-studio.webp')
    ),
    width: 1200,
    quality: 68,
  },
  {
    name: 'hero backgrounds',
    test: (file) => (
      file.endsWith('/images/hero-bg.webp') ||
      file.endsWith('/images/ecos-bg.webp') ||
      file.endsWith('/regenera/bg-regenera.webp') ||
      file.endsWith('/CEIBA/bg-ceiba.webp') ||
      file.endsWith('/Studio/bg-studio.webp')
    ),
    width: 1600,
    quality: 64,
  },
  {
    name: 'program backgrounds',
    test: (file) => file.includes('/images/') && file.endsWith('-line-bg.webp') || file.endsWith('/images/ecos-line.webp'),
    width: 1600,
    quality: 62,
  },
  {
    name: 'ceiba shapes',
    test: (file) => file.includes('/CEIBA/ceiba-shape-'),
    width: 360,
    quality: 58,
  },
];

async function listFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(fullPath);
    return fullPath;
  }));
  return files.flat();
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function profileFor(filePath) {
  const normalized = toPosix(filePath);
  return profiles.find((profile) => profile.test(normalized));
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const rasterExtensions = new Set(['.webp', '.png', '.jpg', '.jpeg']);

async function optimize(filePath) {
  const profile = profileFor(filePath);
  if (!profile) return null;

  const before = await fs.stat(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const outputPath = extension === '.webp' ? filePath : filePath.slice(0, -extension.length) + '.webp';
  const image = sharp(filePath, { animated: false, limitInputPixels: false });
  const metadata = await image.metadata();
  const resizeWidth = metadata.width && metadata.width > profile.width ? profile.width : undefined;

  const output = await image
    .resize({ width: resizeWidth, withoutEnlargement: true })
    .webp({
      quality: profile.quality,
      effort: 6,
      smartSubsample: true,
      nearLossless: false,
    })
    .toBuffer();

  if (extension === '.webp' && output.length >= before.size * 0.95) {
    return {
      filePath,
      outputPath,
      profile: profile.name,
      skipped: true,
      before: before.size,
      after: before.size,
      width: metadata.width,
      height: metadata.height,
    };
  }

  await fs.writeFile(outputPath, output);
  if (outputPath !== filePath) await fs.unlink(filePath);
  const afterMetadata = await sharp(output).metadata();

  return {
    filePath,
    outputPath,
    profile: profile.name,
    skipped: false,
    before: before.size,
    after: output.length,
    width: afterMetadata.width,
    height: afterMetadata.height,
  };
}

const imageFiles = (await listFiles(assetsDir)).filter((file) => rasterExtensions.has(path.extname(file).toLowerCase()));
const results = (await Promise.all(imageFiles.map(optimize))).filter(Boolean);

let saved = 0;
for (const result of results) {
  saved += result.before - result.after;
  const relative = toPosix(path.relative(root, result.filePath));
  const outputRelative = toPosix(path.relative(root, result.outputPath));
  const status = result.skipped ? 'kept' : 'optimized';
  const target = relative === outputRelative ? relative : `${relative} -> ${outputRelative}`;
  console.log(`${status.padEnd(9)} ${formatBytes(result.before).padStart(7)} -> ${formatBytes(result.after).padStart(7)} ${String(result.width).padStart(4)}x${String(result.height).padEnd(4)} ${result.profile.padEnd(20)} ${target}`);
}

console.log(`\nOptimized ${results.filter((result) => !result.skipped).length}/${results.length} files, saved ${formatBytes(saved)}.`);