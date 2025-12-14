import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Sparkles, CheckCircle, Target, Calendar, TrendingUp, Eye, EyeOff } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required'
        if (value.length < 2) return 'First name must be at least 2 characters'
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'First name can only contain letters'
        return ''
      case 'lastName':
        if (!value.trim()) return 'Last name is required'
        if (value.length < 2) return 'Last name must be at least 2 characters'
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Last name can only contain letters'
        return ''
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
        return ''
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter'
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter'
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number'
        return ''
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== formData.password) return 'Passwords do not match'
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
    
    // Also revalidate confirmPassword when password changes
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword)
      setErrors({ ...errors, [name]: error, confirmPassword: confirmError })
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
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        confirmPassword: true
      })
      return
    }
    
    setLoading(true)
    setErrors({})

    const result = await register(
      formData.email, formData.password, formData.firstName, formData.lastName
    )
    
    if (result.success) {
      navigate('/')
    } else {
      setErrors({ submit: result.error || 'Registration failed. Please try again.' })
    }
    
    setLoading(false)
  }

  const benefits = [
    { icon: CheckCircle, text: "Track unlimited tasks and goals", color: '#10B981' },
    { icon: TrendingUp, text: "Build productive habits that stick", color: '#3B82F6' },
    { icon: Calendar, text: "Organize your schedule efficiently", color: '#8B5CF6' },
    { icon: Target, text: "Monitor expenses and achieve financial clarity", color: '#F59E0B' },
  ]

  return (
    <div style={styles.container}>
      {/* Left Side - Benefits */}
      <div style={styles.leftPanel}>
        <div style={styles.decorativeCircle}></div>
        <div style={styles.contentWrapper}>
          <h2 style={styles.leftTitle}>Why Choose Life Dashboard?</h2>
          <p style={styles.leftSubtitle}>
            Your all-in-one productivity companion. Transform the way you work, live, and achieve your goals.
          </p>
          
          <div style={styles.benefitsContainer}>
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} style={{...styles.benefitCard, animationDelay: `${index * 0.15}s`}}>
                  <div style={{...styles.iconWrapper, background: `${benefit.color}25`}}>
                    <Icon size={22} color={benefit.color} />
                  </div>
                  <p style={styles.benefitText}>{benefit.text}</p>
                </div>
              )
            })}
          </div>

          <div style={styles.ctaBox}>
            <div style={styles.ctaIcon}>
              <Sparkles size={28} />
            </div>
            <div>
              <div style={styles.ctaTitle}>Start Free Today</div>
              <div style={styles.ctaSubtitle}>No credit card required • Forever free</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formWrapper}>
          <div style={styles.logo}>
            <Sparkles size={32} color="var(--accent-primary)" />
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join thousands of productive people</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {errors.submit && <div style={styles.errorBox}>{errors.submit}</div>}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    ...styles.input,
                    ...(errors.firstName && touched.firstName ? styles.inputError : {})
                  }}
                />
                {errors.firstName && touched.firstName && (
                  <span style={styles.errorText}>{errors.firstName}</span>
                )}
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    ...styles.input,
                    ...(errors.lastName && touched.lastName ? styles.inputError : {})
                  }}
                />
                {errors.lastName && touched.lastName && (
                  <span style={styles.errorText}>{errors.lastName}</span>
                )}
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
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
                  placeholder="At least 6 characters with upper, lower & number"
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

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    ...styles.input,
                    paddingRight: '45px',
                    ...(errors.confirmPassword && touched.confirmPassword ? styles.inputError : {})
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <span style={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account? <Link to="/login" style={styles.link}>Sign In</Link>
          </p>
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
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 32px',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
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
    background: 'rgba(255, 255, 255, 0.08)',
    top: '-150px',
    left: '-150px',
    backdropFilter: 'blur(60px)',
  },
  contentWrapper: {
    maxWidth: '480px',
    zIndex: 1,
    color: '#FFFFFF',
    width: '100%',
  },
  leftTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    marginBottom: '12px',
    letterSpacing: '-0.03em',
  },
  leftSubtitle: {
    fontSize: '1rem',
    opacity: 0.95,
    marginBottom: '32px',
    lineHeight: 1.6,
  },
  benefitsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
  },
  benefitCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    animation: 'fadeInUp 0.8s ease forwards',
    opacity: 0,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.2)',
    flexShrink: 0,
  },
  benefitText: {
    fontSize: '0.9rem',
    fontWeight: 500,
    margin: 0,
  },
  ctaBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 24px',
    background: 'rgba(255, 255, 255, 0.18)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    animation: 'fadeInUp 1.2s ease forwards',
  },
  ctaIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ctaTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    marginBottom: '4px',
  },
  ctaSubtitle: {
    fontSize: '0.8rem',
    opacity: 0.9,
  },
  rightPanel: {
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
    gap: '18px',
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
}

export default Register
