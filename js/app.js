/* ═══════════════════════════════════════════════════════════════
 *  app.js — Lógica v2 (Contador, Tamagotchi Canvas, Mini Player)
 * ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var estado = {
    seccionActual: "inicio",
    pista: 0,
    sonando: false,
    mute: false,
    audio: null,
    tamaFrame: 0,
    tamaAccion: null, // "corazon", "rebote", "comida"
    tamaTimer: 0
  };

  /* ══════════════════════════════════════════════════════════════
   *  PANTALLA DE ENTRADA
   * ══════════════════════════════════════════════════════════════ */
  function initEntrada() {
    var cfg = window.CONFIG || {};
    var pantalla = document.getElementById("pantalla-entrada");
    var btn = document.getElementById("btn-entrada");
    var passInput = document.getElementById("entrada-password");
    var errorMsg = document.getElementById("entrada-error");

    if (cfg.contrasena && cfg.contrasena.length > 0) {
      passInput.style.display = "block";
    }

    function acceder() {
      if (cfg.contrasena && cfg.contrasena.length > 0) {
        if (passInput.value !== cfg.contrasena) {
          errorMsg.style.display = "block";
          errorMsg.textContent = "✧ contraseña incorrecta ✧";
          passInput.focus();
          return;
        }
      }
      pantalla.classList.add("oculta");
      document.getElementById("app").classList.add("visible");

      // Iniciar música
      if (window.MUSICA && window.MUSICA.length > 0) {
        reproducir(0);
      }
    }

    btn.addEventListener("click", acceder);
    passInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") acceder();
    });
  }

  /* ══════════════════════════════════════════════════════════════
   *  NAVEGACIÓN ENTRE SECCIONES
   * ══════════════════════════════════════════════════════════════ */
  function initNav() {
    var btns = document.querySelectorAll(".nav-pill-btn");

    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sec = btn.getAttribute("data-seccion");
        cambiarSeccion(sec);
      });
    });

    // Clic en mini tira de la portada lleva a la timeline
    var miniStrip = document.getElementById("mini-timeline-strip");
    if (miniStrip) {
      miniStrip.addEventListener("click", function () {
        cambiarSeccion("timeline");
      });
      miniStrip.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cambiarSeccion("timeline");
        }
      });
    }
  }

  function cambiarSeccion(id) {
    estado.seccionActual = id;

    document.querySelectorAll(".seccion").forEach(function (sec) {
      sec.classList.remove("activa");
    });

    var target = document.getElementById("seccion-" + id);
    if (target) {
      target.classList.add("activa");
    }

    // Si entramos a la timeline, recalcular la posición de la línea horizontal
    if (id === "timeline") {
      requestAnimationFrame(function () {
        var track = document.getElementById("timeline-track");
        var datos = window.TIMELINE || [];
        var idxFuturo = -1;
        datos.forEach(function (h, i) {
          if (h.tipo === "futuro" && idxFuturo === -1) idxFuturo = i;
        });
        if (track) ajustarLineasTimeline(track, datos, idxFuturo);
      });
    }

    document.querySelectorAll(".nav-pill-btn").forEach(function (btn) {
      btn.classList.toggle("activo", btn.getAttribute("data-seccion") === id);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ══════════════════════════════════════════════════════════════
   *  INICIO: POEMA, CONTADOR Y MINI TIRA
   * ══════════════════════════════════════════════════════════════ */
  function initInicio() {
    var cfg = window.CONFIG || {};

    // Poema / Mensaje de bienvenida
    var bienvenidaEl = document.getElementById("inicio-bienvenida");
    if (bienvenidaEl && cfg.mensajeBienvenida) {
      bienvenidaEl.textContent = cfg.mensajeBienvenida;
    }

    // Actividad
    if (cfg.actividad) {
      var badgeEl = document.getElementById("actividad-badge");
      var tituloEl = document.getElementById("actividad-titulo");
      var textoEl = document.getElementById("actividad-texto");
      if (badgeEl && cfg.actividad.etiqueta) badgeEl.textContent = cfg.actividad.etiqueta;
      if (tituloEl && cfg.actividad.titulo) tituloEl.textContent = cfg.actividad.titulo;
      if (textoEl && cfg.actividad.texto) textoEl.textContent = cfg.actividad.texto;
    }

    // ── Contador en Vivo (Días, Horas, Minutos, Segundos) ──
    // Fecha de inicio: 1 de noviembre de 2021
    var fechaInicio = new Date(cfg.fechaInicio || "2021-11-01T00:00:00");
    var elDias  = document.getElementById("cnt-dias");
    var elHoras = document.getElementById("cnt-horas");
    var elMins  = document.getElementById("cnt-mins");
    var elSegs  = document.getElementById("cnt-segs");

    function actualizarContadorEnVivo() {
      var ahora = new Date();
      var diffMs = ahora.getTime() - fechaInicio.getTime();
      if (diffMs < 0) diffMs = 0;

      var totalSegs = Math.floor(diffMs / 1000);
      var segs  = totalSegs % 60;
      var totalMins = Math.floor(totalSegs / 60);
      var mins  = totalMins % 60;
      var totalHoras = Math.floor(totalMins / 60);
      var horas = totalHoras % 24;
      var dias  = Math.floor(totalHoras / 24);

      if (elDias)  elDias.textContent  = dias.toLocaleString("es-ES");
      if (elHoras) elHoras.textContent = String(horas).padStart(2, "0");
      if (elMins)  elMins.textContent  = String(mins).padStart(2, "0");
      if (elSegs)  elSegs.textContent  = String(segs).padStart(2, "0");
    }

    actualizarContadorEnVivo();
    setInterval(actualizarContadorEnVivo, 1000);

    // ── Línea del tiempo en portada (Síntesis limpia de hitos por año) ──
    var miniDots = document.getElementById("mini-dots-container");
    if (miniDots) {
      miniDots.innerHTML = "";
      
      // Creamos 7 hitos representativos (un hito por año + el especial de hoy)
      // para que quede perfectamente encajado sin salirse de los límites
      var hitosPortada = [
        { label: "2021: Zahora", year: "2021" },
        { label: "2022: Primeros curros", year: "2022" },
        { label: "2023: París & Madrid", year: "2023" },
        { label: "2024: Viajes & Halloween", year: "2024" },
        { label: "2025: Feria & Recuerdos", year: "2025" },
        { label: "2026: Nueva etapa", year: "2026" },
        { label: "Hoy ♥: PhotoBooth", year: "hoy", isHoy: true }
      ];

      hitosPortada.forEach(function (h) {
        var dot = document.createElement("div");
        dot.className = "mini-dot";
        if (h.isHoy) dot.classList.add("hoy");
        dot.setAttribute("title", h.label);
        miniDots.appendChild(dot);
      });
    }
  }

  /* ══════════════════════════════════════════════════════════════
   *  MASCOTA TAMAGOTCHI EN CANVAS (SPRITE PIXEL CON 2 FRAMES IDLE)
   * ══════════════════════════════════════════════════════════════ */
  /*
   * SPRITE FÁCILMENTE EDITABLE:
   * Matriz de 20x16 píxeles.
   * '.' = transparente
   * 'N' = #1d2b4a (delineado oscuro)
   * 'O' = #ff9ebb (rosa suave)
   * 'C' = #fffdf7 (blanco crema)
   * 'G' = #3b8cff (azul acento)
   * 'R' = #ff4b72 (rojo/rubor)
   */
  var paletaMascota = {
    ".": null,
    "N": "#1d2b4a",
    "O": "#ff9ebb",
    "C": "#fffdf7",
    "G": "#3b8cff",
    "R": "#ff6f91"
  };

  // Frame 1: Normal (ojos abiertos)
  var spriteFrame1 = [
    "....NN........NN....",
    "...NCCN......NCCN...",
    "...NCOON....NOOCN...",
    "...NCOOONNNNOOOCN...",
    "..NCOOCOOOOCOOCON...",
    "..NCOOCOOOOCOOCON...",
    ".NCOONNOOOONNOOCN...",
    ".NCOONNOOOONNOOCN...",
    ".NCOOOOOONOOOOOCN...",
    ".NCOOROOOOOORROCN...",
    "..NCOOOOOOOOOOCN....",
    "..NCOOONNNNOOOCN....",
    "...NCCCCCCCCCCN.....",
    "...NNNNN..NNNNN.....",
    "....................",
    "...................."
  ];

  // Frame 2: Parpadeo / sonrisa
  var spriteFrame2 = [
    "....NN........NN....",
    "...NCCN......NCCN...",
    "...NCOON....NOOCN...",
    "...NCOOONNNNOOOCN...",
    "..NCOOCOOOOCOOCON...",
    "..NCOOCOOOOCOOCON...",
    ".NCOO..OOOO..OOCN...",
    ".NCOONNOOOONNOOCN...",
    ".NCOOOOOONOOOOOCN...",
    ".NCOOROOOOOORROCN...",
    "..NCOOONNNNOOOCN....",
    "..NCOOON..NOOOCN....",
    "...NCCCCCCCCCCN.....",
    "...NNNNN..NNNNN.....",
    "....................",
    "...................."
  ];

  function initTamagotchi() {
    var canvas = document.getElementById("tama-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");

    // Desactivar antialiasing para píxeles perfectos
    ctx.imageSmoothingEnabled = false;

    // Animación Idle en bucle
    setInterval(function () {
      estado.tamaFrame = (estado.tamaFrame === 0) ? 1 : 0;
      dibujarTamagotchi(ctx);
    }, 850);

    // Botones físicos A, B, C debajo de la pantalla LCD
    var btnA = document.getElementById("tama-btn-a");
    var btnB = document.getElementById("tama-btn-b");
    var btnC = document.getElementById("tama-btn-c");

    if (btnA) {
      btnA.addEventListener("click", function () {
        activarAccionTama("corazon", ctx);
      });
    }
    if (btnB) {
      btnB.addEventListener("click", function () {
        activarAccionTama("rebote", ctx);
      });
    }
    if (btnC) {
      btnC.addEventListener("click", function () {
        activarAccionTama("comida", ctx);
      });
    }

    dibujarTamagotchi(ctx);
  }

  function activarAccionTama(accion, ctx) {
    estado.tamaAccion = accion;
    dibujarTamagotchi(ctx);

    if (estado.tamaTimer) clearTimeout(estado.tamaTimer);
    estado.tamaTimer = setTimeout(function () {
      estado.tamaAccion = null;
      dibujarTamagotchi(ctx);
    }, 1400);
  }

  function dibujarTamagotchi(ctx) {
    var cw = ctx.canvas.width;
    var ch = ctx.canvas.height;

    // Fondo LCD
    ctx.fillStyle = "#c7dbbf";
    ctx.fillRect(0, 0, cw, ch);

    // Grid sutil de píxeles LCD
    ctx.fillStyle = "rgba(140, 165, 131, 0.15)";
    for (var gx = 0; gx < cw; gx += 2) {
      ctx.fillRect(gx, 0, 1, ch);
    }

    // Elegir frame y posición
    var frame = (estado.tamaFrame === 0) ? spriteFrame1 : spriteFrame2;
    var offsetX = 10;
    var offsetY = (estado.tamaAccion === "rebote" && estado.tamaFrame === 1) ? 3 : 4;

    // Dibujar sprite píxel a píxel
    for (var y = 0; y < frame.length; y++) {
      var fila = frame[y];
      for (var x = 0; x < fila.length; x++) {
        var char = fila[x];
        var color = paletaMascota[char];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(offsetX + x, offsetY + y, 1, 1);
        }
      }
    }

    // Extras según acción:
    if (estado.tamaAccion === "corazon") {
      // Corazoncito pixel flotando al lado
      ctx.fillStyle = "#ff4b72";
      var hx = 31, hy = 5;
      ctx.fillRect(hx+1, hy, 1, 1); ctx.fillRect(hx+3, hy, 1, 1);
      ctx.fillRect(hx, hy+1, 5, 1);
      ctx.fillRect(hx+1, hy+2, 3, 1);
      ctx.fillRect(hx+2, hy+3, 1, 1);
    } else if (estado.tamaAccion === "comida") {
      // Galletita pixel
      ctx.fillStyle = "#1d2b4a";
      var fx = 3, fy = 14;
      ctx.fillRect(fx, fy, 4, 3);
      ctx.fillStyle = "#ff9ebb";
      ctx.fillRect(fx+1, fy+1, 2, 1);
    }
  }

  /* ══════════════════════════════════════════════════════════════
   *  LÍNEA DEL TIEMPO COMPLETA & NAVEGADOR POR AÑOS
   * ══════════════════════════════════════════════════════════════ */
  function initTimeline() {
    var datos = window.TIMELINE || [];
    var track = document.getElementById("timeline-track");
    var container = document.getElementById("timeline-container");
    if (!track || datos.length === 0) return;

    track.innerHTML = "";

    var indiceFuturo = -1;
    datos.forEach(function (h, i) {
      if (h.tipo === "futuro" && indiceFuturo === -1) indiceFuturo = i;
    });

    var lineaSolida = document.createElement("div");
    lineaSolida.className = "timeline-linea";
    track.appendChild(lineaSolida);

    var lineaFuturo = document.createElement("div");
    lineaFuturo.className = "timeline-linea-futuro";
    track.appendChild(lineaFuturo);

    datos.forEach(function (h, index) {
      var btn = document.createElement("button");
      btn.className = "hito";
      btn.setAttribute("type", "button");
      btn.setAttribute("aria-label", h.titulo + ", " + (h.fechaCorta || h.fecha));
      btn.setAttribute("data-year", h.year || "");
      btn.setAttribute("data-index", index);

      if (h.tipo === "hoy") btn.classList.add("hito-hoy");
      if (h.tipo === "futuro") btn.classList.add("hito-futuro");

      var fecha = document.createElement("span");
      fecha.className = "hito-fecha";
      fecha.textContent = h.fechaCorta || h.fecha;

      var punto = document.createElement("span");
      punto.className = "hito-punto";
      if (h.tipo === "hoy" || h.isWebcamAction) {
        punto.innerHTML = "<svg viewBox='0 0 16 16' width='12' height='12' fill='#1d2b4a'><path d='M2 3h3v2H2zm9 0h3v2h-3zM1 5h14v4H1zm1 4h12v2H2zm2 2h8v2H4zm2 2h4v2H6z'/></svg>";
      }

      var titulo = document.createElement("span");
      titulo.className = "hito-titulo";
      titulo.textContent = h.titulo;

      btn.appendChild(fecha);
      btn.appendChild(punto);
      btn.appendChild(titulo);

      if (h.isWebcamAction) {
        var camBadge = document.createElement("span");
        camBadge.className = "hito-hoy-badge";
        camBadge.textContent = "📷 ¡Foto hoy!";
        btn.appendChild(camBadge);
      } else if (h.cancion !== null && h.cancion !== undefined) {
        var mus = document.createElement("span");
        mus.style.fontSize = "11px";
        mus.style.color = "var(--linea)";
        mus.textContent = "♪";
        btn.appendChild(mus);
      }

      btn.addEventListener("click", function () {
        if (h.isWebcamAction) {
          abrirPhotoBoothWebcam(h);
        } else {
          abrirTarjetaHito(h);
        }
      });

      track.appendChild(btn);
    });

    // Conectar botones de navegación por año
    var yearBtns = document.querySelectorAll(".year-btn");
    yearBtns.forEach(function (yBtn) {
      yBtn.addEventListener("click", function () {
        yearBtns.forEach(function (b) { b.classList.remove("activo"); });
        yBtn.classList.add("activo");

        var yearSelected = yBtn.getAttribute("data-year");
        if (yearSelected === "todos") {
          container.scrollTo({ left: 0, behavior: "smooth" });
          return;
        }
        if (yearSelected === "hoy") {
          var hoyEl = track.querySelector(".hito-hoy");
          if (hoyEl) {
            container.scrollTo({ left: Math.max(0, hoyEl.offsetLeft - 100), behavior: "smooth" });
          }
          return;
        }

        // Buscar el primer hito del año seleccionado
        var targetHito = track.querySelector(".hito[data-year='" + yearSelected + "']");
        if (targetHito) {
          container.scrollTo({ left: Math.max(0, targetHito.offsetLeft - 60), behavior: "smooth" });
        }
      });
    });

    requestAnimationFrame(function () {
      ajustarLineasTimeline(track, datos, indiceFuturo);
    });

    // Drag con ratón
    var isDown = false, startX, scrollLeft;
    container.addEventListener("mousedown", function (e) {
      if (e.target.closest(".hito")) return;
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });
    window.addEventListener("mouseup", function () { isDown = false; });
    container.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - container.offsetLeft;
      var walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });

    // Flechas de teclado
    container.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        container.scrollLeft += 180;
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        container.scrollLeft -= 180;
        e.preventDefault();
      }
    });
  }

  function ajustarLineasTimeline(track, datos, indiceFuturo) {
    var hitos = track.querySelectorAll(".hito");
    if (hitos.length === 0) return;

    var primerHito = hitos[0];
    var ultimoSolido = (indiceFuturo > 0) ? hitos[indiceFuturo - 1] : hitos[hitos.length - 1];
    var ultimoHito = hitos[hitos.length - 1];

    var lineaSolida = track.querySelector(".timeline-linea");
    var lineaFuturo = track.querySelector(".timeline-linea-futuro");

    var startX = primerHito.offsetLeft + (primerHito.offsetWidth / 2);
    var endSolidoX = ultimoSolido.offsetLeft + (ultimoSolido.offsetWidth / 2);

    if (lineaSolida) {
      lineaSolida.style.left = startX + "px";
      lineaSolida.style.width = Math.max(0, endSolidoX - startX) + "px";
    }

    if (lineaFuturo) {
      if (indiceFuturo > 0 && indiceFuturo < datos.length) {
        var endTotalX = ultimoHito.offsetLeft + (ultimoHito.offsetWidth / 2) + 60;
        lineaFuturo.style.left = endSolidoX + "px";
        lineaFuturo.style.width = Math.max(0, endTotalX - endSolidoX) + "px";
        lineaFuturo.style.display = "block";
      } else {
        lineaFuturo.style.display = "none";
      }
    }
  }

  /* Tarjeta Modal de Hito Estándar */
  function abrirTarjetaHito(hito) {
    var anterior = document.querySelector(".hito-tarjeta-overlay");
    if (anterior) anterior.remove();

    var overlay = document.createElement("div");
    overlay.className = "hito-tarjeta-overlay";
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.remove();
    });

    var tarjeta = document.createElement("div");
    tarjeta.className = "hito-tarjeta";

    var btnCerrar = document.createElement("button");
    btnCerrar.className = "hito-tarjeta-cerrar";
    btnCerrar.textContent = "✕";
    btnCerrar.addEventListener("click", function () { overlay.remove(); });

    var fecha = document.createElement("div");
    fecha.style.fontSize = "13px";
    fecha.style.color = "var(--linea)";
    fecha.style.fontWeight = "bold";
    fecha.textContent = hito.fechaCorta ? (hito.fechaCorta + " (" + hito.fecha + ")") : hito.fecha;

    var titulo = document.createElement("h3");
    titulo.style.fontFamily = "var(--font-title)";
    titulo.style.fontSize = "22px";
    titulo.style.color = "var(--borde-oscuro)";
    titulo.style.margin = "4px 0 10px";
    titulo.textContent = hito.titulo;

    var fotoArea = document.createElement("div");
    if (hito.foto && hito.foto.length > 0) {
      var img = document.createElement("img");
      img.src = hito.foto;
      img.alt = hito.titulo;
      img.style.width = "100%";
      img.style.borderRadius = "8px";
      img.style.border = "2px solid var(--borde-oscuro)";
      img.onerror = function () {
        fotoArea.innerHTML = "";
        fotoArea.appendChild(crearPlaceholderFoto());
      };
      fotoArea.appendChild(img);
    } else {
      fotoArea.appendChild(crearPlaceholderFoto());
    }

    var texto = document.createElement("p");
    texto.style.fontSize = "15px";
    texto.style.lineHeight = "1.6";
    texto.textContent = hito.desc || hito.texto || "";

    tarjeta.appendChild(btnCerrar);
    tarjeta.appendChild(fecha);
    tarjeta.appendChild(titulo);
    tarjeta.appendChild(fotoArea);
    tarjeta.appendChild(texto);

    if (hito.cancion !== null && hito.cancion !== undefined) {
      var canciones = window.MUSICA || [];
      if (canciones[hito.cancion]) {
        var btnCancion = document.createElement("button");
        btnCancion.className = "btn-abrir";
        btnCancion.style.padding = "6px 14px";
        btnCancion.style.fontSize = "14px";
        btnCancion.style.marginTop = "14px";
        btnCancion.innerHTML = "<span>♪ " + canciones[hito.cancion].titulo + "</span>";
        btnCancion.addEventListener("click", function () {
          reproducir(hito.cancion);
        });
        tarjeta.appendChild(btnCancion);
      }
    }

    overlay.appendChild(tarjeta);
    document.body.appendChild(overlay);

    function onEsc(e) {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", onEsc);
      }
    }
    document.addEventListener("keydown", onEsc);
  }

  /* ══════════════════════════════════════════════════════════════
   *  PHOTOBOOTH RETRO WEBCAM (HITO: HOY)
   * ══════════════════════════════════════════════════════════════ */
  function abrirPhotoBoothWebcam(hito) {
    var anterior = document.querySelector(".hito-tarjeta-overlay");
    if (anterior) anterior.remove();

    var overlay = document.createElement("div");
    overlay.className = "hito-tarjeta-overlay";

    var modal = document.createElement("div");
    modal.className = "photobooth-modal";

    var btnCerrar = document.createElement("button");
    btnCerrar.className = "hito-tarjeta-cerrar";
    btnCerrar.textContent = "✕";

    var flash = document.createElement("div");
    flash.className = "flash-overlay";

    var titulo = document.createElement("h3");
    titulo.style.fontFamily = "var(--font-title)";
    titulo.style.fontSize = "22px";
    titulo.style.color = "var(--borde-oscuro)";
    titulo.textContent = hito.titulo;

    var desc = document.createElement("p");
    desc.style.fontSize = "14px";
    desc.style.color = "var(--texto)";
    desc.style.margin = "4px 0 10px";
    desc.textContent = hito.desc || "Una foto instantánea juntos para sellar estos 5 años.";

    var frame = document.createElement("div");
    frame.className = "photobooth-frame";

    var video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;

    var canvas = document.createElement("canvas");
    canvas.style.display = "none";

    var stamp = document.createElement("div");
    stamp.className = "stamp-date";
    var d = new Date();
    stamp.textContent = d.getFullYear() + "." + String(d.getMonth() + 1).padStart(2, '0') + "." + String(d.getDate()).padStart(2, '0');

    frame.appendChild(video);
    frame.appendChild(canvas);
    frame.appendChild(stamp);
    frame.appendChild(flash);

    var controls = document.createElement("div");
    controls.className = "photobooth-controls";

    var btnShutter = document.createElement("button");
    btnShutter.className = "btn-shutter";
    btnShutter.innerHTML = "<span>📸 Capturar Foto</span>";

    var btnRetake = document.createElement("button");
    btnRetake.className = "btn-abrir";
    btnRetake.style.fontSize = "13px";
    btnRetake.style.padding = "6px 14px";
    btnRetake.style.display = "none";
    btnRetake.innerHTML = "<span>↺ Repetir</span>";

    var btnSave = document.createElement("button");
    btnSave.className = "btn-shutter";
    btnSave.style.display = "none";
    btnSave.style.background = "var(--panel)";
    btnSave.innerHTML = "<span>♥ Guardar Recuerdo</span>";

    controls.appendChild(btnShutter);
    controls.appendChild(btnRetake);
    controls.appendChild(btnSave);

    modal.appendChild(btnCerrar);
    modal.appendChild(titulo);
    modal.appendChild(desc);
    modal.appendChild(frame);
    modal.appendChild(controls);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    var localStream = null;

    // Verificar si ya hay una foto guardada previamente en localStorage
    var fotoGuardada = localStorage.getItem("maca_foto_hoy");
    if (fotoGuardada) {
      mostrarFotoCapturada(fotoGuardada);
    } else {
      iniciarCamara();
    }

    function iniciarCamara() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
        }).then(function (stream) {
          localStream = stream;
          video.srcObject = stream;
          video.style.display = "block";
          canvas.style.display = "none";
          btnShutter.style.display = "inline-flex";
          btnRetake.style.display = "none";
          btnSave.style.display = "none";
        }).catch(function (err) {
          desc.textContent = "No se pudo acceder a la webcam (" + err.message + "). ¡Puedes subir una foto si lo prefieres!";
          mostrarFallbackSubida();
        });
      } else {
        desc.textContent = "Navegador sin soporte de cámara web directo. ¡Sube tu foto favorita!";
        mostrarFallbackSubida();
      }
    }

    function mostrarFallbackSubida() {
      btnShutter.style.display = "none";
      var fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.style.display = "none";

      var btnUpload = document.createElement("button");
      btnUpload.className = "btn-shutter";
      btnUpload.innerHTML = "<span>📁 Seleccionar foto</span>";
      btnUpload.addEventListener("click", function () { fileInput.click(); });

      fileInput.addEventListener("change", function () {
        if (fileInput.files && fileInput.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            mostrarFotoCapturada(e.target.result);
          };
          reader.readAsDataURL(fileInput.files[0]);
        }
      });

      controls.appendChild(btnUpload);
      controls.appendChild(fileInput);
    }

    btnShutter.addEventListener("click", function () {
      if (!localStream) return;

      // Disparar destello blanco
      flash.classList.remove("disparando");
      void flash.offsetWidth;
      flash.classList.add("disparando");

      setTimeout(function () {
        var vw = video.videoWidth || 640;
        var vh = video.videoHeight || 480;
        canvas.width = vw;
        canvas.height = vh;

        var ctx = canvas.getContext("2d");
        // Dibujar frame
        ctx.drawImage(video, 0, 0, vw, vh);

        // Estampar fecha retro
        ctx.fillStyle = "#ffb7c9";
        ctx.font = "bold 20px monospace";
        ctx.shadowColor = "#1d2b4a";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(stamp.textContent, vw - 160, vh - 20);

        var dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        mostrarFotoCapturada(dataUrl);
      }, 150);
    });

    function mostrarFotoCapturada(imgSrc) {
      if (localStream) {
        localStream.getTracks().forEach(function (t) { t.stop(); });
        localStream = null;
      }
      var imgPreview = new Image();
      imgPreview.src = imgSrc;
      imgPreview.onload = function () {
        canvas.width = imgPreview.width;
        canvas.height = imgPreview.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(imgPreview, 0, 0);

        video.style.display = "none";
        canvas.style.display = "block";
        btnShutter.style.display = "none";
        btnRetake.style.display = "inline-flex";
        btnSave.style.display = "inline-flex";
      };

      btnSave.onclick = function () {
        try {
          localStorage.setItem("maca_foto_hoy", imgSrc);
        } catch (e) {}
        btnSave.innerHTML = "<span>✓ ¡Guardado en nuestro rincón!</span>";
        btnSave.disabled = true;
        setTimeout(function () { cerrar(); }, 900);
      };
    }

    btnRetake.addEventListener("click", function () {
      btnSave.disabled = false;
      btnSave.innerHTML = "<span>♥ Guardar Recuerdo</span>";
      iniciarCamara();
    });

    function cerrar() {
      if (localStream) {
        localStream.getTracks().forEach(function (t) { t.stop(); });
        localStream = null;
      }
      overlay.remove();
      document.removeEventListener("keydown", onEsc);
    }

    btnCerrar.addEventListener("click", cerrar);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) cerrar();
    });

    function onEsc(e) {
      if (e.key === "Escape") cerrar();
    }
    document.addEventListener("keydown", onEsc);
  }

  function crearPlaceholderFoto() {
    var ph = document.createElement("div");
    ph.className = "foto-placeholder";
    ph.innerHTML = "<svg class='pixel-icon' style='width:32px; height:32px; fill:var(--linea);' viewBox='0 0 16 16'><path d='M3 2h10v1H3V2zm-1 2h12v1H2V4zm-1 2h14v8H1V6zm3 2v4h8V8H4z'/></svg><span style='font-size:12px;'>foto por añadir ✧</span>";
    return ph;
  }

  /* ══════════════════════════════════════════════════════════════
   *  MINI REPRODUCTOR EN SIDEBAR & REPRODUCTOR GENERAL
   * ══════════════════════════════════════════════════════════════ */
  function formatTimeDigital(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
  }

  function playChiptuneTone(freq, duration, type, volume) {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!estado.synthCtx) estado.synthCtx = new AudioCtx();
      if (estado.synthCtx.state === "suspended") {
        estado.synthCtx.resume();
      }
      var osc = estado.synthCtx.createOscillator();
      var gain = estado.synthCtx.createGain();
      osc.type = type || "square";
      osc.frequency.setValueAtTime(freq, estado.synthCtx.currentTime);
      var vol = volume || 0.15;
      gain.gain.setValueAtTime(vol, estado.synthCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, estado.synthCtx.currentTime + (duration || 0.3));
      osc.connect(gain);
      gain.connect(estado.synthCtx.destination);
      osc.start();
      osc.stop(estado.synthCtx.currentTime + (duration || 0.3));
    } catch (e) {}
  }

  function playChiptuneAnthem() {
    var melody = [
      { note: 261.63, d: 0.2 }, // Do
      { note: 329.63, d: 0.2 }, // Mi
      { note: 392.00, d: 0.2 }, // Sol
      { note: 523.25, d: 0.35 },// Do'
      { note: 440.00, d: 0.2 }, // La
      { note: 523.25, d: 0.35 },// Do'
      { note: 392.00, d: 0.4 }, // Sol
      { note: 349.23, d: 0.2 }, // Fa
      { note: 329.63, d: 0.2 }, // Mi
      { note: 293.66, d: 0.2 }, // Re
      { note: 261.63, d: 0.5 }  // Do
    ];

    var eqBars = document.querySelectorAll("#deck-eq-bars .eq-bar");
    eqBars.forEach(function (bar) { bar.classList.add("animando"); });

    var delay = 0;
    melody.forEach(function (step) {
      setTimeout(function () {
        playChiptuneTone(step.note, step.d, "square", 0.18);
      }, delay);
      delay += (step.d * 1000) + 40;
    });

    setTimeout(function () {
      if (!estado.sonando) {
        eqBars.forEach(function (bar) { bar.classList.remove("animando"); });
      }
    }, delay + 200);
  }

  function initReproductor() {
    var canciones = window.MUSICA || [];
    if (canciones.length === 0) return;

    estado.audio = new Audio();
    estado.audio.volume = 0.7;

    var btnPlay = document.getElementById("player-play");
    var btnNext = document.getElementById("player-next");
    var btnMute = document.getElementById("player-mute");
    var progress = document.getElementById("player-progress");

    // Elementos del Cassette Deck
    var deckScrubberFill = document.getElementById("deck-scrubber-fill");
    var deckTimeCurrent = document.getElementById("deck-time-current");
    var deckTimeTotal = document.getElementById("deck-time-total");
    var tapeRibbonFill = document.getElementById("tape-ribbon-fill");

    if (btnPlay) {
      btnPlay.addEventListener("click", function () {
        if (estado.sonando) {
          pausar();
        } else {
          reproducir(estado.pista);
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", function () {
        var sig = (estado.pista + 1) % canciones.length;
        reproducir(sig);
      });
    }

    if (btnMute) {
      btnMute.addEventListener("click", function () {
        toggleMute();
      });
    }

    estado.audio.addEventListener("timeupdate", function () {
      if (estado.audio.duration) {
        var pct = (estado.audio.currentTime / estado.audio.duration) * 100;
        if (progress) progress.style.width = pct + "%";
        if (deckScrubberFill) deckScrubberFill.style.width = pct + "%";
        if (deckTimeCurrent) deckTimeCurrent.textContent = formatTimeDigital(estado.audio.currentTime);
        if (deckTimeTotal) deckTimeTotal.textContent = formatTimeDigital(estado.audio.duration);
        if (tapeRibbonFill) tapeRibbonFill.style.width = (30 + pct * 0.4) + "%";
      } else {
        if (deckTimeCurrent) deckTimeCurrent.textContent = formatTimeDigital(estado.audio.currentTime);
      }
    });

    estado.audio.addEventListener("loadedmetadata", function () {
      if (deckTimeTotal && estado.audio.duration) {
        deckTimeTotal.textContent = formatTimeDigital(estado.audio.duration);
      }
    });

    estado.audio.addEventListener("ended", function () {
      if (estado.audio.loop) {
        reproducir(estado.pista);
      } else {
        var sig = (estado.pista + 1) % canciones.length;
        reproducir(sig);
      }
    });

    actualizarInfoReproductor();
  }

  function toggleMute() {
    estado.mute = !estado.mute;
    if (estado.audio) estado.audio.muted = estado.mute;
    
    var iconVol = document.getElementById("icon-vol");
    var iconMuted = document.getElementById("icon-muted");
    var deckIconVol = document.getElementById("deck-icon-vol");
    var deckIconMuted = document.getElementById("deck-icon-muted");

    if (iconVol) iconVol.style.display = estado.mute ? "none" : "block";
    if (iconMuted) iconMuted.style.display = estado.mute ? "block" : "none";
    if (deckIconVol) deckIconVol.style.display = estado.mute ? "none" : "block";
    if (deckIconMuted) deckIconMuted.style.display = estado.mute ? "block" : "none";
  }

  function reproducir(idx) {
    var canciones = window.MUSICA || [];
    if (canciones.length === 0) return;

    estado.pista = idx;
    var track = canciones[idx];
    if (estado.audio) {
      estado.audio.src = track.archivo;
      var p = estado.audio.play();
      if (p !== undefined) {
        p.catch(function () {
          // Si el archivo mp3 no existe o el navegador bloquea autoplay, se mantiene el estado visual
        });
      }
    }

    estado.sonando = true;
    actualizarInfoReproductor();
  }

  function pausar() {
    if (estado.audio) {
      estado.audio.pause();
    }
    estado.sonando = false;
    actualizarInfoReproductor();
  }

  function actualizarInfoReproductor() {
    var canciones = window.MUSICA || [];
    var track = canciones[estado.pista];
    if (!track) return;

    // Mini Player
    var tituloEl = document.getElementById("player-titulo");
    var artistaEl = document.getElementById("player-artista");
    var disc = document.getElementById("vinyl-disc");
    var iconPlay = document.getElementById("icon-play");
    var iconPause = document.getElementById("icon-pause");

    if (tituloEl) tituloEl.textContent = track.titulo;
    if (artistaEl) artistaEl.textContent = track.artista;

    if (estado.sonando) {
      if (disc) disc.classList.add("girando");
      if (iconPlay) iconPlay.style.display = "none";
      if (iconPause) iconPause.style.display = "block";
    } else {
      if (disc) disc.classList.remove("girando");
      if (iconPlay) iconPlay.style.display = "block";
      if (iconPause) iconPause.style.display = "none";
    }

    // Cassette Deck Visual
    var deckTitle = document.getElementById("deck-display-title");
    var deckArtist = document.getElementById("deck-display-artist");
    var deckSideTag = document.getElementById("cassette-side-tag");
    var spoolLeft = document.getElementById("spool-left");
    var spoolRight = document.getElementById("spool-right");
    var eqBars = document.querySelectorAll("#deck-eq-bars .eq-bar");
    var deckBadge = document.getElementById("deck-status-badge");
    var deckIconPlay = document.getElementById("deck-icon-play");
    var deckIconPause = document.getElementById("deck-icon-pause");
    var deckBtnLabel = document.getElementById("deck-btn-label-play");
    var btnDeckPlay = document.getElementById("btn-deck-play");

    if (deckTitle) deckTitle.textContent = track.titulo;
    if (deckArtist) deckArtist.textContent = track.artista;
    if (deckSideTag) deckSideTag.textContent = "CARA " + (track.lado || "A");

    if (estado.sonando) {
      if (spoolLeft) spoolLeft.classList.add("girando");
      if (spoolRight) spoolRight.classList.add("girando");
      eqBars.forEach(function (bar) { bar.classList.add("animando"); });
      if (deckBadge) {
        deckBadge.textContent = "PLAYING";
        deckBadge.classList.add("activo");
      }
      if (deckIconPlay) deckIconPlay.style.display = "none";
      if (deckIconPause) deckIconPause.style.display = "block";
      if (deckBtnLabel) deckBtnLabel.textContent = "PAUSA";
      if (btnDeckPlay) btnDeckPlay.classList.add("sonando");
    } else {
      if (spoolLeft) spoolLeft.classList.remove("girando");
      if (spoolRight) spoolRight.classList.remove("girando");
      eqBars.forEach(function (bar) { bar.classList.remove("animando"); });
      if (deckBadge) {
        deckBadge.textContent = "EN PAUSA";
        deckBadge.classList.remove("activo");
      }
      if (deckIconPlay) deckIconPlay.style.display = "block";
      if (deckIconPause) deckIconPause.style.display = "none";
      if (deckBtnLabel) deckBtnLabel.textContent = "PLAY";
      if (btnDeckPlay) btnDeckPlay.classList.remove("sonando");
    }

    // Actualizar dedicatoria al pie
    var dedTitle = document.getElementById("dedication-track-name");
    var dedText = document.getElementById("dedication-note-text");
    var dedQuote = document.getElementById("dedication-quote");
    if (dedTitle) dedTitle.textContent = track.titulo + " — " + track.artista;
    if (dedText) dedText.textContent = track.nota || "Nuestra canción especial.";
    if (dedQuote) dedQuote.textContent = track.letra || "«Bailando juntos...»";

    // Marcar fila activa en la lista de canciones
    var rows = document.querySelectorAll(".track-row-card");
    rows.forEach(function (row) {
      if (parseInt(row.getAttribute("data-index"), 10) === estado.pista) {
        row.classList.add("activa");
      } else {
        row.classList.remove("activa");
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════
   *  SECCIÓN PLAYLIST INTERACTIVA (CONTROLES, PIANO, LISTA)
   * ══════════════════════════════════════════════════════════════ */
  function initPlaylistSection() {
    var canciones = window.MUSICA || [];
    var listContainer = document.getElementById("playlist-tracks-list");
    var filtroActual = "all";

    // Renderizar lista de pistas
    function renderizarPistas(filtro) {
      if (!listContainer) return;
      listContainer.innerHTML = "";

      canciones.forEach(function (item, idx) {
        if (filtro !== "all" && item.lado !== filtro) return;

        var card = document.createElement("div");
        card.className = "track-row-card" + (idx === estado.pista ? " activa" : "");
        card.setAttribute("data-index", idx);

        card.innerHTML =
          '<div class="track-left-meta">' +
            '<span class="track-num-badge">' + (item.pistaNum || ("0" + (idx + 1))) + '</span>' +
            '<button class="track-play-trigger-btn" type="button" aria-label="Reproducir ' + item.titulo + '">' +
              '<svg class="pixel-icon" style="width:12px; height:12px;" viewBox="0 0 16 16"><path d="M4 2l10 6-10 6V2z"/></svg>' +
            '</button>' +
            '<div class="track-info-col">' +
              '<div class="track-main-title">' + item.titulo + '</div>' +
              '<div class="track-sub-details">' +
                '<span>' + item.artista + '</span>' +
                (item.etiqueta ? '<span class="track-tag-pill">' + item.etiqueta + '</span>' : '') +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="track-right-actions">' +
            '<span>' + (item.duracion || "3:00") + '</span>' +
            '<span style="color:var(--rosa);">♥</span>' +
          '</div>';

        card.addEventListener("click", function () {
          if (estado.pista === idx && estado.sonando) {
            pausar();
          } else {
            reproducir(idx);
          }
        });

        listContainer.appendChild(card);
      });
    }

    renderizarPistas("all");

    // Pestañas de filtrado (Todas, Cara A, Cara B)
    var filterBtns = document.querySelectorAll(".track-tab-btn");
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("activo"); });
        btn.classList.add("activo");
        filtroActual = btn.getAttribute("data-side");
        renderizarPistas(filtroActual);
      });
    });

    // Botones físicos del Cassette Deck
    var btnDeckPlay = document.getElementById("btn-deck-play");
    var btnDeckPrev = document.getElementById("btn-deck-prev");
    var btnDeckNext = document.getElementById("btn-deck-next");
    var btnDeckLoop = document.getElementById("btn-deck-loop");
    var btnDeckMute = document.getElementById("btn-deck-mute");
    var volSlider = document.getElementById("deck-vol-slider");

    if (btnDeckPlay) {
      btnDeckPlay.addEventListener("click", function () {
        if (estado.sonando) {
          pausar();
        } else {
          reproducir(estado.pista);
        }
      });
    }

    if (btnDeckPrev) {
      btnDeckPrev.addEventListener("click", function () {
        var ant = (estado.pista - 1 + canciones.length) % canciones.length;
        reproducir(ant);
      });
    }

    if (btnDeckNext) {
      btnDeckNext.addEventListener("click", function () {
        var sig = (estado.pista + 1) % canciones.length;
        reproducir(sig);
      });
    }

    if (btnDeckLoop) {
      btnDeckLoop.addEventListener("click", function () {
        if (estado.audio) {
          estado.audio.loop = !estado.audio.loop;
          btnDeckLoop.classList.toggle("activo", estado.audio.loop);
        }
      });
    }

    if (btnDeckMute) {
      btnDeckMute.addEventListener("click", function () {
        toggleMute();
      });
    }

    if (volSlider) {
      volSlider.addEventListener("input", function () {
        if (estado.audio) {
          estado.audio.volume = parseFloat(this.value);
        }
      });
    }

    // Scrubber con click para saltar en la canción
    var scrubber = document.getElementById("deck-scrubber");
    if (scrubber) {
      scrubber.addEventListener("click", function (e) {
        if (!estado.audio || !estado.audio.duration) return;
        var rect = scrubber.getBoundingClientRect();
        var clickX = e.clientX - rect.left;
        var pct = Math.max(0, Math.min(1, clickX / rect.width));
        estado.audio.currentTime = pct * estado.audio.duration;
      });
    }

    // Botón de sintonía Chiptune de Aniversario
    var btnAnthem = document.getElementById("btn-chiptune-anthem");
    if (btnAnthem) {
      btnAnthem.addEventListener("click", function () {
        playChiptuneAnthem();
      });
    }

    // Cargar archivo local MP3
    var fileInput = document.getElementById("input-local-song");
    if (fileInput) {
      fileInput.addEventListener("change", function (e) {
        var file = e.target.files && e.target.files[0];
        if (file) {
          var objectUrl = URL.createObjectURL(file);
          var customTrack = {
            id: "local-" + Date.now(),
            lado: "A",
            pistaNum: "★-01",
            titulo: file.name.replace(/\.[^/.]+$/, ""),
            artista: "Tu Archivo MP3",
            duracion: "--:--",
            etiqueta: "Subida por ti ♥",
            nota: "Canción añadida al momento desde tu ordenador para nuestra cita.",
            letra: "«Nuestra banda sonora personalizada al instante.»",
            archivo: objectUrl
          };
          window.MUSICA.unshift(customTrack);
          renderizarPistas(filtroActual);
          reproducir(0);
        }
      });
    }

    // Mini Pianito Chiptune 8-Bit
    var pianoKeys = document.querySelectorAll("#chiptune-piano-keys .piano-key");
    pianoKeys.forEach(function (key) {
      key.addEventListener("click", function () {
        var noteFreq = parseFloat(key.getAttribute("data-note"));
        playChiptuneTone(noteFreq, 0.35, "square", 0.18);
        key.classList.add("tocado");
        setTimeout(function () {
          key.classList.remove("tocado");
        }, 150);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
   *  SECCIÓN MAPA INTERACTIVO RETRO
   * ══════════════════════════════════════════════════════════════ */
  function initMapa() {
    var lugares = window.LUGARES_MAPA || [];
    var pinsLayer = document.getElementById("map-pins-layer");
    var mapEspana = document.getElementById("svg-map-espana");
    var mapEuropa = document.getElementById("svg-map-europa");
    var tabBtns = document.querySelectorAll(".map-tab-btn");

    if (!pinsLayer) return;

    var vistaActual = "espana";

    function renderizarPines(vista) {
      pinsLayer.innerHTML = "";
      var filtrados = lugares.filter(function (l) { return l.mapa === vista; });

      filtrados.forEach(function (lugar) {
        var btn = document.createElement("button");
        btn.className = "map-pin";
        btn.style.left = lugar.x + "%";
        btn.style.top = lugar.y + "%";
        btn.setAttribute("type", "button");
        btn.setAttribute("aria-label", lugar.nombre);

        if (lugar.tieneMensaje) {
          btn.classList.add("pin-con-mensaje");
        } else if (lugar.icono === "★") {
          btn.classList.add("pin-ciudad-base");
        } else {
          btn.classList.add("pin-paso");
        }

        var marker = document.createElement("div");
        marker.className = "pin-marker";
        marker.textContent = lugar.icono || "•";
        if (lugar.tieneMensaje) marker.classList.add("latido");

        var tooltip = document.createElement("div");
        tooltip.className = "pin-tooltip";
        tooltip.textContent = lugar.nombre + (lugar.tieneMensaje ? " ♥" : "");

        btn.appendChild(marker);
        btn.appendChild(tooltip);

        btn.addEventListener("click", function () {
          if (lugar.tieneMensaje) {
            abrirPostalViaje(lugar);
          } else {
            // Mensaje emergente sutil para lugares de paso
            mostrarAvisoPin(lugar, btn);
          }
        });

        pinsLayer.appendChild(btn);
      });
    }

    tabBtns.forEach(function (tBtn) {
      tBtn.addEventListener("click", function () {
        tabBtns.forEach(function (b) { b.classList.remove("activo"); });
        tBtn.classList.add("activo");

        vistaActual = tBtn.getAttribute("data-mapa");
        if (vistaActual === "espana") {
          if (mapEspana) mapEspana.style.display = "block";
          if (mapEuropa) mapEuropa.style.display = "none";
        } else {
          if (mapEspana) mapEspana.style.display = "none";
          if (mapEuropa) mapEuropa.style.display = "block";
        }
        renderizarPines(vistaActual);
      });
    });

    renderizarPines("espana");
  }

  function mostrarAvisoPin(lugar, btnEl) {
    var tooltip = btnEl.querySelector(".pin-tooltip");
    if (!tooltip) return;
    var original = tooltip.textContent;
    tooltip.textContent = "✓ ¡Estuvimos juntos aquí!";
    tooltip.style.opacity = "1";
    setTimeout(function () {
      tooltip.textContent = original;
      tooltip.style.opacity = "";
    }, 1500);
  }

  function abrirPostalViaje(lugar) {
    var anterior = document.querySelector(".hito-tarjeta-overlay");
    if (anterior) anterior.remove();

    var overlay = document.createElement("div");
    overlay.className = "hito-tarjeta-overlay";
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.remove();
    });

    var postal = document.createElement("div");
    postal.className = "postcard-modal";

    var btnCerrar = document.createElement("button");
    btnCerrar.className = "hito-tarjeta-cerrar";
    btnCerrar.textContent = "✕";
    btnCerrar.addEventListener("click", function () { overlay.remove(); });

    // Sello postal retro
    var stamp = document.createElement("div");
    stamp.className = "postcard-stamp";
    stamp.innerHTML = "<span style='font-size:14px; color:var(--rosa);'>♥</span><span>5 AÑOS</span>";

    // Matasellos
    var postmark = document.createElement("div");
    postmark.className = "postcard-postmark";
    postmark.innerHTML = "<span>VIAJE</span>";

    var loc = document.createElement("h3");
    loc.className = "postcard-location";
    loc.textContent = lugar.nombre;

    var date = document.createElement("div");
    date.className = "postcard-date";
    date.textContent = lugar.fecha + " ✧ " + lugar.titulo;

    var body = document.createElement("div");
    body.className = "postcard-body";
    body.textContent = lugar.desc;

    postal.appendChild(btnCerrar);
    postal.appendChild(stamp);
    postal.appendChild(postmark);
    postal.appendChild(loc);
    postal.appendChild(date);
    postal.appendChild(body);

    overlay.appendChild(postal);
    document.body.appendChild(overlay);

    function onEsc(e) {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", onEsc);
      }
    }
    document.addEventListener("keydown", onEsc);
  }

  /* ══════════════════════════════════════════════════════════════
   *  SECCIÓN DIBUJO Y GARABATOS INTERACTIVOS RETRO
   * ══════════════════════════════════════════════════════════════ */
  function initDibujo() {
    var canvas = document.getElementById("paint-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");

    var estadoDibujo = {
      dibujando: false,
      modo: "brush", // "brush", "eraser", "stamp"
      color: "#1d2b4a",
      grosor: 6,
      selloActual: "heart",
      ultimoX: 0,
      ultimoY: 0
    };

    // Ajustar resolución interna nítida
    canvas.width = 760;
    canvas.height = 460;

    // Cargar dibujo previo o dibujar bienvenida
    var dibujoGuardado = localStorage.getItem("maca_dibujo_guardado");
    if (dibujoGuardado) {
      cargarImagenEnCanvas(dibujoGuardado);
    } else {
      dibujarLienzoInicial(ctx);
    }

    function dibujarLienzoInicial(c) {
      c.clearRect(0, 0, canvas.width, canvas.height);
      // Mensaje tierno de dedicatoria inicial
      c.fillStyle = "#ff9ebb";
      c.font = "bold 26px 'Pixelify Sans', cursive, sans-serif";
      c.textAlign = "center";
      c.fillText("¡Dibuja algo bonito aquí! ♥", canvas.width / 2, 190);

      c.fillStyle = "#3b8cff";
      c.font = "16px 'DotGothic16', monospace";
      c.fillText("Usa los colores, la goma o los sellos de arriba", canvas.width / 2, 230);
      c.fillText("y pulsa 'Guardar ♥' para dejarlo en nuestro rincón", canvas.width / 2, 260);

      // Pequeño corazón pixel dibujado en el centro
      c.fillStyle = "#ff4b72";
      var hx = canvas.width / 2 - 12, hy = 110;
      c.fillRect(hx+4, hy, 6, 4); c.fillRect(hx+14, hy, 6, 4);
      c.fillRect(hx+2, hy+4, 20, 6);
      c.fillRect(hx+4, hy+10, 16, 4);
      c.fillRect(hx+7, hy+14, 10, 4);
      c.fillRect(hx+10, hy+18, 4, 4);
    }

    function cargarImagenEnCanvas(dataUrl) {
      var img = new Image();
      img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = dataUrl;
    }

    function obtenerPosicion(e) {
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      var clientX = e.clientX;
      var clientY = e.clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    function empezarTrazo(e) {
      var pos = obtenerPosicion(e);

      if (estadoDibujo.modo === "stamp") {
        estamparSello(pos.x, pos.y);
        return;
      }

      estadoDibujo.dibujando = true;
      estadoDibujo.ultimoX = pos.x;
      estadoDibujo.ultimoY = pos.y;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, estadoDibujo.grosor / 2, 0, Math.PI * 2);
      ctx.fillStyle = (estadoDibujo.modo === "eraser") ? "#fffdf7" : estadoDibujo.color;
      if (estadoDibujo.modo === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
      }
      ctx.fill();
    }

    function trazar(e) {
      if (!estadoDibujo.dibujando) return;
      e.preventDefault();
      var pos = obtenerPosicion(e);

      ctx.beginPath();
      ctx.moveTo(estadoDibujo.ultimoX, estadoDibujo.ultimoY);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = (estadoDibujo.modo === "eraser") ? "#fffdf7" : estadoDibujo.color;
      ctx.lineWidth = estadoDibujo.grosor;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (estadoDibujo.modo === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
      }
      ctx.stroke();

      estadoDibujo.ultimoX = pos.x;
      estadoDibujo.ultimoY = pos.y;
    }

    function terminarTrazo() {
      estadoDibujo.dibujando = false;
    }

    function estamparSello(x, y) {
      ctx.globalCompositeOperation = "source-over";
      var s = estadoDibujo.selloActual;

      if (s === "heart") {
        ctx.fillStyle = estadoDibujo.color === "#fffdf7" ? "#ff4b72" : estadoDibujo.color;
        var hx = x - 12, hy = y - 12;
        ctx.fillRect(hx+4, hy, 6, 4); ctx.fillRect(hx+14, hy, 6, 4);
        ctx.fillRect(hx+2, hy+4, 20, 6);
        ctx.fillRect(hx+4, hy+10, 16, 4);
        ctx.fillRect(hx+7, hy+14, 10, 4);
        ctx.fillRect(hx+10, hy+18, 4, 4);
      } else if (s === "star") {
        ctx.fillStyle = estadoDibujo.color;
        ctx.fillRect(x - 2, y - 14, 4, 28);
        ctx.fillRect(x - 14, y - 2, 28, 4);
        ctx.fillRect(x - 6, y - 6, 12, 12);
      } else if (s === "cat") {
        ctx.font = "28px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🐱", x, y);
      } else if (s === "flower") {
        ctx.font = "28px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✿", x, y);
      }
    }

    // Eventos de puntero unificados (ratón, pantalla táctil y stylus)
    canvas.addEventListener("pointerdown", empezarTrazo);
    window.addEventListener("pointermove", trazar);
    window.addEventListener("pointerup", terminarTrazo);

    // Controles de herramientas
    var toolBrush = document.getElementById("tool-brush");
    var toolEraser = document.getElementById("tool-eraser");
    var statusMsg = document.getElementById("draw-status-msg");

    if (toolBrush) {
      toolBrush.addEventListener("click", function () {
        estadoDibujo.modo = "brush";
        toolBrush.classList.add("activo");
        if (toolEraser) toolEraser.classList.remove("activo");
        document.querySelectorAll(".btn-stamp-tool").forEach(function (b) { b.classList.remove("activo"); });
        if (statusMsg) statusMsg.textContent = "Pincel activo";
      });
    }

    if (toolEraser) {
      toolEraser.addEventListener("click", function () {
        estadoDibujo.modo = "eraser";
        toolEraser.classList.add("activo");
        if (toolBrush) toolBrush.classList.remove("activo");
        document.querySelectorAll(".btn-stamp-tool").forEach(function (b) { b.classList.remove("activo"); });
        if (statusMsg) statusMsg.textContent = "Goma de borrar activa";
      });
    }

    // Grosores
    document.querySelectorAll(".btn-stroke-size").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".btn-stroke-size").forEach(function (b) { b.classList.remove("activo"); });
        btn.classList.add("activo");
        estadoDibujo.grosor = parseInt(btn.getAttribute("data-size"), 10) || 6;
      });
    });

    // Colores
    document.querySelectorAll(".color-swatch").forEach(function (swatch) {
      swatch.addEventListener("click", function () {
        document.querySelectorAll(".color-swatch").forEach(function (s) { s.classList.remove("activo"); });
        swatch.classList.add("activo");
        estadoDibujo.color = swatch.getAttribute("data-color");
        if (estadoDibujo.modo === "eraser") {
          toolBrush.click();
        }
      });
    });

    // Sellos
    document.querySelectorAll(".btn-stamp-tool").forEach(function (stampBtn) {
      stampBtn.addEventListener("click", function () {
        document.querySelectorAll(".btn-stamp-tool").forEach(function (b) { b.classList.remove("activo"); });
        stampBtn.classList.add("activo");
        if (toolBrush) toolBrush.classList.remove("activo");
        if (toolEraser) toolEraser.classList.remove("activo");

        estadoDibujo.modo = "stamp";
        estadoDibujo.selloActual = stampBtn.getAttribute("data-stamp");
        if (statusMsg) statusMsg.textContent = "Sello listo: haz clic en el lienzo";
      });
    });

    // Botón Limpiar
    var btnClear = document.getElementById("btn-draw-clear");
    if (btnClear) {
      btnClear.addEventListener("click", function () {
        if (confirm("¿Quieres limpiar todo el lienzo para empezar de nuevo?")) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          localStorage.removeItem("maca_dibujo_guardado");
          if (statusMsg) statusMsg.textContent = "Lienzo limpio";
        }
      });
    }

    // Botón Guardar
    var btnSave = document.getElementById("btn-draw-save");
    var toast = document.getElementById("draw-saved-toast");
    if (btnSave) {
      btnSave.addEventListener("click", function () {
        try {
          var dataUrl = canvas.toDataURL("image/png");
          localStorage.setItem("maca_dibujo_guardado", dataUrl);
          if (toast) {
            toast.classList.add("visible");
            setTimeout(function () { toast.classList.remove("visible"); }, 1800);
          }
          if (statusMsg) statusMsg.textContent = "✓ ¡Guardado en la web!";
        } catch (err) {
          alert("No se pudo guardar: " + err.message);
        }
      });
    }

    // Botón Descargar PNG
    var btnDownload = document.getElementById("btn-draw-download");
    if (btnDownload) {
      btnDownload.addEventListener("click", function () {
        // Creamos un canvas temporal con fondo blanco/crema para la descarga
        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        var tempCtx = tempCanvas.getContext("2d");

        // Fondo crema de papel
        tempCtx.fillStyle = "#fffdf7";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        // Dibujo
        tempCtx.drawImage(canvas, 0, 0);

        // Estampar firma de aniversario
        tempCtx.fillStyle = "#ff9ebb";
        tempCtx.font = "bold 14px monospace";
        tempCtx.textAlign = "right";
        tempCtx.fillText("5 años juntos ♥", tempCanvas.width - 20, tempCanvas.height - 18);

        var link = document.createElement("a");
        link.download = "nuestro-dibujo-5-anos.png";
        link.href = tempCanvas.toDataURL("image/png");
        link.click();
      });
    }
  }

  /* ══════════════════════════════════════════════════════════════
   *  INICIALIZACIÓN GENERAL
   * ══════════════════════════════════════════════════════════════ */
  function init() {
    initEntrada();
    initNav();
    initInicio();
    initTamagotchi();
    initTimeline();
    initMapa();
    initDibujo();
    initReproductor();
    initPlaylistSection();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
