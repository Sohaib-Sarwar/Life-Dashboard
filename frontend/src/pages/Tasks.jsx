import { useState, useEffect } from 'react'
import api from '../services/api.js'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import ListIcon from '@mui/icons-material/List'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PendingIcon from '@mui/icons-material/Pending'
import FlagIcon from '@mui/icons-material/Flag'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import FolderIcon from '@mui/icons-material/Folder'
import Notification from '../components/Notification.jsx'
import { useNotification } from '../hooks/useNotification.js'

const Tasks = () => {
  console.log('Tasks component rendered')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium', due_date: '', category: ''
  })
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const { notification, showNotification, hideNotification } = useNotification()

  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Other']

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      showNotification('Failed to fetch tasks', 'error')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters'
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      if (editing) {
        await api.put(`/tasks/${editing}`, formData)
        showNotification('Task updated successfully', 'success')
      } else {
        await api.post('/tasks', formData)
        showNotification('Task created successfully', 'success')
      }
      setFormData({ title: '', description: '', priority: 'medium', due_date: '', category: '' })
      setEditing(null)
      setShowModal(false)
      setErrors({})
      fetchTasks()
    } catch (error) {
      console.error('Error saving task:', error)
      showNotification('Failed to save task', 'error')
    }
  }

  const handleDelete = async (id) => {
    setShowDeleteConfirm(id)
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/tasks/${showDeleteConfirm}`)
      showNotification('Task deleted successfully', 'success')
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      showNotification('Failed to delete task', 'error')
    }
    setShowDeleteConfirm(null)
  }

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      due_date: task.due_date || '',
      category: task.category || ''
    })
    setEditing(task.id)
    setShowModal(true)
  }

  const handleToggle = async (task) => {
    try {
      const newCompletedStatus = !task.completed
      await api.put(`/tasks/${task.id}`, { 
        ...task, 
        completed: newCompletedStatus,
        status: newCompletedStatus ? 'completed' : 'pending'
      })
      
      // Trigger confetti animation on completion
      if (newCompletedStatus) {
        triggerConfetti()
      }
      
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
      showNotification('Failed to update task', 'error')
    }
  }

  const triggerConfetti = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Create confetti
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#FF69B4', '#00CED1']
      
      // Left side burst
      createConfettiElement(randomInRange(0.1, 0.3), Math.random() - 0.2, colors)
      // Right side burst
      createConfettiElement(randomInRange(0.7, 0.9), Math.random() - 0.2, colors)
    }, 250)
  }

  const createConfettiElement = (x, y, colors) => {
    const confettiCount = 15
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.left = `${x * 100}%`
      confetti.style.top = `${(y + 0.5) * 100}%`
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.width = `${Math.random() * 10 + 5}px`
      confetti.style.height = `${Math.random() * 10 + 5}px`
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`
      
      const angle = Math.random() * Math.PI * 2
      const velocity = Math.random() * 200 + 100
      confetti.style.setProperty('--tx', `${Math.cos(angle) * velocity}px`)
      confetti.style.setProperty('--ty', `${Math.sin(angle) * velocity - 100}px`)
      
      document.body.appendChild(confetti)
      
      setTimeout(() => {
        confetti.remove()
      }, 3000)
    }
  }

  const handleClearCompleted = async () => {
    try {
      const completedTaskIds = tasks.filter(t => t.completed).map(t => t.id)
      await Promise.all(completedTaskIds.map(id => api.delete(`/tasks/${id}`)))
      showNotification('Completed tasks cleared', 'success')
      fetchTasks()
    } catch (error) {
      console.error('Error clearing completed tasks:', error)
      showNotification('Failed to clear completed tasks', 'error')
    }
  }

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const matchesFilter = filter === 'all' || 
                          (filter === 'completed' && task.completed) ||
                          (filter === 'pending' && !task.completed)
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter
      return matchesFilter && matchesCategory
    })
  }

  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.filter(t => !t.completed).length
  const totalTasks = tasks.length

  const getRelativeTime = (dateString) => {
    if (!dateString) return 'No date'
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF6B6B'
      case 'medium': return '#FFA500'
      case 'low': return '#4ECDC4'
      default: return '#999'
    }
  }

  if (loading) return <div style={styles.loading}>Loading...</div>

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) rotate(720deg);
            opacity: 0;
          }
        }
        
        .confetti-piece {
          position: fixed;
          width: 10px;
          height: 10px;
          border-radius: 2px;
          pointer-events: none;
          animation: confettiFall 3s ease-out forwards;
          z-index: 10000;
        }
        
        .stat-card-mini {
          animation: slideIn 0.3s ease-out;
        }
        
        .stat-card-mini:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .stat-icon {
          animation: pulse 2s infinite;
        }
        
        body.dark .stat-card {
          background: #2a2a2a !important;
          border-color: #444 !important;
        }
        
        body.dark .stat-card h3 {
          color: #ccc !important;
        }
        
        body.dark .stat-card p {
          color: #999 !important;
        }
        
        body.dark .stat-card-mini {
          background: #0a0a0a !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.8) !important;
          border: 1px solid #333 !important;
        }
        
        body.dark .stat-card-mini:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.9) !important;
          border-color: #444 !important;
        }
        
        body.dark .mini-card-icon-circle {
          background: rgba(255, 255, 255, 0.15) !important;
        }
        
        body.dark .stat-card-mini svg[data-testid="CheckCircleIcon"] {
          color: #66BB6A !important;
        }
        
        body.dark .stat-card-mini svg[data-testid="PendingIcon"] {
          color: #FFA726 !important;
        }
        
        body.dark .mini-card-value {
          color: #ffffff !important;
          font-weight: 700 !important;
        }
        
        body.dark .mini-card-label {
          color: #c0c0c0 !important;
        }
        
        body.dark .mini-card-icon-circle svg {
          filter: brightness(1.3) !important;
        }
        
        body.dark .timeline-date-day {
          color: #e8e8e8 !important;
        }
        
        body.dark .btn,
        body.dark button.btn {
          background: #1a1a1a !important;
          border-color: #444 !important;
          color: #ffffff !important;
        }
        
        body.dark .btn:hover,
        body.dark button.btn:hover {
          background: #222 !important;
          border-color: #555 !important;
        }
        
        body.dark .timeline-task-title {
          color: #ffffff !important;
          font-weight: 600 !important;
        }
        
        body.dark .timeline-task-desc-simple {
          color: #b0b0b0 !important;
        }
        
        body.dark .timeline-status-badge {
          opacity: 1;
        }
        
        body.dark .filter-btn {
          background: #0a0a0a !important;
          border-color: #333 !important;
          color: #c0c0c0 !important;
        }
        
        body.dark .filter-btn:hover:not(.active) {
          background: #1a1a1a !important;
          border-color: #444 !important;
          color: #e0e0e0 !important;
        }
        
        body.dark .filter-btn.active {
          background: #1a1a1a !important;
          border-color: #444 !important;
          color: #ffffff !important;
        }
        
        body.dark .action-btn {
          background: #0a0a0a !important;
          border-color: #333 !important;
          color: #c0c0c0 !important;
        }
        
        body.dark .action-btn:hover {
          background: #1a1a1a !important;
          border-color: #444 !important;
          color: #ffffff !important;
        }
        
        body.dark .timeline-badge-container {
          border-color: #2a2a2a !important;
        }
        
        body.dark .filter-btn:hover,
        body.dark .filter-btn.active {
          background: #fff !important;
          color: #1a1a1a !important;
          border-color: #fff !important;
        }
        
        body.dark .task-item {
          background: #000000 !important;
          border-color: #2a2a2a !important;
        }
        
        body.dark .task-item:hover {
          border-color: #3a3a3a !important;
        }
        
        body.dark .timeline-card {
          background: #000000 !important;
          border-color: #2a2a2a !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.8) !important;
        }
        
        body.dark .timeline-line {
          background: #444 !important;
        }
        
        .timeline-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
        }
        
        body.dark .timeline-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.9) !important;
          border-color: #444 !important;
        }
        
        body.dark .timeline-category-badge {
          background: rgba(59, 130, 246, 0.2) !important;
          color: #60A5FA !important;
          border: 1px solid rgba(96, 165, 250, 0.35) !important;
        }
        
        body.dark .timeline-timestamp {
          color: #b0b0b0 !important;
        }
        
        body.dark .task-item:hover {
          border-color: #333 !important;
        }
        
        body.dark .task-title {
          color: #f5f5f5 !important;
        }
        
        body.dark .task-description {
          color: #c0c0c0 !important;
        }
        
        body.dark .badge {
          background: rgba(255, 255, 255, 0.12) !important;
          color: #d0d0d0 !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
        
        body.dark .empty-state-text {
          color: #a0a0a0 !important;
        }
        
        body.dark .timeline-title {
          color: #f5f5f5 !important;
        }
        
        body.dark .timeline-badge-count {
          color: #f5f5f5 !important;
        }
        
        body.dark .timeline-badge {
          color: #b0b0b0 !important;
        }
        
        body.dark .timeline-badge-container {
          border-bottom-color: #333 !important;
        }
        
        body.dark .timeline-badge {
          color: #b0b0b0 !important;
        }
        
        body.dark .timeline-vertical-line {
          background-color: #444 !important;
        }
        
        @media (max-width: 768px) {
          .tasks-container {
            padding: 20px 16px !important;
          }
          .tasks-header {
            flex-direction: column !important;
            gap: 16px !important;
            align-items: flex-start !important;
          }
          .tasks-title {
            font-size: 1.75rem !important;
          }
          .mini-cards-container {
            grid-template-columns: 1fr !important;
          }
          .tasks-main-content {
            flex-direction: column !important;
          }
          .filter-container {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .filter-buttons-group {
            flex-wrap: wrap !important;
          }
          .timeline-date-day {
            font-size: 22px !important;
          }
          .timeline-date-month {
            font-size: 12px !important;
          }
          .timeline-card {
            padding: 14px 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          .tasks-title {
            font-size: 1.5rem !important;
          }
          .filter-btn {
            font-size: 13px !important;
            padding: 8px 16px !important;
          }
          .timeline-date {
            min-width: 50px !important;
          }
          .timeline-date-day {
            font-size: 20px !important;
          }
          .timeline-card {
            padding: 12px 14px !important;
          }
        }
        
        .circular-progress {
          position: relative;
          width: 100px;
          height: 100px;
        }
        
        .circular-progress svg {
          transform: rotate(-90deg);
        }
        
        .circular-progress circle {
          fill: none;
          stroke-width: 8;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.5s ease;
        }
        
        .circular-progress .bg-circle {
          stroke: #f0f0f0;
        }
        
        body.dark .circular-progress .bg-circle {
          stroke: #3a3a3a;
        }
        
        .circular-progress .progress-circle {
          stroke: #4CAF50;
        }
        
        .circular-progress.pending .progress-circle {
          stroke: #ff4444;
        }
        
        .circular-progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 20px;
          font-weight: bold;
          color: #1a1a1a;
        }
        
        body.dark .circular-progress-text {
          color: #fff;
        }
        
        .filter-btn {
          transition: all 0.2s ease;
        }
        
        .filter-btn:hover {
          transform: translateY(-2px);
        }
        
        .task-checkbox {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .task-checkbox:hover {
          transform: scale(1.1);
        }
      `}</style>
      
      <div style={styles.container} className="tasks-container">
        {/* Header */}
        <div style={styles.header} className="tasks-header">
          <h1 style={styles.title} className="tasks-title">Tasks</h1>
          <button 
            className="btn"
            onClick={() => {
              setEditing(null)
              setFormData({ title: '', description: '', priority: 'medium', due_date: '', category: '' })
              setShowModal(true)
            }}
            style={styles.addButton}
          >
            <AddIcon style={{fontSize: '20px', marginRight: '8px'}} />
            Add Task
          </button>
        </div>

        {/* Mini Stats Cards */}
        <div style={styles.miniCardsContainer} className="mini-cards-container">
          <div className="stat-card-mini" style={{...styles.miniCard, backgroundColor: '#E8F5E9'}}>
            <div style={styles.miniCardIconCircle} className="mini-card-icon-circle">
              <CheckCircleIcon style={{fontSize: '24px', color: '#4CAF50'}} />
            </div>
            <div style={styles.miniCardContent}>
              <div className="mini-card-value" style={styles.miniCardValue}>{completedTasks}</div>
              <div className="mini-card-label" style={styles.miniCardLabel}>Completed</div>
            </div>
            <div style={styles.circularProgressSmall}>
              <svg width="50" height="50">
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20"
                  fill="none"
                  stroke="#C8E6C9"
                  strokeWidth="4"
                ></circle>
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - (totalTasks > 0 ? completedTasks / totalTasks : 0))}`}
                  strokeLinecap="round"
                  transform="rotate(-90 25 25)"
                ></circle>
              </svg>
            </div>
          </div>
          
          <div className="stat-card-mini" style={{...styles.miniCard, backgroundColor: '#FFF3E0'}}>
            <div style={styles.miniCardIconCircle} className="mini-card-icon-circle">
              <PendingIcon style={{fontSize: '24px', color: '#FF9800'}} />
            </div>
            <div style={styles.miniCardContent}>
              <div className="mini-card-value" style={styles.miniCardValue}>{pendingTasks}</div>
              <div className="mini-card-label" style={styles.miniCardLabel}>Pending</div>
            </div>
            <div style={styles.circularProgressSmall}>
              <svg width="50" height="50">
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20"
                  fill="none"
                  stroke="#FFE0B2"
                  strokeWidth="4"
                ></circle>
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20"
                  fill="none"
                  stroke="#FF9800"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - (totalTasks > 0 ? pendingTasks / totalTasks : 0))}`}
                  strokeLinecap="round"
                  transform="rotate(-90 25 25)"
                ></circle>
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={styles.filterContainer} className="filter-container">
          <div style={styles.filterButtonsGroup} className="filter-buttons-group">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              style={{...styles.filterBtn, ...(filter === 'all' ? styles.filterBtnActive : {})}}
              onClick={() => setFilter('all')}
            >
              <ListIcon style={{fontSize: '18px', marginRight: '6px'}} />
              All Tasks
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              style={{...styles.filterBtn, ...(filter === 'completed' ? styles.filterBtnActive : {})}}
              onClick={() => setFilter('completed')}
            >
              <CheckCircleOutlineIcon style={{fontSize: '18px', marginRight: '6px'}} />
              Completed
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              style={{...styles.filterBtn, ...(filter === 'pending' ? styles.filterBtnActive : {})}}
              onClick={() => setFilter('pending')}
            >
              <PendingIcon style={{fontSize: '18px', marginRight: '6px'}} />
              Pending
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent} className="tasks-main-content">
          {/* Left Side - Stats Cards */}
          <div style={styles.leftSection}>
            {/* Task List */}
            <div style={styles.taskListContainer}>
              {getFilteredTasks().length === 0 ? (
                <div style={styles.emptyState}>
                  <ListIcon style={{ fontSize: 64, opacity: 0.3, color: '#999' }} />
                  <p style={{color: '#999', marginTop: '16px'}} className="empty-state-text">No tasks found</p>
                </div>
              ) : (
                getFilteredTasks().map(task => (
                  <div key={task.id} className="task-item" style={styles.taskItem}>
                    <div style={styles.taskContent}>
                      <div 
                        className="task-checkbox"
                        onClick={() => handleToggle(task)}
                        style={{marginRight: '12px', cursor: 'pointer'}}
                      >
                        {task.completed ? (
                          <CheckCircleIcon style={{fontSize: '24px', color: '#4CAF50'}} />
                        ) : (
                          <RadioButtonUncheckedIcon style={{fontSize: '24px', color: '#999'}} />
                        )}
                      </div>
                      <div style={{flex: 1}}>
                        <h3 style={{
                          ...styles.taskTitle, 
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? '#999' : 'var(--text-primary)'
                        }} className="task-title">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p style={styles.taskDescription} className="task-description">{task.description}</p>
                        )}
                        <div style={styles.taskMeta}>
                          {task.priority && (
                            <span style={{
                              ...styles.badge,
                              backgroundColor: getPriorityColor(task.priority) + '20',
                              color: getPriorityColor(task.priority)
                            }} className="badge">
                              <FlagIcon style={{fontSize: '14px', marginRight: '4px'}} />
                              {task.priority}
                            </span>
                          )}
                          {task.category && (
                            <span style={{
                              ...styles.badge,
                              backgroundColor: '#EFF6FF',
                              color: '#3B82F6'
                            }} className="badge">
                              <FolderIcon style={{fontSize: '14px', marginRight: '4px'}} />
                              {task.category}
                            </span>
                          )}
                          {task.due_date && (
                            <span style={styles.badge} className="badge">
                              <CalendarTodayIcon style={{fontSize: '14px', marginRight: '4px'}} />
                              {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={styles.taskActions}>
                      <button 
                        style={styles.actionBtn} 
                        className="action-btn"
                        onClick={() => handleEdit(task)}
                        title="Edit Task"
                      >
                        <EditIcon style={{fontSize: '18px'}} />
                      </button>
                      <button 
                        style={styles.actionBtn} 
                        className="action-btn"
                        onClick={() => handleDelete(task.id)}
                        title="Delete Task"
                      >
                        <DeleteIcon style={{fontSize: '18px'}} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Side - Timeline */}
          <div style={styles.rightSection}>
            <div style={styles.timelineHeader}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <CalendarTodayIcon style={{fontSize: '20px', color: 'var(--text-primary)'}} />
                <h3 style={styles.timelineTitle} className="timeline-title">Timeline</h3>
              </div>
            </div>
            
            <div style={styles.timelineBadgeContainer} className="timeline-badge-container">
              <span style={styles.timelineBadge} className="timeline-badge">TODAY</span>
              <span style={styles.timelineBadgeCount} className="timeline-badge-count">{totalTasks}</span>
            </div>
            
            <div style={styles.timelineContainer}>
              {getFilteredTasks().length === 0 ? (
                <div style={styles.emptyTimeline}>
                  <p style={{color: '#999', fontSize: '14px'}}>No tasks to display</p>
                </div>
              ) : (
                getFilteredTasks()
                  .filter(task => !task.completed)
                  .sort((a, b) => {
                    const priorityOrder = { high: 3, medium: 2, low: 1 }
                    const aPriority = priorityOrder[a.priority] || 0
                    const bPriority = priorityOrder[b.priority] || 0
                    return bPriority - aPriority
                  })
                  .map((task, index, arr) => {
                    // Determine badge color based on priority
                    let badgeStyle = {}
                    if (task.priority === 'high') {
                      badgeStyle = { backgroundColor: '#FEE2E2', color: '#DC2626' }
                    } else if (task.priority === 'medium') {
                      badgeStyle = { backgroundColor: '#FED7AA', color: '#EA580C' }
                    } else if (task.priority === 'low') {
                      badgeStyle = { backgroundColor: '#D1FAE5', color: '#059669' }
                    } else {
                      badgeStyle = { backgroundColor: '#E0E7FF', color: '#4F46E5' }
                    }
                    
                    return (
                      <div key={task.id} style={styles.timelineItemWrapper}>
                        <div style={styles.timelineItemSimple}>
                          {/* Dot and Line Column */}
                          <div style={styles.timelineDotColumn}>
                            <div 
                              style={{
                                ...styles.timelineDotSimple,
                                backgroundColor: getPriorityColor(task.priority)
                              }}
                            />
                            {index < arr.length - 1 && (
                              <div style={styles.timelineVerticalLine} className="timeline-vertical-line" />
                            )}
                          </div>
                          
                          {/* Card Content */}
                          <div style={styles.timelineCardSimple} className="timeline-card">
                            <div style={styles.timelineCardContent}>
                              <h4 style={styles.timelineTaskTitleSimple} className="timeline-task-title">{task.title}</h4>
                              
                              {task.description && (
                                <p style={styles.timelineTaskDescSimple} className="timeline-task-desc-simple">{task.description}</p>
                              )}
                              
                              <div style={styles.timelineMetaRowSimple}>
                                {task.category && (
                                  <span style={styles.timelineCategoryBadge} className="timeline-category-badge">{task.category}</span>
                                )}
                              </div>
                            </div>
                            
                            <div style={{...styles.timelinePriorityBadge, ...badgeStyle}}>
                              {task.priority || 'Normal'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div style={styles.modal} className="card">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? 'Edit Task' : 'New Task'}</h2>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={{...styles.input, ...(errors.title ? styles.inputError : {})}}
                  placeholder="Enter task title"
                />
                {errors.title && <span style={styles.errorText}>{errors.title}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{...styles.textarea, ...(errors.description ? styles.inputError : {})}}
                  placeholder="Enter task description"
                  rows="3"
                />
                {errors.description && <span style={styles.errorText}>{errors.description}</span>}
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    style={styles.select}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    style={styles.select}
                  >
                    <option value="">None</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowDeleteConfirm(null)}>
          <div style={styles.confirmModal} className="card">
            <h3 style={styles.confirmTitle}>Delete Task?</h3>
            <p style={styles.confirmText}>This action cannot be undone.</p>
            <div style={styles.confirmActions}>
              <button style={styles.cancelBtn} onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button style={styles.deleteBtn} onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={hideNotification}
        />
      )}
    </>
  )
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px 24px',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    color: 'var(--text-secondary)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  addButton: {
    fontSize: '1rem',
    padding: '12px 28px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: '2px solid #1a1a1a',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  miniCardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  miniCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: 'none',
    borderRadius: '16px',
    padding: '16px 20px',
    transition: 'all 0.3s ease',
    cursor: 'default',
    position: 'relative',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  miniCardIconCircle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexShrink: 0,
  },
  miniCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  miniCardValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1a1a1a',
    lineHeight: 1,
  },
  miniCardLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#666',
  },
  circularProgressSmall: {
    position: 'relative',
    flexShrink: 0,
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  filterButtonsGroup: {
    display: 'flex',
    gap: '12px',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#666',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  filterBtnActive: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderColor: '#1a1a1a',
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#ff4444',
    color: '#fff',
    border: '2px solid #ff4444',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  mainContent: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  leftSection: {
    flex: '1 1 65%',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  rightSection: {
    flex: '1 1 30%',
    minWidth: '280px',
  },
  statCard: {
    backgroundColor: '#fff',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.2s ease',
  },
  statCardHeader: {
    marginBottom: '16px',
  },
  statCardTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1a1a1a',
    margin: 0,
  },
  circularProgressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  statCardCount: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  taskListContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  taskItem: {
    backgroundColor: '#fff',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
  },
  taskContent: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
  },
  taskTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 8px 0',
  },
  taskDescription: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 12px 0',
  },
  taskMeta: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    backgroundColor: '#f5f5f5',
    color: '#666',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
  },
  taskActions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#666',
    transition: 'all 0.2s ease',
  },
  clearTaskBtn: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    marginRight: '8px',
  },
  timelineHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  timelineTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  timelineBadgeContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border-color)',
  },
  timelineBadge: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#666',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  timelineBadgeCount: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  timelineContainer: {
    position: 'relative',
  },
  timelineItemWrapper: {
    position: 'relative',
    marginBottom: '0',
  },
  timelineItemSimple: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    position: 'relative',
  },
  timelineDotColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: '16px',
  },
  timelineDotSimple: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    flexShrink: 0,
    zIndex: 2,
    border: '3px solid var(--bg-primary)',
  },
  timelineVerticalLine: {
    width: '2px',
    backgroundColor: '#e5e7eb',
    height: '100%',
    minHeight: '50px',
    marginTop: '0px',
  },
  timelineCardSimple: {
    flex: 1,
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '14px 16px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  timelineCardContent: {
    flex: 1,
    minWidth: 0,
  },
  timelineTaskTitleSimple: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: 1.3,
    flex: 1,
  },
  timelinePriorityBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'capitalize',
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  timelineTaskDescSimple: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: '0 0 10px 0',
    lineHeight: 1.4,
  },
  timelineMetaRowSimple: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  timelineCategoryBadge: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#3B82F6',
    padding: '3px 10px',
    backgroundColor: '#EFF6FF',
    borderRadius: '4px',
  },
  timelineTimestamp: {
    fontSize: '13px',
    color: '#999',
  },
  timelineContent: {
    flex: 1,
    minWidth: 0,
  },
  timelineTaskTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: '0 0 8px 0',
    lineHeight: 1.4,
  },
  timelineTaskDesc: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 12px 0',
    lineHeight: 1.5,
  },
  timelineMetaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  timelineMetaLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  timelineGivenBy: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#999',
  },
  timelineCategory: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#999',
    padding: '4px 12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '20px',
    border: '1px solid #e0e0e0',
  },
  timelineLine: {
    width: '2px',
    height: '16px',
    backgroundColor: '#e0e0e0',
    margin: '0 0 0 5px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
  },
  emptyTimeline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  closeBtn: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    transition: 'all 0.2s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    transition: 'border-color 0.2s ease',
  },
  textarea: {
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    transition: 'border-color 0.2s ease',
    resize: 'vertical',
  },
  select: {
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    transition: 'border-color 0.2s ease',
    cursor: 'pointer',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    fontSize: '12px',
    color: '#ff4444',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '10px 24px',
    backgroundColor: 'transparent',
    color: '#666',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  submitBtn: {
    padding: '10px 24px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: '2px solid #1a1a1a',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  confirmModal: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
  },
  confirmTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 12px 0',
  },
  confirmText: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 24px 0',
  },
  confirmActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    padding: '10px 24px',
    backgroundColor: '#ff4444',
    color: '#fff',
    border: '2px solid #ff4444',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  '@media (max-width: 768px)': {
    container: {
      padding: '20px 16px',
    },
    header: {
      flexDirection: 'column',
      gap: '16px',
      alignItems: 'flex-start',
    },
    title: {
      fontSize: '1.75rem',
    },
    miniCardsContainer: {
      gridTemplateColumns: '1fr',
    },
    mainContent: {
      flexDirection: 'column',
    },
    filterContainer: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    filterButtonsGroup: {
      flexWrap: 'wrap',
    },
  },
}

export default Tasks
