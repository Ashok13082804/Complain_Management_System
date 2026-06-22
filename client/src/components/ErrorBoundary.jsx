import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-10 font-sans">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full border border-red-100">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong.</h1>
                        <p className="text-gray-600 mb-6">The application encountered a critical error and could not render.</p>

                        <div className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto text-sm font-mono mb-6 max-h-64">
                            <p className="text-red-300 font-bold mb-2">{this.state.error && this.state.error.toString()}</p>
                            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
