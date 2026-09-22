import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  signOut
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config.js";

const AUTH_USER_KEY = process.env.AUTH_USER_KEY || "almar_current_user";
const AUTH_TOKEN_KEY = process.env.AUTH_TOKEN_KEY || "token";
const AUTH_NAME_KEY = process.env.AUTH_NAME_KEY || "adminNombre";

export const authService = {
  /**
   * Log in using Firebase Authentication with email & password
   */
  async login(email, password) {
    const cleanEmail = (email || "").trim();
    const cleanPassword = (password || "").trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error("Por favor ingresa correo electrónico y contraseña.");
    }

    if (!auth) {
      throw new Error("No se pudo conectar con el servicio de Firebase Authentication. Verifica tus credenciales.");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const fbUser = userCredential.user;
      const token = await fbUser.getIdToken();

      const user = {
        uid: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || fbUser.email.split("@")[0],
        role: "admin",
        token: token
      };

      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      localStorage.setItem(AUTH_TOKEN_KEY, user.token);
      localStorage.setItem(AUTH_NAME_KEY, user.name);

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
          userMessage = "Demasiados intentos fallidos consecutivos. Por seguridad, espera unos minutos.";
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
   */
  async registerAdmin(email, password, displayName = "Administrador Almar") {
    if (!auth) throw new Error("Firebase Auth no disponible.");

    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
    const fbUser = userCredential.user;

    if (displayName) {
      await updateProfile(fbUser, { displayName });
    }

    const token = await fbUser.getIdToken();
    const user = {
      uid: fbUser.uid,
      email: fbUser.email,
      name: displayName || fbUser.email.split("@")[0],
      role: "admin",
      token
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, user.token);
    localStorage.setItem(AUTH_NAME_KEY, user.name);

    return user;
  },

  /**
   * Listen to Firebase auth state changes in real time
   */
  onAuthStateChanged(callback) {
    if (!auth) {
      callback(null);
      return () => {};
    }

    return onFirebaseAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const token = await fbUser.getIdToken();
        const user = {
          uid: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || fbUser.email.split("@")[0],
          role: "admin",
          token
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_NAME_KEY, user.name);
        callback(user);
      } else {
        this.clearSession();
        callback(null);
      }
    });
  },

  /**
   * Get currently authenticated user data from local storage
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem(AUTH_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if an active session token exists
   */
  isAuthenticated() {
    return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
  },

  /**
   * Clear local session storage
   */
  clearSession() {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_NAME_KEY);
  },

  /**
   * Sign out from Firebase Authentication
   */
  async logout() {
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("SignOut warning:", e);
      }
    }
    this.clearSession();
  }
};

export default authService;
