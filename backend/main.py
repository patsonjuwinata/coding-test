
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
import json
import random

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data from dummyData.json file
def load_sales_data():
    with open('dummyData.json', 'r') as f:
        return json.load(f)

# Dummy AI feature for questions
class AIRequest(BaseModel):
    question: str

@app.post("/api/ai")
async def get_ai_response(request: AIRequest):
    # A simple mock AI response
    questions = {
        "What is the best deal?": "The best deal is with Acme Corp for $120,000.",
        "Who is Alice?": "Alice is a Senior Sales Executive in North America.",
        "What are the deals for Beta Ltd?": "Beta Ltd has a deal worth $50,000, currently in progress."
    }
    
    # Check if the question is in our predefined list
    answer = questions.get(request.question, "I'm not sure about that question.")
    
    # Randomized response to simulate AI-like behavior
    if random.choice([True, False]):
        answer = "This is an AI-generated response. " + answer
    
    return {"answer": answer}

@app.get("/api/sales-reps")
async def get_sales_reps():
    # Load data from the JSON file
    sales_data = load_sales_data()
    return sales_data
