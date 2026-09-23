# Hotel Innovación · X Edición

App web móvil para la jornada del 23 de septiembre de 2026 en Fundación Cajasol, Sevilla.

**Abrir la app:** https://nestorguerra.github.io/hotel-innovacion-x/

Escanea [`qr-hotel-innovacion-x.png`](qr-hotel-innovacion-x.png) con la cámara del móvil para abrirla directamente. En Safari o Chrome se puede añadir a la pantalla de inicio.

## Qué incluye

- Agenda en directo con los horarios detallados publicados por la organización en [Eventbrite](https://www.eventbrite.es/e/entradas-x-edicion-hotel-innovacion-1992552888327), consultados el 23 de septiembre de 2026.
- Ponentes, guía de Sevilla, indicaciones y enlaces a mapas.
- App instalable y funcionamiento sin conexión tras la primera visita.
- Favoritos y notas guardados solo en el navegador de cada asistente; no hay cuentas ni sincronización entre móviles.

La página general de Eventbrite indica fin a las 14:30; el programa detallado sitúa el cierre a las 15:00. La app conserva el horario del programa detallado.

## Actualizar

Es una web estática sin compilación ni dependencias externas. El contenido del programa está en `data.js`; los estilos, en `styles.css`. Al modificar la app, aumenta la constante `VERSION` de `sw.js` para que los móviles actualicen su copia sin conexión. GitHub Pages publica desde la raíz de `main`.
