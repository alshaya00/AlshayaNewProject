"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-error" />
          <h2 className="text-xl font-semibold text-text-primary">Something went wrong</h2>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="max-w-lg overflow-auto rounded bg-navy-dark p-4 text-sm text-error">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => this.setState({ hasError: false, error: null })}>
              Try again
            </Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/")}>
              Go home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
