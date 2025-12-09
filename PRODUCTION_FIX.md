# Production Deployment Fix - API URL Issue

## Problem
The SIP Monitor components were hardcoded to use `http://localhost:3001`, which doesn't work in production.

## Solution
Updated all components to use `window.location.origin` as fallback, which automatically uses the current server's URL.

## Files Fixed
1. `src/components/SIPMonitor/AddTrunkModal.tsx` - API calls for add/edit trunk
2. `src/components/SIPMonitor/TrunkCard.tsx` - API call for delete trunk  
3. `src/pages/sip-monitor.tsx` - Socket.IO connection

## On Your Server

### Step 1: Copy Updated Files
Copy these 3 fixed files to your server:
```bash
# From your local machine to server
scp src/components/SIPMonitor/AddTrunkModal.tsx user@172.105.154.225:/var/www/apps/integrated-dashboard/src/components/SIPMonitor/
scp src/components/SIPMonitor/TrunkCard.tsx user@172.105.154.225:/var/www/apps/integrated-dashboard/src/components/SIPMonitor/
scp src/pages/sip-monitor.tsx user@172.105.154.225:/var/www/apps/integrated-dashboard/src/pages/
```

### Step 2: Rebuild on Server
```bash
cd /var/www/apps/integrated-dashboard
npm run build
```

### Step 3: Restart Services
```bash
pm2 restart all
# Or if not using PM2:
# Kill existing processes and restart
```

## How It Works Now

The components will automatically use:
- **Development**: `http://localhost:3001` (from env or fallback)
- **Production**: `http://172.105.154.225:4000` (from window.location.origin)

### Environment Variable (Optional)
If you want to explicitly set the URL, add to `.env.local`:
```env
NEXT_PUBLIC_SOCKET_URL=http://172.105.154.225:4000
```

Then rebuild:
```bash
npm run build
pm2 restart all
```

## Verify
1. Go to: http://172.105.154.225:4000/sip-monitor
2. Click "Add Trunk"
3. Fill in the form and submit
4. Should work without "Failed to fetch" error ✅

## What Changed

**Before:**
```typescript
const url = `http://localhost:3001/api/trunks`;
socket = io('http://localhost:3001');
```

**After:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin;
const url = `${API_URL}/api/trunks`;
socket = io(API_URL);
```

This makes the app work on any domain/port automatically!
