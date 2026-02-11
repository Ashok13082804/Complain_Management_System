# YellowShield Project Setup Guide

Follow these steps to run the YellowShield project on another laptop (e.g., your friend's laptop).

## 1. Requirements (Prerequisites)

Before copying the project, ensure the following are installed on the target laptop:

1.  **Node.js (LTS Version)**
    *   Download and install from: [https://nodejs.org/](https://nodejs.org/)
    *   After installing, open a terminal (Command Prompt) and type `node -v` to verify. It should show a version number (e.g., v18.x or v20.x).

2.  **VS Code (Visual Studio Code)**
    *   Download and install from: [https://code.visualstudio.com/](https://code.visualstudio.com/)

3.  **Git (Optional but Recommended)**
    *   Download from: [https://git-scm.com/](https://git-scm.com/)

---

## 2. Setting Up the Project

1.  **Copy the Project Folder**:
    *   Copy the entire `PROJECT` folder from your laptop to your friend's laptop (e.g., via USB drive, Google Drive, or GitHub).
    *   Place it in a simple location, like `D:\PROJECT` or `C:\Users\Name\Desktop\YellowShield`.

2.  **Open in VS Code**:
    *   Open **VS Code**.
    *   Go to **File** > **Open Folder...**.
    *   Select the `PROJECT` folder you just copied.

---

## 3. Running the Application

We have included a simple script to handle everything for you.

### Option A: The Easy Way (Recommended)
1.  In the project folder, look for a file named `start_app.bat`.
2.  **Double-click** `start_app.bat`.
3.  This script will automatically:
    *   Install necessary libraries (if missing).
    *   Start the **Backend Server** (Port 5000).
    *   Start the **Frontend Client** (Port 5173).
    *   Open the website in your default browser.

### Option B: The Manual Way (If script fails)
If you prefer using the terminal in VS Code:

**1. Start the Backend:**
Open a new terminal in VS Code (`Ctrl + ~`) and run:
```bash
cd server
npm install  # Only needed the first time
npm run dev
```

**2. Start the Frontend:**
Open a **second** terminal (click the `+` icon in terminal panel) and run:
```bash
cd client
npm install  # Only needed the first time
npm run dev
```

**3. Open in Browser:**
*   Frontend: [http://localhost:5173](http://localhost:5173)
*   Backend API: [http://localhost:5000](http://localhost:5000)

---

## 4. Admin Credentials
To access the Admin Portal:
*   **Email**: `admin@yellowshield.com`
*   **Password**: `admin123`

---

## Troubleshooting
*   **"Node is not recognized"**: You didn't install Node.js. Install it and restart the computer.
*   **"Server Error"**: Make sure the backend terminal is running and connected to the database.

### 🛑 Fix: Vite Proxy Error (ECONNREFUSED)
If you see `http proxy error: /api/... AggregateError [ECONNREFUSED]`, it means the **Backend is not responding**.

**Step-by-Step Fix for Windows:**
1.  **Check the Backend Terminal**:
    *   Find the terminal window running the Backend (Port 5000).
    *   If you see `🚀 Server running on port 5000`, the server is fine.
    *   If you see `Error: Cannot find module '...'`, you are missing a library.
2.  **Install Missing Libraries**:
    *   Go to the `server` folder in your terminal.
    *   Run: `npm install` (this installs all standard libraries).
    *   If a specific module like `moment` is mentioned, run: `npm install moment`.
3.  **Check if Port 5000 is Occupied**:
    *   Sometimes another app is using port 5000.
    *   Open **Command Prompt** (as Admin) and run:
        ```cmd
        netstat -ano | findstr :5000
        ```
    *   If you see a line ending with a number (PID), another app is using it. You may need to restart your laptop.
4.  **Advanced: Change Localhost to IP**:
    *   If it still doesn't work, open `client/vite.config.js`.
    *   Change `target: 'http://localhost:5000'` to `target: 'http://127.0.0.1:5000'`.

---

**Made with ❤️ for YellowShield Project**
