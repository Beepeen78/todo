import { useState } from 'react'

function TodoItem({ todo, onToggleComplete, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium')
  const [editCategory, setEditCategory] = useState(todo.category || '')
  const [editDueDate, setEditDueDate] = useState(todo.due_date ? new Date(todo.due_date).toISOString().split('T')[0] : '')

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        priority: editPriority,
        category: editCategory.trim() || null,
        due_date: editDueDate ? new Date(editDueDate).toISOString() : null,
      })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setEditPriority(todo.priority || 'medium')
    setEditCategory(todo.category || '')
    setEditDueDate(todo.due_date ? new Date(todo.due_date).toISOString().split('T')[0] : '')
    setIsEditing(false)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const isOverdue = todo.due_date && !todo.completed && new Date(todo.due_date) < new Date()
  const today = new Date().toISOString().split('T')[0]

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b py-3 px-2 sm:px-4 bg-gray-50 rounded gap-3">
        <div className="flex-1 w-full sm:mr-4 space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-2 py-1.5 sm:py-1 border rounded text-sm sm:text-base"
            placeholder="Title"
            autoFocus
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-2 py-1.5 sm:py-1 border rounded text-sm sm:text-base"
            placeholder="Description (optional)"
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="px-2 py-1.5 border rounded text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="px-2 py-1.5 border rounded text-sm"
              placeholder="Category"
            />
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              min={today}
              className="px-2 py-1.5 border rounded text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2 sm:flex-shrink-0">
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none px-3 py-2 sm:py-1 rounded bg-green-600 text-white hover:bg-green-700 text-sm sm:text-base"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 sm:flex-none px-3 py-2 sm:py-1 rounded bg-gray-400 text-white hover:bg-gray-500 text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between border-b py-3 px-2 sm:px-4 rounded transition-colors gap-3 ${
      todo.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
    }`}>
      <div className="flex items-start flex-1 w-full sm:mr-4">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id, todo.completed)}
          className="mt-1 mr-3 h-5 w-5 sm:h-4 sm:w-4 cursor-pointer flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-medium text-base sm:text-lg break-words ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {todo.title}
            </h3>
            {todo.priority && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getPriorityColor(todo.priority)}`}>
                {todo.priority.toUpperCase()}
              </span>
            )}
            {todo.category && (
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800 border border-blue-300">
                {todo.category}
              </span>
            )}
            {isOverdue && (
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-500 text-white">
                OVERDUE
              </span>
            )}
          </div>
          {todo.description && (
            <p className={`text-sm sm:text-base mt-1 break-words ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <p className="text-xs text-gray-400">
              Created: {new Date(todo.created_at).toLocaleDateString()}
            </p>
            {todo.due_date && (
              <p className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                Due: {new Date(todo.due_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 sm:flex-shrink-0 sm:flex-col sm:gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 sm:flex-none px-3 py-2 sm:py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="flex-1 sm:flex-none px-3 py-2 sm:py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm sm:text-base"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default TodoItem

