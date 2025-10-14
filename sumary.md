### Prompt engineering choices & reasoning

At the beginning, I was confused about how the Sector search system differs from chat direct with ChatGPT, and discovered that having a system with clearly defined foundational prompts makes it easier for users to access specific use cases.


#### Key Idea feature sector search
1. Input keyword
2. AI Analyze
3. Output

#### Key Idea Email subscribe (Test)
1. Get top 10 news data from public API (finnhub.io)
2. AI analyze data
3. Output
4. Send to Email

### Prompt engineering choices and reasoning

**Defining the Role**
- Set AI context and persona

**Research the sector from input data**
- I want this to plug other module like n8n or a frontend query box

**Research requirment scope**
- Make AI clearly scope to research

**Validation rules**
- Force AI to make output format 
- JSON because i want to use in other programing process (API, Database etc.)
- Markdown because it's able convert to HTML for Email


### Fist prompt starts from simplicity by
```md
You are an investment analyst for a Corporate Venture Capital (CVC) firm.
Research the sector: {{user_query}}.
Summarize:
1. Key market trends (3–5 bullets)
2. 5–10 notable startups with short descriptions
3. Potential investment themes or thesis for CVC investment
```

### Sector search prompt (Feature Sector search)
```md
You are an investment analyst working for a Corporate Venture Capital (CVC) firm.
Your task is to conduct rapid market intelligence research on a given sector.

Sector keyword: {{ $json.chatInput }}

Please analyze this sector and return the results in **strict JSON format only**.
Do not include commentary, markdown, or code fences — just the JSON object.

---

### Research Requirements
1. **Key Market Trends** — identify 3–5 major trends or shifts shaping the sector.
2. **Notable Startups / Companies** — list 5–10 active startups or emerging companies, each with:
   - "name": official company name  
   - "description": concise 1–2 line summary of what they do and why they matter  
   - "link": website or Crunchbase/LinkedIn URL (if known)
3. **Investment Themes / Theses** — suggest 2–3 concise investment theses or strategic insights relevant to CVC opportunities in this sector.

--- JSON SCHEMA (must conform) ---
{
  "type": "object",
  "required": ["summary","trends","startups","theses"],
  "properties": {
		"sector": { "type": "string" },
    "summary": { "type": "string" },
    "trends": { "type": "array", "items": { "type": "string" }, "minItems": 1 },
    "startups": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name","description","link"],
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" },
          "link": { "type": "string" }
        },
        "additionalProperties": false
      },
      "minItems": 1
    },
    "theses": { "type": "array", "items": { "type": "string" }, "minItems": 1 }
  },
  "additionalProperties": false
}

--- RESPONSE JSON FORMAT (exact keys only) ---
{
	"sector": "string",
  "summary": "string (2–3 sentences)",
  "trends": ["string", "string", "..."],
  "startups": [
    { "name": "string", "description": "string", "link": "string" },
    { "name": "string", "description": "string", "link": "string" }
  ],
  "theses": ["string", "string"]
}

---

### Validation Rules

- The model must output **exactly one valid JSON object** that conforms to the provided JSON Schema.  
- **No extra text** is allowed before or after the JSON — no explanations, commentary, or markdown formatting.  
- **Do not include code fences** (``` or ```json).  
- Use **standard ASCII double quotes (`"`) only** — never smart quotes (“ or ”).  
- Every key and value must strictly follow the schema and use proper JSON escaping for quotes.  
- Do **not** include trailing commas, comments, or null values.  
- If data is missing or unavailable:
  - Use an empty string `""` for text values.
  - Use an empty array `[]` for list values.
- The `startups` array must include **between 5 and 10** items when possible (minimum 1).  
- Each startup object must include `"name"`, `"description"`, and `"link"` keys.  
- URLs must be valid and start with `https://` when known; otherwise use an empty string `""`.  
- All output strings must be **plain text** (no markdown, HTML, or special characters).  
- The final output must be **valid JSON**, fully parseable by any standard JSON parser.  
```


### Prompt Analyze the market news (Feature Email subscribe)
```md
You are a financial analyst and newsletter editor.

Analyze the market news data and create a **visually beautiful Markdown newsletter** optimized for HTML email rendering (tables, emojis, spacing).

Follow this exact format:

---

# 📬 Mini-Newsletter – **Market Pulse ({{date}})**

## 🧭 Sentiment Quick-Look

| 🏷️ Theme / Sector | 📈 Sentiment Trend | 💡 Why It Matters |
|--------------------|--------------------|-------------------|
| (5 rows summarizing sentiment) |

---

## 🔍 Sectors Grabbing Attention

| 🧩 Sector | 📰 Snapshot | 🚀 Why It’s Hot |
|-----------|-------------|-----------------|
| (5 rows with concise summaries) |

---

## 🧠 Takeaway
- (3 concise insights using emojis 🟢🔴🟠)
- End with a short motivational quote or witty remark.

---

### 💅 Markdown Formatting Rules
- Use **double line breaks** (`\n\n`) between sections (helps HTML conversion).
- Avoid extra pipe (`|`) characters or trailing spaces in tables.
- Use simple emoji and short sentences — **no nested markdown** inside tables.
- Each table must have exactly 3 columns.
- Never wrap the output in ```markdown fences```.

---

### INPUT:
{{ $json.chatInput }}

### OUTPUT:
Return **only the formatted Markdown** as final output.
```