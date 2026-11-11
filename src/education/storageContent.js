export const storageDevices = [
  {
    id: 'hdd',
    button: 'HDD de 2,5″',
    title: 'Disco rígido mecánico (HDD)',
    file: 'hdd.png',
    alt: 'Disco rígido con carcasa metálica, etiqueta de 320 GB y conector visible en el borde inferior.',
    observation: 'La etiqueta indica 320 GB. Se ven una carcasa metálica y un conector dividido en dos tramos.',
    technology: 'Guarda datos magnéticamente en platos que giran. Un cabezal se mueve para leer y escribir.',
    connection: 'En este ejemplo, SATA lleva datos y alimentación por tramos separados del conector.',
    check: 'Buscá el modelo en la etiqueta. Para comparar un repuesto, verificá la interfaz, el grosor y el espacio del equipo.',
  },
  {
    id: 'm2',
    button: 'SSD M.2',
    title: 'Unidad de estado sólido M.2',
    file: 'ssd-m2.png',
    alt: 'Módulo de almacenamiento angosto con etiqueta, instalado en una netbook.',
    observation: 'Se ve un módulo angosto con etiqueta y un extremo insertado en un conector.',
    technology: 'Un SSD guarda datos en memoria flash. No utiliza platos ni cabezales.',
    connection: 'M.2 describe el formato. Los SSD M.2 pueden usar SATA o PCIe con NVMe, según la unidad.',
    check: 'Verificá el modelo de la unidad y qué interfaz y longitud acepta la ranura. Por ejemplo, 2280 indica 22 mm de ancho y 80 mm de largo.',
  },
  {
    id: 'emmc',
    button: 'eMMC y chips soldados',
    title: 'Almacenamiento integrado (eMMC)',
    file: 'chips-soldados.png',
    alt: 'Primer plano de circuitos integrados montados directamente sobre una placa, sin un módulo enchufado en la zona fotografiada.',
    observation: 'Se ven chips montados sobre la placa. La foto sirve para reconocer el montaje soldado. El tipo de cada chip se confirma con su código o con la documentación.',
    technology: 'eMMC reúne memoria flash y su controlador en un encapsulado que se suelda a la placa.',
    connection: 'Se comunica mediante una interfaz MMC integrada. Su reemplazo requiere trabajo especializado de placa.',
    check: 'Confirmá el código del chip o el modelo de la netbook antes de identificarlo como eMMC.',
  },
];

export const storageQuestions = [
  {
    id: 'observacion',
    prompt: 'Al mirar el módulo de la segunda foto, ¿qué podés registrar como observación?',
    options: [
      ['nvme', 'Se confirma que usa NVMe.'],
      ['forma', 'Se ve un módulo angosto insertado en un conector.'],
      ['falla', 'La unidad está dañada porque es pequeña.'],
    ],
    answer: 'forma',
    explanation: 'La forma y el conector se observan en la foto. Para identificar el protocolo o evaluar el estado de la unidad hace falta otra evidencia.',
  },
  {
    id: 'hipotesis',
    prompt: 'La netbook tiene 6 GB libres y arranca lento. ¿Cuál es una hipótesis que podés investigar?',
    options: [
      ['diagnostico', 'La unidad falló porque el equipo tarda en arrancar.'],
      ['igualdad', 'Todos los equipos de ese programa arrancan igual.'],
      ['espacio', 'El poco espacio libre podría influir. Conviene contrastarlo con el uso del disco y los procesos de inicio.'],
    ],
    answer: 'espacio',
    explanation: 'El espacio disponible es una pista. El uso de la unidad y los procesos de inicio ayudan a distinguir hipótesis antes de atribuir la lentitud a una falla física.',
  },
  {
    id: 'compatibilidad',
    prompt: 'La ficha indica que la ranura admite solo M.2 2280 SATA. ¿Qué respuesta podés justificar con ese dato?',
    options: [
      ['sata', 'Buscar un M.2 2280 SATA y verificar el repuesto en la ficha del equipo.'],
      ['nvme', 'Elegir cualquier M.2 2280 NVMe porque tiene la misma longitud.'],
      ['emmc', 'Elegir un chip eMMC soldado para colocarlo en la ranura.'],
    ],
    answer: 'sata',
    explanation: 'La longitud y la interfaz son datos distintos. En este caso, la ficha exige ambos: formato M.2 2280 e interfaz SATA.',
  },
  {
    id: 'decision',
    prompt: 'Más tarde, la herramienta de diagnóstico emite una alerta S.M.A.R.T. y los trabajos aún no tienen copia. ¿Qué priorizás?',
    options: [
      ['formateo', 'Formatear la unidad para comprobar si desaparece la alerta.'],
      ['respaldo', 'Avisar al docente y priorizar el respaldo de los archivos accesibles.'],
      ['optimizacion', 'Desfragmentar la unidad antes de copiar.'],
    ],
    answer: 'respaldo',
    explanation: 'Una alerta de estado justifica proteger los archivos. Registrá el aviso y coordiná el respaldo y la revisión con el docente.',
  },
];
