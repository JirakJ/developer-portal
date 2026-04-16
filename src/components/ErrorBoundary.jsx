import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/';
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message?.includes('Loading chunk');
      return (
        <div className="error-boundary">
          <div className="error-boundary-icon">⚠️</div>
          <h1>{isChunkError ? 'Update Available' : 'Something went wrong'}</h1>
          <p className="error-boundary-msg">
            {isChunkError
              ? 'A new version is available. Please reload to get the latest.'
              : 'An unexpected error occurred. Try again or go back to the home page.'}
          </p>
          <div className="error-boundary-actions">
            {isChunkError ? (
              <button className="btn-primary" onClick={() => window.location.reload()}>
                Reload Page
              </button>
            ) : (
              <>
                <button className="btn-primary" onClick={this.handleReset}>Try Again</button>
                <button className="btn-secondary" onClick={this.handleGoHome}>Go Home</button>
              </>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
