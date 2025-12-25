from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Todo
from schemas import TodoCreate, TodoUpdate
from typing import List, Optional


def get_todos(db: Session, completed: Optional[bool] = None, search: Optional[str] = None, 
              category: Optional[str] = None, priority: Optional[str] = None,
              sort_by: Optional[str] = "created_at", order: Optional[str] = "desc") -> List[Todo]:
    query = db.query(Todo)
    
    if completed is not None:
        query = query.filter(Todo.completed == completed)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Todo.title.ilike(search_term),
                Todo.description.ilike(search_term),
                Todo.category.ilike(search_term)
            )
        )
    
    if category:
        query = query.filter(Todo.category == category)
    
    if priority:
        query = query.filter(Todo.priority == priority)
    
    # Sorting
    sort_column = getattr(Todo, sort_by, Todo.created_at)
    if order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())
    
    return query.all()


def search_todos(db: Session, search_term: str) -> List[Todo]:
    """Search todos by title, description, or category"""
    term = f"%{search_term}%"
    return db.query(Todo).filter(
        or_(
            Todo.title.ilike(term),
            Todo.description.ilike(term),
            Todo.category.ilike(term)
        )
    ).all()


def get_todos_statistics(db: Session):
    """Get statistics about todos"""
    total = db.query(Todo).count()
    completed = db.query(Todo).filter(Todo.completed == True).count()
    active = total - completed
    
    # By priority
    high_priority = db.query(Todo).filter(Todo.priority == "high", Todo.completed == False).count()
    medium_priority = db.query(Todo).filter(Todo.priority == "medium", Todo.completed == False).count()
    low_priority = db.query(Todo).filter(Todo.priority == "low", Todo.completed == False).count()
    
    # Overdue todos
    from datetime import datetime
    overdue = db.query(Todo).filter(
        Todo.due_date < datetime.utcnow(),
        Todo.completed == False
    ).count()
    
    return {
        "total": total,
        "completed": completed,
        "active": active,
        "high_priority": high_priority,
        "medium_priority": medium_priority,
        "low_priority": low_priority,
        "overdue": overdue
    }


def get_categories(db: Session) -> List[str]:
    """Get all unique categories"""
    categories = db.query(Todo.category).distinct().all()
    return [cat[0] for cat in categories if cat[0]]


def get_todo(db: Session, todo_id: int) -> Optional[Todo]:
    return db.query(Todo).filter(Todo.id == todo_id).first()


def create_todo(db: Session, todo: TodoCreate) -> Todo:
    try:
        # Pydantic v2 uses model_dump() instead of dict()
        todo_data = todo.model_dump()
        print(f"Creating todo with data: {todo_data}")
        db_todo = Todo(**todo_data)
        db.add(db_todo)
        db.commit()
        db.refresh(db_todo)
        print(f"Todo created with ID: {db_todo.id}")
        return db_todo
    except Exception as e:
        db.rollback()
        print(f"Error in create_todo: {str(e)}")
        raise


def update_todo(db: Session, todo_id: int, todo_update: TodoUpdate) -> Optional[Todo]:
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return None
    
    # Pydantic v2 uses model_dump() instead of dict()
    update_data = todo_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    
    db.commit()
    db.refresh(db_todo)
    return db_todo


def delete_todo(db: Session, todo_id: int) -> bool:
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return False
    
    db.delete(db_todo)
    db.commit()
    return True

