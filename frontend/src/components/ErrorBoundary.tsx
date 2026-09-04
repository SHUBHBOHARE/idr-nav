import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-card border border-danger/40 p-8 rounded-2xl max-w-xl shadow-2xl space-y-4">
            <div className="p-4 bg-danger/20 rounded-full text-danger inline-block border border-danger/40">
              <AlertOctagon className="w-10 h-10" />
            </div>
            <h1 className="text-xl font-black text-danger tracking-tight">IDR NAV Navigation Console Recovered</h1>
            <p className="text-xs text-muted">
              A telemetry rendering error was safely caught. The application prevented a black screen crash.
            </p>

            {this.state.error && (
              <div className="bg-surface p-3 rounded-lg border border-border text-left font-mono text-[11px] text-warning overflow-x-auto">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="bg-primary text-surface font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all inline-flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RELOAD DASHBOARD CONSOLE</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
