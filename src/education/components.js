export const schematicNotice = 'Diseño esquemático: la ubicación, la forma y la presencia de estas piezas dependen del modelo real. No es una guía de desmontaje.';
export const handlingNotice = 'Para una práctica real: equipo apagado y desconectado, manejo de la batería según el manual del fabricante y protección contra descargas electrostáticas, con supervisión docente.';

export const components = Object.freeze([
  Object.freeze({
    id: 'ram', objectKey: 'ram', number: '01', name: 'Memoria RAM', color: '#44846E',
    function: 'Mantiene temporalmente los datos y las instrucciones que usan los programas en ejecución. Su contenido se pierde al apagar el equipo.',
    precautions: ['Evitá tocar los contactos y los circuitos; la electricidad estática puede dañarlos.', 'La RAM puede ser un módulo extraíble o estar soldada. Confirmá el tipo en el manual del modelo y no fuerces ninguna pieza.'],
    question: 'Al abrir una aplicación, ¿cómo se relacionan la tarea de la RAM y la del almacenamiento?',
  }),
  Object.freeze({
    id: 'almacenamiento', objectKey: 'storage', number: '02', name: 'Unidad de almacenamiento', color: '#437E90',
    function: 'Conserva el sistema, los programas y los archivos incluso sin alimentación. Puede ser un SSD, un disco duro u otra solución, como eMMC integrada.',
    precautions: ['Protegé la unidad de golpes y evitá tocar contactos o conectores.', 'Identificá el formato y la sujeción en el manual antes de cualquier práctica; no tires de cables ni fuerces conectores.'],
    question: '¿Qué información necesitás conocer del modelo para distinguir entre una unidad reemplazable y almacenamiento integrado?',
  }),
  Object.freeze({
    id: 'placa-madre', objectKey: 'motherboard', number: '03', name: 'Placa madre', color: '#7A8860',
    function: 'Interconecta los principales componentes mediante pistas y conectores, y distribuye alimentación y señales entre ellos.',
    precautions: ['Evitá tocar pistas, contactos y componentes; no apoyes objetos metálicos sobre la placa.', 'No dobles la placa ni fuerces los conectores. La disposición y los elementos integrados cambian entre modelos.'],
    question: '¿Qué conexiones del esquema te ayudan a explicar por qué la placa madre vincula a los demás componentes?',
  }),
  Object.freeze({
    id: 'refrigeracion', objectKey: 'cooling', number: '04', name: 'Sistema de refrigeración', color: '#B58953',
    function: 'Ayuda a transferir y disipar el calor. Puede combinar disipador, conductos térmicos y ventilador; algunos equipos usan refrigeración pasiva sin ventilador.',
    precautions: ['Dejá enfriar el equipo antes de una práctica y evitá tocar superficies que puedan estar calientes.', 'No fuerces aspas ni cables. No retires el disipador ni alteres la interfaz térmica sin las indicaciones del fabricante.'],
    question: '¿Cómo podría cambiar el recorrido del calor entre un equipo con ventilador y uno con refrigeración pasiva?',
  }),
]);

export const componentSources = Object.freeze([
  { title: 'Dell: seguridad y protección contra descargas electrostáticas', url: 'https://www.dell.com/support/kbdoc/en-ph/000137973/safety-precautions-when-working-with-electrical-equipment' },
  { title: 'Kingston: memoria y almacenamiento', url: 'https://www.kingston.com/en/blog/pc-performance/difference-between-memory-storage' },
]);
