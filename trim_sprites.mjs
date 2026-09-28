import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dirs = [
  'public/sprites/girl1/turnaround',
  'public/sprites/girl1/action',
  'public/sprites/girl1/expression',
  'public/sprites/girl2/turnaround',
  'public/sprites/girl2/action',
  'public/sprites/girl2/expression',
];

async function trimAll() {
  for (const dir of dirs) {
    const fullDir = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullDir)) continue;
    
    const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.png'));
    for (const file of files) {
      const filePath = path.join(fullDir, file);
      const tempPath = filePath + '.tmp.png';
      try {
        await sharp(filePath).trim().toFile(tempPath);
        fs.renameSync(tempPath, filePath);
        console.log(`Trimmed ${file}`);
      } catch (err) {
        console.error(`Error trimming ${file}:`, err);
      }
    }
  }
}

trimAll();
