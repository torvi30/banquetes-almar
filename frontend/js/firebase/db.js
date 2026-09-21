/**
 * Database Service for Banquetes Almar (Marinilla, Antioquia).
 * Standardized with 100% English collections, schema attributes, and queries.
 * Live integration with Google Cloud Firestore & local cache synchronization.
 */

import { firebaseConfig, isFirebaseConfigured } from "./config.js";
import { ENV } from "./env.js";
import { DEFAULT_ANNOUNCEMENT } from "../config/business-info.js";

// Client local storage keys prefix
const storagePrefix = ENV?.STORAGE_KEY_PREFIX || "almar_";
const STORAGE_KEYS = {
  PACKAGES: `${storagePrefix}packages`,
  INVENTORY: `${storagePrefix}inventory`,
  QUOTES: `${storagePrefix}quotes`,
  RESERVATIONS: `${storagePrefix}reservations`,
  EVENTS: `${storagePrefix}events`,
  PAYMENTS: `${storagePrefix}payments`,
  CLIENTS: `${storagePrefix}clients`,
  GALLERY: `${storagePrefix}gallery`,
  GALLERY_CATEGORIES: `${storagePrefix}gallery_categories`,
  SERVICES: `${storagePrefix}services`,
  INVENTORY_CATEGORIES: `${storagePrefix}inventory_categories`,
  ANNOUNCEMENT: `${storagePrefix}announcements`
};

// ----------------- ENTITY NORMALIZERS (ENGLISH CANONICAL SCHEMA) -----------------

export function normalizePackage(raw) {
  if (!raw) return null;
  const pkg = {
    id: String(raw.id || ""),
    title: raw.title || raw.titulo || "",
    category: raw.category || raw.categoria || "bodas",
    badge: raw.badge || "",
    description: raw.description || raw.descripcion || "",
    pricePerPerson: Number(raw.pricePerPerson ?? raw.precioPorPersona ?? 0),
    minGuests: Number(raw.minGuests ?? raw.minimoPersonas ?? 1),
    imageUrl: raw.imageUrl || raw.imagen || "",
    inclusions: Array.isArray(raw.inclusions) ? raw.inclusions : (Array.isArray(raw.inclusiones) ? raw.inclusiones : []),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
  Object.defineProperty(pkg, "titulo", { get() { return this.title; }, set(v) { this.title = v; }, enumerable: false });
  Object.defineProperty(pkg, "categoria", { get() { return this.category; }, set(v) { this.category = v; }, enumerable: false });
  Object.defineProperty(pkg, "descripcion", { get() { return this.description; }, set(v) { this.description = v; }, enumerable: false });
  Object.defineProperty(pkg, "precioPorPersona", { get() { return this.pricePerPerson; }, set(v) { this.pricePerPerson = v; }, enumerable: false });
  Object.defineProperty(pkg, "minimoPersonas", { get() { return this.minGuests; }, set(v) { this.minGuests = v; }, enumerable: false });
  Object.defineProperty(pkg, "imagen", { get() { return this.imageUrl; }, set(v) { this.imageUrl = v; }, enumerable: false });
  Object.defineProperty(pkg, "inclusiones", { get() { return this.inclusions; }, set(v) { this.inclusions = v; }, enumerable: false });
  return pkg;
}

export function normalizeInventoryItem(raw) {
  if (!raw) return null;
  const item = {
    id: String(raw.id || ""),
    name: raw.name || raw.nombre || "",
    category: raw.category || raw.categoria || "sillas",
    price: Number(raw.price ?? raw.precio ?? 0),
    unit: raw.unit || raw.unidad || "día/evento",
    stock: Number(raw.stock ?? raw.cantidad_total ?? 0),
    imageUrl: raw.imageUrl || raw.imagen || "",
    description: raw.description || raw.descripcion || "",
    isActive: raw.isActive !== undefined ? Boolean(raw.isActive) : (raw.activo !== undefined ? Boolean(raw.activo) : true),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
  Object.defineProperty(item, "nombre", { get() { return this.name; }, set(v) { this.name = v; }, enumerable: false });
  Object.defineProperty(item, "categoria", { get() { return this.category; }, set(v) { this.category = v; }, enumerable: false });
  Object.defineProperty(item, "precio", { get() { return this.price; }, set(v) { this.price = v; }, enumerable: false });
  Object.defineProperty(item, "unidad", { get() { return this.unit; }, set(v) { this.unit = v; }, enumerable: false });
  Object.defineProperty(item, "imagen", { get() { return this.imageUrl; }, set(v) { this.imageUrl = v; }, enumerable: false });
  Object.defineProperty(item, "descripcion", { get() { return this.description; }, set(v) { this.description = v; }, enumerable: false });
  return item;
}

export function normalizeQuote(raw) {
  if (!raw) return null;
  const quote = {
    id: String(raw.id || ""),
    clientName: raw.clientName || raw.nombre || "",
    phone: raw.phone || raw.telefono || "",
    email: raw.email || "",
    eventType: raw.eventType || raw.evento || "Boda",
    location: raw.location || raw.locacion || "",
    guestCount: Number(raw.guestCount ?? raw.personas ?? raw.invitados ?? 50),
    packageId: raw.packageId || raw.paqueteId || "",
    estimatedTotal: Number(raw.estimatedTotal ?? raw.totalEstimado ?? 0),
    suggestedDeposit: Number(raw.suggestedDeposit ?? raw.anticipoSugerido ?? 0),
    message: raw.message || raw.mensaje || "",
    status: raw.status || raw.estado || "Pending",
    eventDate: raw.eventDate || raw.fechaEvento || raw.fecha_evento || "",
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
  Object.defineProperty(quote, "nombre", { get() { return this.clientName; }, set(v) { this.clientName = v; }, enumerable: false });
  Object.defineProperty(quote, "telefono", { get() { return this.phone; }, set(v) { this.phone = v; }, enumerable: false });
  Object.defineProperty(quote, "evento", { get() { return this.eventType; }, set(v) { this.eventType = v; }, enumerable: false });
  Object.defineProperty(quote, "locacion", { get() { return this.location; }, set(v) { this.location = v; }, enumerable: false });
  Object.defineProperty(quote, "personas", { get() { return this.guestCount; }, set(v) { this.guestCount = v; }, enumerable: false });
  Object.defineProperty(quote, "totalEstimado", { get() { return this.estimatedTotal; }, set(v) { this.estimatedTotal = v; }, enumerable: false });
  Object.defineProperty(quote, "anticipoSugerido", { get() { return this.suggestedDeposit; }, set(v) { this.suggestedDeposit = v; }, enumerable: false });
  Object.defineProperty(quote, "mensaje", { get() { return this.message; }, set(v) { this.message = v; }, enumerable: false });
  Object.defineProperty(quote, "estado", { get() { return this.status; }, set(v) { this.status = v; }, enumerable: false });
  Object.defineProperty(quote, "fechaEvento", { get() { return this.eventDate; }, set(v) { this.eventDate = v; }, enumerable: false });
  return quote;
}

export function normalizeReservation(raw) {
  if (!raw) return null;
  const res = {
    id: String(raw.id || ""),
    clientName: raw.clientName || raw.cliente || "",
    phone: raw.phone || raw.telefono || "",
    email: raw.email || "",
    eventType: raw.eventType || raw.tipo_evento || raw.evento || "Boda",
    guestCount: Number(raw.guestCount ?? raw.personas ?? raw.invitados ?? 50),
    eventDate: raw.eventDate || raw.fecha_evento || raw.fechaEvento || "",
    eventTime: raw.eventTime || raw.hora_evento || "16:00",
    location: raw.location || raw.locacion || "",
    totalAmount: Number(raw.totalAmount ?? raw.total ?? 0),
    depositAmount: Number(raw.depositAmount ?? raw.anticipo ?? 0),
    balanceAmount: Number(raw.balanceAmount ?? raw.saldo ?? 0),
    status: raw.status || raw.estado || "Confirmed",
    notes: raw.notes || raw.observaciones || "",
    packageId: raw.packageId || raw.paqueteId || raw.paquete_id || "",
    rentalItems: Array.isArray(raw.rentalItems) ? raw.rentalItems : (Array.isArray(raw.items_mobiliario) ? raw.items_mobiliario : []),
    contractSigned: Boolean(raw.contractSigned ?? raw.contrato_firmado ?? false),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
  Object.defineProperty(res, "cliente", { get() { return this.clientName; }, set(v) { this.clientName = v; }, enumerable: false });
  Object.defineProperty(res, "telefono", { get() { return this.phone; }, set(v) { this.phone = v; }, enumerable: false });
  Object.defineProperty(res, "tipo_evento", { get() { return this.eventType; }, set(v) { this.eventType = v; }, enumerable: false });
  Object.defineProperty(res, "evento", { get() { return this.eventType; }, set(v) { this.eventType = v; }, enumerable: false });
  Object.defineProperty(res, "personas", { get() { return this.guestCount; }, set(v) { this.guestCount = v; }, enumerable: false });
  Object.defineProperty(res, "invitados", { get() { return this.guestCount; }, set(v) { this.guestCount = v; }, enumerable: false });
  Object.defineProperty(res, "fecha_evento", { get() { return this.eventDate; }, set(v) { this.eventDate = v; }, enumerable: false });
  Object.defineProperty(res, "hora_evento", { get() { return this.eventTime; }, set(v) { this.eventTime = v; }, enumerable: false });
  Object.defineProperty(res, "locacion", { get() { return this.location; }, set(v) { this.location = v; }, enumerable: false });
  Object.defineProperty(res, "total", { get() { return this.totalAmount; }, set(v) { this.totalAmount = v; }, enumerable: false });
  Object.defineProperty(res, "anticipo", { get() { return this.depositAmount; }, set(v) { this.depositAmount = v; }, enumerable: false });
  Object.defineProperty(res, "saldo", { get() { return this.balanceAmount; }, set(v) { this.balanceAmount = v; }, enumerable: false });
  Object.defineProperty(res, "estado", { get() { return this.status; }, set(v) { this.status = v; }, enumerable: false });
  Object.defineProperty(res, "observaciones", { get() { return this.notes; }, set(v) { this.notes = v; }, enumerable: false });
  return res;
}

export function normalizePayment(raw) {
  if (!raw) return null;
  const pay = {
    id: String(raw.id || ""),
    reservationId: String(raw.reservationId || raw.reservaId || raw.reserva_id || ""),
    clientName: raw.clientName || raw.cliente || "",
    amount: Number(raw.amount ?? raw.monto ?? 0),
    concept: raw.concept || raw.concepto || "Abono",
    method: raw.method || raw.metodo || "Transferencia",
    paymentDate: raw.paymentDate || raw.fecha || new Date().toISOString().split("T")[0],
    reference: raw.reference || raw.referencia || "",
    receiptUrl: raw.receiptUrl || raw.comprobanteUrl || "",
    createdAt: raw.createdAt || new Date().toISOString()
  };
  Object.defineProperty(pay, "reservaId", { get() { return this.reservationId; }, set(v) { this.reservationId = v; }, enumerable: false });
  Object.defineProperty(pay, "cliente", { get() { return this.clientName; }, set(v) { this.clientName = v; }, enumerable: false });
  Object.defineProperty(pay, "monto", { get() { return this.amount; }, set(v) { this.amount = v; }, enumerable: false });
  Object.defineProperty(pay, "concepto", { get() { return this.concept; }, set(v) { this.concept = v; }, enumerable: false });
  Object.defineProperty(pay, "metodo", { get() { return this.method; }, set(v) { this.method = v; }, enumerable: false });
  Object.defineProperty(pay, "fecha", { get() { return this.paymentDate; }, set(v) { this.paymentDate = v; }, enumerable: false });
  Object.defineProperty(pay, "referencia", { get() { return this.reference; }, set(v) { this.reference = v; }, enumerable: false });
  return pay;
}

export function normalizeGalleryItem(raw) {
  if (!raw) return null;
  const item = {
    id: String(raw.id || ""),
    title: raw.title || raw.titulo || "",
    category: raw.category || raw.categoria || "Bodas",
    imageUrl: raw.imageUrl || raw.imagen || "",
    description: raw.description || raw.descripcion || "",
    order: Number(raw.order ?? 0),
    createdAt: raw.createdAt || new Date().toISOString()
  };
  Object.defineProperty(item, "titulo", { get() { return this.title; }, set(v) { this.title = v; }, enumerable: false });
  Object.defineProperty(item, "categoria", { get() { return this.category; }, set(v) { this.category = v; }, enumerable: false });
  Object.defineProperty(item, "imagen", { get() { return this.imageUrl; }, set(v) { this.imageUrl = v; }, enumerable: false });
  Object.defineProperty(item, "descripcion", { get() { return this.description; }, set(v) { this.description = v; }, enumerable: false });
  return item;
}

export function normalizeClient(raw) {
  if (!raw) return null;
  const c = {
    id: String(raw.id || ""),
    name: raw.name || raw.nombre || "",
    phone: raw.phone || raw.telefono || "",
    email: raw.email || "",
    address: raw.address || raw.direccion || "",
    city: raw.city || raw.ciudad || "Marinilla",
    documentId: raw.documentId || raw.documento || "",
    clientType: raw.clientType || raw.tipo_cliente || raw.tipo || "Cliente",
    eventsCount: Number(raw.eventsCount ?? raw.totalEventos ?? 0),
    totalBilled: Number(raw.totalBilled ?? raw.totalFacturado ?? 0),
    notes: raw.notes || raw.notas || "",
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
  Object.defineProperty(c, "nombre", { get() { return this.name; }, set(v) { this.name = v; }, enumerable: false });
  Object.defineProperty(c, "telefono", { get() { return this.phone; }, set(v) { this.phone = v; }, enumerable: false });
  Object.defineProperty(c, "direccion", { get() { return this.address; }, set(v) { this.address = v; }, enumerable: false });
  Object.defineProperty(c, "ciudad", { get() { return this.city; }, set(v) { this.city = v; }, enumerable: false });
  Object.defineProperty(c, "documento", { get() { return this.documentId; }, set(v) { this.documentId = v; }, enumerable: false });
  Object.defineProperty(c, "tipo_cliente", { get() { return this.clientType; }, set(v) { this.clientType = v; }, enumerable: false });
  Object.defineProperty(c, "totalEventos", { get() { return this.eventsCount; }, set(v) { this.eventsCount = v; }, enumerable: false });
  Object.defineProperty(c, "totalFacturado", { get() { return this.totalBilled; }, set(v) { this.totalBilled = v; }, enumerable: false });
  return c;
}

export function normalizeService(raw) {
  if (!raw) return null;
  const s = {
    id: String(raw.id || ""),
    name: raw.name || raw.nombre || "",
    category: raw.category || raw.categoria || "Producción",
    price: Number(raw.price ?? raw.precio ?? 0),
    description: raw.description || raw.descripcion || "",
    inclusions: Array.isArray(raw.inclusions) ? raw.inclusions : (Array.isArray(raw.inclusiones) ? raw.inclusiones : []),
    imageUrl: raw.imageUrl || raw.imagen || "",
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
  Object.defineProperty(s, "nombre", { get() { return this.name; }, set(v) { this.name = v; }, enumerable: false });
  Object.defineProperty(s, "categoria", { get() { return this.category; }, set(v) { this.category = v; }, enumerable: false });
  Object.defineProperty(s, "precio", { get() { return this.price; }, set(v) { this.price = v; }, enumerable: false });
  Object.defineProperty(s, "descripcion", { get() { return this.description; }, set(v) { this.description = v; }, enumerable: false });
  Object.defineProperty(s, "inclusiones", { get() { return this.inclusions; }, set(v) { this.inclusions = v; }, enumerable: false });
  Object.defineProperty(s, "imagen", { get() { return this.imageUrl; }, set(v) { this.imageUrl = v; }, enumerable: false });
  return s;
}

export function normalizeAnnouncement(raw) {
  if (!raw) return null;
  const a = {
    id: String(raw.id || "top_banner"),
    isActive: raw.isActive !== undefined ? Boolean(raw.isActive) : (raw.activo !== undefined ? Boolean(raw.activo) : true),
    icon: raw.icon || raw.icono || "✨",
    title: raw.title || raw.titulo || "",
    message: raw.message || raw.mensaje || "",
    badge: raw.badge || "Oriente Antioqueño",
    subtext: raw.subtext || raw.subtexto || "",
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
  Object.defineProperty(a, "activo", { get() { return this.isActive; }, set(v) { this.isActive = v; }, enumerable: false });
  Object.defineProperty(a, "icono", { get() { return this.icon; }, set(v) { this.icon = v; }, enumerable: false });
  Object.defineProperty(a, "titulo", { get() { return this.title; }, set(v) { this.title = v; }, enumerable: false });
  Object.defineProperty(a, "mensaje", { get() { return this.message; }, set(v) { this.message = v; }, enumerable: false });
  Object.defineProperty(a, "subtexto", { get() { return this.subtext; }, set(v) { this.subtext = v; }, enumerable: false });
  return a;
}

// ----------------- LOCAL STORAGE HELPERS -----------------

function getLocal(key) {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn(`Local store error for key ${key}:`, e);
    return [];
  }
}

function setLocal(key, value) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Local store write error for key ${key}:`, e);
  }
}

function initLocalStore() {
  if (typeof localStorage === "undefined") return;

  if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, JSON.stringify(normalizeAnnouncement(DEFAULT_ANNOUNCEMENT)));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUOTES)) {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY_CATEGORIES)) {
    const categories = [
      "Bodas",
      "15 Años",
      "Salón Marinilla",
      "Finca El Peñol",
      "Mobiliario",
      "Catering",
      "Eventos Corporativos"
    ];
    localStorage.setItem(STORAGE_KEYS.GALLERY_CATEGORIES, JSON.stringify(categories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify([]));
  }
}

if (typeof window !== "undefined") {
  initLocalStore();
}

// ----------------- FIRESTORE INITIALIZATION -----------------

let firestoreInstance = null;
let firestoreOps = null;
let firestoreInitPromise = null;

async function initFirestoreLive() {
  if (typeof window === "undefined" || !isFirebaseConfigured()) return null;
  if (firestoreInstance && firestoreOps) return { db: firestoreInstance, ops: firestoreOps };
  if (firestoreInitPromise) return firestoreInitPromise;

  firestoreInitPromise = (async () => {
    try {
      const { initializeApp, getApps } = await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"
      );
      const ops = await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
      );
      const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
      firestoreInstance = ops.getFirestore(app);
      firestoreOps = ops;
      return { db: firestoreInstance, ops: firestoreOps };
    } catch (err) {
      console.warn("Firestore live initialization notice:", err.message);
      return null;
    }
  })();

  return firestoreInitPromise;
}

if (typeof window !== "undefined") {
  initFirestoreLive();
}

// ----------------- DATABASE SERVICE PUBLIC API -----------------

export const dbService = {
  // PACKAGES
  async getPackages() {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const snapshot = await ops.getDocs(ops.collection(db, "packages"));
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(doc => remoteItems.push(normalizePackage({ id: doc.id, ...doc.data() })));
          setLocal(STORAGE_KEYS.PACKAGES, remoteItems);
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getPackages error:", err.message);
      }
    }
    let localItems = getLocal(STORAGE_KEYS.PACKAGES);
    if (!Array.isArray(localItems)) localItems = [];
    return localItems.map(item => normalizePackage(item));
  },

  async getPackageById(id) {
    const list = await this.getPackages();
    return list.find(p => String(p.id) === String(id)) || null;
  },

  async addPackage(pkgData) {
    const clean = normalizePackage({
      ...pkgData,
      id: pkgData.id || ("pkg-" + Date.now()),
      createdAt: new Date().toISOString()
    });

    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "packages", clean.id), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore addPackage error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.PACKAGES) || [];
    list.unshift(clean);
    setLocal(STORAGE_KEYS.PACKAGES, list);
    return clean;
  },

  async updatePackage(id, pkgData) {
    const clean = normalizePackage({ ...pkgData, id, updatedAt: new Date().toISOString() });
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const docRef = ops.doc(db, "packages", String(id));
        await ops.setDoc(docRef, clean, { merge: true });
      } catch (err) {
        console.warn("Firestore updatePackage error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.PACKAGES) || [];
    const idx = list.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      list[idx] = clean;
      setLocal(STORAGE_KEYS.PACKAGES, list);
    }
    return true;
  },

  async deletePackage(id) {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.deleteDoc(ops.doc(db, "packages", String(id)));
      } catch (err) {
        console.warn("Firestore deletePackage error:", err.message);
      }
    }

    let list = getLocal(STORAGE_KEYS.PACKAGES) || [];
    list = list.filter(p => String(p.id) !== String(id));
    setLocal(STORAGE_KEYS.PACKAGES, list);
    return true;
  },

  async resetDefaultPackages() {
    setLocal(STORAGE_KEYS.PACKAGES, []);
    return [];
  },

  // INVENTORY / RENTAL ITEMS
  async getRentalItems(category = "todos") {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const snapshot = await ops.getDocs(ops.collection(db, "inventory"));
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(doc => remoteItems.push(normalizeInventoryItem({ id: doc.id, ...doc.data() })));
          setLocal(STORAGE_KEYS.INVENTORY, remoteItems);
          if (!category || category === "todos") return remoteItems;
          return remoteItems.filter(item => (item.category || "").toLowerCase() === category.toLowerCase());
        }
      } catch (err) {
        console.warn("Firestore getRentalItems error:", err.message);
      }
    }

    let list = getLocal(STORAGE_KEYS.INVENTORY);
    if (!Array.isArray(list)) list = [];
    list = list.map(item => normalizeInventoryItem(item));
    if (!category || category === "todos") return list;
    return list.filter(item => (item.category || "").toLowerCase() === category.toLowerCase());
  },

  async getRentalItemById(id) {
    const list = await this.getRentalItems();
    return list.find(item => String(item.id) === String(id)) || null;
  },

  async getInventoryCategories() {
    let cats = getLocal(STORAGE_KEYS.INVENTORY_CATEGORIES);
    if (!Array.isArray(cats) || cats.length === 0) {
      cats = ["Sillas", "Mesas", "Carpas", "Menaje", "Mantelería", "Lounge"];
      setLocal(STORAGE_KEYS.INVENTORY_CATEGORIES, cats);
    }
    return cats;
  },

  async addInventoryCategory(name) {
    const cats = await this.getInventoryCategories();
    const clean = String(name || "").trim();
    if (clean && !cats.some(c => c.toLowerCase() === clean.toLowerCase())) {
      cats.push(clean);
      setLocal(STORAGE_KEYS.INVENTORY_CATEGORIES, cats);
    }
    return cats;
  },

  async saveRentalItem(itemData) {
    const clean = normalizeInventoryItem({
      ...itemData,
      id: itemData.id || ("mob-" + Date.now()),
      createdAt: itemData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "inventory", clean.id), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore saveRentalItem error:", err.message);
      }
    }

    let items = getLocal(STORAGE_KEYS.INVENTORY) || [];
    const idx = items.findIndex(i => String(i.id) === String(clean.id));
    if (idx !== -1) {
      items[idx] = clean;
    } else {
      items.unshift(clean);
    }
    setLocal(STORAGE_KEYS.INVENTORY, items);
    return clean;
  },

  async deleteRentalItem(id) {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.deleteDoc(ops.doc(db, "inventory", String(id)));
      } catch (err) {
        console.warn("Firestore deleteRentalItem error:", err.message);
      }
    }

    let items = getLocal(STORAGE_KEYS.INVENTORY) || [];
    items = items.filter(i => String(i.id) !== String(id));
    setLocal(STORAGE_KEYS.INVENTORY, items);
    return true;
  },

  // QUOTES
  async getQuotes() {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const q = ops.query(ops.collection(db, "quotes"), ops.orderBy("createdAt", "desc"));
        const snapshot = await ops.getDocs(q);
        if (!snapshot.empty) {
          const remoteQuotes = [];
          snapshot.forEach(doc => {
            remoteQuotes.push(normalizeQuote({ id: doc.id, ...doc.data() }));
          });
          setLocal(STORAGE_KEYS.QUOTES, remoteQuotes);
          return remoteQuotes;
        }
      } catch (err) {
        console.warn("Firestore getQuotes error:", err.message);
      }
    }

    let quotes = getLocal(STORAGE_KEYS.QUOTES) || [];
    return quotes.map(q => normalizeQuote(q)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createQuote(quoteData) {
    const clean = normalizeQuote({
      ...quoteData,
      id: quoteData.id || ("cot-" + Date.now()),
      status: quoteData.status || quoteData.estado || "Pending",
      createdAt: new Date().toISOString()
    });

    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "quotes", clean.id), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore createQuote error:", err.message);
      }
    }

    const quotes = getLocal(STORAGE_KEYS.QUOTES) || [];
    quotes.unshift(clean);
    setLocal(STORAGE_KEYS.QUOTES, quotes);
    return clean;
  },

  async updateQuoteStatus(id, status) {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.updateDoc(ops.doc(db, "quotes", String(id)), {
          status: status,
          updatedAt: new Date().toISOString()
        });
      } catch (e) {}
    }

    const quotes = getLocal(STORAGE_KEYS.QUOTES) || [];
    const idx = quotes.findIndex(q => String(q.id) === String(id));
    if (idx !== -1) {
      quotes[idx].status = status;
      setLocal(STORAGE_KEYS.QUOTES, quotes);
      return quotes[idx];
    }
    return { id, status };
  },

  async updateQuote(id, quoteData) {
    const clean = normalizeQuote({ ...quoteData, id, updatedAt: new Date().toISOString() });
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "quotes", String(id)), clean, { merge: true });
      } catch (e) {
        console.warn("Firestore updateQuote error:", e.message);
      }
    }

    const quotes = getLocal(STORAGE_KEYS.QUOTES) || [];
    const idx = quotes.findIndex(q => String(q.id) === String(id));
    if (idx !== -1) {
      quotes[idx] = clean;
      setLocal(STORAGE_KEYS.QUOTES, quotes);
      return quotes[idx];
    }
    return clean;
  },

  async deleteQuote(id) {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.deleteDoc(ops.doc(db, "quotes", String(id)));
      } catch (e) {}
    }

    let quotes = getLocal(STORAGE_KEYS.QUOTES) || [];
    quotes = quotes.filter(q => String(q.id) !== String(id));
    setLocal(STORAGE_KEYS.QUOTES, quotes);
    return true;
  },

  // RESERVATIONS
  async getReservations() {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const snapshot = await ops.getDocs(ops.collection(db, "reservations"));
        if (!snapshot.empty) {
          const remoteReservations = [];
          snapshot.forEach(doc => remoteReservations.push(normalizeReservation({ id: doc.id, ...doc.data() })));
          setLocal(STORAGE_KEYS.RESERVATIONS, remoteReservations);
          return remoteReservations;
        }
      } catch (e) {
        console.warn("Firestore getReservations error:", e.message);
      }
    }

    let reservations = getLocal(STORAGE_KEYS.RESERVATIONS) || [];
    return reservations.map(r => normalizeReservation(r)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getReservationById(id) {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const docRef = ops.doc(db, "reservations", String(id));
        const docSnap = await ops.getDoc(docRef);
        if (docSnap.exists()) {
          return normalizeReservation({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (e) {
        console.warn("Firestore getReservationById error:", e.message);
      }
    }

    const reservations = getLocal(STORAGE_KEYS.RESERVATIONS) || [];
    const item = reservations.find(r => String(r.id) === String(id));
    return item ? normalizeReservation(item) : null;
  },

  async createReservation(reservationData) {
    const clean = normalizeReservation({
      ...reservationData,
      id: reservationData.id || ("res-" + Date.now()),
      status: reservationData.status || reservationData.estado || "Confirmed",
      createdAt: new Date().toISOString()
    });

    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "reservations", clean.id), clean, { merge: true });
      } catch (e) {
        console.warn("Firestore createReservation error:", e.message);
      }
    }

    const reservations = getLocal(STORAGE_KEYS.RESERVATIONS) || [];
    reservations.unshift(clean);
    setLocal(STORAGE_KEYS.RESERVATIONS, reservations);
    return clean;
  },

  async updateReservation(id, updatedData) {
    const clean = normalizeReservation({ ...updatedData, id, updatedAt: new Date().toISOString() });
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "reservations", String(id)), clean, { merge: true });
      } catch (e) {
        console.warn("Firestore updateReservation error:", e.message);
      }
    }

    const reservations = getLocal(STORAGE_KEYS.RESERVATIONS) || [];
    const idx = reservations.findIndex(r => String(r.id) === String(id));
    if (idx !== -1) {
      reservations[idx] = clean;
      setLocal(STORAGE_KEYS.RESERVATIONS, reservations);
      return reservations[idx];
    }
    return clean;
  },

  async deleteReservation(id) {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.deleteDoc(ops.doc(db, "reservations", String(id)));
      } catch (e) {
        console.warn("Firestore deleteReservation error:", e.message);
      }
    }

    let reservations = getLocal(STORAGE_KEYS.RESERVATIONS) || [];
    reservations = reservations.filter(r => String(r.id) !== String(id));
    setLocal(STORAGE_KEYS.RESERVATIONS, reservations);
    return true;
  },

  // PAYMENTS
  async getPayments() {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const snapshot = await ops.getDocs(ops.collection(db, "payments"));
        if (!snapshot.empty) {
          const remotePayments = [];
          snapshot.forEach(doc => remotePayments.push(normalizePayment({ id: doc.id, ...doc.data() })));
          setLocal(STORAGE_KEYS.PAYMENTS, remotePayments);
          return remotePayments;
        }
      } catch (e) {
        console.warn("Firestore getPayments error:", e.message);
      }
    }

    let payments = getLocal(STORAGE_KEYS.PAYMENTS) || [];
    return payments.map(p => normalizePayment(p));
  },

  async createPayment(paymentData) {
    const clean = normalizePayment({
      ...paymentData,
      id: paymentData.id || ("pay-" + Date.now()),
      paymentDate: paymentData.paymentDate || paymentData.fecha || new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString()
    });

    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "payments", clean.id), clean, { merge: true });
      } catch (e) {
        console.warn("Firestore createPayment error:", e.message);
      }
    }

    const payments = getLocal(STORAGE_KEYS.PAYMENTS) || [];
    payments.unshift(clean);
    setLocal(STORAGE_KEYS.PAYMENTS, payments);

    if (clean.reservationId) {
      await this.recalculateReservationBalance(clean.reservationId);
    }

    return clean;
  },

  async updatePayment(id, paymentData) {
    const clean = normalizePayment({ ...paymentData, id, updatedAt: new Date().toISOString() });
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "payments", String(id)), clean, { merge: true });
      } catch (e) {
        console.warn("Firestore updatePayment error:", e.message);
      }
    }

    const payments = getLocal(STORAGE_KEYS.PAYMENTS) || [];
    const idx = payments.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      const oldResId = payments[idx].reservationId;
      payments[idx] = clean;
      setLocal(STORAGE_KEYS.PAYMENTS, payments);

      if (clean.reservationId) {
        await this.recalculateReservationBalance(clean.reservationId);
      }
      if (oldResId && oldResId !== clean.reservationId) {
        await this.recalculateReservationBalance(oldResId);
      }
      return clean;
    }
    return null;
  },

  async deletePayment(id) {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.deleteDoc(ops.doc(db, "payments", String(id)));
      } catch (e) {
        console.warn("Firestore deletePayment error:", e.message);
      }
    }

    const payments = getLocal(STORAGE_KEYS.PAYMENTS) || [];
    const item = payments.find(p => String(p.id) === String(id));
    const reservationId = item ? item.reservationId : null;
    const filtered = payments.filter(p => String(p.id) !== String(id));
    setLocal(STORAGE_KEYS.PAYMENTS, filtered);

    if (reservationId) {
      await this.recalculateReservationBalance(reservationId);
    }
    return true;
  },

  async recalculateReservationBalance(reservationId) {
    if (!reservationId) return;
    const reservations = await this.getReservations();
    const resIdx = reservations.findIndex(r => String(r.id) === String(reservationId));
    if (resIdx !== -1) {
      const payments = await this.getPayments();
      const totalPaid = payments
        .filter(p => String(p.reservationId) === String(reservationId))
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      
      const total = Number(reservations[resIdx].totalAmount) || 0;
      const balance = Math.max(0, total - totalPaid);
      reservations[resIdx].depositAmount = totalPaid;
      reservations[resIdx].balanceAmount = balance;
      setLocal(STORAGE_KEYS.RESERVATIONS, reservations);

      const live = await initFirestoreLive();
      if (live) {
        try {
          const { db, ops } = live;
          await ops.updateDoc(ops.doc(db, "reservations", String(reservationId)), {
            depositAmount: totalPaid,
            balanceAmount: balance,
            updatedAt: new Date().toISOString()
          });
        } catch (e) {}
      }
    }
  },

  // Alias for backward-compatibility
  async recalcularSaldoReserva(reservaId) {
    return this.recalculateReservationBalance(reservaId);
  },

  // GALLERY
  async getGalleryCategories() {
    let cats = getLocal(STORAGE_KEYS.GALLERY_CATEGORIES);
    if (!Array.isArray(cats) || cats.length === 0) {
      cats = [
        "Bodas",
        "15 Años",
        "Salón Marinilla",
        "Finca El Peñol",
        "Mobiliario",
        "Catering",
        "Eventos Corporativos"
      ];
      setLocal(STORAGE_KEYS.GALLERY_CATEGORIES, cats);
    }
    return cats;
  },

  async addGalleryCategory(name) {
    const trimmed = (name || "").trim();
    if (!trimmed) return false;
    const cats = await this.getGalleryCategories();
    if (!cats.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      cats.push(trimmed);
      setLocal(STORAGE_KEYS.GALLERY_CATEGORIES, cats);
    }
    return cats;
  },

  async deleteGalleryCategory(name) {
    let cats = await this.getGalleryCategories();
    cats = cats.filter(c => c.toLowerCase() !== name.toLowerCase());
    setLocal(STORAGE_KEYS.GALLERY_CATEGORIES, cats);
    return cats;
  },

  async getGallery() {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const snapshot = await ops.getDocs(ops.collection(db, "gallery"));
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(doc => remoteItems.push(normalizeGalleryItem({ id: doc.id, ...doc.data() })));
          setLocal(STORAGE_KEYS.GALLERY, remoteItems);
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getGallery error:", err.message);
      }
    }

    let localItems = getLocal(STORAGE_KEYS.GALLERY);
    if (!Array.isArray(localItems)) localItems = [];
    return localItems.map(item => normalizeGalleryItem(item));
  },

  async addGalleryItem(itemData) {
    const clean = normalizeGalleryItem({
      ...itemData,
      id: itemData.id || ("gal-" + Date.now()),
      createdAt: new Date().toISOString()
    });

    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "gallery", clean.id), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore addGalleryItem error:", err.message);
      }
    }

    const gallery = getLocal(STORAGE_KEYS.GALLERY) || [];
    gallery.unshift(clean);
    setLocal(STORAGE_KEYS.GALLERY, gallery);
    return clean;
  },

  async updateGalleryItem(id, itemData) {
    const clean = normalizeGalleryItem({ ...itemData, id, updatedAt: new Date().toISOString() });
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "gallery", String(id)), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore updateGalleryItem error:", err.message);
      }
    }

    const gallery = getLocal(STORAGE_KEYS.GALLERY) || [];
    const idx = gallery.findIndex(g => String(g.id) === String(id));
    if (idx !== -1) {
      gallery[idx] = clean;
      setLocal(STORAGE_KEYS.GALLERY, gallery);
      return gallery[idx];
    }
    return clean;
  },

  async deleteGalleryItem(id) {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.deleteDoc(ops.doc(db, "gallery", String(id)));
      } catch (err) {
        console.warn("Firestore deleteGalleryItem error:", err.message);
      }
    }

    let gallery = getLocal(STORAGE_KEYS.GALLERY) || [];
    gallery = gallery.filter(g => String(g.id) !== String(id));
    setLocal(STORAGE_KEYS.GALLERY, gallery);
    return true;
  },

  async saveGalleryOrder(orderedItems) {
    if (Array.isArray(orderedItems)) {
      const normalized = orderedItems.map((item, idx) => normalizeGalleryItem({ ...item, order: idx }));
      setLocal(STORAGE_KEYS.GALLERY, normalized);
      return normalized;
    }
    return orderedItems;
  },

  // CLIENTS
  async getClients() {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const snapshot = await ops.getDocs(ops.collection(db, "clients"));
        if (!snapshot.empty) {
          const remoteClients = [];
          snapshot.forEach(doc => remoteClients.push(normalizeClient({ id: doc.id, ...doc.data() })));
          setLocal(STORAGE_KEYS.CLIENTS, remoteClients);
          return remoteClients;
        }
      } catch (err) {
        console.warn("Firestore getClients error:", err.message);
      }
    }

    let clients = getLocal(STORAGE_KEYS.CLIENTS) || [];
    return clients.map(c => normalizeClient(c)).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  },

  async getClientById(id) {
    const clients = await this.getClients();
    return clients.find(c => String(c.id) === String(id)) || null;
  },

  async createClient(clientData) {
    const clean = normalizeClient({
      ...clientData,
      id: clientData.id || ("cli-" + Date.now()),
      createdAt: new Date().toISOString()
    });

    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "clients", clean.id), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore createClient error:", err.message);
      }
    }

    const clients = getLocal(STORAGE_KEYS.CLIENTS) || [];
    clients.unshift(clean);
    setLocal(STORAGE_KEYS.CLIENTS, clients);
    return clean;
  },

  async updateClient(id, clientData) {
    const clean = normalizeClient({ ...clientData, id, updatedAt: new Date().toISOString() });
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "clients", String(id)), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore updateClient error:", err.message);
      }
    }

    const clients = getLocal(STORAGE_KEYS.CLIENTS) || [];
    const idx = clients.findIndex(c => String(c.id) === String(id));
    if (idx !== -1) {
      clients[idx] = clean;
      setLocal(STORAGE_KEYS.CLIENTS, clients);
      return clients[idx];
    }
    return clean;
  },

  async deleteClient(id) {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.deleteDoc(ops.doc(db, "clients", String(id)));
      } catch (err) {
        console.warn("Firestore deleteClient error:", err.message);
      }
    }

    let clients = getLocal(STORAGE_KEYS.CLIENTS) || [];
    clients = clients.filter(c => String(c.id) !== String(id));
    setLocal(STORAGE_KEYS.CLIENTS, clients);
    return true;
  },

  async searchClients(query) {
    const clients = await this.getClients();
    if (!query || !query.trim()) return clients;
    const q = query.toLowerCase().trim();
    return clients.filter(c => 
      String(c.name || "").toLowerCase().includes(q) ||
      String(c.phone || "").toLowerCase().includes(q) ||
      String(c.documentId || "").toLowerCase().includes(q) ||
      String(c.email || "").toLowerCase().includes(q) ||
      String(c.id || "").toLowerCase().includes(q)
    );
  },

  // SERVICES
  async getServices() {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const snapshot = await ops.getDocs(ops.collection(db, "services"));
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(doc => remoteItems.push(normalizeService({ id: doc.id, ...doc.data() })));
          setLocal(STORAGE_KEYS.SERVICES, remoteItems);
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getServices error:", err.message);
      }
    }

    let localItems = getLocal(STORAGE_KEYS.SERVICES) || [];
    return localItems.map(s => normalizeService(s));
  },

  async addService(serviceData) {
    const clean = normalizeService({
      ...serviceData,
      id: serviceData.id || ("srv-" + Date.now()),
      createdAt: new Date().toISOString()
    });

    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "services", clean.id), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore addService error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.SERVICES) || [];
    list.unshift(clean);
    setLocal(STORAGE_KEYS.SERVICES, list);
    return clean;
  },

  async updateService(id, serviceData) {
    const clean = normalizeService({ ...serviceData, id, updatedAt: new Date().toISOString() });
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.setDoc(ops.doc(db, "services", String(id)), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore updateService error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.SERVICES) || [];
    const idx = list.findIndex(s => String(s.id) === String(id));
    if (idx !== -1) {
      list[idx] = clean;
      setLocal(STORAGE_KEYS.SERVICES, list);
    }
    return true;
  },

  async deleteService(id) {
    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        await ops.deleteDoc(ops.doc(db, "services", String(id)));
      } catch (err) {
        console.warn("Firestore deleteService error:", err.message);
      }
    }

    let list = getLocal(STORAGE_KEYS.SERVICES) || [];
    list = list.filter(s => String(s.id) !== String(id));
    setLocal(STORAGE_KEYS.SERVICES, list);
    return true;
  },

  // DASHBOARD STATISTICS
  async getStats() {
    const quotes = await this.getQuotes();
    const reservations = await this.getReservations();
    const payments = await this.getPayments();
    const clients = await this.getClients();

    const totalIncome = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const totalPending = reservations.reduce((acc, r) => acc + (Number(r.balanceAmount) || 0), 0);
    const confirmedCount = reservations.filter(r => (r.status === "Confirmed" || r.status === "Completed" || r.status === "Confirmada")).length;

    return {
      totalQuotes: quotes.length,
      totalEvents: reservations.length,
      totalEventos: reservations.length,
      totalClients: clients.length,
      totalClientes: clients.length,
      confirmedCount: confirmedCount,
      confirmados: confirmedCount,
      totalIncome: totalIncome,
      ingresos: totalIncome,
      pendingBalance: totalPending,
      pendiente: totalPending
    };
  },

  // ANNOUNCEMENT BANNER
  async getAnnouncement() {
    let item = getLocal(STORAGE_KEYS.ANNOUNCEMENT);
    if (!item || !item.title) {
      item = normalizeAnnouncement(DEFAULT_ANNOUNCEMENT);
      setLocal(STORAGE_KEYS.ANNOUNCEMENT, item);
    }

    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const docRef = ops.doc(db, "announcements", "top_banner");
        const snap = await ops.getDoc(docRef);
        if (snap.exists()) {
          item = normalizeAnnouncement({ id: snap.id, ...snap.data() });
          setLocal(STORAGE_KEYS.ANNOUNCEMENT, item);
        }
      } catch (err) {
        console.warn("Firestore getAnnouncement error:", err.message);
      }
    }

    return item;
  },

  async saveAnnouncement(data) {
    const clean = normalizeAnnouncement({ ...data, updatedAt: new Date().toISOString() });
    setLocal(STORAGE_KEYS.ANNOUNCEMENT, clean);

    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const docRef = ops.doc(db, "announcements", "top_banner");
        await ops.setDoc(docRef, clean, { merge: true });
      } catch (err) {
        console.warn("Firestore saveAnnouncement error:", err.message);
      }
    }

    return clean;
  },

  async resetAnnouncement() {
    const clean = normalizeAnnouncement({ ...DEFAULT_ANNOUNCEMENT, updatedAt: new Date().toISOString() });
    setLocal(STORAGE_KEYS.ANNOUNCEMENT, clean);

    const live = await initFirestoreLive();
    if (live) {
      try {
        const { db, ops } = live;
        const docRef = ops.doc(db, "announcements", "top_banner");
        await ops.setDoc(docRef, clean, { merge: true });
      } catch (err) {
        console.warn("Firestore resetAnnouncement error:", err.message);
      }
    }

    return clean;
  }
};
