import { useState, useEffect } from 'react'
import api from '../services/api.js'
import Notification from '../components/Notification.jsx'
import { useNotification } from '../hooks/useNotification.js'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EventNoteIcon from '@mui/icons-material/EventNote'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TodayIcon from '@mui/icons-material/Today'
import EventIcon from '@mui/icons-material/Event'
import DescriptionIcon from '@mui/icons-material/Description'
import FlagIcon from '@mui/icons-material/Flag'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'

const Calendar = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState('month') // month, week, year
  const [sidebarView, setSidebarView] = useState('calendar') // calendar or events
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({
    title: '', description: '', start_time: '', end_time: '', 
    event_type: 'personal', location: '', priority: 'medium',
    color: '#1a1a1a', reminder: false
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [deletingEventId, setDeletingEventId] = useState(null)
  const [quickFilter, setQuickFilter] = useState('all') // all, today, upcoming, week
  const { notification, showNotification, hideNotification } = useNotification()

  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const fetchEvents = async () => {
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const response = await api.get(`/calendar?month=${month}&year=${year}`)
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/calendar', formData)
      showNotification('Event created successfully', 'success')
      resetForm()
      fetchEvents()
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to create event'
      showNotification(errorMsg, 'error')
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/calendar/${editingEvent.id}`, formData)
      showNotification('Event updated successfully', 'success')
      resetForm()
      setShowEditModal(false)
      setShowViewModal(false)
      fetchEvents()
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to update event'
      showNotification(errorMsg, 'error')
    }
  }

  const openDeleteModal = (eventId) => {
    setDeletingEventId(eventId)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deletingEventId) return
    try {
      await api.delete(`/calendar/${deletingEventId}`)
      showNotification('Event deleted successfully', 'success')
      setShowDeleteModal(false)
      setShowViewModal(false)
      setDeletingEventId(null)
      fetchEvents()
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to delete event'
      showNotification(errorMsg, 'error')
      setShowDeleteModal(false)
      setDeletingEventId(null)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '', description: '', start_time: '', end_time: '',
      event_type: 'personal', location: '', priority: 'medium',
      color: '#1a1a1a', reminder: false
    })
    setShowAddModal(false)
    setSelectedDate(null)
    setEditingEvent(null)
  }

  const handleDateClick = (date) => {
    // Prevent adding events in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const clickedDate = new Date(date)
    clickedDate.setHours(0, 0, 0, 0)
    
    if (clickedDate < today) {
      showNotification('Cannot create events in the past', 'error')
      return
    }
    
    setSelectedDate(date)
    // Use local date instead of UTC to avoid timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    setFormData({ ...formData, start_time: dateStr + 'T09:00', end_time: dateStr + 'T10:00' })
    setShowAddModal(true)
  }

  const openViewModal = (event) => {
    setSelectedDate(new Date(event.start_time))
    setEditingEvent(event)
    setShowViewModal(true)
  }

  const openEditModal = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      start_time: event.start_time.slice(0, 16),
      end_time: event.end_time.slice(0, 16),
      event_type: event.event_type || 'personal',
      location: event.location || '',
      priority: event.priority || 'medium',
      color: event.color || '#1a1a1a',
      reminder: event.reminder || false
    })
    setShowViewModal(false)
    setShowEditModal(true)
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()

    const days = []
    // Adjust for Monday start (0=Sun, 1=Mon, ..., 6=Sat)
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1
    for (let i = adjustedStartDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, prevMonthDays - i), isOtherMonth: true })
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isOtherMonth: false })
    }
    const remainingCells = 7 - (days.length % 7)
    if (remainingCells < 7) {
      for (let i = 1; i <= remainingCells; i++) {
        days.push({ date: new Date(year, month + 1, i), isOtherMonth: true })
      }
    }
    return days
  }

  const getWeekStart = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
    return new Date(d.setDate(diff))
  }

  const getWeekDays = () => {
    const weekStart = getWeekStart(currentDate)
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      days.push(date)
    }
    return days
  }

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const formatDateString = (date) => {
    if (currentView === 'year') {
      return date.getFullYear()
    } else if (currentView === 'week') {
      const weekStart = getWeekStart(date)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    } else {
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
  }

  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (currentView === 'month') newDate.setMonth(newDate.getMonth() - 1)
    else if (currentView === 'week') newDate.setDate(newDate.getDate() - 7)
    else if (currentView === 'year') newDate.setFullYear(newDate.getFullYear() - 1)
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (currentView === 'month') newDate.setMonth(newDate.getMonth() + 1)
    else if (currentView === 'week') newDate.setDate(newDate.getDate() + 7)
    else if (currentView === 'year') newDate.setFullYear(newDate.getFullYear() + 1)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const formatDuration = (start, end) => {
    const diff = new Date(end) - new Date(start)
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      urgent: '#dc2626'
    }
    return colors[priority] || colors.medium
  }

  const getEventStats = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayEvents = events.filter(e => {
      const eventDate = new Date(e.start_time)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate.getTime() === today.getTime()
    })

    const weekEnd = new Date(today)
    weekEnd.setDate(today.getDate() + 7)
    const thisWeekEvents = events.filter(e => {
      const eventDate = new Date(e.start_time)
      return eventDate >= today && eventDate < weekEnd
    })

    return {
      total: events.length,
      today: todayEvents.length,
      thisWeek: thisWeekEvents.length
    }
  }

  const applyQuickFilter = (filter) => {
    setQuickFilter(filter)
    setSidebarView('events')
  }

  const getFilteredEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (quickFilter === 'today') {
      return events.filter(e => {
        const eventDate = new Date(e.start_time)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate.getTime() === today.getTime()
      })
    } else if (quickFilter === 'upcoming') {
      return events.filter(e => new Date(e.start_time) > today)
    } else if (quickFilter === 'week') {
      const weekEnd = new Date(today)
      weekEnd.setDate(today.getDate() + 7)
      return events.filter(e => {
        const eventDate = new Date(e.start_time)
        return eventDate >= today && eventDate < weekEnd
      })
    }
    return events
  }

  const stats = getEventStats()

  if (loading) {
    return <div style={styles.loading}>Loading calendar...</div>
  }

  return (
    <>
      <style>{`
        .calendar-date-cell:hover {
          background: transparent !important;
        }
        
        .calendar-date-cell:hover .calendar-date-number {
          background: #e8e8e8;
          transform: scale(1.08);
        }
        
        body.dark .calendar-date-cell:hover .calendar-date-number {
          background: #555;
        }
        
        body.dark .calendar-date-number {
          background: #333 !important;
          color: #ccc !important;
        }
        
        body.dark .topFilterBtn {
          border-color: #444 !important;
          color: #999 !important;
        }
        
        body.dark .topFilterBtn:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: #666 !important;
        }
        
        .calendar-nav-arrow:hover {
          background: #f5f5f5;
          transform: scale(1.05);
        }
        
        body.dark .calendar-nav-arrow {
          color: #999 !important;
        }
        
        body.dark .calendar-nav-arrow:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .calendar-today-btn:hover {
          background: #252540;
          transform: translateY(-1px);
        }
        
        body.dark .navControls {
          background: #1a1a1a !important;
          border-color: #333 !important;
        }
        
        body.dark .currentPeriod {
          color: #ccc !important;
        }
        
        .calendar-event-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          border-color: #d0d0d0;
        }
        
        body.dark .calendar-event-card {
          background: #1a1a1a !important;
          border-color: #333 !important;
        }
        
        body.dark .calendar-event-card:hover {
          border-color: #444 !important;
          box-shadow: 0 4px 16px rgba(255, 255, 255, 0.05);
        }
        
        .calendar-event-action:hover {
          background: #f5f5f5;
          color: #333;
        }
        
        body.dark .calendar-event-action:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #ccc;
        }
        
        .calendar-week-event:hover {
          background: #f8f8f8;
          transform: translateX(2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        body.dark .calendar-week-event {
          background: #1a1a1a !important;
          border-color: #333 !important;
        }
        
        body.dark .calendar-week-event:hover {
          background: #222 !important;
          box-shadow: 0 2px 8px rgba(255, 255, 255, 0.05);
        }
        
        body.dark .weekColumn {
          background: #0a0a0a !important;
          border-color: #333 !important;
        }
        
        body.dark .weekDayNum {
          color: #ccc !important;
        }
        
        .calendar-view-tab:hover:not(.active) {
          background: var(--bg-tertiary);
          transform: translateY(-2px);
        }
        
        .calendar-nav-item:hover:not(.active) {
          background: var(--bg-tertiary);
          border-color: var(--text-secondary);
        }
        
        .calendar-filter-btn:hover:not(.active) {
          background: var(--bg-tertiary);
          border-color: var(--text-secondary);
        }
        
        .calendar-event-action:hover {
          background: var(--bg-tertiary);
          transform: scale(1.1);
        }
        
        .calendar-event-card:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .calendar-week-event:hover {
          transform: translateX(2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .calendar-year-month:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        
        .calendar-stat-item:hover {
          background: var(--bg-tertiary);
          transform: scale(1.05);
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.calendarWrapper}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Date Display */}
          <div style={styles.dateDisplay}>
            <div style={styles.currentDay}>{currentDate.getDate()}</div>
            <div style={styles.currentMonth}>
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div style={styles.navMenu}>
            <button 
              className={`calendar-nav-item ${sidebarView === 'calendar' ? 'active' : ''}`}
              style={{...styles.navItem, ...(sidebarView === 'calendar' ? styles.navItemActive : {})}}
              onClick={() => setSidebarView('calendar')}
            >
              <CalendarTodayIcon style={{ fontSize: 20 }} />
              <span>Calendar</span>
            </button>
            <button 
              className={`calendar-nav-item ${sidebarView === 'events' ? 'active' : ''}`}
              style={{...styles.navItem, ...(sidebarView === 'events' ? styles.navItemActive : {})}}
              onClick={() => { setSidebarView('events'); setQuickFilter('all'); }}
            >
              <EventNoteIcon style={{ fontSize: 20 }} />
              <span>All Events</span>
            </button>
          </div>

          {/* Stats */}
          <div style={styles.statsContainer}>
            <div className="calendar-stat-item" style={styles.statItem}>
              <div style={styles.statValue}>{stats.total}</div>
              <div style={styles.statLabel}>Total</div>
            </div>
            <div className="calendar-stat-item" style={styles.statItem}>
              <div style={styles.statValue}>{stats.today}</div>
              <div style={styles.statLabel}>Today</div>
            </div>
            <div className="calendar-stat-item" style={styles.statItem}>
              <div style={styles.statValue}>{stats.thisWeek}</div>
              <div style={styles.statLabel}>This Week</div>
            </div>
          </div>


        </div>

        {/* Main Content */}
        <div style={styles.main}>
          {/* Quick Filters - Top Right for Events Page */}
          {sidebarView === 'events' && (
            <div style={styles.topFilters}>
              <button
                className="topFilterBtn"
                onClick={() => applyQuickFilter('all')}
                style={quickFilter === 'all' ? styles.topFilterBtnActive : styles.topFilterBtn}
              >
                All
              </button>
              <button
                className="topFilterBtn"
                onClick={() => applyQuickFilter('today')}
                style={quickFilter === 'today' ? styles.topFilterBtnActive : styles.topFilterBtn}
              >
                Today
              </button>
              <button
                className="topFilterBtn"
                onClick={() => applyQuickFilter('upcoming')}
                style={quickFilter === 'upcoming' ? styles.topFilterBtnActive : styles.topFilterBtn}
              >
                Upcoming
              </button>
              <button
                className="topFilterBtn"
                onClick={() => applyQuickFilter('week')}
                style={quickFilter === 'week' ? styles.topFilterBtnActive : styles.topFilterBtn}
              >
                This Week
              </button>
            </div>
          )}
          
          {sidebarView === 'calendar' ? (
            <>
              {/* Top Bar */}
              <div style={styles.topBar}>
                <div style={styles.viewTabs}>
                  <button 
                    className={`calendar-view-tab ${currentView === 'year' ? 'active' : ''}`}
                    style={{...styles.viewTab, ...(currentView === 'year' ? styles.viewTabActive : {})}}
                    onClick={() => setCurrentView('year')}
                  >
                    Year
                  </button>
                  <button 
                    className={`calendar-view-tab ${currentView === 'month' ? 'active' : ''}`}
                    style={{...styles.viewTab, ...(currentView === 'month' ? styles.viewTabActive : {})}}
                    onClick={() => setCurrentView('month')}
                  >
                    Month
                  </button>
                  <button 
                    className={`calendar-view-tab ${currentView === 'week' ? 'active' : ''}`}
                    style={{...styles.viewTab, ...(currentView === 'week' ? styles.viewTabActive : {})}}
                    onClick={() => setCurrentView('week')}
                  >
                    Week
                  </button>
                </div>
                <div className="navControls" style={styles.navControls}>
                  <button className="calendar-nav-arrow" style={styles.navArrow} onClick={goToPrevious}>
                    <ChevronLeftIcon style={{ fontSize: 20 }} />
                  </button>
                  <span className="currentPeriod" style={styles.currentPeriod}>{formatDateString(currentDate)}</span>
                  <button className="calendar-nav-arrow" style={styles.navArrow} onClick={goToNext}>
                    <ChevronRightIcon style={{ fontSize: 20 }} />
                  </button>
                  <button className="calendar-today-btn" style={styles.todayBtn} onClick={goToToday}>
                    Today
                  </button>
                </div>
              </div>

              {/* Calendar Views */}
              {currentView === 'month' && (
                <div style={styles.monthView}>
                  <div style={styles.grid}>
                    {dayNames.map(day => (
                      <div key={day} style={styles.weekdayHeader}>{day}</div>
                    ))}
                    {getDaysInMonth().map((dayObj, index) => {
                      const dayEvents = getEventsForDate(dayObj.date)
                      const isTodayDate = isToday(dayObj.date)
                      return (
                        <div
                          key={index}
                          className="calendar-date-cell"
                          style={{
                            ...styles.dateCell,
                            ...(dayObj.isOtherMonth ? styles.dateCellOther : {}),
                            ...(isTodayDate ? styles.dateCellToday : {})
                          }}
                          onClick={() => !dayObj.isOtherMonth && handleDateClick(dayObj.date)}
                        >
                          <div className="calendar-date-number" style={isTodayDate ? styles.dateNumberToday : styles.dateNumber}>
                            {dayObj.date.getDate()}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {currentView === 'week' && (
                <div style={styles.weekView}>
                  <div style={styles.weekGrid}>
                    {getWeekDays().map((date, index) => {
                      const dayEvents = getEventsForDate(date)
                      const isTodayDate = isToday(date)
                      return (
                        <div key={index} className="weekColumn" style={{...styles.weekColumn, ...(isTodayDate ? styles.weekColumnToday : {})}}>
                          <div style={styles.weekHeader} onClick={() => handleDateClick(date)}>
                            <div style={styles.weekDayName}>{dayNames[index]}</div>
                            <div className="weekDayNum" style={styles.weekDayNum}>{date.getDate()}</div>
                          </div>
                          <div style={styles.weekEvents}>
                            {dayEvents.map(event => (
                              <div
                                key={event.id}
                                className="calendar-week-event"
                                style={{...styles.weekEvent, borderLeftColor: getPriorityColor(event.priority)}}
                                onClick={() => openViewModal(event)}
                              >
                                <div style={styles.eventTime}>
                                  <AccessTimeIcon style={{ fontSize: 14 }} />
                                  {formatTime(event.start_time)}
                                </div>
                                <div style={styles.eventTitle}>{event.title}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {currentView === 'year' && (
                <div style={styles.yearView}>
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthDate = new Date(currentDate.getFullYear(), i, 1)
                    return (
                      <div key={i} className="calendar-year-month" style={styles.yearMonth} onClick={() => {
                        setCurrentDate(monthDate)
                        setCurrentView('month')
                      }}>
                        <div style={styles.yearMonthName}>
                          {monthDate.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div style={styles.yearMonthGrid}>
                          {Array.from({ length: new Date(currentDate.getFullYear(), i + 1, 0).getDate() }, (_, d) => {
                            const date = new Date(currentDate.getFullYear(), i, d + 1)
                            const hasEvents = events.some(e => {
                              const eventDate = new Date(e.start_time)
                              return eventDate.toDateString() === date.toDateString()
                            })
                            const isTodayDate = isToday(date)
                            return (
                              <div 
                                key={d} 
                                style={{
                                  ...styles.yearDate,
                                  ...(hasEvents ? styles.yearDateEvent : {}),
                                  ...(isTodayDate ? styles.yearDateToday : {})
                                }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDateClick(date)
                                }}
                              >
                                {d + 1}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            /* Events List */
            <div style={styles.eventsList}>
              <div style={styles.eventsHeader}>
                <h2 style={styles.eventsTitle}>
                  {quickFilter === 'today' ? "Today's Events" :
                   quickFilter === 'upcoming' ? 'Upcoming Events' :
                   quickFilter === 'week' ? 'This Week' : 'All Events'}
                </h2>
                <p style={styles.eventsCount}>{getFilteredEvents().length} events</p>
              </div>
              <div style={styles.eventsContainer}>
                {getFilteredEvents().length === 0 ? (
                  <div style={styles.eventsEmpty}>
                    <EventNoteIcon style={{ fontSize: 64, opacity: 0.3 }} />
                    <p>No events scheduled</p>
                  </div>
                ) : (
                  getFilteredEvents().sort((a, b) => new Date(a.start_time) - new Date(b.start_time)).map(event => (
                    <div key={event.id} className="calendar-event-card" style={styles.eventCard} onClick={() => openViewModal(event)}>
                      <div style={{...styles.eventIconContainer, backgroundColor: getPriorityColor(event.priority) + '15'}}>
                        <EventIcon style={{ fontSize: 22, color: getPriorityColor(event.priority) }} />
                      </div>
                      <div style={styles.eventContent}>
                        <h3 style={styles.eventCardTitle}>{event.title}</h3>
                        <div style={styles.eventDetails}>
                          <div style={styles.eventDetail}>
                            <AccessTimeIcon style={{ fontSize: 15, color: '#999' }} />
                            <span style={{ fontSize: '0.85rem', color: '#666' }}>{new Date(event.start_time).toLocaleDateString()} • {formatTime(event.start_time)}</span>
                          </div>
                          {event.location && (
                            <div style={styles.eventDetail}>
                              <LocationOnIcon style={{ fontSize: 15, color: '#999' }} />
                              <span style={{ fontSize: '0.85rem', color: '#666' }}>{event.location}</span>
                            </div>
                          )}
                          {event.description && (
                            <div style={styles.eventDetail}>
                              <DescriptionIcon style={{ fontSize: 15, color: '#999' }} />
                              <span style={{ fontSize: '0.85rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>{event.description}</span>
                            </div>
                          )}
                        </div>
                        <div style={styles.eventMeta}>
                          <span style={{...styles.priorityBadge, backgroundColor: getPriorityColor(event.priority) + '20', color: getPriorityColor(event.priority), border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px'}}>
                            <FlagIcon style={{ fontSize: 12 }} />
                            {event.priority}
                          </span>
                          <span style={{...styles.typeBadge, background: '#f5f5f5', color: '#666', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '400'}}>{event.event_type}</span>
                        </div>
                      </div>
                      <div style={styles.eventActions}>
                        <button className="calendar-event-action" style={styles.eventActionBtn} onClick={(e) => { e.stopPropagation(); openEditModal(event); }}>
                          <EditIcon style={{ fontSize: 18 }} />
                        </button>
                        <button className="calendar-event-action" style={styles.eventActionBtn} onClick={(e) => { e.stopPropagation(); openDeleteModal(event.id); }}>
                          <DeleteIcon style={{ fontSize: 18 }} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div style={styles.modal} className="card">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add Event</h2>
              <button style={styles.closeBtn} onClick={resetForm}>
                <CloseIcon />
              </button>
            </div>
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Event Name *</label>
                  <input
                    className="input"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    className="input"
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="meeting">Meeting</option>
                    <option value="appointment">Appointment</option>
                    <option value="reminder">Reminder</option>
                    <option value="birthday">Birthday</option>
                    <option value="holiday">Holiday</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Start Time</label>
                  <input
                    className="input"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>End Time</label>
                  <input
                    className="input"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    min={formData.start_time || new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Location</label>
                  <input
                    className="input"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Priority</label>
                  <select
                    className="input"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroupFull}>
                <label style={styles.label}>Description</label>
                <textarea
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="submit" className="btn btn-primary">
                  <AddIcon style={{ fontSize: 18, marginRight: 4 }} />
                  Add Event
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
        }
      `}</style>

      {/* Edit Event Modal */}
      {showEditModal && editingEvent && (
        <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}>
          <div style={styles.modal} className="card">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Event</h2>
              <button style={styles.closeBtn} onClick={() => { setShowEditModal(false); resetForm(); }}>
                <CloseIcon />
              </button>
            </div>
            <form style={styles.form} onSubmit={handleUpdate}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Event Name *</label>
                  <input
                    className="input"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    className="input"
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="meeting">Meeting</option>
                    <option value="appointment">Appointment</option>
                    <option value="reminder">Reminder</option>
                    <option value="birthday">Birthday</option>
                    <option value="holiday">Holiday</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Start Time</label>
                  <input
                    className="input"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>End Time</label>
                  <input
                    className="input"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Location</label>
                  <input
                    className="input"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Priority</label>
                  <select
                    className="input"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroupFull}>
                <label style={styles.label}>Description</label>
                <textarea
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowEditModal(false); resetForm(); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}>
          <div style={styles.deleteModal} className="card">
            <div style={styles.deleteIcon}>
              <DeleteIcon style={{ fontSize: 32 }} />
            </div>
            <h2 style={styles.deleteTitle}>Delete Event</h2>
            <p style={styles.deleteText}>
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div style={styles.deleteActions}>
              <button className="btn btn-danger" style={{ minWidth: 120 }} onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="btn btn-secondary" style={{ minWidth: 120 }} onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
          duration={notification.duration}
        />
      )}
      </div>
    </>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    color: 'var(--text-secondary)',
  },
  calendarWrapper: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  sidebar: {
    width: '100%',
    maxWidth: '280px',
    minWidth: '240px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '24px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  dateDisplay: {
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-primary) 100%)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    marginBottom: '8px',
  },
  currentDay: {
    fontSize: '4.5em',
    fontWeight: 800,
    color: 'var(--text-primary)',
    lineHeight: 1,
    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  currentMonth: {
    fontSize: '1em',
    color: 'var(--text-secondary)',
    marginTop: '12px',
    fontWeight: 500,
    letterSpacing: '0.5px',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    background: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontSize: '0.95em',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  },
  navItemActive: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    borderColor: 'transparent',
    color: 'white',
    transform: 'translateX(4px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    padding: '18px',
    background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-primary) 100%)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  statItem: {
    textAlign: 'center',
    padding: '8px',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 0.3s ease',
  },
  statValue: {
    fontSize: '2em',
    fontWeight: 800,
    color: 'var(--text-primary)',
    lineHeight: 1,
    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  statLabel: {
    fontSize: '0.7em',
    color: 'var(--text-tertiary)',
    marginTop: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 600,
  },
  topFilters: {
    position: 'absolute',
    top: '30px',
    right: '40px',
    display: 'flex',
    gap: '8px',
    zIndex: 10,
  },
  filterLabel: {
    fontSize: '0.75em',
    fontWeight: 600,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  topFilterBtn: {
    padding: '8px 20px',
    background: 'transparent',
    border: '1px solid #e0e0e0',
    borderRadius: '20px',
    color: '#666',
    fontSize: '0.85rem',
    fontWeight: 400,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.3px',
  },
  topFilterBtnActive: {
    padding: '8px 20px',
    background: '#333',
    border: '1px solid #333',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: 500,
    letterSpacing: '0.3px',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    padding: '28px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
    position: 'relative',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    paddingBottom: '0',
    borderBottom: 'none',
    flexWrap: 'wrap',
    gap: '20px',
  },
  viewTabs: {
    display: 'flex',
    gap: '6px',
    padding: '6px',
    background: 'var(--bg-primary)',
    borderRadius: '12px',
    border: '2px solid var(--border-color)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  viewTab: {
    padding: '10px 28px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    fontSize: '0.95em',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    letterSpacing: '0.3px',
  },
  viewTabActive: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    color: 'white',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    transform: 'scale(1.05)',
  },
  navControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'white',
    padding: '8px',
    borderRadius: '12px',
    border: '1px solid #e8e8e8',
  },
  currentPeriod: {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#1a1a1a',
    minWidth: '200px',
    textAlign: 'center',
    letterSpacing: '0.3px',
    padding: '4px 12px',
  },
  navArrow: {
    width: '36px',
    height: '36px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#666',
    transition: 'all 0.2s ease',
  },
  todayBtn: {
    padding: '8px 20px',
    background: '#1a1a2e',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.88rem',
    fontWeight: 500,
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.3px',
  },
  monthView: {
    flex: 1,
    overflow: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '20px',
    padding: '20px 60px 40px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  weekdayHeader: {
    background: 'transparent',
    padding: '16px 0',
    textAlign: 'center',
    fontWeight: 500,
    fontSize: '0.75rem',
    color: '#999',
    letterSpacing: '1.5px',
  },
  dateCell: {
    background: 'transparent',
    minHeight: '70px',
    padding: '16px 8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCellOther: {
    opacity: 0.3,
  },
  dateCellToday: {
    background: 'transparent',
    border: 'none',
  },
  dateNumber: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#333',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f5',
    transition: 'all 0.2s ease',
  },
  dateNumberToday: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'white',
    background: '#ff8c42',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    animation: 'pulse 2s ease-in-out infinite',
  },
  dateEvents: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  eventDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  moreEvents: {
    fontSize: '0.7em',
    color: 'var(--text-tertiary)',
  },
  weekView: {
    flex: 1,
    overflow: 'auto',
  },
  weekGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '12px',
    width: '100%',
  },
  weekColumn: {
    background: 'var(--bg-primary)',
    borderRadius: '12px',
    padding: '16px 12px',
    minHeight: '400px',
    border: '1px solid #e8e8e8',
  },
  weekColumnToday: {
    border: '2px solid #ff8c42',
    boxShadow: '0 0 16px rgba(255, 140, 66, 0.2)',
    background: 'rgba(255, 140, 66, 0.03)',
  },
  weekHeader: {
    textAlign: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e8e8e8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  weekDayName: {
    fontSize: '0.7rem',
    fontWeight: 500,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  weekDayNum: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1a1a1a',
    marginTop: '6px',
  },
  weekEvents: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  weekEvent: {
    padding: '10px 12px',
    background: 'white',
    borderRadius: '8px',
    borderLeft: '3px solid',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid #e8e8e8',
    borderLeftWidth: '3px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  eventTime: {
    fontSize: '0.7rem',
    color: '#999',
  },
  eventTitle: {
    fontSize: '0.85em',
    color: 'var(--text-primary)',
    fontWeight: 500,
  },
  yearView: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    flex: 1,
    overflow: 'auto',
  },
  yearMonth: {
    background: 'var(--bg-primary)',
    borderRadius: 'var(--radius-md)',
    padding: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid var(--border-color)',
  },
  yearMonthName: {
    fontSize: '0.9em',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '12px',
    textAlign: 'center',
  },
  yearMonthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  yearDate: {
    fontSize: '0.75em',
    color: 'var(--text-secondary)',
    padding: '4px',
    textAlign: 'center',
    borderRadius: '4px',
  },
  yearDateEvent: {
    background: 'var(--accent-primary)',
    color: 'white',
    fontWeight: 600,
  },
  yearDateToday: {
    background: '#02006c',
    color: 'white',
    fontWeight: 700,
    boxShadow: '0 2px 8px rgba(2, 0, 108, 0.4)',
  },
  eventsList: {
    flex: 1,
    overflow: 'auto',
  },
  eventsHeader: {
    marginBottom: '20px',
  },
  eventsTitle: {
    fontSize: '1.5em',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  eventsCount: {
    color: 'var(--text-secondary)',
    fontSize: '0.9em',
  },
  eventsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  eventsEmpty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--text-secondary)',
  },
  eventCard: {
    display: 'flex',
    background: 'var(--bg-primary)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    border: '1px solid #e8e8e8',
    cursor: 'pointer',
    padding: '20px',
    gap: '16px',
    alignItems: 'flex-start',
  },
  eventIconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  eventContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  eventCardTitle: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
  },
  eventActions: {
    display: 'flex',
    gap: '4px',
    marginLeft: 'auto',
  },
  eventActionBtn: {
    background: 'transparent',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  eventDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  eventDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    color: '#666',
  },
  eventDescription: {
    fontSize: '0.9em',
    color: 'var(--text-secondary)',
    marginBottom: '12px',
    lineHeight: 1.5,
  },
  eventMeta: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  priorityBadge: {
    padding: '4px 12px',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.7em',
    fontWeight: 600,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  typeBadge: {
    padding: '4px 12px',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.7em',
    fontWeight: 600,
    background: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    textTransform: 'capitalize',
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
    backdropFilter: 'blur(4px)',
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '500px',
    maxHeight: '85vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border-color)',
  },
  modalTitle: {
    fontSize: '1.2em',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '2em',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formGroupFull: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.875em',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-color)',
    flexWrap: 'wrap',
  },
  deleteModal: {
    maxWidth: '450px',
    textAlign: 'center',
    padding: '32px',
    width: '100%',
  },
  deleteIcon: {
    width: '64px',
    height: '64px',
    margin: '0 auto 20px',
    background: '#fee2e2',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ef4444',
  },
  deleteTitle: {
    fontSize: '1.5em',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '12px',
  },
  deleteText: {
    color: 'var(--text-secondary)',
    fontSize: '0.95em',
    lineHeight: 1.6,
    marginBottom: '28px',
  },
  deleteActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  '@media (max-width: 1024px)': {
    calendarWrapper: {
      flexDirection: 'column',
    },
    sidebar: {
      maxWidth: '100%',
    },
  },
  '@media (max-width: 768px)': {
    container: {
      padding: '12px',
    },
    topBar: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    viewTabs: {
      justifyContent: 'center',
    },
    navControls: {
      justifyContent: 'center',
    },
    statsContainer: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    },
  },
}

export default Calendar
