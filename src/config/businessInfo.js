/**
 * Official Business Information & Venues for Banquetes Almar (Marinilla, Antioquia).
 * Contains public contact details, venue descriptions, and announcements.
 * Conforms to strict English technical identifiers.
 */

export const BUSINESS_INFO = {
  name: "Banquetes Almar",
  slogan: "Salón de Gala en Marinilla & Finca Campestre en El Peñol",
  mainAddress: "Calle 29 n° 28-25, Marinilla, Antioquia",
  countryHouseAddress: "El Peñol, Antioquia (Sector Represa)",
  mainPhone: "+57 314 8849011",
  landlinePhone: "(604) 548 5352",
  whatsapp: "573148849011",
  email: "banquetes-almar@hotmail.com",
  coverageArea: [
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
  venues: ["Salón Marinilla", "Finca Campestre El Peñol"]
};

export const VENUES_INFO = [
  {
    id: "sede-marinilla",
    name: "Salón de Gala Banquetes Almar (Marinilla)",
    type: "Salón Urbano & Recepciones",
    location: "Calle 29 n° 28-25, Marinilla, Antioquia",
    capacity: "Hasta 200 personas",
    features: [
      "Espacio climatizado y acústica profesional",
      "Acceso universal y baños adaptados",
      "Cocina industrial de alta capacidad",
      "Zona de bar y tarima para orquesta / DJ",
      "Céntrico y de fácil llegada para invitados"
    ],
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "sede-el-penol",
    name: "Finca Campestre Almar (El Peñol)",
    type: "Finca de Eventos & Paisaje Natural",
    location: "Sector Campestre, El Peñol, Antioquia (Cerca a la Represa)",
    capacity: "Hasta 250 personas en áreas verdes",
    features: [
      "Jardines para ceremonias al aire libre y atardeceres",
      "Quiosco campestre estructural con iluminación cálida",
      "Zona lounge con fogata (Fire pit) nocturna",
      "Espacio para carpas estructurales y pista de baile",
      "Entorno natural privado ideal para bodas campestres"
    ],
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80"
  }
];

export const DEFAULT_ANNOUNCEMENT = {
  isActive: true,
  icon: "✨",
  title: "Temporada de Eventos 2026-2027:",
  message: "Salón de Gala en Marinilla & Finca Campestre en El Peñol",
  badge: "Oriente Antioqueño",
  subtext: "Degustación Previa de Menú Incluida"
};
