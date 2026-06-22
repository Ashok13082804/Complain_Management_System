const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper to check if a directory has node_modules
function hasNodeModules(dir) {
    return fs.existsSync(path.join(__dirname, dir, 'node_modules'));
}

// Helper to run a command and return a Promise
function runCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        console.log(`Running "${command} ${args.join(' ')}" in ${cwd}...`);
        const isWindows = process.platform === 'win32';
        const child = spawn(command, args, { 
            cwd, 
            shell: isWindows,
            stdio: 'inherit' 
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
}

// Function to start a service and pipe output
function startService(name, command, args, cwd) {
    const isWindows = process.platform === 'win32';
    const child = spawn(command, args, { 
        cwd, 
        shell: isWindows 
    });

    child.stdout.on('data', (data) => {
        process.stdout.write(`[${name}] ${data}`);
    });

    child.stderr.on('data', (data) => {
        process.stderr.write(`[${name} ERROR] ${data}`);
    });

    child.on('close', (code) => {
        console.log(`[${name}] Process exited with code ${code}`);
    });

    return child;
}

// Open URL in default browser
function openBrowser(url) {
    const startCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
        exec(`start ${url}`);
    } else {
        exec(`${startCmd} ${url}`);
    }
}

async function main() {
    try {
        console.log('==================================================');
        console.log('   Starting YellowShield System (Cross-Platform)...');
        console.log('==================================================\n');

        // 1. Install Server Dependencies if missing
        if (!hasNodeModules('server')) {
            console.log('[!] Server dependencies (node_modules) missing. Installing...');
            await runCommand('npm', ['install'], path.join(__dirname, 'server'));
        } else {
            console.log('[+] Server dependencies already installed.');
        }

        // 2. Install Client Dependencies if missing
        if (!hasNodeModules('client')) {
            console.log('[!] Client dependencies (node_modules) missing. Installing...');
            await runCommand('npm', ['install'], path.join(__dirname, 'client'));
        } else {
            console.log('[+] Client dependencies already installed.');
        }

        console.log('\n[+] Starting Backend and Frontend services...');

        // 3. Start Backend
        const backendProcess = startService('Backend', 'npm', ['run', 'dev'], path.join(__dirname, 'server'));

        // 4. Start Frontend
        const frontendProcess = startService('Frontend', 'npm', ['run', 'dev'], path.join(__dirname, 'client'));

        // 5. Open Browser after a short delay
        const delay = 5000; // 5 seconds
        console.log(`\n[+] Waiting ${delay / 1000} seconds for services to initialize...`);
        setTimeout(() => {
            console.log('\n[+] Opening Application in browser...');
            openBrowser('http://localhost:5173');
            console.log('\n==================================================');
            console.log('   YellowShield is Live!');
            console.log('   Frontend: http://localhost:5173');
            console.log('   Backend:  http://localhost:5001');
            console.log('==================================================');
            console.log('   Press Ctrl+C to stop both servers.');
        }, delay);

        // Keep process alive and clean up child processes on exit
        const cleanup = () => {
            console.log('\n\nShutting down services...');
            try { backendProcess.kill(); } catch (e) {}
            try { frontendProcess.kill(); } catch (e) {}
            process.exit(0);
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

    } catch (error) {
        console.error('Failed to start the application:', error);
        process.exit(1);
    }
}

main();
