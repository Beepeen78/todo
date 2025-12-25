# Git Commands to Push Your Code

## Initial Setup (First Time Only)

```bash
# Initialize git repository (if not already done)
git init

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/todo-app.git

# Or if using SSH:
# git remote add origin git@github.com:yourusername/todo-app.git
```

## Standard Push Commands

```bash
# Check status
git status

# Add all files
git add .

# Commit with message
git commit -m "Initial commit: Todo app with smart features"

# Push to main branch
git push -u origin main

# Or if your default branch is master:
# git push -u origin master
```

## Quick One-Liner (After Initial Setup)

```bash
git add . && git commit -m "Your commit message" && git push
```

## Common Workflow

```bash
# 1. Check what changed
git status

# 2. Add files
git add .

# 3. Commit
git commit -m "Add deployment configuration and smart features"

# 4. Push
git push
```

## If You Need to Set Up Branch

```bash
# Create and switch to main branch (if needed)
git branch -M main

# Then push
git push -u origin main
```

