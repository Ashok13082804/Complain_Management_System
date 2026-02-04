const http = require('http');

function testComplaint(payload) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/complaints',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`Payload Category: "${payload.category}" -> Status: ${res.statusCode}`);
                if (res.statusCode !== 201) {
                    console.log(`Response: ${data}`);
                }
                resolve();
            });
        });

        req.write(JSON.stringify(payload));
        req.end();
    });
}

async function runTests() {
    console.log("--- COMPLAINT SUBMISSION DIAGNOSTIC ---");

    console.log("\n1. Testing valid predefined category...");
    await testComplaint({
        name: 'Test',
        role: 'Student',
        department: 'Arts',
        category: 'Infrastructure',
        description: 'Testing valid category'
    });

    console.log("\n2. Testing empty category (should default to General)...");
    await testComplaint({
        name: 'Test',
        role: 'Student',
        department: 'Arts',
        category: '',
        description: 'Testing empty category'
    });

    console.log("\n3. Testing missing category (should default to General)...");
    await testComplaint({
        description: 'Testing missing category'
    });

    console.log("\n4. Testing invalid category (should fail)...");
    await testComplaint({
        category: 'Fake Category',
        description: 'Testing invalid category'
    });

    console.log("\n--- DIAGNOSTIC COMPLETE ---");
}

runTests();
