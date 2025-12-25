from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional, List

from database import get_db, init_db
from schemas import TodoCreate, TodoUpdate, TodoResponse
from crud import (
    get_todos, create_todo, update_todo, delete_todo, get_todo,
    search_todos, get_todos_statistics, get_categories
)

app = FastAPI(title="Todo API")

# CORS middleware to allow frontend to access the API
import os

# Allow specific origins in production, all origins in development
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
if "*" in cors_origins or os.getenv("ENVIRONMENT") == "development":
    cors_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()


@app.get("/")
def root():
    return {"message": "Todo API is running", "status": "ok"}


@app.get("/api/todos", response_model=List[TodoResponse])
def read_todos(
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    search: Optional[str] = Query(None, description="Search in title, description, category"),
    category: Optional[str] = Query(None, description="Filter by category"),
    priority: Optional[str] = Query(None, description="Filter by priority (low, medium, high)"),
    sort_by: Optional[str] = Query("created_at", description="Sort by field (created_at, due_date, priority, title)"),
    order: Optional[str] = Query("desc", description="Sort order (asc, desc)"),
    db: Session = Depends(get_db)
):
    todos = get_todos(db, completed=completed, search=search, category=category, 
                      priority=priority, sort_by=sort_by, order=order)
    return todos


@app.get("/api/todos/search", response_model=List[TodoResponse])
def search_todos_endpoint(
    q: str = Query(..., description="Search query"),
    db: Session = Depends(get_db)
):
    todos = search_todos(db, q)
    return todos


@app.get("/api/todos/statistics")
def get_statistics(db: Session = Depends(get_db)):
    return get_todos_statistics(db)


@app.get("/api/categories")
def get_all_categories(db: Session = Depends(get_db)):
    return {"categories": get_categories(db)}


@app.post("/api/todos", response_model=TodoResponse, status_code=201)
def create_new_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    print(f"Received todo data: {todo.model_dump()}")
    try:
        result = create_todo(db, todo)
        print(f"Todo created successfully with ID: {result.id}")
        return result
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error creating todo: {str(e)}")
        print(f"Traceback: {error_details}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.put("/api/todos/{todo_id}", response_model=TodoResponse)
def update_todo_by_id(
    todo_id: int,
    todo_update: TodoUpdate,
    db: Session = Depends(get_db)
):
    updated_todo = update_todo(db, todo_id, todo_update)
    if not updated_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated_todo


@app.delete("/api/todos/{todo_id}", status_code=204)
def delete_todo_by_id(todo_id: int, db: Session = Depends(get_db)):
    success = delete_todo(db, todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    return None

