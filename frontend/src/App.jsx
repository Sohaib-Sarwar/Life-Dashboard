import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Tasks from './pages/Tasks.jsx'
import Habits from './pages/Habits.jsx'
import Expenses from './pages/Expenses.jsx'
import Journal from './pages/Journal.jsx'
import Calendar from './pages/Calendar.jsx'
import Pomodoro from './pages/Pomodoro.jsx'
import Profile from './pages/Profile.jsx'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/habits" element={<Habits />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/journal" element={<ErrorBoundary><Journal /></ErrorBoundary>} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/pomodoro" element={<Pomodoro />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </PrivateRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
