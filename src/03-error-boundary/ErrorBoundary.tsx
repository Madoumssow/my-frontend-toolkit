import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (props: ErrorFallbackProps) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      return (
        <div
          role="alert"
          style={{
            padding: '1.5rem',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Une erreur inattendue est survenue</h2>
          <p>{this.state.error.message}</p>
          <button
            type="button"
            onClick={this.resetErrorBoundary}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
