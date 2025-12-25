import TodoItem from './TodoItem'

function TodoList({ todos, onToggleComplete, onUpdate, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
        No todos found. Add one to get started!
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-2 sm:space-y-3">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default TodoList

