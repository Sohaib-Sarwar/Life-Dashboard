import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '12px',
          marginTop: '40px'
        }}>
          <h2 style={{ color: 'var(--accent-danger)', marginBottom: '20px' }}>
            ⚠️ Something went wrong
          </h2>
          <details style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '10px', color: 'var(--text-primary)' }}>
              Click to see error details
            </summary>
            <p style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '8px' }}>
              {this.state.error && this.state.error.toString()}
            </p>
            <p style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', marginTop: '10px' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </p>
          </details>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
