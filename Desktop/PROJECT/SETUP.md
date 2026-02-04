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
*   **Port Check**: Ensure ports 5000 and 5173 are free.
