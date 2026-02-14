// Automated screenshots using Playwright
// Captures desktop, tablet, and mobile views of the local site

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async ()=>{
  const outDir = path.resolve(__dirname, '..', 'screenshots');
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const url = process.env.TARGET_URL || 'http://localhost:8000/';

  const browser = await chromium.launch();
  try{
    // Desktop
    const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await desktop.goto(url, { waitUntil: 'networkidle' });
    await desktop.screenshot({ path: path.join(outDir, 'desktop.png'), fullPage: true });
    console.log('Saved desktop screenshot');

    // Tablet
    const tablet = await browser.newPage({ viewport: { width: 768, height: 1024 }, deviceScaleFactor: 1 });
    await tablet.goto(url, { waitUntil: 'networkidle' });
    await tablet.screenshot({ path: path.join(outDir, 'tablet.png'), fullPage: true });
    console.log('Saved tablet screenshot');

    // Mobile
    const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true });
    await mobile.goto(url, { waitUntil: 'networkidle' });
    await mobile.screenshot({ path: path.join(outDir, 'mobile.png'), fullPage: true });
    console.log('Saved mobile screenshot');

    await desktop.close();
    await tablet.close();
    await mobile.close();
  }catch(err){
    console.error('Error capturing screenshots:', err);
  }finally{
    await browser.close();
  }
})();
