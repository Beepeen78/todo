function Statistics({ stats, onFilterChange }) {
  if (!stats) return null

  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0

  return (
    <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div 
        className="bg-blue-50 p-4 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => onFilterChange('all')}
      >
        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
        <div className="text-sm text-gray-600">Total</div>
      </div>
      <div 
        className="bg-green-50 p-4 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
        onClick={() => onFilterChange('active')}
      >
        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        <div className="text-sm text-gray-600">Active</div>
      </div>
      <div 
        className="bg-purple-50 p-4 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
        onClick={() => onFilterChange('completed')}
      >
        <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
        <div className="text-sm text-gray-600">Completed</div>
        <div className="text-xs text-gray-500 mt-1">{completionRate}%</div>
      </div>
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-red-600">{stats.overdue || 0}</div>
        <div className="text-sm text-gray-600">Overdue</div>
      </div>
    </div>
  )
}

export default Statistics

