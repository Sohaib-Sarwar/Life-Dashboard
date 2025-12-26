import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid var(--border)', 
          borderTopColor: 'var(--accent)', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" />
}

export default PrivateRoute
