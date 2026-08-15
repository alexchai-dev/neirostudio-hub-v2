import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#06040d] text-slate-100 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-fuchsia-500/50 rounded-3xl p-6 max-w-sm text-center space-y-4 shadow-[0_0_50px_rgba(217,70,239,0.3)]">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400/50 flex items-center justify-center mx-auto text-fuchsia-300">
              ⚠️
            </div>
            <h2 className="text-base font-black text-white">Упс! Произошла ошибка</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Приложение столкнулось с ошибкой. Нажмите кнопку ниже, чтобы перезапустить.
            </p>
            {this.state.error && (
              <div className="text-[10px] text-rose-300 font-mono bg-slate-950/90 p-2.5 rounded-xl border border-rose-500/40 text-left overflow-x-auto max-h-28 break-all">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Перезапустить App 🚀
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
  </React.StrictMode>,
)
