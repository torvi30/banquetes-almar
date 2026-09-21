/**
 * Official Business Information & Venues for Banquetes Almar (Marinilla, Antioquia).
 * Contains public contact details, venue descriptions, and announcements.
 */

export const BUSINESS_INFO = {
  nombre: "Banquetes Almar",
  slogan: "Salón de Gala en Marinilla & Finca Campestre en El Peñol",
  direccionPrincipal: "Calle 29 n° 28-25, Marinilla, Antioquia",
  sedeCampestre: "El Peñol, Antioquia (Sector Represa)",
  telefonoPrincipal: "+57 314 8849011",
  telefonoFijo: "(604) 548 5352",
  whatsapp: "573148849011",
  email: "banquetes-almar@hotmail.com",
  cobertura: [
    "Marinilla",
    "El Peñol",
    "Guatapé",
    "Rionegro",
    "Guarne",
    "El Carmen de Viboral",
    "El Retiro",
    "La Ceja",
    "El Santuario"
  ],
  sedes: ["Salón Marinilla", "Finca Campestre El Peñol"]
};

export const VENUES_INFO = [
  {
    id: "sede-marinilla",
    nombre: "Salón de Gala Banquetes Almar (Marinilla)",
    tipo: "Salón Urbano & Recepciones",
    ubicacion: "Calle 29 n° 28-25, Marinilla, Antioquia",
    capacidad: "Hasta 200 personas",
    caracteristicas: [
      "Espacio climatizado y acústica profesional",
      "Acceso universal y baños adaptados",
      "Cocina industrial de alta capacidad",
      "Zona de bar y tarima para orquesta / DJ",
      "Céntrico y de fácil llegada para invitados"
    ],
    imagen: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "sede-el-penol",
    nombre: "Finca Campestre Almar (El Peñol)",
    tipo: "Finca de Eventos & Paisaje Natural",
    ubicacion: "Sector Campestre, El Peñol, Antioquia (Cerca a la Represa)",
    capacidad: "Hasta 250 personas en áreas verdes",
    caracteristicas: [
      "Jardines para ceremonias al aire libre y atardeceres",
      "Quiosco campestre estructural con iluminación cálida",
      "Zona lounge con fogata (Fire pit) nocturna",
      "Espacio para carpas estructurales y pista de baile",
      "Entorno natural privado ideal para bodas campestres"
    ],
    imagen: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80"
  }
];

export const DEFAULT_ANNOUNCEMENT = {
  activo: true,
  icono: "✨",
  titulo: "Temporada de Eventos 2026-2027:",
  mensaje: "Salón de Gala en Marinilla & Finca Campestre en El Peñol",
  badge: "Oriente Antioqueño",
  subtexto: "Degustación Previa de Menú Incluida"
};
