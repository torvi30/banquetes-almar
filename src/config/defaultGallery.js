/**
 * Curated Gala Photo Gallery for Banquetes Almar (Marinilla & El Peñol).
 * High-resolution visual portfolio showcasing real banquet decor, weddings, 15th birthdays, and venues.
 * English identifiers conforming to project rules.
 */

export const DEFAULT_GALLERY_CATEGORIES = [
  "Bodas",
  "15 Años",
  "Cumpleaños",
  "Salón Marinilla",
  "Finca El Peñol",
  "Mobiliario",
  "Eventos Corporativos"
];

export const DEFAULT_GALLERY_ITEMS = [
  // 1. Bodas
  {
    id: "gal-boda-01",
    title: "Ceremonia Nupcial en Jardín & Arco Floral",
    category: "Bodas",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    description: "Montaje campestre con pasarela floral, silletería Tiffany y arco decorativo de rosas naturales.",
    order: 1,
    createdAt: "2026-01-15T10:00:00.000Z"
  },
  {
    id: "gal-boda-02",
    title: "Banquete Imperial Tiffany Dorado",
    category: "Bodas",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    description: "Cena de gala nupcial con mesas vestidas, centros florales altos y cubertería de lujo.",
    order: 2,
    createdAt: "2026-01-18T12:00:00.000Z"
  },
  {
    id: "gal-boda-03",
    title: "Brindis Nupcial & Mesa de Honor",
    category: "Bodas",
    imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
    description: "Espacio principal para los novios con cristalería tallada, brindis y ambientación romántica.",
    order: 3,
    createdAt: "2026-02-01T15:00:00.000Z"
  },
  {
    id: "gal-boda-04",
    title: "Recepción Romántica al Atardecer",
    category: "Bodas",
    imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
    description: "Iluminación cálida con guirnaldas de microbombillos y atmósfera mágica al aire libre.",
    order: 4,
    createdAt: "2026-02-10T18:00:00.000Z"
  },

  // 2. 15 Años
  {
    id: "gal-xv-01",
    title: "Pista de Baile LED & Vals de Quince",
    category: "15 Años",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    description: "Show de luces robotizadas, pista de cristal LED interactiva y protocolo musical del vals.",
    order: 5,
    createdAt: "2026-02-14T20:00:00.000Z"
  },
  {
    id: "gal-xv-02",
    title: "Mesa Principal Glamour & Backing Fotográfico",
    category: "15 Años",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    description: "Backing con follaje natural, neón personalizado y mesa de dulces temática de alta repostería.",
    order: 6,
    createdAt: "2026-02-20T17:00:00.000Z"
  },
  {
    id: "gal-xv-03",
    title: "Letras Gigantes Luminosas 'MIS 15'",
    category: "15 Años",
    imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    description: "Punto de bienvenida y sesión de fotos con letras gigantes iluminadas en bombillos cálidos vintage.",
    order: 7,
    createdAt: "2026-02-28T19:00:00.000Z"
  },

  // 3. Cumpleaños & Fiestas Sociales
  {
    id: "gal-cumple-01",
    title: "Fiesta de Cumpleaños & Cóctel de Gala",
    category: "Cumpleaños",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
    description: "Celebración social exclusiva con barra de mixología, brindis de honor y aperitivos gourmet.",
    order: 8,
    createdAt: "2026-03-02T19:00:00.000Z"
  },
  {
    id: "gal-cumple-02",
    title: "Torta de Celebración & Mesa Dulce de Autor",
    category: "Cumpleaños",
    imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=80",
    description: "Estación de postres finos, pastel temático artesanal y arreglos florales de temporada.",
    order: 9,
    createdAt: "2026-03-05T16:00:00.000Z"
  },
  {
    id: "gal-cumple-03",
    title: "Ambiente Festivo con Luces Cálidas & DJ",
    category: "Cumpleaños",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    description: "Producción audiovisual completa para fiesta de adultos y aniversarios con sonido profesional.",
    order: 10,
    createdAt: "2026-03-10T21:00:00.000Z"
  },

  // 4. Salón Marinilla
  {
    id: "gal-salon-01",
    title: "Salón de Gala Marinilla - Vista Panorámica",
    category: "Salón Marinilla",
    imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    description: "Distribución de salón cerrado con capacidad para 180 invitados, aire acondicionado y tarima.",
    order: 11,
    createdAt: "2026-03-12T14:00:00.000Z"
  },
  {
    id: "gal-salon-02",
    title: "Montaje de Mesa Formal & Cristalería Fina",
    category: "Salón Marinilla",
    imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80",
    description: "Vajilla en porcelana de gala, cubiertos dorados y copas de cristal en el salón sede Marinilla.",
    order: 12,
    createdAt: "2026-03-15T11:00:00.000Z"
  },

  // 5. Finca El Peñol
  {
    id: "gal-finca-01",
    title: "Boda Campestre con Carpa Panorámica",
    category: "Finca El Peñol",
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    description: "Montaje al aire libre en finca privada de El Peñol con carpa transparente y luces colgantes.",
    order: 13,
    createdAt: "2026-03-18T17:00:00.000Z"
  },
  {
    id: "gal-finca-02",
    title: "Mesas Rústicas en Tablón de Madera Natural",
    category: "Finca El Peñol",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    description: "Estilo rústico-chic con tablones de madera maciza, sillas Crossback y follaje de eucalipto.",
    order: 14,
    createdAt: "2026-03-20T13:00:00.000Z"
  },

  // 6. Mobiliario
  {
    id: "gal-mob-01",
    title: "Silletería Crossback & Arreglos Silvestres",
    category: "Mobiliario",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    description: "Alquiler y montaje de sillas Crossback de madera natural para eventos campestres de lujo.",
    order: 15,
    createdAt: "2026-03-22T10:00:00.000Z"
  },
  {
    id: "gal-mob-02",
    title: "Lounge VIP & Mobiliario de Confort",
    category: "Mobiliario",
    imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80",
    description: "Zonas de descanso tipo lounge con sillones acolchados, mesitas auxiliares y decoración minimalista.",
    order: 16,
    createdAt: "2026-03-23T15:00:00.000Z"
  },

  // 7. Eventos Corporativos
  {
    id: "gal-corp-01",
    title: "Cena de Gala Empresarial & Convención",
    category: "Eventos Corporativos",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    description: "Logística corporativa integral con ayudas audiovisuales, estación de café y banquete a 3 tiempos.",
    order: 17,
    createdAt: "2026-03-25T18:00:00.000Z"
  },
  {
    id: "gal-corp-02",
    title: "Ceremonia de Graduación & Brindis de Prom",
    category: "Eventos Corporativos",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
    description: "Protocolo de grado institucional con tarima, podio, decoración solemne y brindis de honor.",
    order: 18,
    createdAt: "2026-03-26T16:00:00.000Z"
  }
];
