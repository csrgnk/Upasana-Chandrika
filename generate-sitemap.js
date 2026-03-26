const fs = require('fs');
const path = require('path');

const domain = "https://upasana-chandrika.omnnbc.in";
const pagesDir = path.join(__dirname, 'pages');

try {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add Home Page
    xml += `  <url>\n    <loc>${domain}/</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Scan Pages folder and generate ?page=X links
    if (fs.existsSync(pagesDir)) {
        const files = fs.readdirSync(pagesDir);
        files.forEach(file => {
            if (file.endsWith('.html')) {
                // Extract number from "page103.html" -> "103"
                const pageNum = file.replace(/[^\d]/g, '');
                if (pageNum) {
                    xml += `  <url>\n    <loc>${domain}/?page=${pageNum}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
                }
            }
        });
    }

    xml += `</urlset>`;
    fs.writeFileSync('./sitemap.xml', xml);
    console.log('SUCCESS: Sitemap for Upasana Chandrika generated!');
} catch (err) {
    console.error('ERROR:', err.message);
}
