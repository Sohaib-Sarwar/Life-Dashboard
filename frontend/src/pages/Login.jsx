import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Sparkles, Target, TrendingUp, Zap, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
        return ''
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors({ ...errors, [name]: error })
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched({ ...touched, [name]: true })
    const error = validateField(name, value)
    setErrors({ ...errors, [name]: error })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched({ email: true, password: true })
      return
    }
    
    setLoading(true)
    setErrors({})

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      navigate('/')
    } else {
      setErrors({ submit: result.error || 'Login failed. Please try again.' })
    }
    
    setLoading(false)
  }

  const motivationalQuotes = [
    { icon: Target, text: "Focus on progress, not perfection", color: '#10B981' },
    { icon: TrendingUp, text: "Every day is a new opportunity to grow", color: '#3B82F6' },
    { icon: Zap, text: "Small steps lead to big achievements", color: '#F59E0B' },
  ]

  return (
    <div style={styles.container}>
      {/* Left Side - Form */}
      <div style={styles.leftPanel}>
        <div style={styles.formWrapper}>
          <div style={styles.logo}>
            <Sparkles size={32} color="var(--accent-primary)" />
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Login with e-mail and password</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {errors.submit && <div style={styles.errorBox}>{errors.submit}</div>}
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>E-mail</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  ...styles.input,
                  ...(errors.email && touched.email ? styles.inputError : {})
                }}
              />
              {errors.email && touched.email && (
                <span style={styles.errorText}>{errors.email}</span>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    ...styles.input,
                    paddingRight: '45px',
                    ...(errors.password && touched.password ? styles.inputError : {})
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <span style={styles.errorText}>{errors.password}</span>
              )}
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Signing In...' : 'Login'}
            </button>
          </form>

          <p style={styles.footer}>
            Don't have an account? <Link to="/register" style={styles.link}>Create one</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Motivational Content */}
      <div style={styles.rightPanel}>
        <div style={styles.decorativeCircle}></div>
        <div style={styles.contentWrapper}>
          <h2 style={styles.rightTitle}>Stay Productive</h2>
          <p style={styles.rightSubtitle}>
            Your personal productivity hub awaits. Track tasks, build habits, and achieve your goals.
          </p>
          
          <div style={styles.quotesContainer}>
            {motivationalQuotes.map((quote, index) => {
              const Icon = quote.icon
              return (
                <div key={index} style={{...styles.quoteCard, animationDelay: `${index * 0.2}s`}}>
                  <div style={{...styles.iconWrapper, background: `${quote.color}15`}}>
                    <Icon size={20} color={quote.color} />
                  </div>
                  <p style={styles.quoteText}>{quote.text}</p>
                </div>
              )
            })}
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>100%</div>
              <div style={styles.statLabel}>Free Forever</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>Access Anywhere</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>∞</div>
              <div style={styles.statLabel}>Unlimited Tasks</div>
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
    display: 'flex',
    background: 'var(--bg-primary)',
    '@media (maxWidth: 1024px)': {
      flexDirection: 'column',
    },
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    background: 'var(--bg-primary)',
    minHeight: '100vh',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '420px',
    padding: '0 16px',
  },
  logo: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '8px',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    marginBottom: '32px',
    fontSize: '0.9rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    transition: 'color 0.2s',
    borderRadius: '4px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
  },
  inputError: {
    border: '1.5px solid #DC2626',
    background: 'rgba(239, 68, 68, 0.05)',
  },
  errorText: {
    fontSize: '0.75rem',
    color: '#DC2626',
    marginTop: '4px',
    display: 'block',
    fontWeight: 500,
  },
  errorBox: {
    padding: '12px 16px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#DC2626',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  submitBtn: {
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(50, 50, 50, 0.9) 100%)',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },

  footer: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  link: {
    color: 'var(--accent-primary)',
    textDecoration: 'none',
    fontWeight: 600,
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 32px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)',
    position: 'relative',
    overflow: 'hidden',
    animation: 'gradientShift 8s ease infinite',
    minHeight: '50vh',
  },
  decorativeCircle: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    top: '-150px',
    right: '-150px',
    backdropFilter: 'blur(60px)',
  },
  contentWrapper: {
    maxWidth: '480px',
    zIndex: 1,
    color: '#FFFFFF',
    width: '100%',
  },
  rightTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    marginBottom: '12px',
    letterSpacing: '-0.03em',
  },
  rightSubtitle: {
    fontSize: '1rem',
    opacity: 0.95,
    marginBottom: '32px',
    lineHeight: 1.6,
  },
  quotesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
  },
  quoteCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 18px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    animation: 'fadeInUp 0.8s ease forwards',
    opacity: 0,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
  },
  iconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.2)',
    flexShrink: 0,
  },
  quoteText: {
    fontSize: '0.875rem',
    fontWeight: 500,
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  statItem: {
    textAlign: 'center',
    padding: '16px 12px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: 800,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '0.75rem',
    opacity: 0.9,
  },
}

export default Login
