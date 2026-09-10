# Informe de Auditoría de Accesibilidad (WCAG 2.2 AA), UX y Diseño Responsive

**Proyecto:** Página Web Informativa - Cristiano Ronaldo (CR7)  
**Archivos evaluados:** `index.html`, `styles.css`, `script.js` (ubicados en `paginaCristianoRonaldo/`)  
**Tipo de auditoría:** No destructiva (inspección estática, semántica, contraste y análisis de flujo en ejecución)  
**Fecha:** 7 de septiembre de 2026  
**Estándares de referencia:** Web Content Accessibility Guidelines (WCAG) 2.2 nivel AA, principios de usabilidad UX (Nielsen/Norman) y estándares de diseño responsivo multidispositivo (320px, 390px, 768px y escritorio >= 1200px).

---

## 1. Resumen Ejecutivo

La página presenta una base técnica visualmente cuidada, con una estética moderna de temática deportiva, excelente contraste cromático en su paleta base, una correcta delimitación de landmarks HTML5 (`header`, `nav`, `main`, `footer`), un indicador de foco visible ejemplar mediante `:focus-visible` y una adecuada distinción semántica fundamental entre enlaces (`<a>`) y botones interactivos (`<button>`).

No obstante, la auditoría exhaustiva ha identificado incumplimientos normativos de nivel A y AA de las WCAG 2.2, fallos funcionales en JavaScript y limitaciones de experiencia de usuario en dispositivos móviles y preferencias de accesibilidad.

### Métricas Generales de la Auditoría

| Nivel de Severidad | Cantidad de Hallazgos | Descripción del Impacto |
| :--- | :---: | :--- |
| 🔴 **Crítico** | **3** | Barreras insalvables para tecnologías asistivas o fallos funcionales evidentes en el código. |
| 🟠 **Alto** | **5** | Incumplimientos severos de WCAG 2.2 AA y degradación de usabilidad móvil. |
| 🟡 **Medio** | **6** | Problemas de rendimiento, áreas táctiles subóptimas y pérdida de robustez. |
| 🟢 **Bajo** | **5** | Oportunidades de mejora cosmética, semántica secundaria y resiliencia. |
| **Total de Hallazgos** | **19** | — |
| **Criterios Cumplidos** | **11** | Aspectos que satisfacen plenamente las directrices y buenas prácticas. |

### Criterios que SÍ Cumplen (Aspectos Positivos Destacados)

1. **Contraste de color de texto (WCAG 1.4.3 AA / AAA):** La paleta (`#d4af37` dorado, `#ffffff` blanco, `#e0e0e0` gris claro sobre fondos oscuros `#0a0a0a`, `#111111`, `#1a1a1a`) supera ampliamente el ratio de 4.5:1 exigido para texto normal, alcanzando valores entre 6.11:1 y 19.80:1. El texto oscuro sobre el botón dorado (`#0a0a0a` sobre `#d4af37`) alcanza 9.42:1.
2. **Foco visible de alta visibilidad (WCAG 2.4.7 AA y 2.4.13 AAA):** Regla explícita `a:focus-visible, button:focus-visible` con contorno de 3px dorado (`#d4af37`) y separación de 3px (`outline-offset: 3px`).
3. **Foco no tapado por cabecera fija (WCAG 2.2 SC 2.4.11 AA):** Declaración de `scroll-padding-top: 70px;` en el elemento `html`, lo cual evita que al navegar a anclas o tabular por teclado los elementos queden ocultos detrás del menú adhesivo (`position: sticky;`).
4. **Uso semántico correcto de botones vs. enlaces:** Los elementos de navegación a secciones y externos son estrictamente `<a>`, mientras que los desencadenantes de acción (abrir menú móvil, filtros de línea de tiempo, miniaturas de la galería que abren modal y botón de cerrar modal) son legítimamente elementos `<button>`.
5. **Textos alternativos en imágenes (WCAG 1.1.1 A):** Todas las etiquetas `<img>` de la galería poseen un atributo `alt` descriptivo y contextualizado, evitando textos vacíos o redundantes como "imagen de".
6. **Estados en botones de filtro (WCAG 4.1.2 A):** Uso adecuado de `aria-pressed="true"` y `aria-pressed="false"`, sincronizado con la interacción en JavaScript.
7. **Configuración inicial del diálogo modal (WCAG 4.1.2 A):** Contenedor `#modalOverlay` cuenta con `role="dialog"`, `aria-modal="true"` y `aria-label="Visor de imagen ampliada"`.
8. **Restauración de foco al cerrar modal (WCAG 2.4.3 A):** `script.js` almacena `lastFocusedElement` y devuelve el foco al botón de la miniatura al cerrarse el modal.
9. **Cierre con tecla Escape:** El modal de la galería se cierra limpiamente al pulsar la tecla `Escape`.
10. **Seguridad en enlaces externos:** Todos los enlaces a redes con `target="_blank"` implementan `rel="noopener noreferrer"`.
11. **Sintaxis y estructura del código:** Cero errores de sintaxis JavaScript (`node -c` validado), cero etiquetas HTML sin cerrar y cero duplicidades en atributos `id`.

---

## 2. Clasificación de Hallazgos

### 🔴 Hallazgos Críticos
- **[C1] Violación de WCAG 2.5.3 (Label in Name - Nivel A):** Nombre accesible no coincide ni contiene el texto visible en los botones de la galería.
- **[C2] Error funcional de JavaScript en scroll espía:** El enlace "Contacto" nunca recibe la clase `active` porque el footer no está incluido en la consulta DOM.
- **[C3] Falta de mecanismo para saltar bloques / Skip Link (WCAG 2.4.1 - Nivel A):** No existe enlace para saltar la navegación hacia el contenido principal.

### 🟠 Hallazgos Altos
- **[A1] Menú móvil sin actualización de nombre accesible (`aria-label`) y sin cierre por teclado (Escape) (WCAG 4.1.2, 2.1.1):** Mantiene `aria-label="Abrir menú"` cuando está abierto y carece de `aria-controls`.
- **[A2] Falta de aislamiento del fondo al abrir el modal (`inert` / `aria-hidden`) (WCAG 1.3.1, 2.4.3):** Usuarios de lectores de pantalla pueden salir del modal hacia el contenido de fondo mediante navegación táctil o cursor virtual.
- **[A3] Desbordamiento y bloqueo vertical del menú móvil en orientación horizontal (Landscape):** El menú desplegable no tiene `max-height` ni `overflow-y: auto`, perdiéndose enlaces en pantallas apaisadas.
- **[A4] Ausencia total de soporte para `prefers-reduced-motion` (WCAG 2.2.2, 2.3.3):** Las animaciones continuas de scroll, transiciones de entrada y contadores numéricos no pueden ser desactivadas por usuarios sensibles al movimiento.
- **[A5] Secciones completamente invisibles al imprimir la página (`@media print`):** La inicialización de la clase `.fade-in` (`opacity: 0`) en JS provoca que la impresión en papel o PDF genere documentos en blanco.

### 🟡 Hallazgos Medios
- **[M1] Fuga de escuchador de eventos y reflow sincrónico (Layout Thrashing) en scroll:** `animateStats` sigue ejecutándose en cada pixel de scroll indefinidamente tras haber terminado la animación, y `updateActiveNav` fuerza lectura de `offsetTop` en cada frame.
- **[M2] Objetivo táctil insuficiente en enlaces del pie de página (WCAG 2.2 SC 2.5.8 - Nivel AA):** Los enlaces del pie son inline con una altura efectiva de ~16px y separación insuficiente (<24px).
- **[M3] Pérdida excesiva de ancho útil y riesgo de corte a 320px en la línea de tiempo:** Padding combinado de 126px deja solo 194px para el contenido; la insignia de años de 30 caracteres distorsiona el diseño.
- **[M4] Pérdida de contraste del botón de cierre del modal sobre imágenes claras (WCAG 1.4.3 / 1.4.11):** El botón blanco sin fondo ni sombra pierde visibilidad frente a fondos luminosos.
- **[M5] Emoticonos decorativos no silenciados para lectores de pantalla (WCAG 1.1.1):** Iconos de estadísticas (ej. 💰, ⚽) se anuncian textualmente generando ruido auditivo.
- **[M6] Enlaces a redes externas sin advertencia de apertura en nueva ventana (WCAG 3.2.5 / G201):** Ausencia de aviso audible o visual de que se abrirá una nueva pestaña.

### 🟢 Hallazgos Bajos
- **[B1] Salto jerárquico de encabezados en el pie de página (WCAG 1.3.1):** Se utilizan `<h3>` directamente en el `footer` sin un `<h2>` de nivel superior en la estructura.
- **[B2] Cuadrícula asimétrica en estadísticas de escritorio (UX Layout):** 7 tarjetas en una cuadrícula de 4 columnas dejan un espacio vacío en la fila inferior.
- **[B3] Ausencia de atributos `width` y `height` en etiquetas `<img>`:** Posible desplazamiento de diseño acumulado (CLS) si fallan los contenedores de ratio.
- **[B4] Dependencia de imágenes externas de CDN sin gestión de error visual (Fallback UI):** Si falla la red o el CDN bloquea el hotlinking, no hay mensaje ni interfaz de degradación elegante.
- **[B5] Uso de `overflow-x: hidden` en `body` como supresor de scroll horizontal:** Enmascara desbordamientos e impide el desplazamiento horizontal cuando se amplía el texto al 200% o 400% (WCAG 1.4.4 / 1.4.10).

---

## 3. Evidencia Concreta y Justificación en Código

### 🔴 Hallazgo C1: Violación de WCAG 2.5.3 (Label in Name - Nivel A)
- **Archivo:** `paginaCristianoRonaldo/index.html` (Líneas 225-248).
- **Elemento afectado:** Los 6 botones `<button class="gallery-item">`.
- **Código actual:**
  ```html
  <!-- Ejemplo miniatura 1 -->
  <button class="gallery-item" aria-label="Ver imagen: CR7 celebrando un gol con la camiseta del Real Madrid" ...>
    <img ...>
    <div class="gallery-caption">Gol celebración - Real Madrid</div>
  </button>

  <!-- Ejemplo miniatura 3 -->
  <button class="gallery-item" aria-label="Ver imagen: CR7 en su etapa en el Manchester United" ...>
    <img ...>
    <div class="gallery-caption">Regreso a Manchester United</div>
  </button>
  ```
- **Evidencia técnica:** WCAG 2.5.3 exige que cuando un componente tiene un texto visual (en este caso el caption visible al hacer hover/focus), el nombre accesible (`aria-label`) debe contener ese texto exactamente o comenzar con él. Aquí el texto visible "Gol celebración - Real Madrid" no coincide con "Ver imagen: CR7 celebrando un gol...".
- **Impacto:** Los usuarios de navegación por voz (como Dragon NaturallySpeaking o control por voz de iOS/macOS) dicen "Hacer clic en Gol celebración" o "Click Regreso a Manchester United" y la orden falla por completo porque el motor busca el nombre accesible asignado por el `aria-label`.

---

### 🔴 Hallazgo C2: Bug Funcional de JavaScript en Scroll Activo
- **Archivos:** `paginaCristianoRonaldo/index.html` (Líneas 33 y 262) y `paginaCristianoRonaldo/script.js` (Líneas 39-59).
- **Elemento afectado:** Selector de secciones y enlace de navegación `#contacto`.
- **Código actual:**
  ```html
  <!-- index.html -->
  <li><a href="#contacto">Contacto</a></li>
  ...
  <footer class="footer" id="contacto">
  ```
  ```javascript
  // script.js - Línea 39
  const sections = document.querySelectorAll('.section, .hero');
  ```
- **Evidencia técnica:** El selector solo busca elementos con clase `.section` y `.hero`. La sección de contacto tiene clase `.footer` (`<footer class="footer" id="contacto">`). En consecuencia, el elemento `id="contacto"` nunca forma parte del array `sections` que itera `updateActiveNav()`.
- **Impacto:** Al desplazarse al final de la página (pie de página / contacto), el enlace "Contacto" jamás se ilumina como activo en el menú de navegación, rompiendo la retroalimentación visual esperada en la barra adhesiva.

---

### 🔴 Hallazgo C3: Ausencia de Mecanismo de Salto de Bloques (WCAG 2.4.1 - Nivel A)
- **Archivo:** `paginaCristianoRonaldo/index.html` (Líneas 10-23).
- **Elemento afectado:** Inicio del `<body>` antes del `<nav>`.
- **Evidencia técnica:** No existe un enlace `<a href="#biografia" class="skip-link">Saltar al contenido</a>`.
- **Impacto:** Cualquier usuario que navegue exclusivamente con teclado o pulsador debe presionar la tecla Tab obligatoriamente por el botón principal del hero y los 6 enlaces de la barra de navegación antes de alcanzar el primer párrafo del contenido biográfico en cada recarga o navegación.

---

### 🟠 Hallazgo A1: Inconsistencias de Accesibilidad en el Menú Móvil
- **Archivos:** `paginaCristianoRonaldo/index.html` (Líneas 24-26) y `paginaCristianoRonaldo/script.js` (Líneas 7-21).
- **Elemento afectado:** Botón `#navToggle` y lista `#navLinks`.
- **Código actual:**
  ```javascript
  // script.js
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
  });
  ```
- **Evidencia técnica:**
  1. El botón tiene `aria-label="Abrir menú"`. Cuando el menú se abre (`aria-expanded="true"`), el `aria-label` sigue siendo "Abrir menú", lo cual produce un anuncio contradictorio en lectores de pantalla: *"Abrir menú, expandido, botón"*.
  2. Falta la propiedad `aria-controls="navLinks"` que relaciona formalmente el botón con la lista que controla.
  3. No hay un detector del evento `keydown` para la tecla `Escape`. Si el usuario abre el menú en pantalla táctil con teclado bluetooth o lector de pantalla, no puede cerrarlo mediante `Escape`.
  4. Tampoco existe evento para cerrar el menú si se hace clic fuera del mismo.

---

### 🟠 Hallazgo A2: Falta de Atributo `inert` o Silenciado del Fondo en Diálogo Modal
- **Archivos:** `paginaCristianoRonaldo/index.html` (Línea 254) y `paginaCristianoRonaldo/script.js` (Líneas 157-190).
- **Elemento afectado:** `#modalOverlay` y contenedores hermanos (`header`, `nav`, `main`, `footer`).
- **Evidencia técnica:** En `script.js`, al abrir el modal se añade la clase `.active` y se atrapa el tabulador mediante `keydown`. Sin embargo, los elementos de fondo (`header`, `nav`, `main`, `footer`) no reciben el atributo `inert` ni `aria-hidden="true"`.
- **Impacto:** Los usuarios de lectores de pantalla que navegan con gestos táctiles (VoiceOver deslizando el dedo o TalkBack) o comandos de lectura continua por flechas salen del diálogo hacia el DOM de fondo, interactuando con elementos que deberían estar inhabilitados.

---

### 🟠 Hallazgo A3: Bloqueo del Menú Móvil en Dispositivos Apaisados (Landscape)
- **Archivo:** `paginaCristianoRonaldo/styles.css` (Líneas 747-757).
- **Elemento afectado:** Regla `.nav-links` dentro de `@media (max-width: 768px)`.
- **Código actual:**
  ```css
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--color-dark-alt);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding: 10px 0;
  }
  ```
- **Evidencia técnica:** La lista `.nav-links` contiene 6 enlaces de ~50px de altura cada uno (altura total requerida > 300px + 50px de navbar = 350px). Al estar posicionada de manera absoluta bajo un menú `position: sticky;`, si el usuario gira su teléfono a horizontal (ej. 320px o 360px de altura de ventana), el menú sobrepasa la parte inferior de la pantalla y no se puede desplazar (falta `max-height: calc(100vh - 60px); overflow-y: auto;`).

---

### 🟠 Hallazgo A4: Ausencia de Soporte para Reducción de Movimiento (`prefers-reduced-motion`)
- **Archivos:** `paginaCristianoRonaldo/styles.css` (Líneas 31, 99, 407, 705) y `paginaCristianoRonaldo/script.js` (Líneas 103-142).
- **Elemento afectado:** Regla global `html`, animaciones CSS y contador en JS.
- **Evidencia técnica:**
  1. `styles.css` define `scroll-behavior: smooth;` y animaciones `@keyframes fadeInUp`, `.fade-in`, y transiciones continuas sin ninguna consulta `@media (prefers-reduced-motion: reduce)`.
  2. `script.js` ejecuta un bucle continuo de 2000ms mediante `requestAnimationFrame` que recalcula los números de estadísticas sin consultar `window.matchMedia('(prefers-reduced-motion: reduce)')`.
- **Impacto:** Los usuarios diagnosticados con trastornos vestibulares o cinetosis sufren mareos al interactuar con saltos de ancla y cambios abruptos de desplazamiento.

---

### 🟠 Hallazgo A5: Páginas en Blanco al Imprimir (`@media print`)
- **Archivos:** `paginaCristianoRonaldo/styles.css` (Línea 704) y `paginaCristianoRonaldo/script.js` (Líneas 217-222).
- **Elemento afectado:** `.bio-grid`, `.stat-card`, `.timeline-content`, `.gallery-item`, `.footer-col`.
- **Código actual:**
  ```javascript
  fadeElements.forEach(el => el.classList.add('fade-in'));
  ```
  ```css
  .fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  ```
- **Evidencia técnica:** El script inyecta la clase `.fade-in` a todas las secciones clave para animarlas al hacer scroll. Al no existir una regla `@media print { .fade-in { opacity: 1 !important; transform: none !important; } }`, cualquier elemento que no haya alcanzado el centro de la pantalla permanece con `opacity: 0` al abrir el cuadro de diálogo de impresión del navegador.

---

### 🟡 Hallazgo M1: Fuga de Escuchador de Eventos en Scroll y Falta de Throttle
- **Archivo:** `paginaCristianoRonaldo/script.js` (Líneas 39-63 y 103-147).
- **Elemento afectado:** Eventos de scroll vinculados a `updateActiveNav` y `animateStats`.
- **Evidencia técnica:**
  1. `animateStats()` comprueba `if (statsAnimated) return;`, pero **nunca desvincula el escuchador** con `window.removeEventListener('scroll', animateStats);`. El evento sigue disparándose cientos de veces por segundo en cada scroll.
  2. `updateActiveNav` consulta `section.offsetTop` y `section.offsetHeight` dentro de un bucle `forEach` en cada pixel de desplazamiento sin `requestAnimationFrame` ni retardo (throttle), provocando *layout thrashing*.
  3. Ninguno de los 3 eventos `scroll` incluye `{ passive: true }`.

---

### 🟡 Hallazgo M2: Dimensiones de Objetivo Táctil Subóptimas en Enlaces del Footer
- **Archivo:** `paginaCristianoRonaldo/styles.css` (Líneas 663-671).
- **Elemento afectado:** `.footer-col ul a`.
- **Código actual:**
  ```css
  .footer-col ul li {
    margin-bottom: 10px;
  }
  .footer-col ul a {
    color: var(--color-text-muted);
    font-size: 0.95rem;
    transition: color var(--transition), padding-left var(--transition);
  }
  ```
- **Evidencia técnica:** Las etiquetas `<a>` son por defecto elementos en línea (`display: inline`). La altura efectiva de pulsación táctil es únicamente la altura de la fuente (~16px) y no disponen de padding vertical.
- **Impacto:** WCAG 2.2 SC 2.5.8 (Target Size Minimum) exige un mínimo de 24x24px para evitar pulsaciones accidentales en pantallas táctiles.

---

### 🟡 Hallazgo M3: Densidad Excesiva y Riesgo de Desbordamiento en 320px en Trayectoria
- **Archivo:** `paginaCristianoRonaldo/styles.css` (Líneas 70, 775, 438, 451).
- **Elemento afectado:** Contenedor `.timeline-content` y etiqueta `.timeline-year`.
- **Evidencia técnica:**
  - Ancho de viewport: 320px.
  - Padding lateral de `.container`: `20px + 20px = 40px` (quedan 280px).
  - Padding izquierdo de `.timeline`: `30px` (quedan 250px).
  - Padding lateral de `.timeline-content`: `28px + 28px = 56px` (quedan **194px** útiles).
  - El texto de la insignia de Balones de Oro: `"2008, 2013, 2014, 2016, 2017"` mide más de 200px con sus 14px de padding interno.
- **Impacto:** En 320px el texto de la insignia se corta o se fuerza en dos líneas rompiendo la forma de píldora redondeada (`border-radius: 20px`). El 39.4% de la pantalla son solo márgenes y rellenos.

---

### 🟡 Hallazgo M4: Botón de Cierre del Modal Inseguro en Contraste
- **Archivo:** `paginaCristianoRonaldo/styles.css` (Líneas 598-617).
- **Elemento afectado:** `.modal-close`.
- **Código actual:**
  ```css
  .modal-close {
    position: absolute;
    top: 24px;
    right: 30px;
    background: none;
    border: none;
    color: var(--color-white);
    font-size: 3rem;
  ...
  ```
- **Evidencia técnica:** El glifo `×` es de color blanco puro (`#ffffff`) sobre fondo transparente (`background: none`) y carece de sombra tipográfica.
- **Impacto:** En dispositivos móviles, la imagen modal ocupa hasta el 90% del ancho y 85% del alto. Si la fotografía cargada contiene zonas blancas o muy claras en la esquina superior derecha (por ejemplo, el cielo o focos de estadio), el botón de cierre se vuelve invisible para el usuario.

---

### 🟡 Hallazgo M5: Emoticonos Decorativos Leídos Literalmente por Lectores de Pantalla
- **Archivo:** `paginaCristianoRonaldo/index.html` (Líneas 181, 186, 191, 196, 201, 206, 211).
- **Elemento afectado:** `.stat-icon`.
- **Código actual:**
  ```html
  <div class="stat-icon">&#9917;</div>
  <div class="stat-icon">&#128176;</div>
  ```
- **Evidencia técnica:** Los emojis Unicode carecen del atributo `aria-hidden="true"`.
- **Impacto:** Los sintetizadores de voz anuncian literalmente: *"Bolsa de dinero, sesenta más, Hat-tricks en carrera"*, *"Pelota de fútbol, novecientos más, Goles en carrera"*. La bolsa de dinero para indicar hat-tricks resulta confusa y genera ruido cognitivo innecesario.

---

### 🟡 Hallazgo M6: Enlaces Externos sin Notificación de Destino
- **Archivo:** `paginaCristianoRonaldo/index.html` (Líneas 282-285).
- **Elemento afectado:** Enlaces a Instagram, X, Facebook y YouTube.
- **Evidencia técnica:** Tienen `target="_blank"` pero no incluyen un texto accesible oculto (ej. `<span class="sr-only">(se abre en nueva pestaña)</span>`) ni icono representativo.
- **Impacto:** Puede desorientar a usuarios con discapacidades cognitivas o que utilicen lectores de pantalla sin anticipar la apertura de un nuevo contexto de navegación.

---

### 🟢 Hallazgos Bajos (B1 a B5)
- **[B1] Encabezados en Footer (Líneas 266, 270, 280 de `index.html`):** Los elementos `<h3>` del footer no están anidados bajo un `<h2>` de la sección de contacto, quebrando la jerarquía formal del árbol de accesibilidad.
- **[B2] Grid asimétrico en estadísticas (Línea 478 de `styles.css`):** `.stats-grid` usa `repeat(4, 1fr)` para 7 elementos, dejando la última celda vacía.
- **[B3] Falta de atributos `width` y `height` en `<img>` (Líneas 226, 230, etc. de `index.html`):** Aunque el contenedor tiene `aspect-ratio: 4/3`, omitir las dimensiones intrínsecas en la etiqueta HTML puede causar fluctuaciones de diseño (CLS).
- **[B4] Falta de fallback ante fallo de carga de imágenes CDN:** Las imágenes proceden de Shopify y Eurosport. Si el navegador no tiene conexión o el CDN bloquea el referer, no hay mensaje de sustitución visual en el modal.
- **[B5] `overflow-x: hidden` en `body` (Línea 41 de `styles.css`):** Suprime la barra de desplazamiento horizontal, pero si un usuario activa el zoom de texto del navegador al 200% o 400% (criterios WCAG 1.4.4 y 1.4.10), el texto que sobrepase los márgenes quedará truncado sin posibilidad de ser alcanzado.

---

## 4. Recomendaciones de Corrección Detalladas

### Corrección C1: Sincronizar el Nombre Accesible con el Texto Visible en la Galería
Incluir el texto visual del caption al inicio del `aria-label`:
```html
<!-- En index.html -->
<button class="gallery-item" 
        aria-label="Gol celebración - Real Madrid: Cristiano Ronaldo celebrando un gol en el Bernabéu" 
        data-src="..." 
        data-alt="...">
  <img src="..." alt="Cristiano Ronaldo celebrando un gol con la camiseta del Real Madrid en el Santiago Bernabéu" loading="lazy" width="600" height="450">
  <div class="gallery-caption" aria-hidden="true">Gol celebración - Real Madrid</div>
</button>
```

---

### Corrección C2: Integrar el Pie de Página en el Scroll Espía
Ampliar el selector en JavaScript para incluir la sección de contacto:
```javascript
// En script.js (Línea 39)
const sections = document.querySelectorAll('.section, .hero, #contacto');
```

---

### Corrección C3: Implementar Enlace de Salto (Skip Link)
Añadir el enlace al inicio del documento e incluir el identificador en `<main>`:
```html
<!-- En index.html (justo tras <body>) -->
<a href="#contenido-principal" class="skip-link">Saltar al contenido principal</a>

<!-- En la etiqueta main -->
<main id="contenido-principal">
```
```css
/* En styles.css */
.skip-link {
  position: absolute;
  top: -100px;
  left: 20px;
  background: var(--color-primary);
  color: var(--color-dark);
  padding: 12px 20px;
  font-weight: 700;
  z-index: 9999;
  border-radius: 0 0 6px 6px;
  transition: top 0.2s ease;
}
.skip-link:focus {
  top: 0;
}
```

---

### Corrección A1: Accesibilidad y Manejo de Teclado en el Menú Móvil
Actualizar `aria-controls`, `aria-label` dinámico y soporte de tecla Escape:
```html
<!-- En index.html -->
<button class="nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="navLinks">
  <span class="hamburger" aria-hidden="true"></span>
</button>
```
```javascript
// En script.js
function toggleMobileMenu(forceClose = false) {
  const isOpening = forceClose ? false : !navLinks.classList.contains('active');
  navLinks.classList.toggle('active', isOpening);
  navToggle.classList.toggle('active', isOpening);
  navToggle.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
  navToggle.setAttribute('aria-label', isOpening ? 'Cerrar menú' : 'Abrir menú');
  if (!isOpening) navToggle.focus();
}

navToggle.addEventListener('click', () => toggleMobileMenu());

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    toggleMobileMenu(true);
  }
});
```

---

### Corrección A2: Aislamiento del Fondo durante la Apertura del Modal
Aplicar el atributo estándar `inert` a los contenedores externos:
```javascript
// En script.js
const mainSiblings = [document.querySelector('header'), document.querySelector('nav'), document.querySelector('main'), document.querySelector('footer')];

function openModal(src, alt) {
  modalImg.src = src;
  modalImg.alt = alt;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  mainSiblings.forEach(el => el && el.setAttribute('inert', ''));
  modalClose.focus();
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  modalImg.src = '';
  mainSiblings.forEach(el => el && el.removeAttribute('inert'));
  if (lastFocusedElement) lastFocusedElement.focus();
}
```

---

### Corrección A3: Adaptación del Menú Móvil en Modo Apaisado
Limitar la altura y permitir desplazamiento vertical:
```css
/* En styles.css dentro de @media (max-width: 768px) */
.nav-links {
  max-height: calc(100vh - 70px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

---

### Corrección A4: Soporte de Reducción de Movimiento
Desactivar animaciones agresivas y suavizado forzado si el usuario lo requiere:
```css
/* En styles.css */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto !important;
  }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```
```javascript
// En script.js en animateStats()
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  statNumbers.forEach(stat => {
    stat.textContent = stat.getAttribute('data-target');
  });
  statsAnimated = true;
  return;
}
```

---

### Corrección A5: Soporte de Impresión
Garantizar visibilidad completa del contenido al imprimir:
```css
/* En styles.css */
@media print {
  .fade-in {
    opacity: 1 !important;
    transform: none !important;
    visibility: visible !important;
  }
  .navbar, .nav-toggle, .timeline-filters, .modal-overlay, .btn-principal {
    display: none !important;
  }
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }
}
```

---

### Corrección M1: Optimización de Scroll y Limpieza de Escuchadores
Desvincular el escuchador de estadísticas y usar `IntersectionObserver` o throttling pasivo:
```javascript
// En script.js
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// En animateStats:
if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
  statsAnimated = true;
  window.removeEventListener('scroll', animateStats); // Desvincular listener
  // ... resto de la animación
}
```

---

### Corrección M2: Mejorar Objetivos Táctiles en el Footer
Convertir los enlaces a bloques con padding interactivo:
```css
/* En styles.css */
.footer-col ul a {
  display: inline-block;
  padding: 8px 4px;
  min-height: 44px;
  display: flex;
  align-items: center;
}
```

---

### Corrección M3: Ajuste de Densidad en la Línea de Tiempo para 320px
Reducir paddings en pantallas pequeñas:
```css
/* En styles.css dentro de @media (max-width: 480px) */
.timeline {
  padding-left: 20px;
}
.timeline-dot {
  left: -20px;
}
.timeline-content {
  padding: 16px 14px;
}
.timeline-year {
  white-space: normal;
  font-size: 0.75rem;
}
```

---

### Corrección M4: Contraste y Fondo en el Botón de Cierre del Modal
Garantizar visibilidad del botón de cierre en cualquier circunstancia fotográfica:
```css
/* En styles.css */
.modal-close {
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.4);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}
.modal-close:hover,
.modal-close:focus-visible {
  background: rgba(0, 0, 0, 0.9);
  border-color: var(--color-primary);
}
```

---

### Corrección M5: Ocultar Iconos Decorativos a Lectores de Pantalla
```html
<!-- En index.html -->
<div class="stat-icon" aria-hidden="true">&#9917;</div>
<div class="stat-icon" aria-hidden="true">&#128176;</div>
```

---

### Corrección M6: Aviso de Apertura de Nueva Pestaña en Enlaces Externos
```html
<!-- En index.html -->
<li>
  <a href="https://www.instagram.com/cristiano/" target="_blank" rel="noopener noreferrer">
    Instagram <span class="sr-only">(se abre en una nueva pestaña)</span>
  </a>
</li>
```
```css
/* En styles.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## 5. Pruebas que Deberían Repetirse Después de Corregir

Una vez aplicadas las recomendaciones anteriores, se deberán ejecutar los siguientes protocolos de verificación:

### 1. Pruebas de Accesibilidad con Lectores de Pantalla
- **NVDA / JAWS en Windows (Firefox/Chrome):**
  - Verificar que el enlace de salto ("Skip link") es el primer elemento anunciado al pulsar Tab y lleva directamente a `<main>`.
  - Comprobar que los botones de la galería anuncian un nombre accesible que comienza con el texto visible de su pie de foto.
  - Abrir el modal y comprobar que el lector no puede salir al contenido exterior (`inert`).
  - Verificar que al pulsar el botón de menú móvil se anuncia *"Cerrar menú, expandido"*.
  - Comprobar que los emojis de estadísticas no producen lectura superflua.
- **VoiceOver en iOS / TalkBack en Android:**
  - Deslizar el dedo dentro del modal de la galería y comprobar que el foco queda estrictamente retenido dentro del diálogo.

### 2. Pruebas de Navegación por Voz (Speech-to-Text)
- Utilizar el Control por Voz de Windows, Dragon o Voice Control de macOS y dictar *"Hacer clic en Gol celebración"* y *"Hacer clic en Regreso a Manchester United"*.
- Confirmar que el navegador activa la miniatura correspondiente sin ambigüedades.

### 3. Pruebas de Teclado
- Recorrer todo el sitio con la tecla `Tab` y `Shift + Tab`:
  - Verificar que el foco nunca se oculta detrás de la barra adhesiva.
  - Verificar que el menú móvil se despliega con `Enter`/`Espacio` y se cierra con `Escape`.
  - Confirmar que el foco regresa al botón desencadenante al cerrar tanto el menú móvil como el modal.

### 4. Pruebas de Simulación de Dispositivos y Vista Responsiva (DevTools)
- **320px × 568px (móvil estrecho vertical):** Verificar ausencia de scroll horizontal con `overflow-x: auto` en pruebas, comprobando que la tarjeta de la línea de tiempo y la insignia de años se leen íntegramente sin truncamiento.
- **568px × 320px (móvil apaisado / landscape):** Abrir el menú de navegación móvil y verificar que se puede hacer scroll hacia abajo para interactuar con los enlaces "Galería" y "Contacto".
- **390px × 844px (móvil estándar moderno):** Probar el espaciado táctil en los enlaces del pie de página para validar que no se producen pulsaciones falsas.
- **768px × 1024px (tablet portrait):** Validar la disposición de la galería y el menú hamburguesa.
- **Escritorio (1200px y 1440px):** Hacer scroll continuo hasta el pie de página y validar que el enlace `#contacto` se resalta en dorado en la barra superior.

### 5. Pruebas de Preferencias del Sistema y Medios
- Activar en el sistema operativo la opción **"Reducir movimiento"** (*Settings > Accessibility > Motion / Display*):
  - Recargar la página y validar que los contadores numéricos muestran inmediatamente su valor final (ej. `900+`) sin animación de 2 segundos.
  - Pulsar en los enlaces de la barra de navegación y verificar que el salto es instantáneo sin desplazamiento suave prolongado.
- Abrir el diálogo de impresión (`Ctrl + P`):
  - Validar que todo el texto y las secciones de biografía, trayectoria y estadísticas se imprimen legibles sobre fondo claro y con `opacity: 1`.

---

*Informe de auditoría elaborado bajo directrices estrictas de inspección estática de código y análisis dinámico de navegabilidad.*

