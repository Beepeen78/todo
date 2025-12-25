# Todo App

A full-stack todo application with FastAPI backend and React frontend.

## Features

- ✅ Add todos with title and optional description
- ✅ List todos in created order
- ✅ Mark todos as completed
- ✅ Edit todos
- ✅ Delete todos
- ✅ Filter todos (All / Active / Completed)

## Quick Start

**From the project root directory** (`D:\mini_projects\todo`):

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
todo/
├── backend/
│   ├── main.py          # FastAPI app with routes
│   ├── models.py        # SQLAlchemy Todo model
│   ├── schemas.py       # Pydantic schemas
│   ├── database.py      # Database connection
│   ├── crud.py          # CRUD operations
│   └── requirements.txt # Python dependencies
└── frontend/
    ├── src/
    │   ├── App.jsx      # Main React component
    │   ├── main.jsx     # Entry point
    │   ├── index.css    # Tailwind styles
    │   └── components/
    │       ├── TodoList.jsx
    │       ├── TodoItem.jsx
    │       ├── TodoForm.jsx
    │       └── FilterBar.jsx
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

**Important**: Start from the project root directory (`D:\mini_projects\todo`). The `backend` and `frontend` directories are siblings, not nested.

### Backend Setup

1. From the project root, navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the backend server:
   ```bash
   # Option 1: Using the run script
   python run.py
   
   # Option 2: Using uvicorn directly
   uvicorn main:app --reload --port 8000
   ```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **From the project root** (not from inside backend), navigate to the frontend directory:
   ```bash
   # If you're currently in backend/, go back to root first:
   cd ..
   
   # Then navigate to frontend:
   cd frontend
   ```
   
   Or from the project root directly:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Endpoints

- `GET /api/todos` - List all todos (optional query: `?completed=true/false`)
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/{id}` - Update a todo
- `DELETE /api/todos/{id}` - Delete a todo

## Technologies Used

- **Backend**: FastAPI, SQLAlchemy, SQLite, Pydantic
- **Frontend**: React, Vite, Tailwind CSS, Axios

