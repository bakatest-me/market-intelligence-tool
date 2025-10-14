# 🚀 AI Market Intelligence Tool

A professional, AI-powered market intelligence platform designed for Corporate Venture Capital (CVC) teams. This tool provides comprehensive sector analysis, identifies emerging startups, tracks market trends, and generates actionable investment insights through automated workflows and vector-based semantic search.

### Prerequisites
- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- **Node.js** (v18+) and **npm** (v9+)
- **Git** for version control

### 1. Clone the Repository

```bash
git clone <repository-url>
cd market-intelligence-tool

make dev        # Start all services
make stop       # Stop all services
make restart    # Restart all services

# Or start individual services
docker-compose up -d
```

- web-ui: http://localhost:3000
- n8n: http://localhost:5678
	- user: dev@test.local
	- pass: P@ssw0rd
- database:
	- host: localhost:5432
	- user: postgres
	- pass:	P@ssword
	

### Features
- **Sector search**: Sector search with AI
- **Historical Analysis**: Track and review past sector searches
- **Email Subscriptions (Test)**: Stay updated on sector developments (optional)
- **Workflow Automation**: Customizable n8n workflows for research automation


## 🏗️ Architecture

The system consists of four main components:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Web UI    │────▶│     n8n      │────▶│   LLM API       │
│  (React)    │     │  Workflows   │     │ 								 │
└─────────────┘     └──────────────┘     └─────────────────┘
       │                    │
       │                    │
       ▼                    ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL + pgvector                      │
│          (Vector storage & similarity search)           │
└─────────────────────────────────────────────────────────┘
```

### Components

1. **Web UI** (`web-ui/`): React 19 + React Router v7 SPA with Tailwind CSS
2. **n8n** (Docker): Workflow automation for AI orchestration and data processing
3. **PostgreSQL + pgvector** (Docker): Vector database for semantic search

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19
- **Routing**: React Router v7 (SPA mode)
- **Styling**: TailwindCSS v4 + shadcn/ui components
- **State Management**: Zustand
- **Icons**: Lucide React
- **Build Tool**: Vite

### Backend & Infrastructure
- **Workflow Engine**: n8n (latest)
- **Database**: PostgreSQL 17 with pgvector extension
- **Container Orchestration**: Docker Compose
- **Web Server**: Nginx (production)

### Environment Variables
Create a `.env` file in the root directory:

```bash
# PostgreSQL Database Configuration
POSTGRES_DB=n8n
POSTGRES_USER=postgres
POSTGRES_PASSWORD=P@ssword

# n8n General Configuration
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
NODE_ENV=production

# n8n Database Connection Configuration
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=db
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=postgres
DB_POSTGRESDB_PASSWORD=P@ssword
```

### Database Schema

The PostgreSQL database with pgvector extension stores:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE sector_reports (
  id SERIAL PRIMARY KEY,
  sector TEXT,
  data JSONB,
  embedding VECTOR(1536)
);

CREATE TABLE email_subscribe (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_email_subscribe_email ON email_subscribe(email);
CREATE INDEX idx_email_subscribe_active ON email_subscribe(is_active) WHERE is_active = TRUE;
```