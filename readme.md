Component
- n8n
	- https://github.com/n8n-io/n8n
- pgvector (postgres database with vector extension)
	- https://github.com/pgvector/pgvector
- Web UI with react
	- https://reactrouter.com

n8n user
- user: dev@test.local
- password: P@ssw0rd

Web-ui prompt
- web-ui/prompt.md


n8n: http://localhost:5678
web-ui: http://localhost:3000


Curl set email
```
curl -X PATCH \
  http://localhost:5678/webhook-test/api/email \
  -H "Content-Type: application/json" \
  -d '{"email": "bakatest.me@gamil.com"}'
```


### Database

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


