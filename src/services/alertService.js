import Swal from "sweetalert2";

/**
 * Banquetes Almar - Luxury Alert & Notification Service
 * SweetAlert2 wrapped in obsidian dark theme (#18181b) with gold gala accents (#d4af37).
 */

const baseSwalConfig = {
  background: "#18181b",
  color: "#f4f4f5",
  confirmButtonColor: "#d4af37",
  cancelButtonColor: "#3f3f46",
  customClass: {
    popup: "border border-amber-500/20 shadow-2xl rounded-2xl",
    title: "font-serif text-amber-300",
    confirmButton: "px-6 py-2.5 rounded-full font-semibold text-zinc-950",
    cancelButton: "px-6 py-2.5 rounded-full font-semibold text-zinc-300"
  }
};

export const alertService = {
  /**
   * Display a success modal
   */
  success(title, message = "", options = {}) {
    const isHtml = typeof message === "string" && (message.includes("<") || message.includes("\n"));
    return Swal.fire({
      ...baseSwalConfig,
      icon: "success",
      title: title || "¡Operación Exitosa!",
      [isHtml ? "html" : "text"]: isHtml && !message.includes("<") 
        ? message.replace(/\n/g, "<br>") 
        : message,
      confirmButtonText: options.confirmButtonText || "Entendido",
      ...options
    });
  },

  /**
   * Display a warning modal
   */
  warning(title, message = "", options = {}) {
    const isHtml = typeof message === "string" && (message.includes("<") || message.includes("\n"));
    return Swal.fire({
      ...baseSwalConfig,
      icon: "warning",
      title: title || "Aviso Importante",
      [isHtml ? "html" : "text"]: isHtml && !message.includes("<") 
        ? message.replace(/\n/g, "<br>") 
        : message,
      confirmButtonText: options.confirmButtonText || "Entendido",
      ...options
    });
  },

  /**
   * Display an error modal
   */
  error(title, message = "", options = {}) {
    const isHtml = typeof message === "string" && (message.includes("<") || message.includes("\n"));
    return Swal.fire({
      ...baseSwalConfig,
      icon: "error",
      title: title || "Atención",
      [isHtml ? "html" : "text"]: isHtml && !message.includes("<") 
        ? message.replace(/\n/g, "<br>") 
        : message,
      confirmButtonText: options.confirmButtonText || "Aceptar",
      ...options
    });
  },

  /**
   * Display an informational modal
   */
  info(title, message = "", options = {}) {
    const isHtml = typeof message === "string" && (message.includes("<") || message.includes("\n"));
    return Swal.fire({
      ...baseSwalConfig,
      icon: "info",
      title: title || "Información",
      [isHtml ? "html" : "text"]: isHtml && !message.includes("<") 
        ? message.replace(/\n/g, "<br>") 
        : message,
      confirmButtonText: options.confirmButtonText || "Entendido",
      ...options
    });
  },

  /**
   * Display a luxury confirmation dialog
   */
  async confirm(title, message = "", confirmText = "Confirmar", cancelText = "Cancelar", isDestructive = false) {
    const res = await Swal.fire({
      ...baseSwalConfig,
      icon: isDestructive ? "warning" : "question",
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      confirmButtonColor: isDestructive ? "#dc2626" : "#d4af37"
    });
    return res.isConfirmed;
  },

  /**
   * Floating VIP toast alert
   */
  toast(title, icon = "success", durationMs = 2800) {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: durationMs,
      timerProgressBar: true,
      background: "#18181b",
      color: "#f4f4f5"
    });
  }
};

export default alertService;
