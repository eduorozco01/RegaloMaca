/*  ═══════════════════════════════════════════════════════════════
 *  config.js — Configuración general de la web (v2)
 *  ═══════════════════════════════════════════════════════════════
 *
 *  CÓMO EDITAR:
 *  - «fechaInicio»: Fecha en formato "AAAA-MM-DD" en que empezó
 *    vuestra historia. Se usa para calcular automáticamente los
 *    días juntos en el contador ("Llevamos X días juntos ♥ ∞").
 *  - «contrasena»: Contraseña para entrar (si la dejas vacía "",
 *    se entra directamente sin pedir contraseña).
 *  - «mensajeBienvenida»: El texto/poema central en la portada.
 *  - «actividad»: Novedad que sale en la caja de actividad.
 *  ═══════════════════════════════════════════════════════════════ */

window.CONFIG = {

  /* Fecha en que empezó vuestra relación (formato AAAA-MM-DD)
     Ejemplo: "2021-10-29" calculará exactamente los días transcurridos */
  fechaInicio: "2021-10-29",

  /* Contraseña de la pantalla de entrada.
     Si está vacía (""), el botón abre directamente. */
  contrasena: "",

  /* Nombre de tu pareja (se usa en títulos y textos) */
  nombrePareja: "mi amor",

  /* Fecha del aniversario visible */
  fechaAniversario: "29 de octubre",

  /* Años celebrados */
  anosJuntos: 5,

  /* Poema / Mensaje de bienvenida central */
  mensajeBienvenida:
    "Cinco años desde aquella primera vez.\n" +
    "Cinco años de risas, viajes, abrazos\n" +
    "y mil pequeñas cosas que lo cambiaron todo.\n\n" +
    "Este rincón es para ti. Explóralo despacio. ♥",

  /* Última actividad destacada en la portada */
  actividad: {
    etiqueta: "novedad!",
    titulo: "¡Nueva sección desbloqueada!",
    texto: "La línea del tiempo está lista para recorrer nuestros 5 años y lo que vendrá."
  },

  /* Texto del botón de entrada */
  textoBotonEntrada: "toca para abrir tu regalo ♥",

  /* Subtítulo de la pantalla de entrada */
  subtituloEntrada: "5 años juntos"
};
