from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel

app = FastAPI(title="App Hub Backend", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Agent(BaseModel):
    id: str
    name: str
    description: str
    capability: str


agents_data: List[Agent] = [
    {
        "id": "agent-001",
        "name": "Data Analysis Agent",
        "description": "Analyzes and processes data insights",
        "capability": "Data Processing"
    },
    {
        "id": "agent-002",
        "name": "Document AI Agent",
        "description": "Extracts and understands document content",
        "capability": "Document Understanding"
    },
    {
        "id": "agent-003",
        "name": "Chat Agent",
        "description": "Provides conversational assistance",
        "capability": "Conversation"
    }
]


@app.get("/")
async def root():
    return {"message": "App Hub Backend API"}


@app.get("/agents", response_model=List[Agent])
async def get_agents():
    return agents_data


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
