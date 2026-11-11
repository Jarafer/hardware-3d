import { CanvasTexture, SRGBColorSpace } from 'three';

// La guía forma parte de la hoja 3D. Se repinta el mismo bitmap al seleccionar.
export function createRamGuideTexture(parts) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 768;
  const ctx = canvas.getContext('2d');
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace;
  function select(selectedId = null) {
    ctx.fillStyle = '#f4e8cc'; ctx.fillRect(0, 0, 512, 768);
    ctx.strokeStyle = '#b49b71'; ctx.lineWidth = 1; ctx.strokeRect(20, 20, 472, 728);
    ctx.fillStyle = '#303945'; ctx.textAlign = 'center'; ctx.font = '17px sans-serif'; ctx.fillText('CAPÍTULO 01 / MEMORIA RAM', 256, 67);
    ctx.font = '38px Georgia, serif'; ctx.fillText('Guía visual', 256, 122);
    ctx.font = '19px Georgia, serif'; ctx.fillText('Reconocé las partes del SO-DIMM', 256, 158);
    parts.forEach((part, index) => {
      const top = 193 + index * 77; const selected = part.id === selectedId;
      if (selected) { ctx.fillStyle = '#d6e0d8'; ctx.fillRect(35, top, 442, 69); }
      ctx.fillStyle = selected ? '#356675' : '#303945'; ctx.beginPath(); ctx.arc(68, top + 33, 17, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff9e9'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(String(index + 1), 68, top + 40);
      ctx.fillStyle = '#303945'; ctx.font = `${selected ? 'bold ' : ''}23px Georgia, serif`; ctx.textAlign = 'left';
      let line = ''; let y = top + 31;
      for (const word of part.name.split(' ')) {
        if (line && ctx.measureText(`${line} ${word}`).width > 345) { ctx.fillText(line, 99, y); y += 26; line = word; }
        else line += `${line ? ' ' : ''}${word}`;
      }
      ctx.fillText(line, 99, y);
    });
    ctx.textAlign = 'center'; ctx.font = '17px Georgia, serif'; ctx.fillText('Elegí un número en la memoria.', 256, 704);
    ctx.font = '14px sans-serif'; ctx.fillText('03 / GUÍA DEL LIBRO', 256, 735);
    texture.needsUpdate = true;
  }
  select();
  return { texture, select };
}

// Papel, tinta y planos técnicos generados localmente: sin imágenes ni fuentes remotas.
export function createBookTexture(kind, content) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  // Conservar la composición original en coordenadas lógicas y reducir el bitmap.
  ctx.scale(canvas.width / 768, canvas.height / 1024);
  const cover = kind === 'cover';
  const left = kind === 'left';
  ctx.fillStyle = cover ? '#303e48' : '#f4e8cc';
  ctx.fillRect(0, 0, 768, 1024);
  for (let y = 0; y < 1024; y += 4) {
    ctx.fillStyle = y % 12 === 0 ? '#c6a47709' : '#30394504';
    ctx.fillRect(0, y, 768, 1);
  }
  ctx.strokeStyle = cover ? '#c6a477' : '#b49b71';
  ctx.fillStyle = cover ? '#f0e5ce' : '#303945';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 696, 952);
  ctx.strokeRect(48, 48, 672, 928);
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(cover ? 'CUADERNOS DE TECNOLOGÍA  /  N.º 01' : 'HARDWARE 3D  /  LABORATORIO', 384, 103);
  ctx.font = cover ? 'bold 77px Georgia, serif' : '48px Georgia, serif';
  ctx.fillText(cover ? content.title : content.heading ?? (left ? 'Observar primero.' : 'Observar la netbook'), 384, 260);
  ctx.font = '24px Georgia, serif';
  ctx.fillText(cover ? content.subtitle : content.strapline ?? (left ? 'Cada detalle cuenta.' : 'Pantalla · teclado · conexiones'), 384, 316);
  ctx.strokeStyle = cover ? '#c6a477' : '#437e90';
  // Diagrama técnico de pistas y puntos de medición, sin representar aún una netbook.
  if (kind === 'left') {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#303945';
    ctx.font = '28px Georgia, serif';
    function paragraph(text, y) {
      let line = '';
      for (const word of text.split(' ')) {
        if (ctx.measureText(`${line} ${word}`).width > 555) { ctx.fillText(line, 106, y); y += 44; line = word; }
        else line += `${line ? ' ' : ''}${word}`;
      }
      ctx.fillText(line, 106, y);
      return y + 80;
    }
    const nextY = paragraph(content.introduction, 420);
    ctx.font = 'italic 25px Georgia, serif';
    paragraph(content.reminder, nextY);
    ctx.textAlign = 'center';
  } else {
  ctx.save();
  ctx.translate(384, 585);
  ctx.lineWidth = 2;
  for (const radius of [118, 142, 178]) { ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.stroke(); }
  ctx.strokeRect(-76, -76, 152, 152);
  ctx.strokeRect(-60, -60, 120, 120);
  for (let i = -3; i <= 3; i++) {
    const n = i * 18;
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(n, side * 76); ctx.lineTo(n, side * 100); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(side * 76, n); ctx.lineTo(side * 100, n); ctx.stroke();
    }
  }
  ctx.setLineDash([5, 7]);
  ctx.beginPath(); ctx.moveTo(-235, 0); ctx.lineTo(235, 0); ctx.moveTo(0, -230); ctx.lineTo(0, 230); ctx.stroke();
  ctx.restore();
  }
  ctx.font = '18px sans-serif';
  ctx.fillText(cover ? 'EXPLORACIÓN  ·  MANTENIMIENTO  ·  DIAGNÓSTICO' : content.page ?? (left ? '01  /  INTRODUCCIÓN' : '02  / NETBOOK 3D'), 384, 867);
  ctx.font = 'italic 23px Georgia, serif';
  ctx.fillText(cover ? 'Un laboratorio para aprender.' : kind === 'left' ? 'Aprender haciendo, paso a paso.' : 'El próximo capítulo empieza acá.', 384, 921);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
