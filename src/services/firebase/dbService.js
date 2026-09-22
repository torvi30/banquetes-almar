import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "./config.js";
import { DEFAULT_ANNOUNCEMENT } from "../../config/businessInfo.js";

// Local storage prefix
const storagePrefix = process.env.STORAGE_KEY_PREFIX || "almar_";
const STORAGE_KEYS = {
  PACKAGES: `${storagePrefix}packages`,
  INVENTORY: `${storagePrefix}inventory`,
  QUOTES: `${storagePrefix}quotes`,
  RESERVATIONS: `${storagePrefix}reservations`,
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
  return {
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
}

export function normalizeInventoryItem(raw) {
  if (!raw) return null;
  return {
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
}

export function normalizeQuote(raw) {
  if (!raw) return null;
  return {
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
}

export function normalizeReservation(raw) {
  if (!raw) return null;
  return {
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
}

export function normalizePayment(raw) {
  if (!raw) return null;
  return {
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
}

export function normalizeGalleryItem(raw) {
  if (!raw) return null;
  return {
    id: String(raw.id || ""),
    title: raw.title || raw.titulo || "",
    category: raw.category || raw.categoria || "Bodas",
    imageUrl: raw.imageUrl || raw.imagen || "",
    description: raw.description || raw.descripcion || "",
    order: Number(raw.order ?? 0),
    createdAt: raw.createdAt || new Date().toISOString()
  };
}

export function normalizeClient(raw) {
  if (!raw) return null;
  return {
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
}

export function normalizeService(raw) {
  if (!raw) return null;
  return {
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
}

export function normalizeAnnouncement(raw) {
  if (!raw) return null;
  return {
    id: String(raw.id || "top_banner"),
    isActive: raw.isActive !== undefined ? Boolean(raw.isActive) : (raw.activo !== undefined ? Boolean(raw.activo) : true),
    icon: raw.icon || raw.icono || "✨",
    title: raw.title || raw.titulo || "",
    message: raw.message || raw.mensaje || "",
    badge: raw.badge || "Oriente Antioqueño",
    subtext: raw.subtext || raw.subtexto || "",
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
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

// ----------------- DATABASE SERVICE PUBLIC API -----------------

export const dbService = {
  // PACKAGES
  async getPackages() {
    if (db) {
      try {
        const snapshot = await getDocs(collection(db, "packages"));
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizePackage({ id: d.id, ...d.data() })));
          setLocal(STORAGE_KEYS.PACKAGES, remoteItems);
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getPackages error:", err.message);
      }
    }
    const localItems = getLocal(STORAGE_KEYS.PACKAGES);
    return Array.isArray(localItems) ? localItems.map(normalizePackage) : [];
  },

  async getPackageById(id) {
    const list = await this.getPackages();
    return list.find(p => String(p.id) === String(id)) || null;
  },

  async getPackagesByCategory(category) {
    if (db) {
      try {
        const q = query(
          collection(db, "packages"),
          where("category", "==", category),
          orderBy("pricePerPerson", "asc")
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizePackage({ id: d.id, ...d.data() })));
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getPackagesByCategory error:", err.message);
      }
    }
    const list = await this.getPackages();
    return list.filter(p => p.category === category);
  },

  async addPackage(pkgData) {
    const clean = normalizePackage({
      ...pkgData,
      id: pkgData.id || ("pkg-" + Date.now()),
      createdAt: new Date().toISOString()
    });

    if (db) {
      try {
        await setDoc(doc(db, "packages", clean.id), clean, { merge: true });
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
    if (db) {
      try {
        await setDoc(doc(db, "packages", String(id)), clean, { merge: true });
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
    if (db) {
      try {
        await deleteDoc(doc(db, "packages", String(id)));
      } catch (err) {
        console.warn("Firestore deletePackage error:", err.message);
      }
    }

    let list = getLocal(STORAGE_KEYS.PACKAGES) || [];
    list = list.filter(p => String(p.id) !== String(id));
    setLocal(STORAGE_KEYS.PACKAGES, list);
    return true;
  },

  // INVENTORY
  async getInventory() {
    if (db) {
      try {
        const snapshot = await getDocs(collection(db, "inventory"));
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizeInventoryItem({ id: d.id, ...d.data() })));
          setLocal(STORAGE_KEYS.INVENTORY, remoteItems);
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getInventory error:", err.message);
      }
    }
    const localItems = getLocal(STORAGE_KEYS.INVENTORY);
    return Array.isArray(localItems) ? localItems.map(normalizeInventoryItem) : [];
  },

  async getInventoryItemById(id) {
    const list = await this.getInventory();
    return list.find(item => String(item.id) === String(id)) || null;
  },

  async getInventoryByCategory(category) {
    if (db) {
      try {
        const q = query(
          collection(db, "inventory"),
          where("category", "==", category),
          where("isActive", "==", true),
          orderBy("name", "asc")
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizeInventoryItem({ id: d.id, ...d.data() })));
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getInventoryByCategory error:", err.message);
      }
    }
    const list = await this.getInventory();
    return list.filter(item => item.category === category && item.isActive);
  },

  async addInventoryItem(itemData) {
    const clean = normalizeInventoryItem({
      ...itemData,
      id: itemData.id || ("inv-" + Date.now()),
      createdAt: new Date().toISOString()
    });

    if (db) {
      try {
        await setDoc(doc(db, "inventory", clean.id), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore addInventoryItem error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.INVENTORY) || [];
    list.unshift(clean);
    setLocal(STORAGE_KEYS.INVENTORY, list);
    return clean;
  },

  async updateInventoryItem(id, itemData) {
    const clean = normalizeInventoryItem({ ...itemData, id, updatedAt: new Date().toISOString() });
    if (db) {
      try {
        await setDoc(doc(db, "inventory", String(id)), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore updateInventoryItem error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.INVENTORY) || [];
    const idx = list.findIndex(item => String(item.id) === String(id));
    if (idx !== -1) {
      list[idx] = clean;
      setLocal(STORAGE_KEYS.INVENTORY, list);
    }
    return true;
  },

  async deleteInventoryItem(id) {
    if (db) {
      try {
        await deleteDoc(doc(db, "inventory", String(id)));
      } catch (err) {
        console.warn("Firestore deleteInventoryItem error:", err.message);
      }
    }

    let list = getLocal(STORAGE_KEYS.INVENTORY) || [];
    list = list.filter(item => String(item.id) !== String(id));
    setLocal(STORAGE_KEYS.INVENTORY, list);
    return true;
  },

  // QUOTES
  async getQuotes() {
    if (db) {
      try {
        const snapshot = await getDocs(collection(db, "quotes"));
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizeQuote({ id: d.id, ...d.data() })));
          setLocal(STORAGE_KEYS.QUOTES, remoteItems);
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getQuotes error:", err.message);
      }
    }
    const localItems = getLocal(STORAGE_KEYS.QUOTES);
    return Array.isArray(localItems) ? localItems.map(normalizeQuote) : [];
  },

  async getQuoteById(id) {
    const list = await this.getQuotes();
    return list.find(q => String(q.id) === String(id)) || null;
  },

  async getQuotesByStatus(status) {
    if (db) {
      try {
        const q = query(
          collection(db, "quotes"),
          where("status", "==", status),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizeQuote({ id: d.id, ...d.data() })));
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getQuotesByStatus error:", err.message);
      }
    }
    const list = await this.getQuotes();
    return list.filter(q => q.status === status);
  },

  async addQuote(quoteData) {
    const clean = normalizeQuote({
      ...quoteData,
      id: quoteData.id || ("cot-" + Date.now()),
      status: quoteData.status || "Pending",
      createdAt: new Date().toISOString()
    });

    if (db) {
      try {
        await setDoc(doc(db, "quotes", clean.id), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore addQuote error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.QUOTES) || [];
    list.unshift(clean);
    setLocal(STORAGE_KEYS.QUOTES, list);
    return clean;
  },

  async updateQuote(id, quoteData) {
    const clean = normalizeQuote({ ...quoteData, id, updatedAt: new Date().toISOString() });
    if (db) {
      try {
        await setDoc(doc(db, "quotes", String(id)), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore updateQuote error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.QUOTES) || [];
    const idx = list.findIndex(q => String(q.id) === String(id));
    if (idx !== -1) {
      list[idx] = clean;
      setLocal(STORAGE_KEYS.QUOTES, list);
    }
    return true;
  },

  async updateQuoteStatus(id, newStatus) {
    return this.updateQuote(id, { status: newStatus });
  },

  async deleteQuote(id) {
    if (db) {
      try {
        await deleteDoc(doc(db, "quotes", String(id)));
      } catch (err) {
        console.warn("Firestore deleteQuote error:", err.message);
      }
    }

    let list = getLocal(STORAGE_KEYS.QUOTES) || [];
    list = list.filter(q => String(q.id) !== String(id));
    setLocal(STORAGE_KEYS.QUOTES, list);
    return true;
  },

  // RESERVATIONS
  async getReservations() {
    if (db) {
      try {
        const snapshot = await getDocs(collection(db, "reservations"));
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizeReservation({ id: d.id, ...d.data() })));
          setLocal(STORAGE_KEYS.RESERVATIONS, remoteItems);
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getReservations error:", err.message);
      }
    }
    const localItems = getLocal(STORAGE_KEYS.RESERVATIONS);
    return Array.isArray(localItems) ? localItems.map(normalizeReservation) : [];
  },

  async getReservationById(id) {
    const list = await this.getReservations();
    return list.find(r => String(r.id) === String(id)) || null;
  },

  async getReservationsByStatus(status) {
    if (db) {
      try {
        const q = query(
          collection(db, "reservations"),
          where("status", "==", status),
          orderBy("eventDate", "asc")
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizeReservation({ id: d.id, ...d.data() })));
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getReservationsByStatus error:", err.message);
      }
    }
    const list = await this.getReservations();
    return list.filter(r => r.status === status);
  },

  async findReservationByPhoneOrCode(queryStr) {
    const cleanQuery = (queryStr || "").trim().toLowerCase().replace(/\s+/g, "");
    if (!cleanQuery) return null;

    const list = await this.getReservations();
    return list.find(r => {
      const idMatch = String(r.id || "").toLowerCase().replace(/\s+/g, "") === cleanQuery;
      const phoneMatch = String(r.phone || "").replace(/\D/g, "").includes(cleanQuery.replace(/\D/g, ""));
      return idMatch || (phoneMatch && cleanQuery.length >= 7);
    }) || null;
  },

  async addReservation(reservationData) {
    const total = Number(reservationData.totalAmount || 0);
    const deposit = Number(reservationData.depositAmount || 0);
    const balance = total - deposit;

    const clean = normalizeReservation({
      ...reservationData,
      id: reservationData.id || ("res-" + Date.now()),
      totalAmount: total,
      depositAmount: deposit,
      balanceAmount: balance,
      status: reservationData.status || "Confirmed",
      createdAt: new Date().toISOString()
    });

    if (db) {
      try {
        await setDoc(doc(db, "reservations", clean.id), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore addReservation error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.RESERVATIONS) || [];
    list.unshift(clean);
    setLocal(STORAGE_KEYS.RESERVATIONS, list);
    return clean;
  },

  async updateReservation(id, reservationData) {
    const existing = await this.getReservationById(id);
    const total = Number(reservationData.totalAmount ?? existing?.totalAmount ?? 0);
    const deposit = Number(reservationData.depositAmount ?? existing?.depositAmount ?? 0);
    const balance = total - deposit;

    const clean = normalizeReservation({
      ...existing,
      ...reservationData,
      id,
      totalAmount: total,
      depositAmount: deposit,
      balanceAmount: balance,
      updatedAt: new Date().toISOString()
    });

    if (db) {
      try {
        await setDoc(doc(db, "reservations", String(id)), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore updateReservation error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.RESERVATIONS) || [];
    const idx = list.findIndex(r => String(r.id) === String(id));
    if (idx !== -1) {
      list[idx] = clean;
      setLocal(STORAGE_KEYS.RESERVATIONS, list);
    }
    return true;
  },

  async deleteReservation(id) {
    if (db) {
      try {
        await deleteDoc(doc(db, "reservations", String(id)));
      } catch (err) {
        console.warn("Firestore deleteReservation error:", err.message);
      }
    }

    let list = getLocal(STORAGE_KEYS.RESERVATIONS) || [];
    list = list.filter(r => String(r.id) !== String(id));
    setLocal(STORAGE_KEYS.RESERVATIONS, list);
    return true;
  },

  // PAYMENTS
  async getPayments() {
    if (db) {
      try {
        const snapshot = await getDocs(collection(db, "payments"));
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizePayment({ id: d.id, ...d.data() })));
          setLocal(STORAGE_KEYS.PAYMENTS, remoteItems);
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getPayments error:", err.message);
      }
    }
    const localItems = getLocal(STORAGE_KEYS.PAYMENTS);
    return Array.isArray(localItems) ? localItems.map(normalizePayment) : [];
  },

  async getPaymentsByReservation(reservationId) {
    if (!reservationId) return [];
    if (db) {
      try {
        const q = query(
          collection(db, "payments"),
          where("reservationId", "==", String(reservationId)),
          orderBy("paymentDate", "desc")
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizePayment({ id: d.id, ...d.data() })));
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getPaymentsByReservation error:", err.message);
      }
    }
    const list = await this.getPayments();
    return list.filter(p => String(p.reservationId) === String(reservationId));
  },

  async addPayment(paymentData) {
    const clean = normalizePayment({
      ...paymentData,
      id: paymentData.id || ("pay-" + Date.now()),
      createdAt: new Date().toISOString()
    });

    if (db) {
      try {
        await setDoc(doc(db, "payments", clean.id), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore addPayment error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.PAYMENTS) || [];
    list.unshift(clean);
    setLocal(STORAGE_KEYS.PAYMENTS, list);

    // Update reservation deposit and balance
    if (clean.reservationId) {
      const reservation = await this.getReservationById(clean.reservationId);
      if (reservation) {
        const newDeposit = (reservation.depositAmount || 0) + clean.amount;
        const newBalance = Math.max(0, (reservation.totalAmount || 0) - newDeposit);
        await this.updateReservation(reservation.id, {
          depositAmount: newDeposit,
          balanceAmount: newBalance
        });
      }
    }

    return clean;
  },

  async deletePayment(id) {
    const payments = await this.getPayments();
    const target = payments.find(p => String(p.id) === String(id));

    if (db) {
      try {
        await deleteDoc(doc(db, "payments", String(id)));
      } catch (err) {
        console.warn("Firestore deletePayment error:", err.message);
      }
    }

    let list = getLocal(STORAGE_KEYS.PAYMENTS) || [];
    list = list.filter(p => String(p.id) !== String(id));
    setLocal(STORAGE_KEYS.PAYMENTS, list);

    // Recompute reservation deposit
    if (target?.reservationId) {
      const remainingPayments = await this.getPaymentsByReservation(target.reservationId);
      const newDeposit = remainingPayments.reduce((acc, p) => acc + p.amount, 0);
      const res = await this.getReservationById(target.reservationId);
      if (res) {
        await this.updateReservation(res.id, {
          depositAmount: newDeposit,
          balanceAmount: Math.max(0, (res.totalAmount || 0) - newDeposit)
        });
      }
    }

    return true;
  },

  // CLIENTS
  async getClients() {
    if (db) {
      try {
        const snapshot = await getDocs(collection(db, "clients"));
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizeClient({ id: d.id, ...d.data() })));
          setLocal(STORAGE_KEYS.CLIENTS, remoteItems);
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getClients error:", err.message);
      }
    }
    const localItems = getLocal(STORAGE_KEYS.CLIENTS);
    return Array.isArray(localItems) ? localItems.map(normalizeClient) : [];
  },

  async getClientById(id) {
    const list = await this.getClients();
    return list.find(c => String(c.id) === String(id)) || null;
  },

  async addClient(clientData) {
    const clean = normalizeClient({
      ...clientData,
      id: clientData.id || ("cli-" + Date.now()),
      createdAt: new Date().toISOString()
    });

    if (db) {
      try {
        await setDoc(doc(db, "clients", clean.id), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore addClient error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.CLIENTS) || [];
    list.unshift(clean);
    setLocal(STORAGE_KEYS.CLIENTS, list);
    return clean;
  },

  async updateClient(id, clientData) {
    const clean = normalizeClient({ ...clientData, id, updatedAt: new Date().toISOString() });
    if (db) {
      try {
        await setDoc(doc(db, "clients", String(id)), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore updateClient error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.CLIENTS) || [];
    const idx = list.findIndex(c => String(c.id) === String(id));
    if (idx !== -1) {
      list[idx] = clean;
      setLocal(STORAGE_KEYS.CLIENTS, list);
    }
    return true;
  },

  async deleteClient(id) {
    if (db) {
      try {
        await deleteDoc(doc(db, "clients", String(id)));
      } catch (err) {
        console.warn("Firestore deleteClient error:", err.message);
      }
    }

    let list = getLocal(STORAGE_KEYS.CLIENTS) || [];
    list = list.filter(c => String(c.id) !== String(id));
    setLocal(STORAGE_KEYS.CLIENTS, list);
    return true;
  },

  // SERVICES
  async getServices() {
    if (db) {
      try {
        const snapshot = await getDocs(collection(db, "services"));
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizeService({ id: d.id, ...d.data() })));
          setLocal(STORAGE_KEYS.SERVICES, remoteItems);
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getServices error:", err.message);
      }
    }
    const localItems = getLocal(STORAGE_KEYS.SERVICES);
    return Array.isArray(localItems) ? localItems.map(normalizeService) : [];
  },

  async getServiceById(id) {
    const list = await this.getServices();
    return list.find(s => String(s.id) === String(id)) || null;
  },

  async addService(serviceData) {
    const clean = normalizeService({
      ...serviceData,
      id: serviceData.id || ("srv-" + Date.now()),
      createdAt: new Date().toISOString()
    });

    if (db) {
      try {
        await setDoc(doc(db, "services", clean.id), clean, { merge: true });
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
    if (db) {
      try {
        await setDoc(doc(db, "services", String(id)), clean, { merge: true });
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
    if (db) {
      try {
        await deleteDoc(doc(db, "services", String(id)));
      } catch (err) {
        console.warn("Firestore deleteService error:", err.message);
      }
    }

    let list = getLocal(STORAGE_KEYS.SERVICES) || [];
    list = list.filter(s => String(s.id) !== String(id));
    setLocal(STORAGE_KEYS.SERVICES, list);
    return true;
  },

  // GALLERY
  async getGallery() {
    if (db) {
      try {
        const snapshot = await getDocs(collection(db, "gallery"));
        if (!snapshot.empty) {
          const remoteItems = [];
          snapshot.forEach(d => remoteItems.push(normalizeGalleryItem({ id: d.id, ...d.data() })));
          setLocal(STORAGE_KEYS.GALLERY, remoteItems);
          return remoteItems;
        }
      } catch (err) {
        console.warn("Firestore getGallery error:", err.message);
      }
    }
    const localItems = getLocal(STORAGE_KEYS.GALLERY);
    return Array.isArray(localItems) ? localItems.map(normalizeGalleryItem) : [];
  },

  async getGalleryCategories() {
    const defaultCats = [
      "Bodas",
      "15 Años",
      "Salón Marinilla",
      "Finca El Peñol",
      "Mobiliario",
      "Catering",
      "Eventos Corporativos"
    ];
    const stored = getLocal(STORAGE_KEYS.GALLERY_CATEGORIES);
    return Array.isArray(stored) && stored.length ? stored : defaultCats;
  },

  async addGalleryItem(itemData) {
    const clean = normalizeGalleryItem({
      ...itemData,
      id: itemData.id || ("gal-" + Date.now()),
      createdAt: new Date().toISOString()
    });

    if (db) {
      try {
        await setDoc(doc(db, "gallery", clean.id), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore addGalleryItem error:", err.message);
      }
    }

    const list = getLocal(STORAGE_KEYS.GALLERY) || [];
    list.unshift(clean);
    setLocal(STORAGE_KEYS.GALLERY, list);
    return clean;
  },

  async deleteGalleryItem(id) {
    if (db) {
      try {
        await deleteDoc(doc(db, "gallery", String(id)));
      } catch (err) {
        console.warn("Firestore deleteGalleryItem error:", err.message);
      }
    }

    let list = getLocal(STORAGE_KEYS.GALLERY) || [];
    list = list.filter(item => String(item.id) !== String(id));
    setLocal(STORAGE_KEYS.GALLERY, list);
    return true;
  },

  // ANNOUNCEMENTS
  async getAnnouncement() {
    if (db) {
      try {
        const snapshot = await getDocs(collection(db, "announcements"));
        if (!snapshot.empty) {
          const d = snapshot.docs[0];
          const data = normalizeAnnouncement({ id: d.id, ...d.data() });
          setLocal(STORAGE_KEYS.ANNOUNCEMENT, data);
          return data;
        }
      } catch (err) {
        console.warn("Firestore getAnnouncement error:", err.message);
      }
    }
    const stored = getLocal(STORAGE_KEYS.ANNOUNCEMENT);
    return stored && stored.title ? normalizeAnnouncement(stored) : normalizeAnnouncement(DEFAULT_ANNOUNCEMENT);
  },

  async updateAnnouncement(announcementData) {
    const clean = normalizeAnnouncement({
      ...announcementData,
      id: "top_banner",
      updatedAt: new Date().toISOString()
    });

    if (db) {
      try {
        await setDoc(doc(db, "announcements", "top_banner"), clean, { merge: true });
      } catch (err) {
        console.warn("Firestore updateAnnouncement error:", err.message);
      }
    }

    setLocal(STORAGE_KEYS.ANNOUNCEMENT, clean);
    return clean;
  },

  // DASHBOARD METRICS & CSV EXPORT
  async getDashboardMetrics() {
    const [quotes, reservations, payments] = await Promise.all([
      this.getQuotes(),
      this.getReservations(),
      this.getPayments()
    ]);

    const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const totalPending = reservations.reduce((acc, r) => acc + (r.balanceAmount || 0), 0);
    const pendingQuotes = quotes.filter(q => q.status === "Pending" || q.status === "nuevo");

    return {
      totalRevenue,
      totalPending,
      totalEvents: reservations.length,
      totalQuotes: quotes.length,
      pendingQuotesCount: pendingQuotes.length,
      pendingQuotes: pendingQuotes.slice(0, 5),
      upcomingReservations: reservations.slice(0, 5)
    };
  },

  async exportFinancialCsv() {
    const payments = await this.getPayments();
    const rows = [
      ["ID Abono", "Cliente", "Monto", "Concepto", "Método", "Fecha", "Referencia", "ID Reserva"]
    ];

    payments.forEach(p => {
      rows.push([
        `"${p.id}"`,
        `"${p.clientName}"`,
        p.amount,
        `"${p.concept}"`,
        `"${p.method}"`,
        `"${p.paymentDate}"`,
        `"${p.reference || ""}"`,
        `"${p.reservationId}"`
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `informe_financiero_almar_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default dbService;
