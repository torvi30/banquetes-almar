import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  signOut
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config.js";

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

      return {
        uid: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || fbUser.email.split("@")[0],
        role: "admin",
        token: token
      };
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
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      name: displayName || fbUser.email.split("@")[0],
      role: "admin",
      token
    };
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
        callback(user);
      } else {
        this.clearSession();
        callback(null);
      }
    });
  },

  /**
   * Get currently authenticated user data directly from Firebase Auth instance
   */
  getCurrentUser() {
    if (!auth || !auth.currentUser) return null;
    const fbUser = auth.currentUser;
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      name: fbUser.displayName || fbUser.email.split("@")[0],
      role: "admin"
    };
  },

  /**
   * Check if an active session exists in Firebase Auth
   */
  isAuthenticated() {
    return Boolean(auth && auth.currentUser);
  },

  /**
   * Clear legacy session storage if any existed previously
   */
  clearSession() {
    try {
      localStorage.removeItem("almar_current_user");
      localStorage.removeItem("token");
      localStorage.removeItem("adminNombre");
    } catch (e) {}
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
