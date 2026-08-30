# 🚀 Texting App Setup Instructions

## Prerequisites
You need Node.js and npm installed on your system.

### How to Install Node.js

1. **Download Node.js:**
   - Go to https://nodejs.org/
   - Download the LTS (Long Term Support) version
   - Run the installer and follow the installation wizard
   - Make sure to check "Add to PATH" during installation

2. **Verify Installation:**
   - Open PowerShell or Command Prompt
   - Type: `node --version`
   - Type: `npm --version`
   - Both should show version numbers

## Starting the App

1. **Navigate to the project folder:**
   ```
   cd C:\Users\texoy\OneDrive\Documents\cheat
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Start the server:**
   ```
   npm start
   ```

4. **Open in your browser:**
   - Go to http://localhost:3000
   - Enter the access code: `HadrianÄrGay`

## Features

✅ **Real-time messaging** - Messages appear instantly for all connected users
✅ **Persistent storage** - All messages are saved in a database and persist after closing
✅ **Delete messages** - Remove any message you've sent
✅ **Multi-user** - Everyone accessing the app can see the same messages
✅ **Access code protection** - Only people with the code can use the app
✅ **Beautiful UI** - Modern gradient design with smooth animations

## Access Code
`HadrianÄrGay`

## Troubleshooting

- **Port 3000 already in use?** - Edit server.js and change `const PORT = 3000;` to another port
- **WebSocket connection issues?** - Make sure your firewall allows local connections
- **Database errors?** - Delete `messages.db` file and restart the server
