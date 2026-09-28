import sharp from 'sharp';
import fs from 'fs';

async function process(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  
  // Find all non-transparent pixels
  const pixels = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 10) {
        pixels.push({x, y});
      }
    }
  }
  
  // Simple clustering (distance < 15 pixels)
  const clusters = [];
  for (const p of pixels) {
    let found = false;
    for (const c of clusters) {
      if (p.x >= c.minX - 15 && p.x <= c.maxX + 15 && p.y >= c.minY - 15 && p.y <= c.maxY + 15) {
        c.minX = Math.min(c.minX, p.x);
        c.maxX = Math.max(c.maxX, p.x);
        c.minY = Math.min(c.minY, p.y);
        c.maxY = Math.max(c.maxY, p.y);
        found = true;
        break;
      }
    }
    if (!found) {
      clusters.push({ minX: p.x, maxX: p.x, minY: p.y, maxY: p.y });
    }
  }
  
  // Merge overlapping or close clusters
  let merged = true;
  while(merged) {
    merged = false;
    for (let i=0; i<clusters.length; i++) {
      for (let j=i+1; j<clusters.length; j++) {
        const c1 = clusters[i];
        const c2 = clusters[j];
        if (c1.maxX >= c2.minX - 15 && c1.minX <= c2.maxX + 15 && c1.maxY >= c2.minY - 15 && c1.minY <= c2.maxY + 15) {
          c1.minX = Math.min(c1.minX, c2.minX);
          c1.maxX = Math.max(c1.maxX, c2.maxX);
          c1.minY = Math.min(c1.minY, c2.minY);
          c1.maxY = Math.max(c1.maxY, c2.maxY);
          clusters.splice(j, 1);
          merged = true;
          break;
        }
      }
      if(merged) break;
    }
  }
  
  // Output sorted by Y then X
  clusters.sort((a,b) => {
    if (Math.abs(a.minY - b.minY) > 40) return a.minY - b.minY;
    return a.minX - b.minX;
  });
  
  clusters.forEach((c, i) => {
    console.log(\[\] X: \-\ (w:\), Y: \-\ (h:\)\);
  });
}

process('c:/Users/Avrel/Desktop/Quest/public/sprites/sheet1.png');
