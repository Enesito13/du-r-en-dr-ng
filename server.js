const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const ACCESS_CODE = 'HadrianÄrGay';
const PORT = 3000;

// Database setup
const db = new sqlite3.Database('messages.db', (err) => {
  if (err) console.error(err);
  else console.log('Connected to SQLite database');
});

db.run(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all messages
app.get('/api/messages', (req, res) => {
  db.all('SELECT * FROM messages ORDER BY timestamp ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// WebSocket connections
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`Client connected. Total: ${clients.size}`);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === 'auth') {
        if (message.code === ACCESS_CODE) {
          ws.authenticated = true;
          ws.send(JSON.stringify({ type: 'auth', success: true }));
        } else {
          ws.send(JSON.stringify({ type: 'auth', success: false }));
        }
      } else if (message.type === 'send' && ws.authenticated) {
        // Save message to database
        db.run(
          'INSERT INTO messages (username, text) VALUES (?, ?)',
          [message.username, message.text],
          function (err) {
            if (!err) {
              const newMessage = {
                id: this.lastID,
                username: message.username,
                text: message.text,
                timestamp: new Date().toISOString()
              };

              // Broadcast to all connected clients
              const broadcastData = JSON.stringify({
                type: 'message',
                data: newMessage
              });

              clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN && client.authenticated) {
                  client.send(broadcastData);
                }
              });
            }
          }
        );
      } else if (message.type === 'delete' && ws.authenticated) {
        // Delete message from database
        db.run('DELETE FROM messages WHERE id = ?', [message.id], (err) => {
          if (!err) {
            const deleteData = JSON.stringify({
              type: 'delete',
              id: message.id
            });

            // Broadcast deletion to all clients
            clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN && client.authenticated) {
                client.send(deleteData);
              }
            });
          }
        });
      }
    } catch (e) {
      console.error('Error processing message:', e);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`Client disconnected. Total: ${clients.size}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
