import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL APP ERROR:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-red-400 p-8 font-mono">
          <div className="max-w-2xl mx-auto rounded-xl border border-red-500/40 bg-red-950/40 p-6 shadow-2xl">
            <h1 className="text-xl font-bold text-red-200 mb-2">Application Render Error</h1>
            <p className="text-sm text-red-300 mb-4">{this.state.error?.toString()}</p>
            <pre className="text-xs bg-black/60 p-4 rounded overflow-x-auto text-slate-300 whitespace-pre-wrap">
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-sans text-sm font-semibold transition"
            >
              Reset LocalStorage & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
