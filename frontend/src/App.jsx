import { useState, useEffect } from 'react'
import axios from 'axios'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import FilterBar from './components/FilterBar'
import SearchBar from './components/SearchBar'
import SortBar from './components/SortBar'
import Statistics from './components/Statistics'

// Use environment variable in production, fallback to proxy in development
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/todos`
  : '/api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedPriority, setSelectedPriority] = useState(null)
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchTodos()
    fetchStatistics()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchTodos()
    fetchStatistics()
  }, [filter, searchTerm, sortBy, sortOrder, selectedCategory, selectedPriority])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {
        ...(filter !== 'all' && { completed: filter === 'completed' }),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedPriority && { priority: selectedPriority }),
        sort_by: sortBy,
        order: sortOrder,
      }
      const response = await axios.get(API_URL, { params })
      setTodos(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error)
      setError(error.response?.data?.detail || error.message || 'Failed to fetch todos. Make sure the backend is running on http://localhost:8000')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/statistics`)
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories')
      setCategories(response.data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleAddTodo = async (todoData) => {
    try {
      setError(null)
      console.log('Sending todo data to backend:', todoData)
      const response = await axios.post(API_URL, todoData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('Todo created successfully:', response.data)
      await fetchTodos()
      await fetchStatistics()
      await fetchCategories()
      return true
    } catch (error) {
      console.error('Error creating todo:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to create todo. Make sure the backend is running on http://localhost:8000'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { completed: !completed })
      setTodos(todos.map(todo => todo.id === id ? response.data : todo))
      await fetchStatistics()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleUpdateTodo = async (id, todoData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, todoData)
      setTodos(todos.map(todo => todo.id === id ? response.data : todo))
      await fetchCategories()
    } catch (error) {
      console.error('Error updating todo:', error)
      throw error
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      await fetchTodos()
      await fetchStatistics()
      await fetchCategories()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleFilterChange = (value) => {
    setFilter(value)
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
  }

  const handleSearchClear = () => {
    setSearchTerm('')
  }

  const handleSortChange = (value) => {
    setSortBy(value)
  }

  const handleOrderChange = (value) => {
    setSortOrder(value)
  }

  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
  }

  const handlePriorityChange = (value) => {
    setSelectedPriority(value)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Smart Todo App</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <Statistics stats={stats} onFilterChange={handleFilterChange} />
          
          <TodoForm onSubmit={handleAddTodo} />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange}
            onClear={handleSearchClear}
          />
          
          <SortBar
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onOrderChange={handleOrderChange}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedPriority={selectedPriority}
            onPriorityChange={handlePriorityChange}
          />
          
          <FilterBar currentFilter={filter} onFilterChange={handleFilterChange} />
          
          {loading ? (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">Loading...</div>
          ) : (
            <TodoList
              todos={todos}
              onToggleComplete={handleToggleComplete}
              onUpdate={handleUpdateTodo}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App

