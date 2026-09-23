/* Hotel Innovación X Edición: contenido editable.
   Para cambiar horarios, ponentes o recomendaciones, edita solo este archivo.
   Horas en formato H:MM (hora de Madrid). Tras publicar cambios, sube VERSION en sw.js. */

var EVENT_DATE = "2026-09-23";

var IMG = {
  tausia:"img/ponentes/tausia.jpg", nestor:"img/ponentes/nestor.jpg", neil:"img/ponentes/neil.jpg", sanjulian:"img/ponentes/sanjulian.jpg",
  alvarez:"img/ponentes/alvarez.jpg", garcia:"img/ponentes/garcia.jpg", apraiz:"img/ponentes/apraiz.jpg"
};

var SPEAKERS = {
  tausia:{name:"Javier Tausía", role:"CEO de deLuna Hotels", bio:"Abre el programa de ponencias con una tesis: la cultura es lo que de verdad construye una cadena hotelera, aunque no aparezca en ningún plan de expansión."},
  neil:{name:"Álvaro Neil", role:"Biciclown", bio:"Cambió una notaría por el sillín: trece años dando la vuelta al mundo en bicicleta, 117 países y más de 200.000 kilómetros, llevando su espectáculo de payaso a centros de refugiados, cárceles y hospicios."},
  garcia:{name:"Francisca García", role:"Directora de Hoteles Casas 1800", bio:""},
  sanjulian:{name:"Cristina San Julián", role:"Directora General de Radisson Hotel Group", bio:""},
  alvarez:{name:"José Manuel Álvarez", role:"General Manager de Hotel Sevilla Center", bio:""},
  apraiz:{name:"Kepa Apraiz", role:"CEO y fundador de Kora Living y Kategora", bio:"Presenta Kora Living como caso de innovación con propósito y los modelos que apuntan a un nuevo concepto de hospitalidad."},
  nestor:{name:"Néstor Guerra", role:"CEO y cofundador de NCompany", bio:"Ingeniero de Telecomunicación y Executive MBA. Dirige NCompany, consultora boutique de inteligencia artificial e innovación corporativa, y es profesor en EOI, ISDI y Headspring/IE. Cierra el programa de ponencias con los agentes de IA aplicados a la hospitalidad."}
};
var SPEAKER_ORDER = ["tausia","neil","garcia","sanjulian","alvarez","apraiz","nestor"];

var KIND_COLOR = {"Ponencia":"var(--accent)","Mesa redonda":"#8C3BC7","Pausa":"var(--gold-2)","Partner solidario":"#1E9E6A","Sorpresa":"#D1497A","Institucional":"var(--text-2)","Cierre":"var(--gold-2)"};

var SESSIONS = [
  {id:"apertura", s:"9:00", e:"9:15", kind:"Institucional", title:"Apertura del acto", desc:"Bienvenida de la organización a la décima edición de Hotel Innovación."},
  {id:"tausia", s:"9:15", e:"9:45", kind:"Ponencia", title:"Una cadena hotelera se construye desde la cultura", sub:"El ingrediente que no aparece en ningún plan de expansión", sp:["tausia"]},
  {id:"neil", s:"9:50", e:"10:40", kind:"Ponencia", title:"Biciclown", sp:["neil"]},
  {id:"afanip", s:"10:45", e:"11:00", kind:"Partner solidario", title:"AFANIP", sub:"Asociación de Familias de Niños con Prótesis", desc:"Como cada año, el beneficio de las entradas con donativo y de la fila 0 va destinado al partner solidario de Hotel Innovación."},
  {id:"coffee", s:"11:10", e:"11:40", kind:"Pausa", title:"Coffee break", desc:"Media hora para el networking. Buen momento para saludar a ponentes y organizadores.", pause:true},
  {id:"magia", s:"11:45", e:"12:00", kind:"Sorpresa", title:"Un instante mágico", desc:"Un paréntesis antes de la mesa redonda. Mejor verlo en directo."},
  {id:"mesa", s:"12:05", e:"12:50", kind:"Mesa redonda", title:"Del ayer al mañana", sub:"La evolución de los retos en la dirección hotelera", sp:["garcia","sanjulian","alvarez"]},
  {id:"apraiz", s:"12:55", e:"13:25", kind:"Ponencia", title:"Kora Living, innovación con propósito", sub:"Modelos para un nuevo concepto de hospitalidad", sp:["apraiz"]},
  {id:"nestor", s:"13:30", e:"14:15", kind:"Ponencia", title:"OrquestancIA", sub:"La nueva hospitalidad en la era de los agentes de IA", sp:["nestor"]},
  {id:"premios", s:"14:15", e:"15:00", kind:"Cierre", title:"Cierre y entrega de Premios X Edición", desc:"Final de la jornada y entrega de los premios de la décima edición."}
];

var CITY = {
  comer:[
    {n:"Casa Robles", d:"Cocina sevillana de siempre junto a la Catedral. Colabora con Hotel Innovación.", a:"Calle Álvarez Quintero, 58", t:"4 min", q:"Casa Robles Álvarez Quintero 58 Sevilla"},
    {n:"Casa Morales", d:"Bodega de 1850 con tinajas de vino. Tapas sencillas y ambiente de barra.", a:"Calle García de Vinuesa, 11", t:"6 min", q:"Casa Morales García de Vinuesa Sevilla"},
    {n:"Bodeguita Antonio Romero", d:"Templo del montadito. Pide el de pringá.", a:"Calle Antonia Díaz, 19", t:"8 min", q:"Bodeguita Antonio Romero Antonia Díaz Sevilla"},
    {n:"Bodega Santa Cruz, Las Columnas", d:"Tapeo de pie, rápido y a buen precio, a un paso de la Giralda.", a:"Calle Rodrigo Caro, 1", t:"8 min", q:"Bodega Santa Cruz Las Columnas Sevilla"},
    {n:"La Brunilda", d:"Tapa creativa en el Arenal. Se llena: llega pronto.", a:"Calle Galera, 5", t:"10 min", q:"La Brunilda Sevilla"},
    {n:"El Rinconcillo", d:"Abierto desde 1670, el bar más antiguo de Sevilla. Espinacas con garbanzos.", a:"Calle Gerona, 40", t:"15 min", q:"El Rinconcillo Sevilla"},
    {n:"Eslava", d:"Su tapa Un cigarro para Bécquer es ya un clásico. Muy demandado.", a:"Calle Eslava, 3 (San Lorenzo)", t:"20 min", q:"Eslava Sevilla"}
  ],
  ver:[
    {n:"Catedral y Giralda", d:"La mayor catedral gótica del mundo y su torre, antiguo alminar.", a:"Avenida de la Constitución", t:"5 min", q:"Catedral de Sevilla"},
    {n:"Real Alcázar", d:"Palacio y jardines de visita obligada. Entrada con hora.", a:"Patio de Banderas", t:"8 min", q:"Real Alcázar de Sevilla"},
    {n:"Barrio de Santa Cruz", d:"Callejuelas, patios y plazas para perderse sin prisa.", a:"Junto al Alcázar", t:"10 min", q:"Barrio de Santa Cruz Sevilla"},
    {n:"Torre del Oro y el río", d:"Paseo junto al Guadalquivir, ideal al caer la tarde.", a:"Paseo de Cristóbal Colón", t:"10 min", q:"Torre del Oro Sevilla"},
    {n:"Las Setas", d:"Metropol Parasol y su pasarela mirador sobre los tejados.", a:"Plaza de la Encarnación", t:"12 min", q:"Metropol Parasol Sevilla"},
    {n:"Triana", d:"Cruza el puente de Isabel II: mercado, cerámica y la calle Betis.", a:"Mercado de Triana", t:"15 min", q:"Mercado de Triana Sevilla"},
    {n:"Plaza de España", d:"La postal de Sevilla, junto al Parque de María Luisa. Mejor en tranvía.", a:"Parque de María Luisa", t:"25 min", q:"Plaza de España Sevilla"}
  ],
  dulce:[
    {n:"Confitería La Campana", d:"Dulcería histórica desde 1885, en plena calle Sierpes.", a:"Calle Sierpes esquina Plaza de la Campana", t:"5 min", q:"Confitería La Campana Sevilla"},
    {n:"Yemas de San Leandro", d:"Las yemas de las monjas, vendidas en el torno del convento. Horario conventual.", a:"Convento de San Leandro", t:"12 min", q:"Convento de San Leandro Sevilla yemas"}
  ]
};
var MOVE = [
  {n:"A pie", d:"El casco histórico es compacto: casi todo queda a menos de 20 minutos.", i:"walk"},
  {n:"Tranvía", d:"Parada Plaza Nueva, a unos 3 minutos. Conecta con Puerta Jerez y San Bernardo.", i:"tram", q:"Parada tranvía Plaza Nueva Sevilla"},
  {n:"Metro", d:"Línea 1, estación Puerta Jerez, a unos 8 minutos a pie.", i:"tram", q:"Metro Puerta de Jerez Sevilla"},
  {n:"Aeropuerto", d:"Unos 25 a 30 minutos en taxi. También hay autobús Especial Aeropuerto (EA) desde el centro.", i:"plane", q:"Aeropuerto de Sevilla"},
  {n:"Estación de Santa Justa", d:"Trenes de alta velocidad. Unos 15 minutos en taxi.", i:"train", q:"Estación Santa Justa Sevilla"},
  {n:"Bici pública", d:"Sevici tiene estaciones por todo el centro.", i:"bike"}
];
