const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const BASE_URL = 'https://www.chariscell.com';
const TARGET_URLS = [
  'https://www.chariscell.com/index.do',
  'https://www.chariscell.com/standard/04product/product_list.do?category=011&pgMenuSubCode=051',
  'https://www.chariscell.com/standard/04product/product_list.do?category=001&pgMenuSubCode=041',
  'https://www.chariscell.com/standard/04product/product_list.do?category=004&pgMenuSubCode=044',
  'https://www.chariscell.com/standard/04product/product_list.do?category=006&pgMenuSubCode=046',
  'https://www.chariscell.com/standard/04product/product_list.do?category=002&pgMenuSubCode=042',
  'https://www.chariscell.com/standard/04product/product_list.do?category=003&pgMenuSubCode=043',
  'https://www.chariscell.com/standard/04product/product_list.do?category=005&pgMenuSubCode=045'
];

const OUTPUT_DIR = path.join(__dirname, '../public/images/chariscell');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function downloadImage(url, filename) {
  const filePath = path.join(OUTPUT_DIR, filename);
  if (fs.existsSync(filePath)) {
    return; // Skip if already exists
  }
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10000,
    });
    return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filePath))
        .on('finish', resolve)
        .on('error', reject);
    });
  } catch (error) {
    console.error(`Failed to download ${url}: ${error.message}`);
  }
}

async function scrapeImages() {
  const downloadedUrls = new Set();
  
  for (const targetUrl of TARGET_URLS) {
    console.log(`Scraping: ${targetUrl}`);
    try {
      const { data } = await axios.get(targetUrl, { timeout: 10000 });
      const $ = cheerio.load(data);
      
      const images = $('img');
      const promises = [];
      
      images.each((i, el) => {
        let src = $(el).attr('src');
        if (!src) return;
        
        // Resolve URL
        try {
          const imgUrl = new URL(src, BASE_URL).href;
          if (downloadedUrls.has(imgUrl)) return;
          
          downloadedUrls.add(imgUrl);
          const filename = path.basename(new URL(imgUrl).pathname);
          
          if (filename && (filename.endsWith('.jpg') || filename.endsWith('.png') || filename.endsWith('.gif') || filename.endsWith('.jpeg'))) {
             promises.push(downloadImage(imgUrl, filename));
          }
        } catch (e) {
          // ignore invalid URLs
        }
      });
      
      await Promise.all(promises);
      console.log(`Finished scraping ${targetUrl}. Total unique images so far: ${downloadedUrls.size}`);
    } catch (err) {
      console.error(`Failed to scrape ${targetUrl}: ${err.message}`);
    }
  }
  console.log('All done!');
}

scrapeImages();
