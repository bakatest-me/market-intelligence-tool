You are an expert full-stack developer and product designer.
must use react router v7 framework Your task is to build a **web-based AI Market Intelligence Tool** for Corporate Venture Capital (CVC) team.

## 🎯 GOAL
Create a simple yet professional web UI that:
1. Takes a *sector keyword* (e.g., “AI for energy”)
2. Calls an LLM API (OpenAI or Claude) to:
   - Summarize key market trends
   - Identify 5–10 notable startups or companies (with short descriptions)
   - Suggest potential investment themes or theses
3. Displays the results in a clean, analyst-grade dashboard layout.

---

## 🧩 CORE FEATURES

### Input
- A single **search bar** at the top.
- Placeholder text: “Enter sector keyword (e.g., AI for Energy Efficiency)”
- A [Search] button that triggers API call.

### Output Sections
After submitting a query, render structured results:
1. **📊 Sector Summary** — 1–2 paragraphs
2. **🔎 Key Market Trends** — 3–5 bullet points
3. **🚀 Notable Startups / Companies** — list or cards (name, short description, link)
4. **💰 Investment Themes / Theses** — 2–3 concise bullets

At the bottom:
- Buttons: [🔄 New Search] [📤 Export to PDF or Copy or Markdown]

---

## 💄 DESIGN GUIDELINES
- **Concept UI** Minimal, modern, investor-friendly UI.
- **Theme:** Dark mode by default (dark gray background, light text)
- **Layout:** centered container, generous spacing, readable at a glance.


## 🛠 Technical Requirements
- **Framework:**  
	- React 19
	- React Router v7 (@react-router/node, @react-router/serve)
	- React Router v7 with SPA mode
- **UI Library:** TailwindCSS + shadcn/ui
- **Font:** Inter or Roboto (clean and professional)
- **State management:** Zustand (for simplicity).
- **Icons:** lucide-react icons (📊 🚀 💰).

## 📱 Responsive Design
- Desktop (1200px+): Full layout
- Tablet (768px-1199px): Adjusted card grid
- Mobile (320px-767px): 
  - Single column layout
  - Collapsible sections
  - Touch-friendly inputs

## 🔌 API Integration
- **Endpoint:** `/api/analyze`
- **Method:** POST
- **Request Format:**
  ```json
  {
    "sector": "string"
  }
- **Response format (JSON):**
  ```json
  {
    "summary": "text",
    "trends": ["trend1", "trend2"],
    "startups": [
      { "name": "Company", "description": "short desc", "link": "url" }
    ],
    "theses": ["thesis1", "thesis2"]
  }
