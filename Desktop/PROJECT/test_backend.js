// const fetch = require('node-fetch');
// Actually, simple http is better to avoid deps.
const http = require('http');

function testUrl(url, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`[${method}] ${url} -> Status: ${res.statusCode}`);
                console.log(`Headers: ${JSON.stringify(res.headers)}`);
                console.log(`Body (first 100 chars): ${data.substring(0, 100)}...`);
                try {
                    JSON.parse(data);
                    console.log("✅ Valid JSON");
                    resolve(true);
                } catch (e) {
                    console.log("❌ Invalid JSON (Likely HTML)");
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Error requesting ${url}:`, e.message);
            resolve(false);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function run() {
    console.log("--- DIAGNOSTIC START ---");
    await testUrl('http://localhost:5000/');
    await testUrl('http://localhost:5000/api/complaints');
    await testUrl('http://localhost:5000/api/auth/test');
    await testUrl('http://localhost:5000/api/auth/login', 'POST', { email: 'test@test.com', password: 'password' });
    console.log("--- DIAGNOSTIC END ---");
}

run();
