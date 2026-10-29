/*  ═══════════════════════════════════════════════════════════════
 *  mapa.js — Lugares especiales de nuestra historia
 *  ═══════════════════════════════════════════════════════════════
 *
 *  CÓMO EDITAR:
 *  - «mapa»: "espana" o "europa" (para filtrar la vista del mapa).
 *  - «x» e «y»: Coordenadas en porcentaje (0-100) sobre el mapa.
 *  - «tieneMensaje»: true si quieres que al pulsar se abra una
 *    tarjeta postal con la anécdota, o false para solo pin informativo.
 *  ═══════════════════════════════════════════════════════════════ */

window.LUGARES_MAPA = [
  // ── España & Península Ibérica ─────────────────────────────
  {
    id: "zahora",
    nombre: "Zahora (Cádiz)",
    fecha: "Agosto 2021",
    mapa: "espana",
    x: 37,
    y: 86,
    tieneMensaje: true,
    titulo: "Donde empezó todo",
    desc: "10 de agosto de 2021. Ese día en Zahora cambió nuestras vidas para siempre. El inicio de cinco años maravillosos.",
    foto: "",
    icono: "♥"
  },
  {
    id: "mijas",
    nombre: "Mijas (Málaga)",
    fecha: "Septiembre 2021",
    mapa: "espana",
    x: 48,
    y: 84,
    tieneMensaje: true,
    titulo: "Primer beso y escapada",
    desc: "Nuestro primer beso y ese viaje loco a Mijas. Tiempos duros y caóticos, pero absolutamente inolvidables.",
    foto: "",
    icono: "♥"
  },
  {
    id: "sevilla",
    nombre: "Sevilla",
    fecha: "2021 - 2025",
    mapa: "espana",
    x: 40,
    y: 77,
    tieneMensaje: true,
    titulo: "Nuestra raíz y mil anécdotas",
    desc: "El Real Alcázar conociendo a tu madre, comida en El Pumarejo, Feria de novios guapos y tu graduación inolvidable.",
    foto: "",
    icono: "★"
  },
  {
    id: "arcos",
    nombre: "Arcos de la Frontera",
    fecha: "Marzo 2025",
    mapa: "espana",
    x: 41,
    y: 82,
    tieneMensaje: false,
    titulo: "Ruta en Piolín",
    desc: "Parando el coche en mitad del camino solo para ver vacas.",
    icono: "•"
  },
  {
    id: "tavira",
    nombre: "Tavira (Portugal)",
    fecha: "Diciembre 2024",
    mapa: "espana",
    x: 28,
    y: 78,
    tieneMensaje: true,
    titulo: "Escapada a Portugal",
    desc: "Primer viaje improvisado de fin de año cruzando la frontera. Frío, callejuelas con encanto y nosotros dos.",
    foto: "",
    icono: "♥"
  },
  {
    id: "matalascanas",
    nombre: "Matalascañas",
    fecha: "Marzo 2026",
    mapa: "espana",
    x: 34,
    y: 80,
    tieneMensaje: false,
    titulo: "Aventura al volante",
    desc: "Me atreví a conducir hasta la playa.",
    icono: "•"
  },
  {
    id: "cueva-gato",
    nombre: "Cueva del Gato (Málaga)",
    fecha: "Agosto 2026",
    mapa: "espana",
    x: 45,
    y: 82,
    tieneMensaje: false,
    titulo: "Arte rupestre y naturaleza",
    desc: "Explorando la cueva y la sierra.",
    icono: "•"
  },
  {
    id: "merida",
    nombre: "Mérida",
    fecha: "Diciembre 2025",
    mapa: "espana",
    x: 38,
    y: 62,
    tieneMensaje: false,
    titulo: "Nochebuena romana",
    desc: "Manteniendo la tradición de escaparnos en estas fechas.",
    icono: "•"
  },
  {
    id: "madrid",
    nombre: "Madrid",
    fecha: "2023 - Presente",
    mapa: "espana",
    x: 54,
    y: 47,
    tieneMensaje: true,
    titulo: "Nuestro nuevo hogar",
    desc: "De la escapada a la expo de Monet al primer IKEA de mayores. Nuestra nueva vida en Madrid, El Rastro de domingo y paseos en Casa de Campo.",
    foto: "",
    icono: "★"
  },
  {
    id: "segovia",
    nombre: "Segovia",
    fecha: "Agosto 2026",
    mapa: "espana",
    x: 52,
    y: 43,
    tieneMensaje: false,
    titulo: "Eclipse solar",
    desc: "Excursión a ver el eclipse.",
    icono: "•"
  },
  {
    id: "avila",
    nombre: "Ávila",
    fecha: "Septiembre 2026",
    mapa: "espana",
    x: 49,
    y: 46,
    tieneMensaje: false,
    titulo: "Murallas con Lucía",
    desc: "Paseo entre piedras históricas.",
    icono: "•"
  },
  {
    id: "galicia",
    nombre: "Ruta por Galicia",
    fecha: "Agosto 2026",
    mapa: "espana",
    x: 27,
    y: 22,
    tieneMensaje: false,
    titulo: "Tierras verdes",
    desc: "Días increíbles por tierras gallegas.",
    icono: "•"
  },

  // ── Europa / Escapadas Internacionales ─────────────────────
  {
    id: "toulouse",
    nombre: "Toulouse (Francia)",
    fecha: "Diciembre 2021",
    mapa: "europa",
    x: 48,
    y: 66,
    tieneMensaje: true,
    titulo: "Primer viaje juntos al extranjero",
    desc: "Primer viaje juntos de nuestra vida (con una compañía un tanto extraña). Descubriendo que éramos el mejor equipo para viajar.",
    foto: "",
    icono: "♥"
  },
  {
    id: "paris",
    nombre: "París (Francia)",
    fecha: "Enero 2023",
    mapa: "europa",
    x: 46,
    y: 53,
    tieneMensaje: true,
    titulo: "La ciudad de la luz",
    desc: "Tardamos en viajar pero nos fuimos a París. No fue el viaje perfecto por mil detalles, pero lo recuerdo con todo el cariño del mundo.",
    foto: "",
    icono: "♥"
  },
  {
    id: "holanda",
    nombre: "Holanda (Países Bajos)",
    fecha: "Mayo 2026",
    mapa: "europa",
    x: 49,
    y: 43,
    tieneMensaje: true,
    titulo: "Cumpleaños inolvidable",
    desc: "Viaje especial para celebrar tu cumpleaños a lo grande. Canales, flores y risas.",
    foto: "",
    icono: "♥"
  }
];
