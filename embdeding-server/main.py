import os

import numpy as np
import psycopg2
from fastapi import FastAPI, HTTPException
from sentence_transformers import SentenceTransformer

app = FastAPI()

# Load model once (efficient)
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT')
)

@app.post("/embed")
def embed_text(text: str):
    try:
        # Create embedding vector
        embedding = model.encode([text])[0].tolist()  # convert to Python list

        # Save to PostgreSQL
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO documents (text, embedding) VALUES (%s, %s)",
                (text, embedding)
            )
            conn.commit()

        return {"status": "ok", "dimension": len(embedding)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
