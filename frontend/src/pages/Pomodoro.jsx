import { useState, useEffect, useRef } from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import WorkIcon from '@mui/icons-material/Work'
import CoffeeIcon from '@mui/icons-material/Coffee'
import WeekendIcon from '@mui/icons-material/Weekend'
import CloseIcon from '@mui/icons-material/Close'

const Pomodoro = () => {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState('work') // work, shortBreak, longBreak
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0)
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    pomodorosUntilLongBreak: 4
  })
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete()
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isActive, minutes, seconds])

  const handleTimerComplete = () => {
    setIsActive(false)
    
    if (mode === 'work') {
      const newCount = pomodorosCompleted + 1
      setPomodorosCompleted(newCount)
      
      if (newCount % settings.pomodorosUntilLongBreak === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
    } else {
      switchMode('work')
    }

    // Play notification sound (browser notification)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'work' ? 'Time for a break!' : 'Time to work!',
      })
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setIsActive(false)
    
    if (newMode === 'work') {
      setMinutes(settings.workDuration)
    } else if (newMode === 'shortBreak') {
      setMinutes(settings.shortBreakDuration)
    } else if (newMode === 'longBreak') {
      setMinutes(settings.longBreakDuration)
    }
    setSeconds(0)
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    if (mode === 'work') {
      setMinutes(settings.workDuration)
    } else if (mode === 'shortBreak') {
      setMinutes(settings.shortBreakDuration)
    } else {
      setMinutes(settings.longBreakDuration)
    }
    setSeconds(0)
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const saveSettings = () => {
    if (mode === 'work') {
      setMinutes(settings.workDuration)
    } else if (mode === 'shortBreak') {
      setMinutes(settings.shortBreakDuration)
    } else {
      setMinutes(settings.longBreakDuration)
    }
    setSeconds(0)
    setShowSettings(false)
  }

  const formatTime = () => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const getProgress = () => {
    const totalSeconds = mode === 'work' 
      ? settings.workDuration * 60 
      : mode === 'shortBreak' 
        ? settings.shortBreakDuration * 60 
        : settings.longBreakDuration * 60
    const currentSeconds = minutes * 60 + seconds
    return ((totalSeconds - currentSeconds) / totalSeconds) * 100
  }

  const getModeColor = () => {
    if (mode === 'work') return '#e74c3c'
    if (mode === 'shortBreak') return '#3498db'
    return '#9b59b6'
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pomodoro Timer</h1>

      <div style={styles.modeSelector}>
        <button
          className={`btn ${mode === 'work' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => switchMode('work')}
          type="button"
          style={{display: 'flex', alignItems: 'center', gap: '6px'}}
        >
          <WorkIcon fontSize="small" /> Work
        </button>
        <button
          className={`btn ${mode === 'shortBreak' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => switchMode('shortBreak')}
          type="button"
          style={{display: 'flex', alignItems: 'center', gap: '6px'}}
        >
          <CoffeeIcon fontSize="small" /> Short Break
        </button>
        <button
          className={`btn ${mode === 'longBreak' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => switchMode('longBreak')}
          type="button"
          style={{display: 'flex', alignItems: 'center', gap: '6px'}}
        >
          <WeekendIcon fontSize="small" /> Long Break
        </button>
      </div>

      <div style={styles.timerCard}>
        <div style={styles.progressRing}>
          <svg style={styles.progressSvg} viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={getModeColor()}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgress() / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div style={styles.timerDisplay}>{formatTime()}</div>
        </div>

        <div style={styles.controls}>
          <button className="btn btn-primary" onClick={toggleTimer} style={{ fontSize: '18px', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '8px' }} type="button">
            {isActive ? <><PauseIcon /> Pause</> : <><PlayArrowIcon /> Start</>}
          </button>
          <button className="btn btn-secondary" onClick={resetTimer} style={{ fontSize: '18px', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '8px' }} type="button">
            <RestartAltIcon /> Reset
          </button>
        </div>

        <div style={styles.stats}>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>Pomodoros Completed</div>
            <div style={styles.statValue}>{pomodorosCompleted}</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>Current Mode</div>
            <div style={styles.statValue}>
              {mode === 'work' ? 'Work' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.actions}>
        <button className="btn btn-secondary" onClick={() => setShowSettings(!showSettings)} type="button" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
          <SettingsIcon fontSize="small" /> Settings
        </button>
        <button className="btn btn-secondary" onClick={requestNotificationPermission} type="button" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
          <NotificationsIcon fontSize="small" /> Enable Notifications
        </button>
      </div>

      {showSettings && (
        <div style={styles.modalOverlay} onMouseDown={(e) => {
          if (e.target === e.currentTarget) setShowSettings(false)
        }}>
          <div style={styles.modal} className="card">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Timer Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                style={styles.closeButton}
                type="button"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveSettings(); }} style={styles.modalForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Work Duration (minutes)</label>
                <input
                  type="number"
                  className="input"
                  value={settings.workDuration}
                  onChange={(e) => setSettings({ ...settings, workDuration: parseInt(e.target.value) || 1 })}
                  min="1"
                  max="60"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Short Break (minutes)</label>
                <input
                  type="number"
                  className="input"
                  value={settings.shortBreakDuration}
                  onChange={(e) => setSettings({ ...settings, shortBreakDuration: parseInt(e.target.value) || 1 })}
                  min="1"
                  max="30"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Long Break (minutes)</label>
                <input
                  type="number"
                  className="input"
                  value={settings.longBreakDuration}
                  onChange={(e) => setSettings({ ...settings, longBreakDuration: parseInt(e.target.value) || 1 })}
                  min="1"
                  max="60"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Pomodoros until long break</label>
                <input
                  type="number"
                  className="input"
                  value={settings.pomodorosUntilLongBreak}
                  onChange={(e) => setSettings({ ...settings, pomodorosUntilLongBreak: parseInt(e.target.value) || 1 })}
                  min="1"
                  max="10"
                />
              </div>
              <div style={styles.modalActions}>
                <button type="submit" className="btn btn-primary">Save Settings</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSettings(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '32px 24px',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: 700,
    marginBottom: '32px',
    textAlign: 'center',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  modeSelector: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  timerCard: {
    padding: '48px 32px',
    marginBottom: '24px',
  },
  progressRing: {
    position: 'relative',
    width: '300px',
    height: '300px',
    margin: '0 auto 40px',
  },
  progressSvg: {
    width: '100%',
    height: '100%',
    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.15))',
  },
  timerDisplay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '4.5rem',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  controls: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  statItem: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
  },
  statLabel: {
    fontSize: '0.8125rem',
    color: 'var(--text-tertiary)',
    marginBottom: '8px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
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
    maxWidth: '500px',
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
    fontSize: '1.5rem',
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
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-color)',
  },
}

export default Pomodoro
