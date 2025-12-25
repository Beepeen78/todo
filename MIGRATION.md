# Database Migration Guide

Since we've added new fields to the Todo model (priority, category, due_date), you'll need to update your database.

## Option 1: Fresh Start (Recommended for Development)

Delete the existing database file and let it recreate:

```bash
# Stop your backend server first
# Then delete the database file:
cd backend
rm todos.db  # Linux/Mac
del todos.db  # Windows PowerShell
```

Then restart your backend - it will create a new database with the updated schema.

## Option 2: Manual Migration (If you have important data)

You would need to use a migration tool like Alembic, but for development purposes, Option 1 is recommended.

