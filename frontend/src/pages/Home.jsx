import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import AddTaskIcon from '@mui/icons-material/AddTask'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CreateIcon from '@mui/icons-material/Create'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import EmailIcon from '@mui/icons-material/Email'
import DescriptionIcon from '@mui/icons-material/Description'
import SecurityIcon from '@mui/icons-material/Security'
import InfoIcon from '@mui/icons-material/Info'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EventNoteIcon from '@mui/icons-material/EventNote'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const Home = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    tasks: { total: 0, completed: 0, pending: 0, overdue: 0 },
    habits: { total: 0, completedToday: 0, weeklyCompletion: 0 },
    expenses: { total: 0, amount: 0, thisMonth: 0, budget: user?.budget || 5000 },
    events: { total: 0, today: 0, upcoming: 0 }
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    setGreeting(getTimeBasedGreeting())
    fetchStats()
  }, [])

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now - time
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    
    return time.toLocaleDateString()
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      // Use local date instead of UTC to avoid timezone issues
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      const todayStr = `${year}-${month}-${day}`
      
      // Fetch all data in parallel
      const [tasksRes, habitsRes, expensesRes, eventsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/habits'),
        api.get('/expenses'),
        api.get(`/calendar?month=${today.getMonth() + 1}&year=${today.getFullYear()}`)
      ])

      const tasks = tasksRes.data
      const habits = habitsRes.data
      const expenses = expensesRes.data
      const events = eventsRes.data || []
      
      // Enhanced task stats
      const completedTasks = tasks.filter(t => t.completed).length
      const pendingTasks = tasks.filter(t => !t.completed).length
      const overdueTasks = tasks.filter(t => {
        if (t.completed) return false
        if (!t.due_date) return false
        const dueDate = new Date(t.due_date)
        dueDate.setHours(0, 0, 0, 0)
        return dueDate < today
      }).length

      // Enhanced habit stats with weekly completion
      // Count habits that have been logged today
      const completedToday = habits.filter(h => {
        if (!h.logs || h.logs.length === 0) return false;
        
        // Check if any log matches today's date
        return h.logs.some(log => {
          if (!log.date) return false;
          
          // Extract just the date part (YYYY-MM-DD) from the log date
          // Handle both ISO strings with time (2025-12-14T00:00:00) and date-only strings (2025-12-14)
          let logDateStr = log.date;
          if (typeof logDateStr === 'string') {
            logDateStr = logDateStr.split('T')[0]; // Get YYYY-MM-DD part
          }
          
          // Compare with today's date string
          return logDateStr === todayStr;
        });
      }).length
      
      // Calculate weekly completion rate
      const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split('T')[0]
      })
      
      const weeklyCompletions = habits.reduce((sum, habit) => {
        const completedDays = last7Days.filter(date =>
          habit.logs?.some(log => log.date === date)
        ).length
        return sum + completedDays
      }, 0)
      
      const totalPossibleCompletions = habits.length * 7
      const weeklyCompletion = totalPossibleCompletions > 0 
        ? Math.round((weeklyCompletions / totalPossibleCompletions) * 100)
        : 0

      // Enhanced expense stats - this month
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()
      
      const thisMonthExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear
      })
      
      const monthlyAmount = thisMonthExpenses.reduce((sum, e) => 
        sum + parseFloat(e.amount || 0), 0
      )

      // Calculate calendar events stats
      const todayEvents = events.filter(e => {
        const eventDate = new Date(e.start_time)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate.getTime() === today.getTime()
      })
      
      const upcomingEvents = events.filter(e => {
        const eventDate = new Date(e.start_time)
        return eventDate > today
      })

      // Build recent activities
      const activities = []
      
      if (tasks.length > 0) {
        const latestTask = [...tasks].sort((a, b) => 
          new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
        )[0]
        activities.push({
          type: 'task',
          title: latestTask.title,
          action: latestTask.completed ? 'completed' : 'created',
          time: latestTask.updated_at || latestTask.created_at
        })
      }
      
      if (completedToday > 0) {
        const completedHabit = habits.find(h => 
          h.logs?.some(log => log.date === todayStr)
        )
        if (completedHabit) {
          activities.push({
            type: 'habit',
            title: completedHabit.name,
            action: 'completed',
            time: new Date().toISOString()
          })
        }
      }
      
      if (expenses.length > 0) {
        const latestExpense = [...expenses].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        )[0]
        activities.push({
          type: 'expense',
          title: `$${parseFloat(latestExpense.amount).toFixed(2)} - ${latestExpense.category || 'Expense'}`,
          action: 'added',
          time: latestExpense.date
        })
      }

      setRecentActivities(
        activities
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 5)
      )

      setStats({
        tasks: {
          total: tasks.length,
          completed: completedTasks,
          pending: pendingTasks,
          overdue: overdueTasks
        },
        habits: {
          total: habits.length,
          completedToday,
          weeklyCompletion
        },
        expenses: {
          total: expenses.length,
          amount: expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0),
          thisMonth: monthlyAmount,
          budget: user?.budget || 5000
        },
        events: {
          total: events.length,
          today: todayEvents.length,
          upcoming: upcomingEvents.length
        }
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="shimmer" style={{width: '200px', height: '32px', margin: '0 auto'}}></div>
      </div>
    )
  }

  return (
    <>
    <div style={styles.container}>
      {/* Header with Streak Card */}
      <div style={styles.headerSection}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>{greeting}, {user?.first_name}</h1>
          <p style={styles.subtitle}>Here is your productivity overview</p>
        </div>
        
        {/* Streak Card */}
        <div style={{
          ...styles.streakCard, 
          backgroundColor: theme === 'light' ? '#ffffff' : '#000000',
          border: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)'
        }} className="card">
          <div style={styles.streakHorizontalContainer}>
            <div style={styles.streakMainRow}>
              <LocalFireDepartmentIcon style={{fontSize: '28px', color: 'var(--warning)'}} />
              <div style={styles.streakNumberSection}>
                <span style={styles.streakNumberLarge}>{user?.current_streak || 0}</span>
                <span style={styles.streakLabelInline}>Day Streak</span>
              </div>
              <div style={styles.streakDivider}></div>
              <div style={styles.streakStatsRow}>
                <div style={styles.streakStatItem}>
                  <span style={styles.streakStatLabel}>Longest</span>
                  <span style={styles.streakStatValue}>{user?.longest_streak || 0} days</span>
                </div>
                <div style={styles.streakStatItem}>
                  <span style={styles.streakStatLabel}>This Week</span>
                  <span style={styles.streakStatValue}>{Math.min(user?.current_streak || 0, 7)} days</span>
                </div>
              </div>
            </div>
            <div style={styles.weekDaysGrid}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                const currentStreak = user?.current_streak || 0;
                const isActive = index < Math.min(currentStreak, 7);
                return (
                  <div key={index} style={{
                    ...styles.weekDay,
                    ...(isActive ? styles.weekDayActive : {})
                  }}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.grid}>
        <div style={styles.card} className="card" onClick={() => navigate('/tasks')}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Tasks</h3>
            <div style={styles.cardIcon}>
              <CheckCircleIcon style={{fontSize: '28px', color: 'var(--accent)'}} />
            </div>
          </div>
          <div style={styles.circularProgressContainer}>
            <div style={styles.circularProgress}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--border-color)"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - (stats.tasks.total > 0 ? stats.tasks.completed / stats.tasks.total : 0))}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{transition: 'stroke-dashoffset 0.5s ease'}}
                />
              </svg>
              <div style={styles.circularProgressText}>
                <div style={styles.circularProgressValue}>{stats.tasks.total > 0 ? Math.round((stats.tasks.completed / stats.tasks.total) * 100) : 0}%</div>
                <div style={styles.circularProgressLabel}>Complete</div>
              </div>
            </div>
          </div>
          <div style={styles.cardStats}>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Completed</span>
              <span style={{...styles.statValue, color: '#4CAF50'}}>{stats.tasks.completed}/{stats.tasks.total}</span>
            </div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Pending</span>
              <span style={{...styles.statValue, color: '#FF9800'}}>{stats.tasks.pending}</span>
            </div>
          </div>
        </div>

        <div style={styles.card} className="card" onClick={() => navigate('/habits')}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Habits</h3>
            <div style={styles.cardIcon}>
              <TrendingUpIcon style={{fontSize: '28px', color: 'var(--success)'}} />
            </div>
          </div>
          <div style={styles.circularProgressContainer}>
            <div style={styles.circularProgress}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--border-color)"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#2196F3"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - stats.habits.weeklyCompletion / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{transition: 'stroke-dashoffset 0.5s ease'}}
                />
              </svg>
              <div style={styles.circularProgressText}>
                <div style={styles.circularProgressValue}>{stats.habits.weeklyCompletion}%</div>
                <div style={styles.circularProgressLabel}>Weekly</div>
              </div>
            </div>
          </div>
          <div style={styles.cardStats}>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Today</span>
              <span style={{...styles.statValue, color: '#4CAF50'}}>{stats.habits.completedToday}/{stats.habits.total}</span>
            </div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Total Habits</span>
              <span style={styles.statValue}>{stats.habits.total}</span>
            </div>
          </div>
        </div>

        <div style={styles.card} className="card" onClick={() => navigate('/expenses')}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Expenses</h3>
            <div style={styles.cardIcon}>
              <AccountBalanceWalletIcon style={{fontSize: '28px', color: 'var(--warning)'}} />
            </div>
          </div>
          <div style={styles.circularProgressContainer}>
            <div style={styles.circularProgress}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--border-color)"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#FF9800"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - Math.min(stats.expenses.thisMonth / stats.expenses.budget, 1))}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{transition: 'stroke-dashoffset 0.5s ease'}}
                />
              </svg>
              <div style={styles.circularProgressText}>
                <div style={styles.circularProgressValue}>${stats.expenses.thisMonth.toFixed(0)}</div>
                <div style={styles.circularProgressLabel}>This Month</div>
              </div>
            </div>
          </div>
          <div style={styles.cardStats}>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Budget</span>
              <span style={styles.statValue}>${stats.expenses.budget.toFixed(2)}</span>
            </div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Total Entries</span>
              <span style={{...styles.statValue, color: '#FF9800'}}>{stats.expenses.total}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Notifications & Reminders Section */}
      <div style={styles.section}>
        <div style={styles.remindersSectionHeader}>
          <div style={styles.overviewBadge}>
            <div style={styles.overviewBadgeDot}></div>
            <span style={styles.overviewBadgeText}>LIVE</span>
          </div>
          <h2 style={styles.overviewTitle}>Today's Overview</h2>
          <p style={styles.overviewSubtitle}>Monitor your daily progress and priorities</p>
        </div>
        <div style={styles.remindersGrid}>
          {/* Today's Tasks */}
          <div style={{
            ...styles.reminderCard,
            backgroundColor: theme === 'light' ? '#ffffff' : '#000000',
            border: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{...styles.reminderIconWrapper, backgroundColor: 'rgba(76, 175, 80, 0.1)'}}>
              <CheckCircleOutlineIcon style={{...styles.reminderIcon, color: '#4CAF50', animation: 'pulse 2s ease-in-out infinite'}} />
            </div>
            <h3 style={styles.reminderTitle}>Tasks</h3>
            <div style={styles.reminderStats}>
              {stats.tasks.pending > 0 ? (
                <>
                  <div style={styles.reminderStat}>
                    <span style={styles.reminderStatNumber}>{stats.tasks.pending}</span>
                    <span style={styles.reminderStatLabel}>Pending</span>
                  </div>
                  {stats.tasks.overdue > 0 && (
                    <div style={{...styles.reminderStat, ...styles.reminderStatUrgent}}>
                      <span style={styles.reminderStatNumber}>{stats.tasks.overdue}</span>
                      <span style={styles.reminderStatLabel}>Overdue</span>
                    </div>
                  )}
                </>
              ) : (
                <div style={styles.reminderEmptyState}>
                  <CheckCircleIcon style={styles.reminderEmptyIcon} />
                  <span style={styles.reminderEmptyText}>All Clear</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate('/tasks')}
              style={styles.reminderAction}
            >
              <span>View Tasks</span>
              <ArrowForwardIcon style={{fontSize: '16px'}} />
            </button>
          </div>

          {/* Today's Habits */}
          <div style={{
            ...styles.reminderCard,
            backgroundColor: theme === 'light' ? '#ffffff' : '#000000',
            border: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{...styles.reminderIconWrapper, backgroundColor: 'rgba(255, 152, 0, 0.1)'}}>
              <LocalFireDepartmentIcon style={{...styles.reminderIcon, color: '#FF9800', animation: 'bounce 2s ease-in-out infinite'}} />
            </div>
            <h3 style={styles.reminderTitle}>Habits</h3>
            <div style={styles.reminderStats}>
              {stats.habits.completedToday < stats.habits.total ? (
                <>
                  <div style={styles.reminderStat}>
                    <span style={styles.reminderStatNumber}>{stats.habits.total - stats.habits.completedToday}</span>
                    <span style={styles.reminderStatLabel}>Remaining</span>
                  </div>
                  {stats.habits.completedToday > 0 && (
                    <div style={styles.reminderStat}>
                      <span style={styles.reminderStatNumber}>{stats.habits.completedToday}</span>
                      <span style={styles.reminderStatLabel}>Completed</span>
                    </div>
                  )}
                </>
              ) : (
                <div style={styles.reminderEmptyState}>
                  <CheckCircleIcon style={styles.reminderEmptyIcon} />
                  <span style={styles.reminderEmptyText}>All Logged</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate('/habits')}
              style={styles.reminderAction}
            >
              <span>Log Habits</span>
              <ArrowForwardIcon style={{fontSize: '16px'}} />
            </button>
          </div>

          {/* Today's Events */}
          <div style={{
            ...styles.reminderCard,
            backgroundColor: theme === 'light' ? '#ffffff' : '#000000',
            border: theme === 'light' ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{...styles.reminderIconWrapper, backgroundColor: 'rgba(33, 150, 243, 0.1)'}}>
              <EventNoteIcon style={{...styles.reminderIcon, color: '#2196F3', animation: 'slideIn 0.5s ease-out'}} />
            </div>
            <h3 style={styles.reminderTitle}>Events</h3>
            <div style={styles.reminderStats}>
              {stats.events.today > 0 ? (
                <>
                  <div style={styles.reminderStat}>
                    <span style={styles.reminderStatNumber}>{stats.events.today}</span>
                    <span style={styles.reminderStatLabel}>Today</span>
                  </div>
                  {stats.events.upcoming > 0 && (
                    <div style={styles.reminderStat}>
                      <span style={styles.reminderStatNumber}>{stats.events.upcoming}</span>
                      <span style={styles.reminderStatLabel}>Upcoming</span>
                    </div>
                  )}
                </>
              ) : (
                <div style={styles.reminderEmptyState}>
                  <EventNoteIcon style={styles.reminderEmptyIcon} />
                  <span style={styles.reminderEmptyText}>No Events</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate('/calendar')}
              style={styles.reminderAction}
            >
              <span>View Calendar</span>
              <ArrowForwardIcon style={{fontSize: '16px'}} />
            </button>
          </div>
        </div>
      </div>

      </div>
      
      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          {/* Brand Section */}
          <div style={styles.footerBrand}>
            <h3 style={styles.brandTitle}>LIFE DASHBOARD</h3>
            <p style={styles.brandDescription}>
              Your personal productivity companion for managing tasks, building habits, tracking expenses, and journaling your growth.
            </p>
            <div style={styles.socialIcons}>
              <a href="#" style={styles.socialIcon}>
                <FacebookIcon style={{fontSize: '18px'}} />
              </a>
              <a href="#" style={styles.socialIcon}>
                <InstagramIcon style={{fontSize: '18px'}} />
              </a>
              <a href="#" style={styles.socialIcon}>
                <TwitterIcon style={{fontSize: '18px'}} />
              </a>
              <a href="https://www.linkedin.com/in/muhammadsohaibsarwar/" target="_blank" rel="noopener noreferrer" style={styles.socialIcon}>
                <LinkedInIcon style={{fontSize: '18px'}} />
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div style={styles.footerColumn}>
            <h4 style={styles.footerColumnTitle}>Features</h4>
            <a onClick={() => navigate('/tasks')} style={styles.footerColumnLink}>Tasks</a>
            <a onClick={() => navigate('/habits')} style={styles.footerColumnLink}>Habits</a>
            <a onClick={() => navigate('/expenses')} style={styles.footerColumnLink}>Expenses</a>
            <a onClick={() => navigate('/calendar')} style={styles.footerColumnLink}>Calendar</a>
            <a onClick={() => navigate('/journal')} style={styles.footerColumnLink}>Journal</a>
          </div>

          {/* Terms Section */}
          <div style={styles.footerColumn}>
            <h4 style={styles.footerColumnTitle}>Terms of Use</h4>
            <a href="#" style={styles.footerColumnLink}>Privacy Policy</a>
            <a href="#" style={styles.footerColumnLink}>Legal Notice</a>
          </div>

          {/* Contact Section */}
          <div style={styles.footerColumn}>
            <h4 style={styles.footerColumnTitle}>Contact</h4>
            <a href="mailto:msarwar.bese23seecs@seecs.edu.pk" style={styles.footerColumnLink}>Email Us</a>
            <a href="#" style={styles.footerColumnLink}>Support</a>
          </div>
        </div>

        {/* Copyright */}
        <div style={styles.footerCopyright}>
          <p style={styles.copyrightText}>
            Copyright © {new Date().getFullYear()} ByteBuilders. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '48px 24px',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '32px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  headerLeft: {
    flex: '1 1 400px',
  },
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '8px',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: 'var(--text-secondary)',
    fontWeight: 400,
  },
  streakCard: {
    padding: '20px 24px',
    flex: '0 0 auto',
    minWidth: '500px',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    animation: 'slideIn 0.4s ease-out',
    boxShadow: 'none',
  },
  streakHorizontalContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  streakMainRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    width: '100%',
  },
  streakNumberSection: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  streakNumberLarge: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'var(--accent)',
    lineHeight: 1,
  },
  streakLabelInline: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
  },
  streakDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: 'var(--border-color)',
    margin: '0 8px',
  },
  streakStatsRow: {
    display: 'flex',
    gap: '32px',
    flex: 1,
  },
  streakStatItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  streakStatLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    fontWeight: 500,
  },
  streakStatValue: {
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  weekDaysGrid: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-start',
  },
  weekDay: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.813rem',
    fontWeight: 600,
    borderRadius: '10px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-tertiary)',
    border: '1px solid var(--border-color)',
    transition: 'all 0.2s ease',
  },
  weekDayActive: {
    backgroundColor: 'var(--warning)',
    color: '#ffffff',
    border: '1px solid var(--warning)',
    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
  },
  streakStats: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  streakMain: {
    textAlign: 'center',
  },
  streakNumber: {
    fontSize: '40px',
    fontWeight: 700,
    color: 'var(--accent-primary)',
    lineHeight: 1,
    marginBottom: '6px',
  },
  streakLabel: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
  },
  streakSecondary: {
    display: 'flex',
    gap: '24px',
  },
  streakItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  streakItemLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
  },
  streakItemValue: {
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--warning)',
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.5s ease-out',
  },
  streakGoal: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    textAlign: 'right',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '48px',
  },
  card: {
    padding: '24px',
    cursor: 'pointer',
    transition: 'all var(--transition-base)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  cardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
  },
  cardStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
  },
  statValue: {
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  section: {
    marginBottom: '48px',
  },
  sectionTitle: {
    fontSize: 'var(--text-xl)',
    fontWeight: 600,
    marginBottom: '24px',
    color: 'var(--text-primary)',
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  activityItem: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'default',
  },
  activityIcon: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    color: 'var(--accent-primary)',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  activityText: {
    fontSize: 'var(--text-base)',
    color: 'var(--text-primary)',
    margin: 0,
  },
  activityAction: {
    fontWeight: 600,
    color: 'var(--accent-primary)',
    textTransform: 'capitalize',
  },
  activityTime: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    flexShrink: 0,
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 24px',
    fontSize: '0.9375rem',
    fontWeight: 500,
  },
  circularProgressContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    marginTop: '10px',
  },
  circularProgress: {
    position: 'relative',
    width: '120px',
    height: '120px',
  },
  circularProgressText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  circularProgressValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  circularProgressLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
    fontWeight: 500,
  },
  remindersSectionHeader: {
    marginBottom: '40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  overviewBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    backgroundColor: 'rgba(220, 38, 38, 0.05)',
    borderRadius: '20px',
    border: '1px solid rgba(220, 38, 38, 0.15)',
  },
  overviewBadgeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#DC2626',
    boxShadow: '0 0 8px rgba(220, 38, 38, 0.6), 0 0 16px rgba(220, 38, 38, 0.3)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  overviewBadgeText: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#DC2626',
    letterSpacing: '0.1em',
  },
  overviewTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  overviewSubtitle: {
    fontSize: '0.9375rem',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  remindersSectionSubtitle: {
    fontSize: '0.9375rem',
    color: 'var(--text-secondary)',
    marginTop: '8px',
    margin: 0,
  },
  remindersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  reminderCard: {
    padding: '32px 24px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  reminderIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  reminderIcon: {
    fontSize: '24px',
    color: 'var(--text-primary)',
  },
  reminderTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  reminderStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
    minHeight: '80px',
  },
  reminderStat: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
  },
  reminderStatUrgent: {
    backgroundColor: 'rgba(244, 67, 54, 0.05)',
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  reminderStatNumber: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  reminderStatLabel: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  reminderEmptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '20px',
  },
  reminderEmptyIcon: {
    fontSize: '32px',
    color: 'var(--text-tertiary)',
    opacity: 0.5,
  },
  reminderEmptyText: {
    fontSize: '0.875rem',
    color: 'var(--text-tertiary)',
    fontWeight: 500,
  },
  reminderAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '12px 16px',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  footer: {
    width: '100%',
    backgroundColor: '#000000',
    color: '#ffffff',
    paddingTop: '72px',
    marginTop: '96px',
    borderTop: 'none',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px 56px',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '64px',
  },
  footerBrand: {
    gridColumn: '1',
  },
  brandTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '16px',
    letterSpacing: '0.1em',
  },
  brandDescription: {
    fontSize: '0.875rem',
    color: '#999999',
    lineHeight: 1.8,
    marginBottom: '24px',
    maxWidth: '300px',
  },
  socialIcons: {
    display: 'flex',
    gap: '16px',
  },
  socialIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  footerColumnTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '4px',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  footerColumnLink: {
    fontSize: '0.875rem',
    color: '#999999',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
  },
  footerBottom: {
    paddingTop: '24px',
    borderTop: '1px solid #1a1a1a',
    textAlign: 'center',
  },
  footerCopyright: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 24px',
    borderTop: '1px solid #1a1a1a',
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: '0.75rem',
    color: '#666666',
    margin: 0,
  },
  footerFeatures: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  footerFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  footerFeatureIcon: {
    fontSize: '20px',
    color: 'var(--accent-primary)',
  },
  footerLinks: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  footerLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.2s',
    cursor: 'pointer',
  },
  footerLinkIcon: {
    fontSize: '16px',
    color: 'var(--text-tertiary)',
  },
  linkIcon: {
    fontSize: '18px',
    color: 'var(--accent-primary)',
  },
  footerBottom: {
    padding: '32px 0',
    backgroundColor: 'var(--bg-secondary)',
  },
  footerBottomContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
}

export default Home
