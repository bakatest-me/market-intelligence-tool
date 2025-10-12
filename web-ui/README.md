# 🚀 AI Market Intelligence Tool

A professional web-based market intelligence tool built for Corporate Venture Capital (CVC) teams. Analyzes sectors, identifies startups, and generates investment insights using AI.

## ✨ Features

- **🔍 Sector Analysis**: Enter any sector keyword to get comprehensive market intelligence
- **📊 Market Insights**: Get structured summaries, trends, notable companies, and investment theses
- **💾 Export Options**: Copy or download analysis as Markdown
- **🌙 Dark Mode**: Professional dark theme optimized for analysts
- **📱 Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠 Tech Stack

- **Framework**: React 19 + React Router v7 (SPA mode)
- **UI Library**: TailwindCSS + shadcn/ui components
- **State Management**: Zustand
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (for production):
   Create a `.env` file:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   # or
   ANTHROPIC_API_KEY=your_claude_api_key_here
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to `http://localhost:5173`

## 🚀 Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## 🔌 API Integration

### Current Implementation
The app includes a **mock API** at `app/routes/api.analyze.ts` that simulates LLM responses.

### Production Integration

To integrate with a real LLM API (OpenAI or Claude), update `app/routes/api.analyze.ts`:

#### Option 1: OpenAI Integration
```typescript
const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'You are a market intelligence analyst for corporate venture capital. Provide structured analysis in JSON format.'
    }, {
      role: 'user',
      content: `Analyze the "${sector}" sector and provide: 1) A summary paragraph, 2) 3-5 key trends, 3) 5-10 notable startups with descriptions and links, 4) 2-3 investment theses.`
    }],
    temperature: 0.7
  })
});
```

#### Option 2: Anthropic Claude Integration
```typescript
const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-3-opus-20240229',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `Analyze the "${sector}" sector...`
    }]
  })
});
```

### API Response Format
The API endpoint expects responses in this format:
```json
{
  "summary": "string",
  "trends": ["trend1", "trend2"],
  "startups": [
    {
      "name": "Company Name",
      "description": "Brief description",
      "link": "https://example.com"
    }
  ],
  "theses": ["thesis1", "thesis2"]
}
```

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px (single column, collapsible sections)
- **Tablet**: 768px - 1199px (adjusted grid layout)
- **Desktop**: 1200px+ (full layout with multi-column cards)

## 🎨 Design Philosophy

- **Minimal & Modern**: Clean interface focused on content
- **Investor-Friendly**: Professional dark theme suitable for CVC teams
- **Readable**: Generous spacing and Inter font for clarity
- **Accessible**: High contrast ratios and touch-friendly targets

## 📂 Project Structure

```
web-ui/
├── app/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── SearchBar.tsx
│   │   └── ResultsDisplay.tsx
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── routes/
│   │   ├── home.tsx         # Main page
│   │   └── api.analyze.ts   # API endpoint
│   ├── store/
│   │   └── marketStore.ts   # Zustand state
│   ├── app.css              # Global styles
│   └── root.tsx             # Root layout
├── public/                  # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── react-router.config.ts
```

## 🔧 Configuration

### React Router v7 (SPA Mode)
The app uses React Router v7 in SPA mode (`ssr: false` in `react-router.config.ts`).

### TailwindCSS
Dark mode is configured with the `class` strategy. Theme tokens are defined in `app.css`.

### Zustand Store
Global state management for:
- Sector input
- Market data
- Loading states
- Error handling

## 🧪 Testing

To test the application:
1. Enter a sector keyword (e.g., "AI for Energy Efficiency")
2. Click "Search" to trigger the mock API
3. Review the structured results
4. Test export functionality (Copy/Download Markdown)
5. Test responsive design by resizing the browser

## 📝 License

MIT License - Feel free to use for commercial or personal projects.

## 🤝 Contributing

This is a demonstration project. For production use, ensure you:
- Add proper error handling
- Implement rate limiting
- Add authentication if needed
- Set up proper logging and monitoring
- Test across different browsers and devices

---

**Built with ❤️ for Corporate Venture Capital teams**

