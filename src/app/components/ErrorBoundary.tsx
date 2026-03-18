import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    errorMessage: "",
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("UI crash captured by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "#111827",
          color: "#f9fafb",
          padding: "24px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
            Runtime Error Detected
          </h1>
          <p style={{ marginBottom: "10px" }}>
            The app crashed while rendering. Send this message to me:
          </p>
          <pre style={{
            background: "#1f2937",
            padding: "12px",
            borderRadius: "8px",
            whiteSpace: "pre-wrap",
          }}>
            {this.state.errorMessage}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
