import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: 5000,
      open: false
    },
    define: {
      // Expose environment variables to client code
      "process.env": env
    },
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-firebase": ["firebase/app", "firebase/auth", "firebase/firestore"],
            "vendor-ui": ["sweetalert2"]
          }
        }
      }
    }
  };
});

