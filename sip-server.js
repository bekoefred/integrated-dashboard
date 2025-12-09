const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const SipSimulator = require('./simulator');
const SipMonitor = require('./sipMonitor');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;
const MONITOR_MODE = process.env.MONITOR_MODE || 'simulator';
const TRUNKS_FILE = path.join(__dirname, 'trunks.json');

app.use(cors());
app.use(bodyParser.json());

// Load Trunks
let trunks = [];
try {
    const data = fs.readFileSync(TRUNKS_FILE, 'utf8');
    trunks = JSON.parse(data);
} catch (err) {
    console.error("Error reading trunks file:", err);
    trunks = [];
}

// Initialize Monitor (Simulator or Real SIP Monitor)
let monitor;
if (MONITOR_MODE === 'real') {
    console.log('🔍 Starting Real SIP Monitor...');
    monitor = new SipMonitor(trunks, {
        interval: parseInt(process.env.MONITOR_INTERVAL) || 5000,
        timeout: parseInt(process.env.MONITOR_TIMEOUT) || 3000,
        userAgent: process.env.SIP_USER_AGENT || 'SIP-Dashboard-Monitor/1.0'
    });
} else {
    console.log('🎭 Starting Simulator Mode (for testing)...');
    monitor = new SipSimulator(trunks);
}
monitor.start();

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('Client connected');

    // Send initial state
    socket.emit('initial_state', trunks);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Monitor Events
monitor.on('update', (data) => {
    // Update local state (optional, mostly for persistence if we wanted to save status)
    // For now, we just stream the live data
    io.emit('status_update', data);
});

// API Routes
app.get('/api/trunks', (req, res) => {
    res.json(trunks);
});

app.post('/api/trunks', (req, res) => {
    const newTrunk = {
        id: `trunk_${Date.now()}`,
        ...req.body,
        status: 'Unknown'
    };
    trunks.push(newTrunk);
    saveTrunks();
    monitor.updateTrunks(trunks);
    io.emit('trunk_added', newTrunk);
    res.status(201).json(newTrunk);
});

app.put('/api/trunks/:id', (req, res) => {
    const { id } = req.params;
    const index = trunks.findIndex(t => t.id === id);
    if (index !== -1) {
        trunks[index] = { ...trunks[index], ...req.body };
        saveTrunks();
        monitor.updateTrunks(trunks);
        io.emit('trunk_updated', trunks[index]);
        res.json(trunks[index]);
    } else {
        res.status(404).json({ error: 'Trunk not found' });
    }
});

app.delete('/api/trunks/:id', (req, res) => {
    const { id } = req.params;
    trunks = trunks.filter(t => t.id !== id);
    saveTrunks();
    monitor.updateTrunks(trunks);
    io.emit('trunk_deleted', id);
    res.status(204).send();
});

function saveTrunks() {
    fs.writeFileSync(TRUNKS_FILE, JSON.stringify(trunks, null, 2));
}

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
