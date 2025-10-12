# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: **http://localhost:5173**

That's it! The app is running with mock data.

## 🎮 How to Use

1. **Enter a sector keyword** in the search bar
   - Example: "AI for Energy Efficiency"
   - Example: "FinTech in Southeast Asia"
   - Example: "Healthcare AI"

2. **Click "Search"**
   - Mock API simulates 1.5s delay
   - Loading spinner appears

3. **Review Results**
   - 📊 Sector Summary
   - 🔎 Key Market Trends
   - 🚀 Notable Startups
   - 💰 Investment Themes

4. **Export Data**
   - Copy as Markdown
   - Download as .md file

5. **Start New Search**
   - Click "New Search" button

## 🎨 Features to Try

### Search Different Sectors
- "Quantum Computing"
- "Renewable Energy"
- "EdTech"
- "Space Technology"
- "Cybersecurity"

### Test Responsive Design
- Resize browser window
- Open DevTools (F12)
- Use device toolbar (Ctrl+Shift+M)
- Try mobile, tablet, desktop views

### Export Functionality
- Click "Copy as Markdown"
- Paste into your notes
- Or download the .md file

## 📱 Keyboard Shortcuts

- **Enter** in search bar → Submit search
- **Esc** → Clear focus
- **Tab** → Navigate between elements

## 🔧 Configuration

### Change API Delay (for testing)
Edit `app/routes/api.analyze.ts`:
```typescript
// Line 12: Adjust timeout
await new Promise((resolve) => setTimeout(resolve, 1500)); // Change 1500ms
```

### Customize Theme Colors
Edit `app/app.css`:
```css
.dark {
  --background: 222.2 84% 4.9%;  /* Adjust HSL values */
  --foreground: 210 40% 98%;
  /* ... */
}
```

## 🐛 Troubleshooting

### Port 5173 already in use?
```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

### Build errors?
```bash
# Clean install
rm -rf node_modules
npm install
```

### TypeScript errors?
```bash
# Restart TypeScript server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

## 📚 Next Steps

1. **Add Real API**: See `DEPLOYMENT.md` for OpenAI/Claude integration
2. **Customize UI**: Edit components in `app/components/`
3. **Add Features**: Check `IMPLEMENTATION.md` for architecture
4. **Deploy**: Follow `DEPLOYMENT.md` for production setup

## 🎯 Project Structure (Simplified)

```
web-ui/
├── app/
│   ├── components/      # UI components
│   ├── routes/          # Pages & API
│   ├── store/           # Zustand state
│   └── lib/             # Utilities
├── public/              # Static files
└── *.config.ts          # Configuration
```

## 💡 Pro Tips

1. **Use browser DevTools** to inspect components
2. **Check Network tab** to see API calls
3. **Console logs** show any errors
4. **React DevTools** extension helps debug state

## 📖 Documentation

- **README.md** - Full project overview
- **IMPLEMENTATION.md** - Technical deep-dive
- **DEPLOYMENT.md** - Production deployment guide

## ❓ Common Questions

**Q: Can I change the mock data?**  
A: Yes! Edit `app/routes/api.analyze.ts` → `mockResponse` object

**Q: How do I add real AI?**  
A: See `DEPLOYMENT.md` section "Update API Route"

**Q: Is dark mode only?**  
A: Currently yes. To add light mode, update `app/root.tsx` and toggle `dark` class

**Q: Can I deploy for free?**  
A: Yes! Vercel and Netlify have free tiers perfect for this app

**Q: Performance slow?**  
A: Run `npm run build` for optimized production build

---

**Need help?** Check the full README.md or open an issue!

**Ready to build?** Start editing `app/routes/home.tsx`! 🚀

