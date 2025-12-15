import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, CheckSquare, TrendingUp, DollarSign, 
  BookOpen, Calendar, Clock, Moon, Sun, LogOut, Sparkles
} from 'lucide-react'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Home' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/habits', icon: TrendingUp, label: 'Habits' },
    { path: '/expenses', icon: DollarSign, label: 'Expenses' },
    { path: '/journal', icon: BookOpen, label: 'Journal' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/pomodoro', icon: Clock, label: 'Pomodoro' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{...styles.navWrapper}}>
      <div style={{...styles.nav, ...(scrolled ? styles.navScrolled : {}), ...(theme === 'dark' ? styles.navDark : styles.navLight)}}>
        <div style={styles.container}>
        <div style={styles.brand}>
          <Sparkles size={20} style={{color: 'var(--accent-primary)'}} />
          <span style={styles.brandText}>Life Dashboard</span>
        </div>
        
        <div style={styles.links}>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.link,
                  ...(location.pathname === item.path ? styles.linkActive : {})
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div style={styles.actions}>
          <div style={styles.userInfo} onClick={() => navigate('/profile')}>
            <div style={styles.userAvatar}>
              {user?.first_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span style={styles.userName}>
              {user?.first_name || 'User'}
            </span>
          </div>
          <button style={styles.iconBtn} onClick={toggleTheme} title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout} title="Logout">
            <LogOut size={18} />
            <span style={styles.logoutText}>Logout</span>
          </button>
        </div>
        </div>
      </div>
    </nav>
  )
}

const styles = {
  navWrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '16px 20px',
  },
  nav: {
    borderRadius: '16px',
    padding: '10px 16px',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  },
  navLight: {
    background: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  navDark: {
    background: 'rgba(20, 20, 40, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  navScrolled: {
    backdropFilter: 'blur(50px) saturate(200%)',
    WebkitBackdropFilter: 'blur(50px) saturate(200%)',
    boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.25)',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'nowrap',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
    minWidth: 'fit-content',
    flexShrink: 0,
  },
  brandText: {
    fontSize: '1.15rem',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  links: {
    display: 'flex',
    gap: '3px',
    flex: 1,
    overflow: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '10px',
    textDecoration: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.25s ease',
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
    position: 'relative',
    background: 'transparent',
  },
  linkActive: {
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(40, 40, 40, 0.85) 100%)',
    color: '#FFFFFF',
    fontWeight: 600,
    border: '1px solid rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-1px)',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexShrink: 0,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',    cursor: 'pointer',
    transition: 'opacity 0.2s ease',    padding: '5px 10px',
    borderRadius: '10px',
    background: 'rgba(var(--bg-secondary-rgb, 255, 255, 255), 0.25)',
    border: '1px solid rgba(var(--border-rgb, 0, 0, 0), 0.08)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: 'all 0.25s ease',
  },
  userAvatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(60, 60, 60, 0.9) 100%)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: 600,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
  },
  iconBtn: {
    padding: '9px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-primary)',
    border: '1px solid rgba(var(--border-rgb, 0, 0, 0), 0.08)',
    background: 'rgba(var(--bg-secondary-rgb, 255, 255, 255), 0.25)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.25s ease',
  },
  logoutBtn: {
    padding: '7px 12px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#DC2626',
    border: '1px solid rgba(220, 38, 38, 0.2)',
    background: 'rgba(220, 38, 38, 0.05)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 4px rgba(220, 38, 38, 0.08)',
  },
  logoutText: {
    fontSize: '0.875rem',
  },
}

export default Navbar
