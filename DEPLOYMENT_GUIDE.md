# Deployment Guide - Mergdata Monitor with SIP Integration

## 📦 What to Deploy

You need to deploy **ONE directory** with everything included:

```
mergdata-moniter/  (The entire directory)
```

## 🗂️ Required Directories & Files

### **Essential Directories:**

```
mergdata-moniter/
├── src/                    ✅ REQUIRED - All source code
│   ├── components/         ✅ REQUIRED - React components (including SIPMonitor)
│   ├── pages/              ✅ REQUIRED - Next.js pages (including sip-monitor.tsx)
│   ├── assets/             ✅ REQUIRED - Images, SVGs, etc.
│   ├── hooks/              ✅ REQUIRED - Custom React hooks
│   ├── redux/              ✅ REQUIRED - State management
│   ├── styles/             ✅ REQUIRED - Global styles
│   ├── utils/              ✅ REQUIRED - Utility functions
│   └── middleware.ts       ✅ REQUIRED - Auth middleware
│
├── public/                 ✅ REQUIRED - Static assets
├── config/                 ✅ REQUIRED - Configuration files
├── context/                ✅ REQUIRED - React context providers
│
├── package.json            ✅ REQUIRED - Dependencies
├── package-lock.json       ✅ REQUIRED - Dependency lock
├── next.config.js          ✅ REQUIRED - Next.js config
├── tsconfig.json           ✅ REQUIRED - TypeScript config
├── tailwind.config.js      ✅ REQUIRED - Tailwind config
├── postcss.config.js       ✅ REQUIRED - PostCSS config
│
├── sip-server.js           ✅ REQUIRED - SIP backend server
├── sipMonitor.js           ✅ REQUIRED - SIP monitoring logic
├── simulator.js            ✅ REQUIRED - Test data simulator
├── trunks.json             ✅ REQUIRED - Trunk data storage
│
└── .env.example            ✅ REQUIRED - Environment template
```

### **NOT Required for Deployment:**

```
❌ node_modules/           (Install fresh on server)
❌ .next/                  (Build fresh on server)
❌ .env.local              (Create on server with production values)
❌ .git/                   (Optional - only if using Git)
❌ QUICK_START.md          (Optional - documentation)
❌ SIP_MONITOR_INTEGRATION.md (Optional - documentation)
```

## 🚀 Deployment Options

### **Option 1: VPS/Cloud Server (Recommended for SIP Monitor)**

Best for: Full control, Socket.IO support, custom server

**Platforms:** DigitalOcean, AWS EC2, Linode, Azure VM, Google Cloud

#### **Steps:**

1. **Prepare the directory:**
   ```bash
   # Copy only necessary files (exclude node_modules, .next, .env.local)
   rsync -av --exclude 'node_modules' --exclude '.next' --exclude '.env.local' \
     mergdata-moniter/ user@your-server:/var/www/mergdata-moniter/
   ```

2. **On the server:**
   ```bash
   cd /var/www/mergdata-moniter
   
   # Install dependencies
   npm install --production
   
   # Create production environment file
   nano .env.local
   ```

3. **Configure `.env.local` (Production):**
   ```env
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-production-secret-key-generate-random
   NEXTAUTH_URL=https://your-domain.com
   
   # API Configuration
   NEXT_PUBLIC_SOCKET_URL=https://your-domain.com
   NEXT_PUBLIC_MDAPI=https://api.mergdata.net
   
   # Google OAuth (if using)
   NEXT_PUBLIC_GOOGLE_ID=your-google-client-id
   NEXT_PUBLIC_GOOGLE_SECRET=your-google-client-secret
   ```

4. **Re-enable Authentication:**
   Edit `src/middleware.ts`:
   ```typescript
   export { default } from "next-auth/middleware";
   export const config = { matcher: ["/"] };
   ```

5. **Build the application:**
   ```bash
   npm run build
   ```

6. **Start with PM2 (Process Manager):**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Create ecosystem file
   nano ecosystem.config.js
   ```

   **ecosystem.config.js:**
   ```javascript
   module.exports = {
     apps: [
       {
         name: 'mergdata-frontend',
         script: 'npm',
         args: 'start',
         env: {
           NODE_ENV: 'production',
           PORT: 3000
         }
       },
       {
         name: 'sip-backend',
         script: './sip-server.js',
         env: {
           NODE_ENV: 'production',
           PORT: 3001
         }
       }
     ]
   };
   ```

   ```bash
   # Start both servers
   pm2 start ecosystem.config.js
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx (Reverse Proxy):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Next.js Frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # SIP Backend (Socket.IO)
       location /socket.io/ {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
       }
   }
   ```

---

### **Option 2: Vercel (Frontend Only)**

Best for: Easy deployment, but **SIP Monitor won't work** (no Socket.IO support)

**⚠️ Limitation:** Vercel doesn't support custom servers or Socket.IO, so the SIP Monitor real-time features won't work.

#### **Workaround:**
- Deploy Next.js to Vercel
- Deploy SIP backend separately (VPS, Heroku, Railway)
- Update `NEXT_PUBLIC_SOCKET_URL` to point to separate backend

#### **Steps:**

1. **Push to GitHub:**
   ```bash
   cd mergdata-moniter
   git init
   git add .
   git commit -m "Initial commit with SIP integration"
   git remote add origin https://github.com/your-username/mergdata-moniter.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Deploy SIP Backend Separately:**
   - Use Railway, Render, or Heroku for the backend
   - Deploy only: `sip-server.js`, `sipMonitor.js`, `simulator.js`, `trunks.json`
   - Update `NEXT_PUBLIC_SOCKET_URL` to backend URL

---

### **Option 3: Docker (Containerized)**

Best for: Consistent deployments, easy scaling

#### **Create Dockerfile:**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# Expose ports
EXPOSE 3000 3001

# Start both servers
CMD ["sh", "-c", "node sip-server.js & npm start"]
```

#### **Create docker-compose.yml:**

```yaml
version: '3.8'

services:
  mergdata-monitor:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL}
      - NEXT_PUBLIC_MDAPI=${NEXT_PUBLIC_MDAPI}
    volumes:
      - ./trunks.json:/app/trunks.json
    restart: unless-stopped
```

#### **Deploy:**
```bash
docker-compose up -d
```

---

## 📋 Pre-Deployment Checklist

### **1. Code Preparation:**
- [ ] Re-enable authentication in `src/middleware.ts`
- [ ] Update environment variables for production
- [ ] Remove development logs/console statements
- [ ] Test build locally: `npm run build`

### **2. Environment Variables:**
- [ ] Set `NEXTAUTH_SECRET` (generate random string)
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Set `NEXT_PUBLIC_SOCKET_URL` to production backend URL
- [ ] Configure Google OAuth credentials (if using)

### **3. Security:**
- [ ] Change default secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules

### **4. Performance:**
- [ ] Enable production mode (`NODE_ENV=production`)
- [ ] Configure caching
- [ ] Set up CDN for static assets (optional)

---

## 📁 Minimal Deployment Package

If you want to create a clean deployment package:

```bash
# Create deployment directory
mkdir mergdata-moniter-deploy

# Copy only necessary files
cp -r src/ mergdata-moniter-deploy/
cp -r public/ mergdata-moniter-deploy/
cp -r config/ mergdata-moniter-deploy/
cp -r context/ mergdata-moniter-deploy/
cp package.json mergdata-moniter-deploy/
cp package-lock.json mergdata-moniter-deploy/
cp next.config.js mergdata-moniter-deploy/
cp tsconfig.json mergdata-moniter-deploy/
cp tailwind.config.js mergdata-moniter-deploy/
cp postcss.config.js mergdata-moniter-deploy/
cp sip-server.js mergdata-moniter-deploy/
cp sipMonitor.js mergdata-moniter-deploy/
cp simulator.js mergdata-moniter-deploy/
cp trunks.json mergdata-moniter-deploy/
cp .env.example mergdata-moniter-deploy/
cp .eslintrc.json mergdata-moniter-deploy/
cp .gitignore mergdata-moniter-deploy/

# Zip for deployment
zip -r mergdata-moniter-deploy.zip mergdata-moniter-deploy/
```

---

## 🔧 Post-Deployment

### **1. Verify Deployment:**
- [ ] Main dashboard loads
- [ ] SIP Monitor page accessible
- [ ] Navigation works between pages
- [ ] Socket.IO connects successfully
- [ ] Can add/edit/delete trunks
- [ ] Real-time updates working

### **2. Monitoring:**
- Set up error logging (Sentry, LogRocket)
- Monitor server resources
- Set up uptime monitoring
- Configure alerts

### **3. Backup:**
- Backup `trunks.json` regularly
- Database backups (if using)
- Configuration backups

---

## 🆘 Troubleshooting

### **Socket.IO Not Connecting:**
- Check `NEXT_PUBLIC_SOCKET_URL` is correct
- Verify SIP backend is running
- Check firewall allows port 3001
- Ensure WebSocket support in proxy

### **Build Fails:**
- Run `npm install` fresh
- Clear `.next` directory
- Check Node.js version (18+)
- Verify all dependencies installed

### **Authentication Issues:**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches domain
- Ensure middleware is enabled

---

## 📊 Recommended: VPS Deployment

For the **best experience** with the SIP Monitor, I recommend **Option 1 (VPS)** because:

✅ Full Socket.IO support
✅ Custom server control
✅ Both frontend and backend in one place
✅ Real-time updates work perfectly
✅ Easy to manage and scale

**Recommended Providers:**
- DigitalOcean ($6/month droplet)
- Linode ($5/month)
- AWS Lightsail ($5/month)
- Hetzner ($4/month)

---

## 🎯 Quick Deployment Summary

**What you need:**
1. The entire `mergdata-moniter` directory (except node_modules, .next, .env.local)
2. A server (VPS recommended)
3. Node.js 18+ installed
4. PM2 for process management
5. Nginx for reverse proxy
6. SSL certificate (Let's Encrypt)

**Deploy in 5 steps:**
1. Copy files to server
2. Install dependencies
3. Configure environment variables
4. Build the application
5. Start with PM2

Need help with any specific deployment platform? Let me know!
