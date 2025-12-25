import { useState } from 'react'

function TodoForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const todoData = {
        title: title.trim(),
        description: description.trim() || null,
        priority: priority,
        category: category.trim() || null,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      }
      
      const success = await onSubmit(todoData)
      if (success !== false) {
        setTitle('')
        setDescription('')
        setPriority('medium')
        setCategory('')
        setDueDate('')
      }
    } catch (error) {
      console.error('Failed to create todo:', error)
      // Error is already handled in App.jsx and shown to user
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get minimum date (today) for due date picker
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
      <div className="mb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Todo title *"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base sm:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base sm:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base sm:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (optional)"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base sm:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={today}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base sm:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="w-full px-4 py-3 sm:py-2 text-base sm:text-lg rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  )
}

export default TodoForm

