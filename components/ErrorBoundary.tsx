
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch React errors and display a fallback UI
 * Prevents the entire app from crashing when a component error occurs
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-zinc-800 rounded-3xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Algo deu errado</h1>
              <p className="text-zinc-400 text-sm">
                Ocorreu um erro inesperado. Você pode tentar recarregar a página.
              </p>
            </div>

            {this.state.error && (
              <details className="text-left">
                <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-400">
                  Detalhes técnicos
                </summary>
                <pre className="mt-2 p-3 bg-zinc-900 rounded-lg text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl font-semibold transition-colors"
              >
                Tentar novamente
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
              >
                Recarregar página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
