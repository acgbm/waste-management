import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
    // Log the error and info to the console
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "red", padding: 20 }}>
          <h2>Something went wrong.</h2>
          <pre>{String(this.state.error)}</pre>
          <pre>{JSON.stringify(this.state.info, null, 2)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
} 