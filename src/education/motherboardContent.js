export const motherboardLesson = {
  directory: 'recursos/motherboard/',
  introduction: 'La motherboard, o placa madre, es el circuito impreso principal. Sus capas de cobre conectan chips, ranuras y puertos para que el equipo pueda funcionar como un conjunto.',
  functions: [
    ['Comunica los componentes', 'Las pistas llevan datos y señales entre la CPU, la RAM, el almacenamiento y otros dispositivos. Algunas se ven en la superficie y otras están dentro de la placa.'],
    ['Distribuye la energía', 'La placa recibe energía de la batería o del cargador. Los reguladores entregan las tensiones que necesitan los distintos circuitos.'],
    ['Prepara el arranque', 'El firmware (BIOS o UEFI) inicia y comprueba el hardware. Después da paso al programa que inicia el sistema operativo.'],
  ],
  netbook: 'En la cara superior buscá el procesador cuadrado cerca del centro, la ranura alargada de RAM debajo y los puertos en el borde derecho. Girá la placa para ver las pistas y los componentes de la cara posterior.',
  variations: 'Según la netbook, la RAM puede ser extraíble o estar soldada. El almacenamiento también puede ir en un conector o estar integrado. Los cables planos pueden llevar señales al teclado, al touchpad o a la pantalla.',
  details: [
    ['Pistas, capas y vías', 'Las pistas son caminos de cobre. Los pequeños orificios metalizados llamados vías enlazan pistas de distintas capas. Por eso solo una parte de las conexiones se ve desde afuera.'],
    ['Piezas soldadas, ranuras y flex', 'En esta placa se ve el procesador y una ranura para un módulo de RAM. En otros modelos la memoria viene soldada. Un conector flex une la placa con una pieza separada, como el teclado, mediante un cable plano.'],
    ['Puertos y conectores internos', 'Un puerto USB permite conectar un periférico desde afuera. Los conectores internos enlazan piezas del propio equipo, como la batería, la pantalla o el teclado. Para identificar uno, compará su ubicación y su función con el manual del modelo.'],
  ],
  care: 'Para una revisión real, apagá el equipo, aislá la alimentación y seguí el manual del modelo con supervisión docente. Usá protección contra descargas electrostáticas y sujetá la placa por los bordes. Si hay corrosión o un conector dañado, registrá lo que ves y consultá antes de limpiar o manipular.',
};

export const motherboardQuestions = [
  {
    id: 'ranura',
    prompt: 'Mirá la cara superior. ¿Para qué sirve la ranura alargada ubicada debajo del procesador?',
    options: [
      ['pantalla', 'Para conectar la pantalla interna.'],
      ['ram', 'Para alojar un módulo de memoria RAM.'],
      ['cargador', 'Para recibir energía del cargador.'],
    ],
    answer: 'ram',
    explanation: 'La ranura alargada de esta placa aloja un módulo de RAM. En otras netbooks la memoria puede estar soldada.',
  },
  {
    id: 'vias',
    prompt: 'Al girar la placa ves pistas y pequeños orificios metalizados. ¿Qué función cumplen las vías?',
    options: [
      ['capas', 'Enlazan pistas de distintas capas de la placa.'],
      ['tornillos', 'Fijan la placa al chasis con tornillos.'],
      ['aire', 'Dejan pasar aire entre ambas caras.'],
    ],
    answer: 'capas',
    explanation: 'Las vías son conexiones eléctricas entre capas. Los orificios de fijación cumplen una función mecánica diferente.',
  },
  {
    id: 'evidencia',
    prompt: 'En un caso simulado, una netbook enciende, pero su teclado interno no responde. ¿Qué primera comprobación aporta evidencia sin abrir el equipo?',
    options: [
      ['bateria', 'Comprobar si el cargador enciende su luz.'],
      ['modelo', 'Comparar el color de la placa con el de la foto.'],
      ['usb', 'Probar un teclado USB que funciona y registrar el resultado.'],
    ],
    answer: 'usb',
    explanation: 'Si el teclado USB responde, ya sabés que el equipo puede recibir entrada por ese puerto. Eso orienta la revisión del teclado interno y sus conexiones, aunque todavía no identifica la causa.',
  },
  {
    id: 'seguridad',
    prompt: 'El docente decide revisar un conector interno. ¿Qué preparación corresponde antes de tocar la placa?',
    options: [
      ['tapa', 'Cerrar la tapa y dejar el cargador conectado.'],
      ['manual', 'Apagar, aislar la alimentación según el manual y preparar la protección electrostática.'],
      ['pantalla', 'Apagar la pantalla y sujetar la placa por el conector.'],
    ],
    answer: 'manual',
    explanation: 'La preparación incluye el apagado, el aislamiento de las fuentes de energía y la protección contra descargas electrostáticas según el procedimiento del modelo y con supervisión docente.',
  },
];
