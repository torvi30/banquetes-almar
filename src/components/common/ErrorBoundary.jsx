import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-zinc-100 font-sans">
          <div className="max-w-md w-full bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            <span className="text-4xl block mb-4">✨</span>
            <h2 className="font-serif text-2xl font-bold text-white mb-2">
              Banquetes Almar
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Ocurrió un inconveniente temporal al cargar la vista. Por favor pulsa el botón a continuación para restablecer.
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-semibold text-sm transition shadow-lg cursor-pointer"
            >
              🔄 Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
