export interface DailyCalendarEntry {
  day: number;
  week: number;
  phaseTitle: string;
  reading: string;
  theme: string;
  actionStep: string;
}

const DAILY_SEEDS: Array<{ reading: string; theme: string; actionStep: string }> = [
  { reading: 'Juan 1:1-18', theme: 'El Verbo hecho carne', actionStep: 'Agradece a Jesús por revelar el amor del Padre.' },
  { reading: 'Juan 3:1-21', theme: 'El nuevo nacimiento', actionStep: 'Lee el v.16 en voz alta y reflexiona en la gracia de Dios.' },
  { reading: 'Romanos 3:21-26', theme: 'Justificación por la fe', actionStep: 'Reconoce que la salvación es regalo y no mérito propio.' },
  { reading: 'Romanos 5:1-11', theme: 'Paz con Dios', actionStep: 'Ora dando gracias por el perdón recibido en la cruz.' },
  { reading: 'Hechos 3:19-21', theme: 'Arrepentimiento y refrigerio', actionStep: 'Pide al Señor un corazón dispuesto a obedecerle hoy.' },
  { reading: 'Efesios 2:1-10', theme: 'Salvos por gracia para buenas obras', actionStep: 'Haz un gesto concreto de servicio o bondad hoy.' },
  { reading: 'Salmos 23', theme: 'El Señor es tu Pastor', actionStep: 'Entrega tus preocupaciones de la semana al cuidado de Dios.' },
  { reading: 'Salmos 1', theme: 'Raíces junto a corrientes de aguas', actionStep: 'Separa 10 minutos sin distracciones para meditar en un versículo.' },
  { reading: 'Mateo 6:5-15', theme: 'Cómo orar al Padre', actionStep: 'Ora siguiendo el modelo del Padre Nuestro con tus palabras.' },
  { reading: '2 Timoteo 3:14-17', theme: 'La Escritura inspirada', actionStep: 'Anota una enseñanza práctica de tu lectura de hoy.' },
  { reading: '1 Juan 1:5-10', theme: 'Andar en luz y confesión', actionStep: 'Pide limpieza al Señor si algo ha estorbado tu paz.' },
  { reading: 'Juan 10:1-18', theme: 'La voz del Buen Pastor', actionStep: 'Escucha primero la Palabra antes de tomar una decisión hoy.' },
  { reading: 'Filipenses 4:4-9', theme: 'La paz que guarda el corazón', actionStep: 'Cambia una queja de hoy por una oración con acción de gracias.' },
  { reading: 'Isaías 41:10', theme: 'No temas, Dios te sostiene', actionStep: 'Memoriza este versículo y repítelo si sientes temor.' },
  { reading: 'Mateo 28:18-20', theme: 'Bautismo en el nombre trino', actionStep: 'Aprende el significado del Padre, Hijo y Espíritu Santo.' },
  { reading: 'Juan 14:15-26', theme: 'La promesa del Consolador', actionStep: 'Pide al Espíritu Santo guía para recordar la Palabra.' },
  { reading: '2 Corintios 13:14', theme: 'Comunión con la Trinidad', actionStep: 'Medita en la gracia de Cristo, el amor del Padre y la comunión del Espíritu.' },
  { reading: 'Hechos 1:1-11', theme: 'Poder para ser testigos', actionStep: 'Ora por valentía y mansedumbre para hablar de Jesús.' },
  { reading: 'Hechos 2:1-21', theme: 'Pentecostés y el Espíritu derramado', actionStep: 'Pide llenura del Espíritu Santo para vivir conforme a Cristo.' },
  { reading: 'Gálatas 5:16-26', theme: 'El fruto del Espíritu', actionStep: 'Pide a Dios cultivar hoy paciencia, bondad y dominio propio.' },
  { reading: '1 Corintios 12:1-11', theme: 'Dones para edificación', actionStep: 'Ora pidiendo sabiduría para servir a otros en tu congregación.' },
  { reading: '1 Corintios 13:1-13', theme: 'El camino del amor', actionStep: 'Practica la paciencia y el respeto en una conversación difícil.' },
  { reading: 'Romanos 12:1-12', theme: 'Renovación de la mente', actionStep: 'Evita contenidos que dañen tu fe y aliméntate de la Escritura.' },
  { reading: 'Salmos 119:105-112', theme: 'Lámpara a nuestros pies', actionStep: 'Consulta la Palabra ante cualquier duda ética o familiar.' },
  { reading: 'Santiago 1:2-12', theme: 'Sabiduría en la prueba', actionStep: 'Pide sabiduría a Dios con fe en medio de un reto actual.' },
  { reading: 'Santiago 1:19-27', theme: 'Hacedores de la Palabra', actionStep: 'Pronto para oír, tardo para hablar y tardo para airarse hoy.' },
  { reading: 'Hebreos 10:19-25', theme: 'Perseverar y congregarnos', actionStep: 'Da un paso para acercarte o servir en una iglesia bíblica sana.' },
  { reading: 'Colosenses 3:12-17', theme: 'Vida nueva en comunidad y hogar', actionStep: 'Perdona o bendice hoy a un miembro de tu familia.' },
  { reading: '1 Pedro 2:1-10', theme: 'Pueblo adquirido por Dios', actionStep: 'Recuerda tu identidad en Cristo cuando enfrentes desánimo.' },
  { reading: '1 Tesalonicenses 4:13-18', theme: 'La esperanza del regreso de Cristo', actionStep: 'Vive hoy con esperanza eterna y corazón vigilante.' },
];

export const NINETY_DAY_CALENDAR: DailyCalendarEntry[] = Array.from({ length: 90 }, (_, idx) => {
  const day = idx + 1;
  const week = Math.ceil(day / 7);
  const seed = DAILY_SEEDS[idx % DAILY_SEEDS.length];
  let phaseTitle = 'Primeros Pasos en Cristo';
  if (day > 7 && day <= 30) phaseTitle = 'Mes 1 · Fundamentos de la Fe';
  else if (day > 30 && day <= 60) phaseTitle = 'Mes 2 · Doctrina Trinitaria y Pentecostal';
  else if (day > 60) phaseTitle = 'Mes 3 · Carácter, Iglesia y Misión';

  return {
    day,
    week,
    phaseTitle,
    reading: seed.reading,
    theme: seed.theme,
    actionStep: seed.actionStep,
  };
});

export function generateCalendarReminderICS(timeHHMM: string): string {
  const [rawHour, rawMinute] = timeHHMM.split(':');
  const hour = String(Math.min(23, Math.max(0, Number(rawHour) || 7))).padStart(2, '0');
  const minute = String(Math.min(59, Math.max(0, Number(rawMinute) || 0))).padStart(2, '0');

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JAIRRESTAURA EVANGELISTA//Discipulado 90 Dias//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:jairrestaura-discipulado-${yyyy}${mm}${dd}@jairrestaura.app`,
    `DTSTAMP:${yyyy}${mm}${dd}T${hour}${minute}00`,
    `DTSTART:${yyyy}${mm}${dd}T${hour}${minute}00`,
    'RRULE:FREQ=DAILY;COUNT=90',
    'SUMMARY:Lectura bíblica y oración · JAIRRESTAURA Discipulado',
    'DESCRIPTION:Tiempo diario voluntario de lectura de las Sagradas Escrituras, oración y crecimiento en Cristo.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
