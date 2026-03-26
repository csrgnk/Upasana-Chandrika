const fs = require('fs');
const path = require('path');

// 1. Configuration
// Set your primary domain here
const domain = "https://upasana-chandrika.omnnbc.in"; 
// If you are using the GitHub URL directly, use: 
// const domain = "https://csrgnk.github.io/upasana-chandrika";

const postsPath = path.join(__dirname, 'data', 'posts.json');
const pagesDir = path.join(__dirname, 'pages');

try {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 2. Add Root Home Page
    xml += `  <url>\n    <loc>${domain}/</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // 3. Add Static Book Pages (Chapters/Verses) from "pages" folder
    if (fs.existsSync(pagesDir)) {
        const files = fs.readdirSync(pagesDir);
        files.forEach(file => {
            // Only process .html files and skip index.html as it's the home page
            if (file.endsWith('.html') && file !== 'index.html') {
                const pageName = file.replace('.html', '');
                xml += `  <url>\n    <loc>${domain}/${pageName}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
            }
        });
    }

    // 4. Add dynamic entries from posts.json
    if (fs.existsSync(postsPath)) {
        const data = fs.readFileSync(postsPath, 'utf8');
        const posts = JSON.parse(data);
        posts.forEach(post => {
            if (post.url) {
                // Clean the path to ensure it maps correctly to your URL structure
                let cleanPath = post.url
                    .replace(/^posts\//, '')
                    .replace(/^pages\//, '')
                    .replace('.html', '');
                
                // Get the final slug if it's nested
                if (cleanPath.includes('/')) { 
                    cleanPath = cleanPath.split('/').pop(); 
                }

                const fullUrl = `${domain}/${cleanPath}`;
                const date = post.publish_date ? post.publish_date.split('T')[0] : new Date().toISOString().split('T')[0];

                xml += `  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
            }
        });
    }

    xml += `</urlset>`;

    // 5. Write the final sitemap.xml to the root directory
    fs.writeFileSync('./sitemap.xml', xml);
    console.log('SUCCESS: Sitemap for Upasana Chandrika generated successfully!');

} catch (err) {
    console.error('ERROR during sitemap generation:', err.message);
}
