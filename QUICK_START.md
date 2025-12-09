# Quick Start - SIP Monitor

## 🎯 Fastest Way to Get Started

### 1. Install Dependencies

```powershell
# In the mergdata-moniter directory
powershell -ExecutionPolicy Bypass -Command "npm install lucide-react socket.io express"
```

### 2. Start the SIP Backend Server

```powershell
# In a NEW terminal window
cd c:\Users\bekoe\.gemini\antigravity\scratch\mergdata-moniter
node sip-server.js
```

This will start the SIP monitoring backend on `http://localhost:3001`

### 3. Start Next.js

```powershell
# In ANOTHER terminal window
cd c:\Users\bekoe\.gemini\antigravity\scratch\mergdata-moniter
npm run dev
```

This will start your Next.js app on `http://localhost:3000`

### 4. Access the SIP Monitor

Open your browser and go to:
```
http://localhost:3000/sip-monitor
```

## ✅ That's It!

You should now see the SIP Monitor dashboard. You can:
- Click "Add Trunk" to add a new SIP trunk
- Monitor real-time status updates
- Edit or delete existing trunks

## 🔧 If You Get Errors

### "Cannot find module 'lucide-react'"
Run:
```powershell
powershell -ExecutionPolicy Bypass -Command "npm install lucide-react"
```

### "Cannot find module 'socket.io'"
Run:
```powershell
powershell -ExecutionPolicy Bypass -Command "npm install socket.io express"
```

### Port Already in Use
If port 3001 is already in use, edit `sip-server.js` and change:
```javascript
const PORT = 3001; // Change to 3002 or another port
```

Then update `src/pages/sip-monitor.tsx`:
```typescript
socket = io('http://localhost:3002'); // Match the new port
```

## 📁 Files Added to Your Project

```
mergdata-moniter/
├── src/
│   ├── components/
│   │   └── SIPMonitor/
│   │       ├── Dashboard.tsx       ✅ Created
│   │       ├── TrunkCard.tsx       ✅ Created
│   │       └── AddTrunkModal.tsx   ✅ Created
│   └── pages/
│       └── sip-monitor.tsx         ✅ Created
├── sip-server.js                   ✅ Copied
├── sipMonitor.js                   ✅ Copied
├── trunks.json                     ✅ Copied
├── package.json                    ✅ Updated (added lucide-react)
└── SIP_MONITOR_INTEGRATION.md      ✅ Full documentation
```

## 🚀 Next Steps

1. **Add to Navigation**: Add a link to `/sip-monitor` in your navbar
2. **Customize**: Edit the components to match your design system
3. **Deploy**: See `SIP_MONITOR_INTEGRATION.md` for deployment options

---

**Need Help?** Check `SIP_MONITOR_INTEGRATION.md` for detailed documentation!
