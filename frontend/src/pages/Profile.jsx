import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'
import { useNotification } from '../hooks/useNotification.js'
import Notification from '../components/Notification.jsx'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import CakeIcon from '@mui/icons-material/Cake'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import SaveIcon from '@mui/icons-material/Save'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

const Profile = () => {
  const { user, setUser } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { notification, showNotification, hideNotification } = useNotification()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    age: '',
    budget: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        age: user.age || '',
        budget: user.budget || 5000
      })
    }
  }, [user])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }
    
    if (formData.age && (parseInt(formData.age) < 1 || parseInt(formData.age) > 150)) {
      newErrors.age = 'Age must be between 1 and 150'
    }
    
    if (formData.budget && parseFloat(formData.budget) < 0) {
      newErrors.budget = 'Budget must be positive'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showNotification('Please fix the errors in the form', 'error')
      return
    }
    
    setLoading(true)

    try {
      const dataToSend = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
      }
      
      const response = await api.put('/auth/profile', dataToSend)
      const updatedUser = response.data.user
      
      setUser(updatedUser)
      showNotification('Profile updated successfully!', 'success')
      
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      console.error('Profile update error:', error)
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to update profile'
      showNotification(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div style={styles.container}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
          duration={notification.duration}
        />
      )}

      {/* Header */}
      <div style={{...styles.header, backgroundColor: theme === 'light' ? '#ffffff' : '#000000'}}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          <ArrowBackIcon style={{ fontSize: '18px' }} />
        </button>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Profile Settings</h1>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={styles.content}>
        {/* Left Column - Form */}
        <div style={styles.leftColumn}>

          {/* Profile Form Card */}
          <div style={{...styles.formCard, backgroundColor: theme === 'light' ? '#ffffff' : '#000000'}}>
            <div style={styles.cardHeader}>
              <div style={styles.avatarContainer}>
                <div style={styles.avatar}>
                  <PersonIcon style={{fontSize: '32px', color: 'var(--text-primary)', opacity: 0.8}} />
                </div>
              </div>
              <div>
                <h2 style={styles.cardTitle}>Personal Details</h2>
                <p style={styles.cardSubtitle}>Update your information</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>First Name</label>
                  <div style={styles.inputWrapper}>
                    <PersonIcon style={styles.inputIcon} />
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      style={{...styles.input, ...(errors.first_name && styles.inputError)}}
                      placeholder="Enter first name"
                    />
                  </div>
                  {errors.first_name && <span style={styles.errorText}>{errors.first_name}</span>}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Last Name</label>
                  <div style={styles.inputWrapper}>
                    <PersonIcon style={styles.inputIcon} />
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      style={{...styles.input, ...(errors.last_name && styles.inputError)}}
                      placeholder="Enter last name"
                    />
                  </div>
                  {errors.last_name && <span style={styles.errorText}>{errors.last_name}</span>}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <EmailIcon style={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    style={{...styles.input, cursor: 'not-allowed', opacity: 0.6}}
                    disabled
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Age</label>
                  <div style={styles.inputWrapper}>
                    <CakeIcon style={styles.inputIcon} />
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      style={{...styles.input, ...(errors.age && styles.inputError)}}
                      placeholder="Enter age"
                      min="1"
                      max="150"
                    />
                  </div>
                  {errors.age && <span style={styles.errorText}>{errors.age}</span>}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Monthly Budget ($)</label>
                  <div style={styles.inputWrapper}>
                    <AccountBalanceWalletIcon style={styles.inputIcon} />
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      style={{...styles.input, ...(errors.budget && styles.inputError)}}
                      placeholder="Enter budget"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errors.budget && <span style={styles.errorText}>{errors.budget}</span>}
                </div>
              </div>

              <button
                type="submit"
                style={styles.submitButton}
                disabled={loading}
              >
                <SaveIcon style={{ fontSize: '16px' }} />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div style={styles.rightColumn}>
          <div style={{...styles.statsCard, backgroundColor: theme === 'light' ? '#ffffff' : '#000000'}}>
            <h3 style={styles.statsTitle}>Account Overview</h3>
            
            <div style={styles.statItem}>
              <div style={styles.statIconWrapper}>
                <LocalFireDepartmentIcon style={{fontSize: '20px', color: '#F59E0B'}} />
              </div>
              <div style={styles.statInfo}>
                <div style={styles.statValue}>{user?.current_streak || 0}</div>
                <div style={styles.statLabel}>Day Streak</div>
              </div>
            </div>

            <div style={styles.statItem}>
              <div style={styles.statIconWrapper}>
                <TrendingUpIcon style={{fontSize: '20px', color: '#EF4444'}} />
              </div>
              <div style={styles.statInfo}>
                <div style={styles.statValue}>{user?.longest_streak || 0}</div>
                <div style={styles.statLabel}>Longest Streak</div>
              </div>
            </div>

            <div style={styles.statItem}>
              <div style={styles.statIconWrapper}>
                <CalendarTodayIcon style={{fontSize: '20px', color: '#3B82F6'}} />
              </div>
              <div style={styles.statInfo}>
                <div style={styles.statValue}>
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </div>
                <div style={styles.statLabel}>Member Since</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
  },
  header: {
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    borderBottom: '1px solid var(--border-color)',
  },
  backButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid var(--border-color)',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0,
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '24px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  formCard: {
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--border-color)',
  },
  avatarContainer: {
    width: '56px',
    height: '56px',
    flexShrink: 0,
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-primary)',
    border: '2px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: '0 0 4px 0',
  },
  cardSubtitle: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '18px',
    color: 'var(--text-secondary)',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '10px 12px 10px 40px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: '0.75rem',
    color: '#EF4444',
    marginTop: '4px',
  },
  submitButton: {
    marginTop: '8px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  statsCard: {
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    padding: '20px',
    position: 'sticky',
    top: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  statsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: '0 0 20px 0',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-color)',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 0',
    borderBottom: '1px solid var(--border-color)',
  },
  statIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
}

export default Profile
