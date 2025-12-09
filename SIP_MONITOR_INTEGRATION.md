# SIP Monitor Integration - Complete Guide

## ✅ What's Been Done

I've successfully integrated the SIP monitoring dashboard into your Next.js project! Here's what was added:

### 📁 Files Created

1. **Components** (TypeScript):
   - `src/components/SIPMonitor/Dashboard.tsx` - Main dashboard component
   - `src/components/SIPMonitor/TrunkCard.tsx` - Individual trunk card display
   - `src/components/SIPMonitor/AddTrunkModal.tsx` - Modal for adding/editing trunks

2. **Page**:
   - `src/pages/sip-monitor.tsx` - SIP Monitor page (accessible at `/sip-monitor`)

3. **Dependencies**:
   - Added `lucide-react` for icons

## 🚀 Next Steps

### Step 1: Install Dependencies

Run this command in your Next.js project directory:

```bash
npm install lucide-react
```

Or if you have PowerShell execution policy issues:

```powershell
powershell -ExecutionPolicy Bypass -Command "npm install lucide-react"
```

### Step 2: Set Up the Backend

You have **two options**:

#### **Option A: Separate Backend Server (Recommended for Quick Start)**

1. Copy the backend files from the SIP dashboard project:
   ```
   sip_dashboard/server.js → Your project root
   sip_dashboard/sipMonitor.js → Your project root
   sip_dashboard/trunks.json → Your project root
   ```

2. Install backend dependencies in your Next.js project:
   ```bash
   npm install socket.io express
   ```

3. Run the backend server (in a separate terminal):
   ```bash
   node server.js
   ```
   This will run on `http://localhost:3001`

4. Run your Next.js app (in another terminal):
   ```bash
   npm run dev
   ```

5. Visit: `http://localhost:3000/sip-monitor`

#### **Option B: Integrated Custom Next.js Server**

Create a custom Next.js server that includes Socket.IO:

1. Create `server.js` in your Next.js project root:

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const express = require('express');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Load trunks
const trunksFile = path.join(__dirname, 'trunks.json');
let trunks = [];

if (fs.existsSync(trunksFile)) {
  trunks = JSON.parse(fs.readFileSync(trunksFile, 'utf8'));
}

app.prepare().then(() => {
  const expressApp = express();
  expressApp.use(express.json());

  const server = createServer(expressApp);

  // Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  // Socket.IO connection
  io.on('connection', (socket) => {
    console.log('Client connected');
    
    // Send initial state
    socket.emit('initial_state', trunks);

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // API Routes for trunk management
  expressApp.get('/api/trunks', (req, res) => {
    res.json(trunks);
  });

  expressApp.post('/api/trunks', (req, res) => {
    const newTrunk = {
      id: Date.now().toString(),
      ...req.body,
      status: 'Unknown',
      calls: 0,
      latency: '0ms',
      timestamp: new Date().toISOString()
    };
    trunks.push(newTrunk);
    fs.writeFileSync(trunksFile, JSON.stringify(trunks, null, 2));
    io.emit('trunk_added', newTrunk);
    res.json(newTrunk);
  });

  expressApp.put('/api/trunks/:id', (req, res) => {
    const { id } = req.params;
    const index = trunks.findIndex(t => t.id === id);
    if (index !== -1) {
      trunks[index] = { ...trunks[index], ...req.body };
      fs.writeFileSync(trunksFile, JSON.stringify(trunks, null, 2));
      io.emit('trunk_updated', trunks[index]);
      res.json(trunks[index]);
    } else {
      res.status(404).json({ error: 'Trunk not found' });
    }
  });

  expressApp.delete('/api/trunks/:id', (req, res) => {
    const { id } = req.params;
    trunks = trunks.filter(t => t.id !== id);
    fs.writeFileSync(trunksFile, JSON.stringify(trunks, null, 2));
    io.emit('trunk_deleted', id);
    res.json({ success: true });
  });

  // Next.js request handler
  expressApp.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.IO server running`);
  });
});
```

2. Create `trunks.json` in your project root:

```json
[]
```

3. Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}
```

4. Install dependencies:
```bash
npm install socket.io express
```

5. Run:
```bash
npm run dev
```

### Step 3: Add Navigation Link

Add a link to the SIP Monitor in your navigation. Edit `src/components/Shared/Navbar.tsx`:

```tsx
<Link href="/sip-monitor">
  SIP Monitor
</Link>
```

### Step 4: Environment Variables (Optional)

Create/update `.env.local`:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

Then update `src/pages/sip-monitor.tsx`:

```typescript
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
socket = io(SOCKET_URL);
```

## 🎨 Features

- ✅ Real-time SIP trunk monitoring
- ✅ Add/Edit/Delete trunks
- ✅ Live status updates (Up/Down/Lag)
- ✅ Active call tracking
- ✅ Latency monitoring
- ✅ Beautiful, modern UI with Tailwind CSS
- ✅ TypeScript support
- ✅ Responsive design

## 📊 Usage

1. Navigate to `/sip-monitor` in your browser
2. Click "Add Trunk" to add a new SIP trunk
3. Fill in the trunk details (Name, Provider, IP, Port)
4. Monitor real-time status updates
5. Edit or delete trunks as needed

## 🔧 Customization

### Change Colors

Edit the Tailwind classes in the components:
- Primary color: `bg-blue-500` → `bg-[your-color]`
- Success: `bg-emerald-500`
- Error: `bg-red-500`
- Warning: `bg-amber-500`

### Add More Metrics

Edit `TrunkCard.tsx` to add more metrics like:
- Packet loss
- Jitter
- Call quality
- Uptime percentage

## 🐛 Troubleshooting

### Socket.IO Connection Issues

If you see connection errors:
1. Make sure the backend server is running on port 3001
2. Check CORS settings in the backend
3. Verify the Socket.IO URL in `sip-monitor.tsx`

### TypeScript Errors

Run:
```bash
npm install
```

This will install all dependencies and resolve type errors.

### Port Conflicts

If port 3001 is in use, change it in:
- `server.js` (backend)
- `src/pages/sip-monitor.tsx` (frontend connection)

## 📝 Files Location

```
mergdata-moniter/
├── src/
│   ├── components/
│   │   └── SIPMonitor/
│   │       ├── Dashboard.tsx
│   │       ├── TrunkCard.tsx
│   │       └── AddTrunkModal.tsx
│   └── pages/
│       └── sip-monitor.tsx
├── server.js (if using Option B)
├── trunks.json (trunk data storage)
└── package.json (updated with lucide-react)
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production

**Option A (Separate Backend)**:
1. Deploy backend separately (e.g., on a VPS)
2. Update `NEXT_PUBLIC_SOCKET_URL` to point to your backend
3. Deploy Next.js to Vercel/Netlify

**Option B (Custom Server)**:
1. Deploy to a VPS or container service
2. Cannot use Vercel (doesn't support custom servers)
3. Use PM2 or similar for process management

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the server logs
3. Verify all dependencies are installed
4. Ensure ports 3000 and 3001 are available

---

**Next Action**: Choose Option A or B above and follow the steps to get the backend running!
