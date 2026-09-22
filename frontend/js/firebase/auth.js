/**
 * Firebase Authentication Service - Banquetes Almar (Marinilla, Antioquia)
 * Direct integration with Google Firebase Authentication (Live Cloud Project: banquetes-almar).
 * Enforces strict authentication, token management, and route protection.
 */

import { firebaseConfig, isFirebaseConfigured } from "./config.js";
import { ENV } from "./env.js";


let firebaseAuth = null;
let authOps = null;
let authInitPromise = null;

/**
 * Initialize Firebase Authentication SDK dynamically
 * @returns {Promise<{auth: any, ops: any}|null>}
 */
export async function getFirebaseAuthInstance() {
  if (typeof window === "undefined" || !isFirebaseConfigured()) return null;
  if (firebaseAuth && authOps) return { auth: firebaseAuth, ops: authOps };

  if (authInitPromise) return authInitPromise;

  authInitPromise = (async () => {
    try {
      const { initializeApp, getApps } = await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"
      );
      const ops = await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"
      );
      const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
      firebaseAuth = ops.getAuth(app);
      authOps = ops;
      return { auth: firebaseAuth, ops: authOps };
    } catch (err) {
      console.error("Firebase Auth SDK initialization failure:", err);
      return null;
    }
  })();

  return authInitPromise;
}

// Background initialization on browser load
if (typeof window !== "undefined") {
  getFirebaseAuthInstance();
}

export const authService = {
  /**
   * Log in using Firebase Authentication with email & password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{uid: string, email: string, nombre: string, rol: string, token: string}>}
   */
  async login(email, password) {
    const cleanEmail = (email || "").trim();
    const cleanPassword = (password || "").trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error("Por favor ingresa correo electrónico y contraseña.");
    }

    const live = await getFirebaseAuthInstance();
    if (!live) {
      throw new Error("No se pudo conectar con el servicio de Firebase Authentication. Verifica tu conexión a internet.");
    }

    const { auth, ops } = live;

    try {
      const userCredential = await ops.signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const fbUser = userCredential.user;
      const token = await fbUser.getIdToken();

      const user = {
        uid: fbUser.uid,
        email: fbUser.email,
        nombre: fbUser.displayName || fbUser.email.split("@")[0],
        rol: "admin",
      };
      return user;
    } catch (authErr) {
      console.warn("Firebase Auth error:", authErr.code, authErr.message);

      let userMessage = "Credenciales incorrectas.";
      switch (authErr.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          userMessage = "El correo o la contraseña no coinciden con ninguna cuenta registrada en Firebase.";
          break;
        case "auth/invalid-email":
          userMessage = "El formato del correo electrónico es inválido.";
          break;
        case "auth/user-disabled":
          userMessage = "Esta cuenta de administrador ha sido deshabilitada.";
          break;
        case "auth/too-many-requests":
          userMessage = "Demasiados intentos fallidos consecutivos. Por seguridad, espera unos minutos o reestablece tu contraseña.";
          break;
        case "auth/network-request-failed":
          userMessage = "Error de conexión de red al validar con Firebase. Revisa tu acceso a internet.";
          break;
        default:
          userMessage = authErr.message || "Error al autenticar con Firebase.";
      }
      throw new Error(userMessage);
    }
  },

  /**
   * Register a new administrator in Firebase Authentication
   * @param {string} email 
   * @param {string} password 
   * @param {string} [displayName]
   */
  async registerAdmin(email, password, displayName = "Administrador Almar") {
    const live = await getFirebaseAuthInstance();
    if (!live) throw new Error("Firebase Auth no disponible.");

    const { auth, ops } = live;
    const userCredential = await ops.createUserWithEmailAndPassword(auth, email.trim(), password.trim());
    const fbUser = userCredential.user;

    if (displayName && ops.updateProfile) {
      await ops.updateProfile(fbUser, { displayName });
    }

    const token = await fbUser.getIdToken();
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      nombre: displayName || fbUser.email.split("@")[0],
      rol: "admin",
      token
    };
  },

  /**
   * Listen to Firebase auth state changes in real time
   * @param {Function} callback 
   */
  async onAuthStateChanged(callback) {
    const live = await getFirebaseAuthInstance();
    if (live) {
      const { auth, ops } = live;
      return ops.onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          fbUser.getIdToken().then((token) => {
            const user = {
              uid: fbUser.uid,
              email: fbUser.email,
              nombre: fbUser.displayName || fbUser.email.split("@")[0],
              rol: "admin",
              token
            };
            callback(user);
          });
        } else {
          this.clearSession();
          callback(null);
        }
      });
    }
  },

  /**
   * Get currently authenticated user data directly from Firebase Auth
   * @returns {Object|null}
   */
  getCurrentUser() {
    if (firebaseAuth && firebaseAuth.currentUser) {
      const fbUser = firebaseAuth.currentUser;
      return {
        uid: fbUser.uid,
        email: fbUser.email,
        nombre: fbUser.displayName || fbUser.email.split("@")[0],
        rol: "admin"
      };
    }
    return null;
  },

  /**
   * Check if an active session exists in Firebase Auth
   * @returns {boolean}
   */
  isAuthenticated() {
    return Boolean(firebaseAuth && firebaseAuth.currentUser);
  },

  /**
   * Clear local session storage if legacy keys remain
   */
  clearSession() {
    try {
      localStorage.removeItem("almar_current_user");
      localStorage.removeItem("token");
      localStorage.removeItem("adminNombre");
    } catch (e) {}
  },

  /**
   * Sign out from Firebase Authentication and clear local cache
   */
  async logout() {
    const live = await getFirebaseAuthInstance();
    if (live) {
      try {
        await live.ops.signOut(live.auth);
      } catch (e) {
        console.warn("SignOut warning:", e);
      }
    }
    this.clearSession();
    window.location.href = "./login.html";
  },

  /**
   * Protect administration routes. Redirects immediately if not authenticated.
   * @param {string} [redirectUrl="./login.html"]
   */
  requireAuth(redirectUrl = "./login.html") {
    if (!this.isAuthenticated()) {
      window.location.href = redirectUrl;
    }
  }
};
