# 🚢 Deployment Guide

Complete guide for deploying the AI Market Intelligence Tool to production.

## 🎯 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Obtain API keys (OpenAI or Anthropic)
- [ ] Set up environment variables
- [ ] Configure production domain
- [ ] Set up SSL/TLS certificates

### 2. Code Preparation
- [ ] Update API integration (remove mock data)
- [ ] Test with real API calls
- [ ] Run production build locally
- [ ] Fix any build warnings

### 3. Security
- [ ] Never commit API keys to git
- [ ] Set up rate limiting
- [ ] Add CORS configuration
- [ ] Implement request validation

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Quick Deploy)

**Advantages**: Zero-config, automatic SSL, global CDN

**Steps**:
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

**Environment Variables** (in Vercel Dashboard):
```
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "react-router",
  "env": {
    "OPENAI_API_KEY": "@openai-api-key"
  }
}
```

### Option 2: Netlify

**Advantages**: Simple UI, form handling, serverless functions

**Steps**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

**Environment Variables** (in Netlify UI):
- Site Settings → Environment Variables → Add variable

### Option 3: Docker + Cloud Provider

**Dockerfile**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and Deploy**:
```bash
# Build Docker image
docker build -t ai-market-intel .

# Run locally
docker run -p 3000:3000 -e OPENAI_API_KEY=sk-... ai-market-intel

# Push to registry (example: Google Cloud)
docker tag ai-market-intel gcr.io/PROJECT_ID/ai-market-intel
docker push gcr.io/PROJECT_ID/ai-market-intel
```

### Option 4: Traditional VPS (DigitalOcean, AWS EC2, etc.)

**Setup on Ubuntu Server**:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone repository
git clone https://github.com/yourusername/ai-market-intel.git
cd ai-market-intel

# Install dependencies
npm ci

# Build
npm run build

# Set environment variables
export OPENAI_API_KEY=sk-...

# Start with PM2
pm2 start npm --name "ai-market-intel" -- start
pm2 save
pm2 startup
```

**Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔐 Environment Variables

Create `.env` file (local development only):
```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4

# Anthropic Configuration
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-opus-20240229

# Optional: API Base URL (for proxies)
API_BASE_URL=https://api.openai.com/v1

# Optional: Rate Limiting
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW=60000
```

**⚠️ IMPORTANT**: Never commit `.env` file to git!

## 🔧 Production Configuration

### Update API Route

Replace mock implementation in `app/routes/api.analyze.ts`:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function action({ request }: Route.ActionArgs) {
  try {
    const { sector } = await request.json();
    
    if (!sector) {
      return Response.json({ error: "Sector required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a market intelligence analyst for corporate venture capital.
          Analyze sectors and provide structured JSON responses with:
          - summary (1-2 paragraphs)
          - trends (3-5 bullet points)
          - startups (5-10 companies with name, description, link)
          - theses (2-3 investment themes)`
        },
        {
          role: "user",
          content: `Analyze the "${sector}" sector. Return ONLY valid JSON.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return Response.json(result);
    
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: "Failed to analyze sector" },
      { status: 500 }
    );
  }
}
```

### Install Additional Dependencies

```bash
npm install openai
# or
npm install @anthropic-ai/sdk
```

## 🚀 Build for Production

```bash
# Clean previous builds
rm -rf build .react-router

# Install dependencies
npm ci

# Build
npm run build

# Test production build locally
npm start
```

## 📊 Monitoring & Logging

### Option 1: Application Monitoring (Sentry)
```bash
npm install @sentry/react
```

```typescript
// app/root.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Option 2: Server Logs (PM2)
```bash
# View logs
pm2 logs ai-market-intel

# Monitor
pm2 monit
```

### Option 3: Cloud Provider Logs
- **Vercel**: Built-in logging in dashboard
- **Netlify**: Function logs in dashboard
- **AWS**: CloudWatch
- **Google Cloud**: Cloud Logging

## 🔒 Security Best Practices

### 1. API Key Protection
```typescript
// Never expose in client-side code
// ❌ Bad
const apiKey = "sk-..."; 

// ✅ Good - Server-side only
const apiKey = process.env.OPENAI_API_KEY;
```

### 2. Rate Limiting
```typescript
// Example with simple in-memory store
const rateLimit = new Map();

export async function action({ request }: Route.ActionArgs) {
  const ip = request.headers.get('x-forwarded-for');
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const max = 10; // 10 requests per minute

  const record = rateLimit.get(ip) || { count: 0, resetTime: now + windowMs };
  
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }
  
  if (record.count >= max) {
    return Response.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }
  
  record.count++;
  rateLimit.set(ip, record);
  
  // Continue with API call...
}
```

### 3. Input Validation
```typescript
const MAX_SECTOR_LENGTH = 100;

if (!sector || typeof sector !== 'string') {
  return Response.json({ error: "Invalid sector" }, { status: 400 });
}

if (sector.length > MAX_SECTOR_LENGTH) {
  return Response.json(
    { error: "Sector keyword too long" },
    { status: 400 }
  );
}
```

## 🧪 Pre-Production Testing

```bash
# 1. Build production
npm run build

# 2. Run production server
npm start

# 3. Test endpoints
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"sector":"AI for Healthcare"}'

# 4. Check for errors
# Look for console errors or failed requests

# 5. Test responsive design
# Use browser dev tools to test mobile/tablet views
```

## 📈 Performance Optimization

### 1. Enable Compression (Nginx)
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### 2. Cache Static Assets
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN (Cloudflare)
- Sign up for Cloudflare
- Add your domain
- Update DNS records
- Enable caching and minification

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules .react-router build
npm install
npm run build
```

### API Errors
```bash
# Check environment variables
echo $OPENAI_API_KEY

# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Port Already in Use
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

## 📞 Support & Resources

- **React Router Docs**: https://reactrouter.com
- **Vite Docs**: https://vitejs.dev
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Anthropic API Docs**: https://docs.anthropic.com

---

**Ready to deploy? Follow the checklist and choose your deployment option!** 🚀

