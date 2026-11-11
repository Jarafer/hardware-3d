export const microLesson = {
  imagePath: 'recursos/micro/placa-netbook.png',
  introduction: 'La CPU (unidad central de procesamiento) ejecuta las instrucciones de los programas y realiza cálculos y operaciones lógicas. La RAM mantiene temporalmente los datos e instrucciones que usa.',
  references: [
    {
      title: 'Encapsulado',
      text: 'Es el cuadrado oscuro. Sostiene el dado de silicio y lo conecta eléctricamente con la placa.',
      bounds: { left: 38.2, top: 28, width: 16.6, height: 18.5 },
    },
    {
      title: 'Silicio visible',
      text: 'El rectángulo brillante es el dado de silicio expuesto. Contiene los circuitos del chip y, en este diseño, es la zona por donde el calor pasa hacia el disipador.',
      bounds: { left: 43.6, top: 32.8, width: 6.6, height: 8.4 },
    },
  ],
  notes: [
    ['Conexión a la placa', 'Según el equipo, el procesador puede ir en un zócalo o soldado. En muchas netbooks está soldado a la placa madre.'],
    ['Temperatura y rendimiento', 'El disipador recibe calor a través de un material térmico adecuado. Si la CPU llega a su límite térmico, puede bajar su frecuencia para protegerse. Esto se llama limitación térmica.'],
  ],
  question: 'Una netbook pierde fluidez después de unos minutos. ¿Qué observación te ayudaría a evaluar si la CPU está limitando su rendimiento por temperatura?',
  choices: [
    ['carcasa', 'Tocar la carcasa y notar que está tibia.', 'La sensación al tacto no indica la temperatura de la CPU ni explica por qué bajó el rendimiento.'],
    ['mediciones', 'Comparar temperatura y frecuencia de la CPU bajo una carga similar.', 'Si sube la temperatura y la frecuencia baja con una carga comparable, hay una pista de limitación térmica. Contrastala con los límites del modelo antes de concluir.'],
    ['foto', 'Mirar el tamaño del procesador en la foto.', 'La foto permite ubicar la pieza. Para explicar la lentitud necesitás datos sobre el funcionamiento del equipo.'],
  ],
};
