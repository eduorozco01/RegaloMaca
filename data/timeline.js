/*  ═══════════════════════════════════════════════════════════════
 *  timeline.js — Datos de la línea del tiempo
 *  ═══════════════════════════════════════════════════════════════
 *
 *  CÓMO AÑADIR UN HITO:
 *  1. Copia un bloque { ... } de ejemplo.
 *  2. Rellena los campos:
 *       fecha   → texto libre ("Oct 2021", "Verano 2023"…)
 *       titulo  → título corto del momento
 *       texto   → descripción (2-3 frases)
 *       foto    → ruta a la imagen ("assets/fotos/mi-foto.jpg")
 *                  Déjala "" si aún no tienes foto: se mostrará
 *                  un placeholder bonito.
 *       cancion → índice de la canción en musica.js (0, 1, 2…)
 *                  Pon null si no quieres asociar canción.
 *       tipo    → "pasado" para los hitos reales,
 *                  "hoy"    para el marcador del presente,
 *                  "futuro" para los hitos soñados.
 *  3. Guarda y recarga la web. ¡Listo!
 *
 *  NOTA: El orden del array es el orden en la línea.
 *  ═══════════════════════════════════════════════════════════════ */

window.TIMELINE = [

  /* ── Hitos pasados ─────────────────────────────── */

  {
    fecha:   "Oct 2021",
    titulo:  "Nos conocimos",
    texto:   "Fue en aquel sitio donde menos lo esperábamos. Una mirada, una risa tonta, y todo empezó a cambiar.",
    foto:    "",
    cancion: 0,
    tipo:    "pasado"
  },

  {
    fecha:   "Dic 2021",
    titulo:  "Primera cita",
    texto:   "Café con leche, lluvia fuera y mariposas dentro. No queríamos que terminara nunca.",
    foto:    "",
    cancion: null,
    tipo:    "pasado"
  },

  {
    fecha:   "Mar 2022",
    titulo:  "Primer viaje juntos",
    texto:   "Un fin de semana improvisado. Mapas mal doblados, canciones a gritos en el coche y la certeza de que esto era especial.",
    foto:    "",
    cancion: 1,
    tipo:    "pasado"
  },

  {
    fecha:   "Sep 2023",
    titulo:  "Nos mudamos juntos",
    texto:   "Cajas por todas partes, pizza en el suelo del salón y la mejor decisión que hemos tomado.",
    foto:    "",
    cancion: null,
    tipo:    "pasado"
  },

  {
    fecha:   "Dic 2024",
    titulo:  "Navidad especial",
    texto:   "Nuestra primera Navidad de verdad juntos. Luces, mantita y la sensación de estar en casa.",
    foto:    "",
    cancion: 2,
    tipo:    "pasado"
  },

  /* ── Hoy ───────────────────────────────────────── */

  {
    fecha:   "Oct 2026",
    titulo:  "Hoy — 5 años ♥",
    texto:   "Cinco años. Quién lo diría. Y aquí seguimos, más fuertes y más enamorados que nunca.",
    foto:    "",
    cancion: 0,
    tipo:    "hoy"
  },

  /* ── Hitos futuros ─────────────────────────────── */

  {
    fecha:   "2027",
    titulo:  "Mil aventuras más",
    texto:   "Nuevos sitios, nuevas historias. Todo lo que nos queda por vivir juntos.",
    foto:    "",
    cancion: null,
    tipo:    "futuro"
  },

  {
    fecha:   "2030",
    titulo:  "Juntos por el mundo",
    texto:   "Ese viaje largo que siempre soñamos. Llegará, seguro.",
    foto:    "",
    cancion: null,
    tipo:    "futuro"
  },

  {
    fecha:   "∞",
    titulo:  "Siempre",
    texto:   "No hay fecha final. Esto es para siempre.",
    foto:    "",
    cancion: null,
    tipo:    "futuro"
  }
];
