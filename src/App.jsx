import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import TasksList from './pages/Tasks/TasksList'
import ExpenseList from './pages/Expenses/ExpenseList'
import AddExpense from './pages/Expenses/AddExpense'
import ExpenseCharts from './pages/Expenses/ExpenseCharts'
import CalendarView from './pages/Calendar/CalendarView'
import PomodoroTimer from './pages/Pomodoro/PomodoroTimer'
import JournalList from './pages/Journal/JournalList'
import Settings from './pages/Settings/Settings'
import { useAuth } from './hooks/useAuth'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'


export default function App(){
const { user, loading } = useAuth()


if(loading) return <div className="page-center">Loading...</div>


return (
<Routes>
<Route element={<AuthLayout/>}>
<Route path="/login" element={<Login/>} />
<Route path="/register" element={<Register/>} />
</Route>


<Route element={<ProtectedRoute user={user}><DashboardLayout/></ProtectedRoute>}>
<Route path="/" element={<Navigate to="/dashboard" replace/>} />
<Route path="/dashboard" element={<Dashboard/>} />
<Route path="/tasks" element={<TasksList/>} />
<Route path="/expenses" element={<ExpenseList/>} />
<Route path="/expenses/add" element={<AddExpense/>} />
<Route path="/expenses/charts" element={<ExpenseCharts/>} />
<Route path="/calendar" element={<CalendarView/>} />
<Route path="/pomodoro" element={<PomodoroTimer/>} />
<Route path="/journal" element={<JournalList/>} />
<Route path="/settings" element={<Settings/>} />
</Route>


<Route path="*" element={<Navigate to={user?'/dashboard':'/login'} replace/>} />
</Routes>
)
}


function ProtectedRoute({user, children}){
if(!user) return <Navigate to="/login" replace />
return children
}