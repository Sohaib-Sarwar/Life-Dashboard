import { useState, useEffect } from 'react'
import api from '../services/api.js'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import MovieIcon from '@mui/icons-material/Movie'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import PushPinIcon from '@mui/icons-material/PushPin'
import Notification from '../components/Notification.jsx'
import { useNotification } from '../hooks/useNotification.js'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    amount: '', category: 'food', description: '', date: new Date().toISOString().split('T')[0]
  })
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const { notification, showNotification, hideNotification } = useNotification()

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses')
      setExpenses(response.data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0'
    } else if (formData.amount > 999999.99) {
      newErrors.amount = 'Amount must be less than 1,000,000'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 3) {
      newErrors.description = 'Description must be at least 3 characters'
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    } else {
      const expenseDate = new Date(formData.date)
      expenseDate.setHours(0, 0, 0, 0)
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      if (expenseDate > today) {
        newErrors.date = 'Date cannot be in the future'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    console.log('Submitting expense:', formData)
    try {
      if (editing) {
        const response = await api.put(`/expenses/${editing}`, formData)
        console.log('Expense updated:', response.data)
        showNotification('Expense updated successfully', 'success')
      } else {
        const response = await api.post('/expenses', formData)
        console.log('Expense created:', response.data)
        showNotification('Expense added successfully', 'success')
      }
      setFormData({ amount: '', category: 'food', description: '', date: new Date().toISOString().split('T')[0] })
      setEditing(null)
      setShowModal(false)
      setErrors({})
      fetchExpenses()
    } catch (error) {
      console.error('Error saving expense:', error)
      console.error('Error response:', error.response?.data)
      showNotification('Failed to save expense: ' + (error.response?.data?.message || error.message), 'error')
    }
  }

  const handleDelete = async (id) => {
    setShowDeleteConfirm(id)
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/expenses/${showDeleteConfirm}`)
      showNotification('Expense deleted successfully', 'success')
      fetchExpenses()
    } catch (error) {
      console.error('Error deleting expense:', error)
      showNotification('Failed to delete expense', 'error')
    }
    setShowDeleteConfirm(null)
  }

  const handleEdit = (expense) => {
    setFormData({
      amount: expense.amount,
      category: expense.category,
      description: expense.description || '',
      date: expense.date
    })
    setEditing(expense.id)
    setShowModal(true)
  }

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true
    return expense.category === filter
  })

  const getTotalAmount = () => {
    return filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0).toFixed(2)
  }

  const getCategoryIcon = (value) => {
    const icons = {
      'food': <FastfoodIcon fontSize="small" />,
      'transport': <DirectionsCarIcon fontSize="small" />,
      'entertainment': <MovieIcon fontSize="small" />,
      'utilities': <LightbulbIcon fontSize="small" />,
      'shopping': <ShoppingBagIcon fontSize="small" />,
      'health': <LocalHospitalIcon fontSize="small" />,
      'other': <PushPinIcon fontSize="small" />
    }
    return icons[value] || <PushPinIcon fontSize="small" />
  }

  const categories = [
    { value: 'food', label: 'Food' },
    { value: 'transport', label: 'Transportation' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'other', label: 'Other' }
  ]

  if (loading) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Expenses</h1>
        <button 
          className="btn btn-primary" 
          style={styles.addButton}
          onClick={() => {
            setEditing(null)
            setFormData({ amount: '', category: 'food', description: '', date: new Date().toISOString().split('T')[0] })
            setShowModal(true)
          }}
          type="button"
        >
          <AddIcon style={{fontSize: '20px', marginRight: '8px'}} />
          Add Expense
        </button>
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onMouseDown={(e) => {
          if (e.target === e.currentTarget) setShowModal(false)
        }}>
          <div className="card" style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? 'Edit Expense' : 'Add Expense'}</h2>
              <button 
                style={styles.closeButton}
                onClick={() => setShowModal(false)}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.modalForm}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Amount *</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => {
                      setFormData({ ...formData, amount: e.target.value })
                      if (errors.amount) setErrors({ ...errors, amount: '' })
                    }}
                    style={errors.amount ? {borderColor: 'var(--danger)'} : {}}
                    step="0.01"
                    min="0"
                    required
                    autoFocus
                  />
                  {errors.amount && <span style={{fontSize: '0.8125rem', color: 'var(--danger)'}}>{errors.amount}</span>}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date *</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value })
                      if (errors.date) setErrors({ ...errors, date: '' })
                    }}
                    style={errors.date ? {borderColor: 'var(--danger)'} : {}}
                    required
                  />
                  {errors.date && <span style={{fontSize: '0.8125rem', color: 'var(--danger)'}}>{errors.date}</span>}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description *</label>
                <textarea
                  className="input"
                  placeholder="What did you spend on?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{ minHeight: '100px' }}
                  required
                />
              </div>

              <div style={styles.modalActions}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={styles.summary}>
        <div style={styles.summaryCard} className="card">
          <div style={styles.summaryLabel}>Total Expenses</div>
          <div style={styles.summaryValue}>${getTotalAmount()}</div>
          <div style={styles.summaryCount}>{filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div style={styles.filterBar}>
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
          type="button"
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.value}
            className={`btn ${filter === cat.value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(cat.value)}
            type="button"
            style={{display: 'flex', alignItems: 'center', gap: '6px'}}
          >
            {getCategoryIcon(cat.value)}
            {cat.label}
          </button>
        ))}
      </div>

      <div style={styles.expenseList}>
        {filteredExpenses.length === 0 ? (
          <div style={styles.empty} className="card">
            {filter === 'all' ? (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '16px', color: 'var(--accent-success)' }}>
                  <ShoppingBagIcon style={{fontSize: '4rem'}} />
                </div>
                <p>No expenses recorded yet!</p>
                <p style={{ fontSize: '0.875rem', marginTop: '8px', opacity: 0.7 }}>
                  Start tracking your spending by adding your first expense.
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '16px', color: 'var(--accent-primary)' }}>
                  {getCategoryIcon(filter)}
                </div>
                <p>No {filter} expenses found</p>
              </>
            )}
          </div>
        ) : (
          filteredExpenses.map(expense => (
            <div key={expense.id} className="card" style={styles.expenseCard}>
              <div style={styles.expenseMain}>
                <div style={styles.expenseAmount}>${parseFloat(expense.amount).toFixed(2)}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={styles.expenseDesc}>{expense.description}</h3>
                  <div style={styles.expenseMeta}>
                    <span style={styles.categoryBadge}>
                      {getCategoryIcon(expense.category)} {expense.category}
                    </span>
                    <span style={styles.date}>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div style={styles.expenseActions}>
                <button className="btn btn-secondary" onClick={() => handleEdit(expense)} type="button">
                  <EditIcon fontSize="small" style={{marginRight: '4px'}} /> Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(expense.id)} type="button">
                  <DeleteIcon fontSize="small" style={{marginRight: '4px'}} /> Delete
                </button>
              </div>
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
            <h3 style={{marginBottom: '16px', fontSize: '1.25rem'}}>Delete Expense?</h3>
            <p style={{marginBottom: '24px', color: 'var(--text-secondary)'}}>Are you sure you want to delete this expense? This action cannot be undone.</p>
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
    maxWidth: '1000px',
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
    gridTemplateColumns: '1fr 1fr',
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
  summary: {
    marginBottom: '32px',
  },
  summaryCard: {
    padding: '32px',
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    marginBottom: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  summaryValue: {
    fontSize: '3rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, var(--accent-success) 0%, var(--accent-primary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
  },
  summaryCount: {
    fontSize: '0.875rem',
    color: 'var(--text-tertiary)',
  },
  filterBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    padding: '16px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
  },
  expenseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  expenseCard: {
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  expenseMain: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flex: 1,
  },
  expenseAmount: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--accent-success)',
    minWidth: '120px',
  },
  expenseDesc: {
    fontSize: '1.0625rem',
    fontWeight: 600,
    marginBottom: '8px',
    color: 'var(--text-primary)',
  },
  expenseMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '0.8125rem',
    alignItems: 'center',
  },
  categoryBadge: {
    padding: '4px 12px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--accent-primary)',
    color: 'white',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  date: {
    color: 'var(--text-tertiary)',
    fontWeight: 500,
  },
  expenseActions: {
    display: 'flex',
    gap: '8px',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--text-secondary)',
  },
}

export default Expenses
