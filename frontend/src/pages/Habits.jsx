import { useState, useEffect } from 'react'
import api from '../services/api.js'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import Notification from '../components/Notification.jsx'
import { useNotification } from '../hooks/useNotification.js'

const Habits = () => {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '', description: '', frequency: 'daily', target_days: 7
  })
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const { notification, showNotification, hideNotification } = useNotification()

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await api.get('/habits')
      setHabits(response.data)
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters'
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }
    
    if (formData.target_days < 1 || formData.target_days > 365) {
      newErrors.target_days = 'Target days must be between 1 and 365'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    console.log('Submitting habit:', formData)
    try {
      if (editing) {
        const response = await api.put(`/habits/${editing}`, formData)
        console.log('Habit updated:', response.data)
        showNotification('Habit updated successfully', 'success')
      } else {
        const response = await api.post('/habits', formData)
        console.log('Habit created:', response.data)
        showNotification('Habit created successfully', 'success')
      }
      setFormData({ name: '', description: '', frequency: 'daily', target_days: 7 })
      setEditing(null)
      setShowModal(false)
      setErrors({})
      fetchHabits()
    } catch (error) {
      console.error('Error saving habit:', error)
      console.error('Error response:', error.response?.data)
      showNotification('Failed to save habit: ' + (error.response?.data?.message || error.message), 'error')
    }
  }

  const handleDelete = async (id) => {
    setShowDeleteConfirm(id)
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/habits/${showDeleteConfirm}`)
      showNotification('Habit deleted successfully', 'success')
      fetchHabits()
    } catch (error) {
      console.error('Error deleting habit:', error)
      showNotification('Failed to delete habit', 'error')
    }
    setShowDeleteConfirm(null)
  }

  const handleEdit = (habit) => {
    setFormData({
      name: habit.name,
      description: habit.description || '',
      frequency: habit.frequency,
      target_days: habit.target_days
    })
    setEditing(habit.id)
    setShowModal(true)
  }

  const handleLog = async (habitId) => {
    try {
      // Use local date instead of UTC to avoid timezone issues
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      const localDate = `${year}-${month}-${day}`
      
      await api.post(`/habits/${habitId}/log`, { date: localDate })
      fetchHabits()
    } catch (error) {
      console.error('Error logging habit:', error)
    }
  }

  const isLoggedToday = (habit) => {
    // Use local date instead of UTC to avoid timezone issues
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const localDate = `${year}-${month}-${day}`
    return habit.logs?.some(log => log.date === localDate)
  }

  const getStreak = (habit) => {
    // Use backend-calculated streak if available
    if (habit.current_streak !== undefined) {
      return habit.current_streak
    }
    
    // Fallback to client-side calculation
    if (!habit.logs || habit.logs.length === 0) return 0
    
    // Get today's date in local format
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const sortedLogs = [...habit.logs]
      .filter(log => log.completed)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    
    let streak = 0
    let checkDate = new Date(today)
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.date + 'T00:00:00')
      
      // Check if this log matches the date we're looking for
      if (logDate.toDateString() === checkDate.toDateString()) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (logDate < checkDate) {
        // Gap in streak
        break
      }
    }
    
    return streak
  }

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      // Use local date instead of UTC to avoid timezone issues
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const localDate = `${year}-${month}-${day}`
      days.push({
        date: localDate,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate()
      })
    }
    return days
  }

  const isLoggedOnDate = (habit, dateStr) => {
    return habit.logs?.some(log => log.date === dateStr)
  }

  if (loading) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Habits</h1>
        <button 
          className="btn btn-success" 
          onClick={() => {
            setEditing(null)
            setFormData({ name: '', description: '', frequency: 'daily', target_days: 7 })
            setShowModal(true)
          }}
          style={styles.addButton}
          type="button"
        >
          <AddIcon style={{fontSize: '20px', marginRight: '8px'}} />
          Add Habit
        </button>
      </div>

      {/* Modal for Add/Edit Habit */}
      {showModal && (
        <div style={styles.modalOverlay} onMouseDown={(e) => {
          if (e.target === e.currentTarget) setShowModal(false)
        }}>
          <div style={styles.modal} className="card">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? 'Edit Habit' : 'New Habit'}</h2>
              <button 
                style={styles.closeButton}
                onClick={() => setShowModal(false)}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Habit Name *</label>
                <input
                  className="input"
                  type="text"
                  placeholder="E.g., Morning Exercise, Read 30 minutes..."
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: '' })
                  }}
                  style={errors.name ? {borderColor: 'var(--danger)'} : {}}
                  required
                  autoFocus
                />
                {errors.name && <span style={{fontSize: '0.8125rem', color: 'var(--danger)'}}>{errors.name}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  className="input"
                  placeholder="Why is this habit important to you?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  style={{minHeight: '90px'}}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Frequency</label>
                  <select
                    className="input"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Target Days</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="Goal"
                    value={formData.target_days}
                    onChange={(e) => setFormData({ ...formData, target_days: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {editing ? 'Update Habit' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={styles.habitList}>
        {habits.length === 0 ? (
          <div style={styles.empty} className="card">
            <div style={{fontSize: '4rem', marginBottom: '20px', color: 'var(--accent-success)'}}>
              <CheckCircleIcon style={{fontSize: '5rem'}} />
            </div>
            <h3 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)'}}>
              Start building better habits
            </h3>
            <p style={{color: 'var(--text-secondary)'}}>
              Create your first habit to begin tracking your progress!
            </p>
          </div>
        ) : (
          habits.map(habit => {
            const loggedToday = isLoggedToday(habit)
            const streak = getStreak(habit)
            const weekDays = getLast7Days()
            
            return (
              <div key={habit.id} style={styles.habitCard} className="card">
                <div style={styles.habitHeader}>
                  <div style={{flex: 1}}>
                    <h3 style={styles.habitName}>{habit.name}</h3>
                    {habit.description && (
                      <p style={styles.habitDesc}>{habit.description}</p>
                    )}
                  </div>
                  <div style={styles.streakBadge}>
                    <LocalFireDepartmentIcon style={{color: '#F59E0B', fontSize: '1.75rem'}} />
                    <span style={styles.streakNumber}>{streak}</span>
                    <span style={styles.streakLabel}>day streak</span>
                  </div>
                </div>

                {/* Weekly Calendar */}
                <div style={styles.weeklyCalendar}>
                  {weekDays.map(day => {
                    const isLogged = isLoggedOnDate(habit, day.date)
                    // Use local date instead of UTC to avoid timezone issues
                    const today = new Date()
                    const year = today.getFullYear()
                    const month = String(today.getMonth() + 1).padStart(2, '0')
                    const dayNum = String(today.getDate()).padStart(2, '0')
                    const localDate = `${year}-${month}-${dayNum}`
                    const isToday = day.date === localDate
                    
                    return (
                      <div key={day.date} style={styles.dayCell}>
                        <div style={styles.dayName}>{day.dayName}</div>
                        <div style={{
                          ...styles.dayBox,
                          backgroundColor: isLogged ? 'var(--success)' : 
                                         isToday ? 'var(--bg-secondary)' : 
                                         'var(--bg-primary)',
                          border: isToday ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                        }}>
                          {isLogged && (
                            <CheckCircleIcon style={{color: 'white', fontSize: '1.5rem'}} />
                          )}
                        </div>
                        <div style={styles.dayNum}>{day.dayNum}</div>
                      </div>
                    )
                  })}
                </div>
                
                <div style={styles.habitMeta}>
                  <span className="badge" style={styles.frequencyBadge}>{habit.frequency}</span>
                  <span style={styles.metaText}>Target: {habit.target_days} days</span>
                  <span style={styles.metaText}>Total Logs: {habit.logs?.length || 0}</span>
                </div>

                <div style={styles.habitActions}>
                  <button
                    className={`btn ${loggedToday ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => handleLog(habit.id)}
                    disabled={loggedToday}
                    type="button"
                  >
                    {loggedToday ? 'Completed Today' : 'Log Today'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleEdit(habit)} type="button">
                    <EditIcon fontSize="small" style={{marginRight: '4px'}} /> Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(habit.id)} type="button">
                    <DeleteIcon fontSize="small" style={{marginRight: '4px'}} /> Delete
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div style={styles.modalOverlay} onMouseDown={(e) => {
          if (e.target === e.currentTarget) setShowDeleteConfirm(null)
        }}>
          <div style={{...styles.modal, maxWidth: '400px'}} className="card">
            <h3 style={{marginBottom: '16px', fontSize: '1.25rem'}}>Delete Habit?</h3>
            <p style={{marginBottom: '24px', color: 'var(--text-secondary)'}}>Are you sure you want to delete this habit? This action cannot be undone.</p>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
          duration={notification.duration}
        />
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px 24px',
    animation: 'fadeIn 0.3s ease-in-out',
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
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    color: 'var(--text-secondary)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out',
    backdropFilter: 'blur(4px)',
  },
  modal: {
    width: '90%',
    maxWidth: '550px',
    maxHeight: '90vh',
    overflow: 'auto',
    animation: 'scaleIn 0.3s ease-out',
    margin: '20px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-color)',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '16px',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-color)',
  },
  habitList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  habitCard: {
    padding: '24px',
    position: 'relative',
  },
  habitHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    gap: '16px',
  },
  habitName: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '8px',
    color: 'var(--text-primary)',
    lineHeight: 1.3,
  },
  habitDesc: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  streakBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
    borderRadius: 'var(--radius-lg)',
    border: '1.5px solid rgba(251, 146, 60, 0.3)',
    flexShrink: 0,
  },
  streakNumber: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--accent-warning)',
  },
  streakLabel: {
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  weeklyCalendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
  },
  dayCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  dayName: {
    fontSize: '0.6875rem',
    color: 'var(--text-tertiary)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  dayBox: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-base)',
    cursor: 'pointer',
  },
  checkMark: {
    color: 'white',
    fontSize: '1.125rem',
    fontWeight: 700,
  },
  dayNum: {
    fontSize: '0.6875rem',
    color: 'var(--text-tertiary)',
    fontWeight: 600,
  },
  habitMeta: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  frequencyBadge: {
    backgroundColor: 'var(--accent-primary)',
    color: 'white',
    padding: '5px 12px',
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: '0.75rem',
  },
  metaText: {
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
  },
  habitActions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--text-secondary)',
    fontSize: '1rem',
  },
}

export default Habits
