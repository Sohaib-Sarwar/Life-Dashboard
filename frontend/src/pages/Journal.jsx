import { useState, useEffect } from 'react'
import api from '../services/api.js'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import BookIcon from '@mui/icons-material/MenuBook'
import MoodIcon from '@mui/icons-material/Mood'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral'
import CelebrationIcon from '@mui/icons-material/Celebration'
import AnxiousIcon from '@mui/icons-material/ErrorOutline'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import BoltIcon from '@mui/icons-material/Bolt'
import SpaIcon from '@mui/icons-material/Spa'
import Notification from '../components/Notification.jsx'
import { useNotification } from '../hooks/useNotification.js'

const Journal = () => {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '', content: '', mood: 'neutral', date: new Date().toISOString().split('T')[0], tags: ''
  })
  const [editing, setEditing] = useState(null)
  const [expandedEntry, setExpandedEntry] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const { notification, showNotification, hideNotification } = useNotification()

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const response = await api.get('/journal')
      console.log('Fetched journal entries:', response.data)
      setEntries(response.data || [])
    } catch (error) {
      console.error('Error fetching journal entries:', error)
      setEntries([])
      if (error.response?.status === 422 || error.response?.status === 401) {
        showNotification('Your session has expired. Please logout and login again.', 'error')
      } else {
        showNotification('Failed to load journal entries. Please try again.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
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
        await api.put(`/journal/${editing}`, formData)
        showNotification('Journal entry updated successfully!', 'success')
      } else {
        await api.post('/journal', formData)
        showNotification('Journal entry created successfully!', 'success')
      }
      setFormData({ title: '', content: '', mood: 'neutral', date: new Date().toISOString().split('T')[0], tags: '' })
      setEditing(null)
      setShowModal(false)
      setErrors({})
      fetchEntries()
    } catch (error) {
      console.error('Error saving entry:', error)
      showNotification('Failed to save journal entry: ' + (error.response?.data?.message || error.message), 'error')
    }
  }

  const handleDelete = async (id) => {
    setShowDeleteConfirm(id)
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/journal/${showDeleteConfirm}`)
      showNotification('Journal entry deleted successfully!', 'success')
      fetchEntries()
    } catch (error) {
      console.error('Error deleting entry:', error)
      showNotification('Failed to delete entry', 'error')
    }
    setShowDeleteConfirm(null)
  }

  const handleEdit = (entry) => {
    setFormData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      date: entry.date,
      tags: entry.tags || ''
    })
    setEditing(entry.id)
    setShowModal(true)
    setErrors({})
  }

  const getMoodIcon = (mood) => {
    const iconProps = { style: { fontSize: '18px', verticalAlign: 'middle' } }
    const moodIcons = {
      happy: <SentimentSatisfiedAltIcon {...iconProps} />,
      sad: <SentimentVeryDissatisfiedIcon {...iconProps} />,
      neutral: <SentimentNeutralIcon {...iconProps} />,
      excited: <CelebrationIcon {...iconProps} />,
      anxious: <AnxiousIcon {...iconProps} />,
      grateful: <FavoriteIcon {...iconProps} />,
      accomplished: <EmojiEventsIcon {...iconProps} />,
      motivated: <BoltIcon {...iconProps} />,
      peaceful: <SpaIcon {...iconProps} />
    }
    return moodIcons[mood] || <SentimentNeutralIcon {...iconProps} />
  }

  const getMoodColor = (mood) => {
    const moodColorMap = {
      happy: '#10B981',
      sad: '#3B82F6',
      neutral: '#6B7280',
      excited: '#F59E0B',
      anxious: '#EF4444',
      grateful: '#8B5CF6'
    }
    return moodColorMap[mood] || '#6B7280'
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="shimmer" style={{width: '200px', height: '32px'}}></div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <BookIcon style={{marginRight: '12px', verticalAlign: 'middle', fontSize: '2rem'}} />
            Journal
          </h1>
          <p style={styles.subtitle}>Capture your thoughts and reflections</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setEditing(null)
            setFormData({ title: '', content: '', mood: 'neutral', date: new Date().toISOString().split('T')[0], tags: '' })
            setShowModal(true)
            setErrors({})
          }}
          style={styles.addButton}
          type="button"
        >
          <AddIcon style={{fontSize: '20px', marginRight: '8px'}} />
          New Entry
        </button>
      </div>

      {/* Modal for Add/Edit Entry */}
      {showModal && (
        <div style={styles.modalOverlay} onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setShowModal(false)
            setErrors({})
          }
        }}>
          <div style={styles.modal} className="card">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editing ? 'Edit Journal Entry' : 'New Journal Entry'}
              </h2>
              <button 
                style={styles.closeButton}
                onClick={() => {
                  setShowModal(false)
                  setErrors({})
                }}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Give your entry a title..."
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value })
                    if (errors.title) setErrors({ ...errors, title: '' })
                  }}
                  style={errors.title ? styles.inputError : {}}
                />
                {errors.title && <span style={styles.errorText}>{errors.title}</span>}
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <MoodIcon style={{fontSize: '16px', marginRight: '4px', verticalAlign: 'middle'}} />
                    Mood
                  </label>
                  <select
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                    className="input"
                  >
                    <option value="happy">Happy</option>
                    <option value="sad">Sad</option>
                    <option value="neutral">Neutral</option>
                    <option value="excited">Excited</option>
                    <option value="anxious">Anxious</option>
                    <option value="grateful">Grateful</option>
                    <option value="accomplished">Accomplished</option>
                    <option value="motivated">Motivated</option>
                    <option value="peaceful">Peaceful</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <CalendarTodayIcon style={{fontSize: '16px', marginRight: '4px', verticalAlign: 'middle'}} />
                    Date *
                  </label>
                  <input
                    className="input"
                    type="date"
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value })
                      if (errors.date) setErrors({ ...errors, date: '' })
                    }}
                    style={errors.date ? styles.inputError : {}}
                  />
                  {errors.date && <span style={styles.errorText}>{errors.date}</span>}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Content *</label>
                <textarea
                  className="input"
                  placeholder="Write your thoughts, feelings, and reflections..."
                  value={formData.content}
                  onChange={(e) => {
                    setFormData({ ...formData, content: e.target.value })
                    if (errors.content) setErrors({ ...errors, content: '' })
                  }}
                  rows="8"
                  style={{...styles.textarea, ...(errors.content ? styles.inputError : {})}}
                />
                <div style={styles.charCount}>
                  {formData.content.length} characters
                </div>
                {errors.content && <span style={styles.errorText}>{errors.content}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tags (optional)</label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g., gratitude, reflection, goals"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
                <span style={styles.helpText}>Separate tags with commas</span>
              </div>

              <div style={styles.modalFooter}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowModal(false)
                    setErrors({})
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div style={styles.entryList}>
        {entries.length === 0 ? (
          <div style={styles.empty} className="card">
            <BookIcon style={{fontSize: '64px', color: 'var(--text-tertiary)', marginBottom: '16px'}} />
            <h3 style={{color: 'var(--text-secondary)', marginBottom: '8px'}}>No journal entries yet</h3>
            <p style={{color: 'var(--text-tertiary)'}}>Click "New Entry" to start writing</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} style={styles.entryCard} className="card">
              <div style={styles.entryHeader}>
                <div style={styles.entryHeaderLeft}>
                  <span style={{...styles.moodBadge, backgroundColor: getMoodColor(entry.mood) + '15', color: getMoodColor(entry.mood)}}>
                    {getMoodIcon(entry.mood)} {entry.mood}
                  </span>
                  <span style={styles.date}>
                    <CalendarTodayIcon style={{fontSize: '14px', marginRight: '4px', verticalAlign: 'middle'}} />
                    {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div style={styles.entryActions}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(entry)} 
                    type="button"
                    style={styles.iconButton}
                  >
                    <EditIcon fontSize="small" />
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(entry.id)} 
                    type="button"
                    style={styles.iconButton}
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>

              <h3 style={styles.entryTitle}>{entry.title}</h3>

              <div style={styles.entryContent}>
                {expandedEntry === entry.id ? (
                  <p style={styles.contentFull}>{entry.content}</p>
                ) : (
                  <p style={styles.contentPreview}>
                    {entry.content.length > 250 ? entry.content.substring(0, 250) + '...' : entry.content}
                  </p>
                )}
              </div>

              {entry.tags && entry.tags.length > 0 && (
                <div style={styles.tags}>
                  {(Array.isArray(entry.tags) ? entry.tags : entry.tags.split(',')).map((tag, idx) => (
                    <span key={idx} style={styles.tag}>
                      {typeof tag === 'string' ? tag.trim() : tag}
                    </span>
                  ))}
                </div>
              )}

              {entry.content.length > 250 && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                  type="button"
                  style={styles.readMoreButton}
                >
                  {expandedEntry === entry.id ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div style={styles.modalOverlay} onMouseDown={(e) => {
          if (e.target === e.currentTarget) setShowDeleteConfirm(null)
        }}>
          <div style={{...styles.modal, maxWidth: '400px'}} className="card">
            <h3 style={{marginBottom: '16px', fontSize: '1.25rem'}}>Delete Journal Entry?</h3>
            <p style={{marginBottom: '24px', color: 'var(--text-secondary)'}}>Are you sure you want to delete this journal entry? This action cannot be undone.</p>
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
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 24px',
    animation: 'fadeIn 0.4s ease-in-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '8px',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    display: 'flex',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    fontSize: '0.9375rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
    animation: 'fadeIn 0.2s ease-in-out',
  },
  modal: {
    width: '90%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'auto',
    animation: 'slideUp 0.3s ease-out',
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
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    color: 'var(--text-tertiary)',
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
    flex: 1,
  },
  formRow: {
    display: 'flex',
    gap: '16px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
  },
  textarea: {
    minHeight: '150px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  charCount: {
    fontSize: '0.8125rem',
    color: 'var(--text-tertiary)',
    textAlign: 'right',
    marginTop: '-4px',
  },
  helpText: {
    fontSize: '0.8125rem',
    color: 'var(--text-tertiary)',
    marginTop: '-4px',
  },
  inputError: {
    borderColor: 'var(--accent-danger)',
  },
  errorText: {
    fontSize: '0.8125rem',
    color: 'var(--accent-danger)',
    marginTop: '-4px',
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-color)',
  },
  entryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  entryCard: {
    padding: '24px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  entryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  entryHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  moodBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.8125rem',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  date: {
    fontSize: '0.8125rem',
    color: 'var(--text-tertiary)',
    display: 'flex',
    alignItems: 'center',
  },
  entryActions: {
    display: 'flex',
    gap: '8px',
  },
  iconButton: {
    padding: '8px',
    minWidth: 'auto',
  },
  entryTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '12px',
    color: 'var(--text-primary)',
    lineHeight: 1.4,
  },
  entryContent: {
    marginBottom: '12px',
  },
  contentPreview: {
    lineHeight: 1.7,
    color: 'var(--text-primary)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  contentFull: {
    lineHeight: 1.7,
    color: 'var(--text-primary)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  tag: {
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '0.8125rem',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  readMoreButton: {
    padding: '6px 16px',
    fontSize: '0.875rem',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 40px',
    color: 'var(--text-tertiary)',
  },
}

export default Journal
