/**
 * Database Migration Script: SQL to Firebase Cloud Firestore (NoSQL Architecture)
 * Project: Banquetes Almar (banquetes-almar)
 * 
 * Transforms relational SQL schema & data into denormalized NoSQL Firestore collections:
 * - Inventory & Categories -> 'inventory' collection
 * - Clientes -> 'clients' collection
 * - Reservas & Eventos & Detalle -> 'reservations' collection (with embedded items)
 * - Cotizaciones -> 'quotes' collection
 * - Pagos -> 'payments' collection
 * - Gallery -> 'gallery' collection
 * - Services & Packages -> 'services' & 'paquetes' collections
 */

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs 
} from "firebase/firestore";
import { getFirebaseConfig } from "./env-loader.mjs";

const firebaseConfig = getFirebaseConfig();

console.log("===============================================================");
console.log("🚀 MIGRACIÓN DE BASE DE DATOS SQL A FIREBASE FIRESTORE (NoSQL)");
console.log(`Proyecto Firebase Destino: ${firebaseConfig.projectId}`);
console.log("===============================================================");

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 1. INVENTARIO & MOBILIARIO (Convertido a NoSQL desnormalizado)
const INVENTORY_DATA = [
  {
    id: "inv-101",
    nombre: "Silla Tiffany Dorada",
    categoria: "Silletería",
    precio: 12000,
    unidad: "unidad",
    stock: 200,
    cantidad_total: 200,
    cantidad_disponible: 180,
    descripcion: "Silla de lujo en resina dorada metálica con cojín en cuerina blanca impermeable. Ideal para bodas y galas.",
    imagen: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    activo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "inv-102",
    nombre: "Silla Crossback Madera Natural",
    categoria: "Silletería",
    precio: 15000,
    unidad: "unidad",
    stock: 150,
    cantidad_total: 150,
    cantidad_disponible: 150,
    descripcion: "Madera de roble acabado rústico chic con cojín en lino crudo. Perfecta para bodas campestres en El Peñol.",
    imagen: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    activo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "inv-103",
    nombre: "Mesa Redonda Imperial (10 Personas)",
    categoria: "Mesas y Tableros",
    precio: 35000,
    unidad: "unidad",
    stock: 30,
    cantidad_total: 30,
    cantidad_disponible: 28,
    descripcion: "Diámetro 1.80m en madera de alta resistencia con estructura metálica plegable de uso rudo.",
    imagen: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    activo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "inv-104",
    nombre: "Tablón Rectangular Banquetero (8 Personas)",
    categoria: "Mesas y Tableros",
    precio: 28000,
    unidad: "unidad",
    stock: 40,
    cantidad_total: 40,
    cantidad_disponible: 40,
    descripcion: "Dimensiones 2.40m x 0.75m ideal para banquetes corridos, mesas presidenciales o estación de buffet.",
    imagen: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    activo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "inv-105",
    nombre: "Mantelería de Alta Costura Champagne",
    categoria: "Mantelería y Textiles",
    precio: 20000,
    unidad: "unidad",
    stock: 60,
    cantidad_total: 60,
    cantidad_disponible: 55,
    descripcion: "Tela jacquard texturizada en tono champaña suave con caída elegante hasta el suelo.",
    imagen: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    activo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "inv-106",
    nombre: "Carpa Estructural Transparente (10x20m)",
    categoria: "Carpas y Estructuras",
    precio: 1800000,
    unidad: "evento",
    stock: 3,
    cantidad_total: 3,
    cantidad_disponible: 3,
    descripcion: "Techo panorámico cristal con iluminación perimetral en bombillería cálida vintage e impermeabilidad total.",
    imagen: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    activo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "inv-107",
    nombre: "Vajilla de Porcelana Fina con Borde Dorado",
    categoria: "Menaje y Vajilla",
    precio: 8500,
    unidad: "puesto",
    stock: 250,
    cantidad_total: 250,
    cantidad_disponible: 250,
    descripcion: "Juego completo de plato base, plato hondo, plato llano y cubertería dorada de acero inoxidable.",
    imagen: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
    activo: true,
    createdAt: new Date().toISOString()
  }
];

// 2. CLIENTES
const CLIENTS_DATA = [
  {
    id: "cli-101",
    nombre: "Mariana Gómez",
    telefono: "3145678901",
    email: "mariana.gomez@gmail.com",
    documento: "1038412991",
    direccion: "Calle 30 # 29-15, Marinilla, Antioquia",
    tipo_cliente: "Cliente",
    notas: "Cliente preferencial para cotización de boda campestre.",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "cli-102",
    nombre: "Carlos Andrés Restrepo",
    telefono: "3104523311",
    email: "carlos.restrepo@outlook.com",
    documento: "1038554210",
    direccion: "Sector La Dalia, El Peñol, Antioquia",
    tipo_cliente: "VIP",
    notas: "Quinceaños para 80 personas en Salón de Gala.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "cli-103",
    nombre: "Valentina Muñoz & Juan Esteban",
    telefono: "3117892233",
    email: "valen.munoz@yahoo.es",
    documento: "1040112845",
    direccion: "Carrera 31 # 27-10, Rionegro",
    tipo_cliente: "Boda",
    notas: "Contrato firmado para Boda Imperial en diciembre 2026.",
    createdAt: new Date().toISOString()
  }
];

// 3. RESERVAS & EVENTOS (NoSQL con cliente embebido y mobiliario embebido en items[])
const RESERVATIONS_DATA = [
  {
    id: "res-201",
    cliente: "Valentina Muñoz & Juan Esteban",
    cliente_id: "cli-103",
    telefono: "3117892233",
    email: "valen.munoz@yahoo.es",
    tipo_evento: "Boda Imperial",
    personas: 120,
    fecha_evento: "2026-12-05",
    hora_evento: "17:00",
    locacion: "Finca Campestre Almar (El Peñol)",
    total: 13800000,
    valor_total: 13800000,
    anticipo: 4000000,
    abono: 4000000,
    saldo: 9800000,
    estado: "Confirmada",
    observaciones: "Ceremonia al atardecer frente a la represa, montaje con silletería Tiffany y carpa panorámica cristal.",
    items: [
      {
        inventario_id: "inv-101",
        nombre: "Silla Tiffany Dorada",
        cantidad: 120,
        precio_unitario: 12000
      },
      {
        inventario_id: "inv-103",
        nombre: "Mesa Redonda Imperial",
        cantidad: 12,
        precio_unitario: 35000
      },
      {
        inventario_id: "inv-106",
        nombre: "Carpa Estructural Transparente",
        cantidad: 1,
        precio_unitario: 1800000
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "res-202",
    cliente: "Carlos Andrés Restrepo",
    cliente_id: "cli-102",
    telefono: "3104523311",
    email: "carlos.restrepo@outlook.com",
    tipo_evento: "15 Años Glam",
    personas: 80,
    fecha_evento: "2026-10-15",
    hora_evento: "19:00",
    locacion: "Salón de Gala Almar (Marinilla)",
    total: 8200000,
    valor_total: 8200000,
    anticipo: 2500000,
    abono: 2500000,
    saldo: 5700000,
    estado: "Confirmada",
    observaciones: "Vals protocolario con máquina de niebla baja y pista LED iluminada.",
    items: [
      {
        inventario_id: "inv-101",
        nombre: "Silla Tiffany Dorada",
        cantidad: 80,
        precio_unitario: 12000
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

// 4. COTIZACIONES
const QUOTES_DATA = [
  {
    id: "cot-101",
    nombre: "Mariana Gómez",
    telefono: "3145678901",
    email: "mariana.gomez@gmail.com",
    evento: "Boda Campestre",
    tipo_evento: "Boda Campestre",
    locacion: "Finca Campestre Almar (El Peñol)",
    personas: 120,
    paqueteId: "boda-almar-imperial",
    paquete: "Boda Almar Imperial",
    totalEstimado: 14100000,
    anticipoSugerido: 4230000,
    mensaje: "Boda campestre al atardecer frente a la represa.",
    estado: "Pendiente",
    origen: "Web",
    fechaEvento: "2026-11-21",
    createdAt: new Date().toISOString()
  },
  {
    id: "cot-102",
    nombre: "Carlos Andrés Restrepo",
    telefono: "3104523311",
    email: "carlos.restrepo@outlook.com",
    evento: "15 Años",
    tipo_evento: "15 Años",
    locacion: "Salón de Gala Almar (Marinilla)",
    personas: 80,
    paqueteId: "quinceanera-encanto",
    paquete: "Quinceañera Mágica & Glam",
    totalEstimado: 7600000,
    anticipoSugerido: 2280000,
    mensaje: "Quinceaños en salón cerrado con pista de baile LED.",
    estado: "Contactado",
    origen: "Web",
    fechaEvento: "2026-10-15",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

// 5. PAGOS & FINANZAS
const PAYMENTS_DATA = [
  {
    id: "pay-301",
    reservaId: "res-201",
    cliente: "Valentina Muñoz & Juan Esteban",
    monto: 4000000,
    concepto: "Anticipo separación fecha y reserva de salón",
    metodo: "Transferencia Bancolombia",
    fecha: "2026-08-15",
    comprobante: "TRANS-BC-8891024",
    estado: "Aprobado",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: "pay-302",
    reservaId: "res-202",
    cliente: "Carlos Andrés Restrepo",
    monto: 2500000,
    concepto: "Anticipo 30% evento 15 años",
    metodo: "Transferencia Bancolombia",
    fecha: "2026-09-01",
    comprobante: "TRANS-BC-9123041",
    estado: "Aprobado",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// 6. GALERÍA
const GALLERY_DATA = [
  {
    id: "gal-1",
    titulo: "Boda Romántica en Salón Almar",
    categoria: "Bodas",
    imagen: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Montaje de gala con centros florales altos e iluminación cálida en Marinilla.",
    es_portada: true,
    orden: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-2",
    titulo: "Ceremonia Campestre en El Peñol",
    categoria: "Finca El Peñol",
    imagen: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Jardines campestres frente a la represa y quiosco iluminado para votos matrimoniales.",
    es_portada: true,
    orden: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-3",
    titulo: "Quince Años de Ensueño",
    categoria: "15 Años",
    imagen: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Efectos especiales, pista LED, backing floral y ambiente juvenil glam.",
    es_portada: true,
    orden: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-4",
    titulo: "Cena de Gala y Alta Cocina",
    categoria: "Catering",
    imagen: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Servicio gourmet a 3 tiempos con emplatado de autor y cristalería fina.",
    es_portada: false,
    orden: 4,
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-5",
    titulo: "Montaje Tiffany y Salas Lounge",
    categoria: "Mobiliario",
    imagen: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Silletería dorada y mobiliario de alquiler de alta gama en Oriente Antioqueño.",
    es_portada: false,
    orden: 5,
    createdAt: new Date().toISOString()
  }
];

// 7. SERVICIOS
const SERVICES_DATA = [
  {
    id: "srv-1",
    titulo: "Banquetería y Catering de Gala",
    categoria: "Catering",
    imagen: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Menús gourmet a 3 tiempos, pasabocas de bienvenida, repostería fina, vajilla de lujo y personal de protocolo para bodas y 15 años.",
    destacado: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "srv-2",
    titulo: "Decoración y Ambientación Floral de Autor",
    categoria: "Decoración",
    imagen: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Centros de mesa altos con flores naturales, arcos ceremoniales, backing de neón para fotos y ambientación de velas.",
    destacado: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "srv-3",
    titulo: "Alquiler de Mobiliario y Menaje de Gala",
    categoria: "Mobiliario",
    imagen: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Sillas Tiffany doradas, Phoenix, Crossback de madera, salas lounge, mantelería de alta costura y cristalería fina.",
    destacado: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "srv-4",
    titulo: "Salón de Gala en Marinilla",
    categoria: "Locación",
    imagen: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Capacidad para 200 personas, acabados de lujo, chandeliers de cristal, camerino para novios y parqueadero privado.",
    destacado: true,
    createdAt: new Date().toISOString()
  }
];

// 8. PAQUETES DE GALA (PACKAGES)
const PACKAGES_DATA = [
  {
    id: "boda-almar-imperial",
    title: "Boda Almar Imperial (Todo Incluido)",
    category: "bodas",
    badge: "Más Solicitado",
    description: "La experiencia nupcial definitiva. Salón o montaje en finca, banquete a 3 tiempos, decoración floral de alta gama y producción técnica completa.",
    pricePerPerson: 115000,
    minGuests: 50,
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    inclusions: [
      "Salón privado Almar o montaje en finca del Oriente Antioqueño",
      "Menú de gala a 3 tiempos con degustación previa para novios",
      "Sillas Tiffany (doradas o blancas) con cojinería de lujo y mesas vestidas",
      "Decoración floral integral: arco nupcial, centros de mesa y camino de flores",
      "Sonido profesional, cabezas móviles, luces vintage y DJ en vivo por 6 horas",
      "Brindis con champaña y cristalería de lujo para todos los invitados",
      "Meseros uniformados, barman, chef y coordinador general del evento"
    ]
  },
  {
    id: "quinceanera-encanto",
    title: "Quinceañera Mágica & Glam",
    category: "quince",
    badge: "Juvenil & Elegante",
    description: "Una celebración inolvidable pensada para destacar a la quinceañera con efectos especiales, pista LED para el vals y ambientación temática.",
    pricePerPerson: 95000,
    minGuests: 40,
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    inclusions: [
      "Decoración temática de impacto: backing fotográfico y letras luminosas XV",
      "Banquete gourmet a 2 tiempos + estación de mesa de postres",
      "Pista de baile LED para el protocolo del vals y fiesta",
      "Show de luces robóticas, máquina de humo y animación DJ",
      "Mobiliario de lujo, vajilla formal y cristalería",
      "Cócteles de bienvenida (con y sin licor) y brindis protocolario",
      "Personal completo de servicio y atención personalizada"
    ]
  },
  {
    id: "grados-prom",
    title: "Grados & Promociones Soñadas",
    category: "grados",
    badge: "Celebración Exclusiva",
    description: "El cierre de ciclo perfecto para colegios y universidades con protocolo de toga, cena de gala, brindis y fiesta inolvidable.",
    pricePerPerson: 78000,
    minGuests: 35,
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
    inclusions: [
      "Salón acondicionado con tarima protocolaria para entrega de diplomas",
      "Cena formal a la mesa con bebida y postre",
      "Copa de vino o champaña para el brindis de honor",
      "Sonido envolvente para discursos y DJ para la hora de fiesta",
      "Mobiliario formal y mantelería elegante",
      "Personal de protocolo y servicio a la mesa"
    ]
  },
  {
    id: "comunion-bautizo",
    title: "Primera Comunión & Bautizo Celestial",
    category: "sociales",
    badge: "Familiar & Acogedor",
    description: "Ambiente cálido, decoración en blanco y dorado o tonos pastel, mesa de dulces angelical y menú delicioso para toda la familia.",
    pricePerPerson: 68000,
    minGuests: 30,
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
    inclusions: [
      "Montaje angelical con detalles en dorado, follaje natural y flores frescas",
      "Almuerzo o cena campestre balanceada para adultos y niños",
      "Mesa de dulces decorada con figuras temáticas",
      "Mobiliario cómodo con mantelería y centros de mesa florales",
      "Atención de meseros y ambientación musical suave"
    ]
  },
  {
    id: "corporativo-almar",
    title: "Eventos Corporativos & Fin de Año",
    category: "corporativo",
    badge: "Empresarial",
    description: "Asambleas, integraciones, conferencias y fiestas de fin de año con tecnología audiovisual, estación de café y banquete ejecutivo.",
    pricePerPerson: 82000,
    minGuests: 30,
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    inclusions: [
      "Equipos audiovisuales: pantalla, videoproyector y micrófonos inalámbricos",
      "Estación permanente de café gourmet, aromáticas y pasabocas",
      "Almuerzo corporativo o cena de gala buffet",
      "Disposición en auditorio, herradura o mesas redondas",
      "Espacio amplio con accesibilidad universal en Marinilla"
    ]
  }
];

// 9. ANUNCIO SUPERIOR
const ANNOUNCEMENT_DATA = {
  id: "top_banner",
  isActive: true,
  icon: "✨",
  title: "Agenda Temporada 2026-2027:",
  message: "Reserva tu fecha especial con degustación exclusiva para novios y quinceañeras.",
  badge: "Oriente Antioqueño",
  subtext: "Marinilla · El Peñol · Rionegro",
  updatedAt: new Date().toISOString()
};

function stripUndefined(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) result[key] = value;
  }
  return result;
}

async function runMigration() {
  try {
    console.log("\n🔐 Autenticando con Firebase Auth como Administrador...");
    const userCredential = await signInWithEmailAndPassword(auth, "admin@almar.com", "Admin123*");
    console.log(`   ✅ Autenticado exitosamente: ${userCredential.user.email} (UID: ${userCredential.user.uid})`);

    console.log("\n📦 1. Migrando Catálogo de Mobiliario e Inventario a Firestore...");
    for (const item of INVENTORY_DATA) {
      const clean = stripUndefined({
        id: item.id,
        name: item.nombre || "",
        category: item.categoria || "General",
        price: Number(item.precio || 0),
        unit: item.unidad || "unidad",
        stock: Number(item.stock || item.cantidad_total || 0),
        totalQuantity: Number(item.cantidad_total || item.stock || 0),
        availableQuantity: Number(item.cantidad_disponible || item.stock || 0),
        description: item.descripcion || "",
        imageUrl: item.imagen || "",
        isActive: item.activo !== false,
        createdAt: item.createdAt || new Date().toISOString()
      });
      await setDoc(doc(db, "inventory", clean.id), clean, { merge: true });
    }
    console.log(`   ✅ ${INVENTORY_DATA.length} artículos de inventario migrados a 'inventory'.`);

    console.log("\n👥 2. Migrando Directorio de Clientes...");
    for (const client of CLIENTS_DATA) {
      const clean = stripUndefined({
        id: client.id,
        name: client.nombre || "",
        phone: client.telefono || "",
        email: client.email || "",
        address: client.direccion || "",
        city: client.ciudad || "Marinilla",
        documentId: client.documento || "",
        clientType: client.tipo_cliente || "Cliente",
        eventsCount: Number(client.totalEventos || 0),
        totalBilled: Number(client.totalFacturado || 0),
        notes: client.notes || client.notas || "",
        createdAt: client.createdAt || new Date().toISOString()
      });
      await setDoc(doc(db, "clients", clean.id), clean, { merge: true });
    }
    console.log(`   ✅ ${CLIENTS_DATA.length} clientes migrados a colección 'clients'.`);

    console.log("\n📅 3. Migrando Reservas y Eventos (Modelo NoSQL Desnormalizado)...");
    for (const res of RESERVATIONS_DATA) {
      const clean = stripUndefined({
        id: res.id,
        clientName: res.cliente || "",
        phone: res.telefono || "",
        email: res.email || "",
        eventType: res.tipo_evento || "Evento Social",
        guestCount: Number(res.personas || 0),
        eventDate: res.fecha_evento || "",
        eventTime: res.hora_evento || "17:00",
        location: res.locacion || "Salón Almar Marinilla",
        totalAmount: Number(res.total || res.valor_total || 0),
        depositAmount: Number(res.anticipo || res.abono || 0),
        balanceAmount: Number(res.saldo || 0),
        status: res.estado || "Confirmada",
        notes: res.observaciones || "",
        rentalItems: (res.items || []).map(it => ({
          inventoryId: it.inventario_id || it.inventoryId || "",
          name: it.nombre || it.name || "",
          quantity: Number(it.cantidad || it.quantity || 0),
          unitPrice: Number(it.precio_unitario || it.unitPrice || 0)
        })),
        createdAt: res.createdAt || new Date().toISOString()
      });
      await setDoc(doc(db, "reservations", clean.id), clean, { merge: true });
    }
    console.log(`   ✅ ${RESERVATIONS_DATA.length} reservas y eventos migrados a colección 'reservations'.`);

    console.log("\n💬 4. Migrando Solicitudes y Cotizaciones Web...");
    for (const quote of QUOTES_DATA) {
      const clean = stripUndefined({
        id: quote.id,
        clientName: quote.nombre || "",
        phone: quote.telefono || "",
        email: quote.email || "",
        eventType: quote.evento || quote.tipo_evento || "Evento Social",
        location: quote.locacion || "Salón Almar Marinilla",
        guestCount: Number(quote.personas || 0),
        packageId: quote.paqueteId || "",
        estimatedTotal: Number(quote.totalEstimado || 0),
        suggestedDeposit: Number(quote.anticipoSugerido || 0),
        message: quote.mensaje || "",
        status: quote.estado || "Pendiente",
        eventDate: quote.fechaEvento || "",
        createdAt: quote.createdAt || new Date().toISOString()
      });
      await setDoc(doc(db, "quotes", clean.id), clean, { merge: true });
    }
    console.log(`   ✅ ${QUOTES_DATA.length} cotizaciones migradas a 'quotes'.`);

    console.log("\n💵 5. Migrando Transacciones Financieras y Abonos...");
    for (const pay of PAYMENTS_DATA) {
      const clean = stripUndefined({
        id: pay.id,
        reservationId: pay.reservaId || "",
        clientName: pay.cliente || "",
        amount: Number(pay.monto || 0),
        concept: pay.concepto || "Abono de evento",
        method: pay.metodo || "Transferencia Bancolombia",
        paymentDate: pay.fecha || new Date().toISOString().slice(0, 10),
        reference: pay.referencia || pay.comprobante || "",
        status: pay.estado || "Aprobado",
        createdAt: pay.createdAt || new Date().toISOString()
      });
      await setDoc(doc(db, "payments", clean.id), clean, { merge: true });
    }
    console.log(`   ✅ ${PAYMENTS_DATA.length} pagos migrados a colección 'payments'.`);

    console.log("\n✨ 6. Migrando Galería y Portafolio Visual...");
    for (const gal of GALLERY_DATA) {
      const clean = stripUndefined({
        id: gal.id,
        title: gal.titulo || "",
        category: gal.categoria || "Gala",
        imageUrl: gal.imagen || "",
        description: gal.descripcion || "",
        isCover: gal.es_portada === true,
        order: Number(gal.order || gal.orden || 0),
        createdAt: gal.createdAt || new Date().toISOString()
      });
      await setDoc(doc(db, "gallery", clean.id), clean, { merge: true });
    }
    console.log(`   ✅ ${GALLERY_DATA.length} montajes de galería migrados a colección 'gallery'.`);

    console.log("\n🛠️ 7. Migrando Catálogo de Servicios...");
    for (const srv of SERVICES_DATA) {
      const clean = stripUndefined({
        id: srv.id,
        name: srv.titulo || "",
        category: srv.categoria || "Producción",
        imageUrl: srv.imagen || "",
        description: srv.descripcion || "",
        isFeatured: srv.destacado === true,
        createdAt: srv.createdAt || new Date().toISOString()
      });
      await setDoc(doc(db, "services", clean.id), clean, { merge: true });
    }
    console.log(`   ✅ ${SERVICES_DATA.length} servicios migrados a colección 'services'.`);

    console.log("\n🎁 8. Migrando Paquetes de Gala...");
    for (const pkg of PACKAGES_DATA) {
      const clean = stripUndefined({
        id: pkg.id,
        title: pkg.title || "",
        category: pkg.category || "bodas",
        badge: pkg.badge || "",
        description: pkg.description || "",
        pricePerPerson: Number(pkg.pricePerPerson || 0),
        minGuests: Number(pkg.minGuests || 1),
        imageUrl: pkg.imageUrl || "",
        inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      await setDoc(doc(db, "packages", clean.id), clean, { merge: true });
    }
    console.log(`   ✅ ${PACKAGES_DATA.length} paquetes de gala migrados a colección 'packages'.`);

    console.log("\n📢 9. Migrando Anuncio Superior Oficial...");
    await setDoc(doc(db, "announcements", ANNOUNCEMENT_DATA.id), stripUndefined(ANNOUNCEMENT_DATA), { merge: true });
    console.log(`   ✅ Anuncio superior institucional migrado a 'announcements'.`);

    console.log("\n===============================================================");
    console.log("🎉 ¡MIGRACIÓN A FIREBASE FIRESTORE COMPLETADA CON ÉXITO!");
    console.log("   Todas las tablas SQL han sido convertidas a documentos NoSQL.");
    console.log("   Tu base de datos ahora reside 100% en Firebase Cloud Firestore (Esquema en Inglés).");
    console.log("===============================================================");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante la migración a Firestore:", error);
    process.exit(1);
  }
}

runMigration();
