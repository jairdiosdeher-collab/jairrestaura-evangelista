export type ResourceCategory =
  | 'Estudios bíblicos'
  | 'Devocionales'
  | 'Planes de lectura'
  | 'Preguntas frecuentes'
  | 'Versículos clave'
  | 'Guías para nuevos creyentes'
  | 'Materiales para evangelización';

export interface LibraryResource {
  id: string;
  category: ResourceCategory;
  title: string;
  scriptureRefs: string[];
  summary: string;
  content: string[];
  practicalTakeaway: string;
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  'Estudios bíblicos',
  'Devocionales',
  'Planes de lectura',
  'Preguntas frecuentes',
  'Versículos clave',
  'Guías para nuevos creyentes',
  'Materiales para evangelización',
];

export const RESOURCE_LIBRARY: LibraryResource[] = [
  {
    id: 'est-autoridad-biblia',
    category: 'Estudios bíblicos',
    title: 'La autoridad e inspiración de las Sagradas Escrituras',
    scriptureRefs: ['2 Timoteo 3:16-17', '2 Pedro 1:20-21', 'Salmos 119:105'],
    summary:
      'Por qué la Biblia es el fundamento seguro de la fe cristiana y cómo leerla respetando su contexto histórico y literario.',
    content: [
      'Texto bíblico: Toda la Escritura es inspirada por Dios y útil para enseñar, redargüir, corregir e instruir en justicia (2 Timoteo 3:16).',
      'Contexto: Los profetas y apóstoles no hablaron por mera opinión humana, sino guiados por el Espíritu Santo (2 Pedro 1:21).',
      'Principio de lectura: Antes de aplicar un pasaje, conviene leer los versículos anteriores y posteriores, identificar quién habla y qué mensaje central comunica en Cristo.',
    ],
    practicalTakeaway:
      'Adopta el hábito de leer un capítulo completo antes de tomar un versículo aislado para tu vida diaria.',
  },
  {
    id: 'est-trinidad-biblia',
    category: 'Estudios bíblicos',
    title: 'Un solo Dios en tres personas: Padre, Hijo y Espíritu Santo',
    scriptureRefs: ['Deuteronomio 6:4', 'Mateo 28:19', '2 Corintios 13:14'],
    summary:
      'Fundamento bíblico de la doctrina trinitaria evangélica frente a confusiones comunes.',
    content: [
      'La Escritura enseña con firmeza el monoteísmo: Jehová nuestro Dios, Jehová uno es (Deuteronomio 6:4).',
      'Al mismo tiempo, el Nuevo Testamento revela plenamente al Padre que envía, al Hijo que redime y al Espíritu Santo que mora y capacita (Mateo 3:16-17; Mateo 28:19).',
      'No son tres dioses ni una sola persona cambiando de disfraz: son tres personas distintas en una sola esencia divina y perfecto amor.',
    ],
    practicalTakeaway:
      'Al orar, dirígete al Padre en el nombre de Jesucristo y con la ayuda del Espíritu Santo (Efesios 2:18).',
  },
  {
    id: 'dev-paz-en-tormenta',
    category: 'Devocionales',
    title: 'Cuando el corazón está inquieto: la paz que sobrepasa todo entendimiento',
    scriptureRefs: ['Filipenses 4:6-7', 'Isaías 26:3', 'Juan 14:27'],
    summary:
      'Devocional pastoral para momentos de ansiedad, incertidumbre laboral o cargas familiares.',
    content: [
      'Pablo escribió Filipenses 4 desde una prisión, recordando que la paz cristiana no depende de que todo sea fácil, sino de descansar en la presencia y el cuidado de Dios.',
      'El pasaje invita a transformar la preocupación en oración específica acompañada de acción de gracias.',
      'Si la angustia persiste de forma intensa, entregar la carga a Dios camina de la mano con buscar consejo pastoral y apoyo profesional humano.',
    ],
    practicalTakeaway:
      'Escribe hoy tres cargas concretas, entrégalas en oración y agradece a Dios por tres muestras reales de su fidelidad.',
  },
  {
    id: 'dev-nuevo-comienzo',
    category: 'Devocionales',
    title: 'Misericordias nuevas cada mañana',
    scriptureRefs: ['Lamentaciones 3:22-24', '2 Corintios 5:17', 'Salmos 103:12'],
    summary:
      'Esperanza bíblica para quienes sienten culpa por su pasado y desean comenzar de nuevo en Cristo.',
    content: [
      'Cuando hay arrepentimiento sincero, Dios no nos define por nuestros errores pasados sino por la obra redentora de Jesucristo.',
      'Las misericordias del Señor no se agotaron ayer; son nuevas cada mañana para sostener al que camina con humildad.',
    ],
    practicalTakeaway:
      'Reemplaza la condenación paralizante por gratitud y obediencia diaria en lo pequeño.',
  },
  {
    id: 'plan-evangelio-juan',
    category: 'Planes de lectura',
    title: 'Plan de 21 días: El Evangelio según San Juan',
    scriptureRefs: ['Juan 1 al 21'],
    summary:
      'Un capítulo diario para conocer quién es Jesucristo, sus señales, sus promesas y el don de la vida eterna.',
    content: [
      'Días 1 al 7 (Juan 1–7): El Verbo eterno, el nuevo nacimiento, el agua viva y el Pan de vida.',
      'Días 8 al 14 (Juan 8–14): La luz del mundo, el Buen Pastor, la resurrección y la promesa del Espíritu Santo.',
      'Días 15 al 21 (Juan 15–21): Permanecer en Cristo, la oración sacerdotal, la cruz, la resurrección y la restauración de Pedro.',
    ],
    practicalTakeaway:
      'Lee un capítulo cada mañana preguntándote: ¿Qué revela este texto acerca de Jesús y qué me llama a obedecer?',
  },
  {
    id: 'plan-salmos-proverbios',
    category: 'Planes de lectura',
    title: 'Plan de 30 días: Salmos para orar y Proverbios para vivir',
    scriptureRefs: ['Salmos 1, 23, 27, 34, 51, 91, 103, 121', 'Proverbios 1 al 31'],
    summary:
      'Equilibrio diario entre adoración sincera delante de Dios y sabiduría práctica en las decisiones cotidianas.',
    content: [
      'Lee cada día el capítulo de Proverbios correspondiente a la fecha del mes (1 al 30/31) para cultivar prudencia en el habla, el trabajo y la familia.',
      'Acompaña tu lectura con un Salmo para expresar gratitud, confesión o clamor confiado al Señor.',
    ],
    practicalTakeaway:
      'Anota un proverbio por día en tu libreta y aplícalo en tu trato con quienes viven o trabajan contigo.',
  },
  {
    id: 'faq-perder-salvacion',
    category: 'Preguntas frecuentes',
    title: '¿Cómo entender la seguridad de salvación y la perseverancia en la fe?',
    scriptureRefs: ['Juan 10:27-29', 'Romanos 8:38-39', 'Hebreos 3:14', '1 Juan 5:11-13'],
    summary:
      'Explicación bíblica honesta sobre la fidelidad de Dios que guarda al creyente y el llamado a permanecer en Cristo.',
    content: [
      'Lo que dice el texto: Jesús asegura que nadie arrebatará a sus ovejas de su mano (Juan 10:28), mientras la Escritura también exhorta a permanecer firmes en la fe (Colosenses 1:23; Hebreos 3:14).',
      'Diferencia entre tradiciones: Algunas tradiciones reformadas enfatizan la preservación incondicional; tradiciones arminianas y pentecostales como el MMM subrayan que la salvación es segura en Cristo mientras el creyente permanece en fe y obediencia voluntaria, advirtiendo contra la apostasía deliberada.',
      'Aplicación pastoral: El creyente sincero no vive con miedo constante por tropiezos involuntarios, sino confiado en Cristo y vigilante en santidad.',
    ],
    practicalTakeaway:
      'Descansa en las promesas de Cristo y mantén viva tu comunión diaria mediante la Palabra, la oración y la iglesia.',
  },
  {
    id: 'faq-espiritu-santo',
    category: 'Preguntas frecuentes',
    title: '¿Cuál es la diferencia entre recibir al Espíritu en la conversión y el bautismo en el Espíritu Santo?',
    scriptureRefs: ['Romanos 8:9', 'Hechos 1:8', 'Hechos 2:4', 'Hechos 8:14-17', 'Gálatas 5:22-23'],
    summary:
      'Claridad bíblica pentecostal sin presiones ni comparaciones espirituales.',
    content: [
      'Todo verdadero creyente que nace de nuevo tiene al Espíritu Santo morando en su vida (Romanos 8:9; Efesios 1:13).',
      'En la enseñanza pentecostal (conforme a Hechos 1:8; 2:4; 8:14-17; 19:1-6), se distingue además el bautismo o investidura de poder del Espíritu Santo para testificar de Cristo con denuedo y manifestar dones para edificación.',
      'Matiz respetuoso: Otros cristianos evangélicos entienden que toda experiencia del Espíritu ocurre de una sola vez en la conversión. En todo caso, el carácter maduro siempre se prueba por el fruto del Espíritu: amor, gozo, paz y santidad.',
    ],
    practicalTakeaway:
      'Busca con sinceridad y paciencia ser lleno del Espíritu Santo sin compararte con nadie ni desanimarte.',
  },
  {
    id: 'vers-esenciales',
    category: 'Versículos clave',
    title: '12 versículos esenciales para memorizar y compartir',
    scriptureRefs: ['Juan 3:16', 'Romanos 5:8', 'Efesios 2:8-9', 'Salmos 119:11', 'Josué 1:9'],
    summary:
      'Selección verificada de pasajes sobre salvación, consuelo, santidad y misión evangelizadora.',
    content: [
      'Salvación: Juan 3:16 · Romanos 3:23 · Romanos 6:23 · Efesios 2:8-9 · Romanos 10:9.',
      'Fortaleza y consuelo: Josué 1:9 · Salmos 23:1 · Isaías 41:10 · Filipenses 4:6-7.',
      'Santidad y Espíritu: Salmos 119:11 · Gálatas 5:22-23 · Hechos 1:8.',
    ],
    practicalTakeaway:
      'Memoriza un versículo por semana repitiéndolo en voz alta y escribiendo su cita exacta.',
  },
  {
    id: 'guia-primeros-30-dias',
    category: 'Guías para nuevos creyentes',
    title: 'Guía práctica para tus primeros 30 días como creyente en Cristo',
    scriptureRefs: ['1 Pedro 2:2', 'Mateo 28:19', 'Hebreos 10:25'],
    summary:
      'Qué hacer después de abrir tu corazón a Jesús: oración diaria, lectura de los Evangelios, bautismo en agua y congregación.',
    content: [
      '1. Conversa con Dios todos los días con sencillez, como un hijo habla con su Padre.',
      '2. Comienza leyendo el Evangelio de Marcos o de Juan diez minutos al día.',
      '3. Busca una iglesia cristiana bíblica y sana donde puedas aprender y crecer acompañado.',
      '4. Prepárate para dar testimonio público de tu fe mediante el bautismo en agua.',
    ],
    practicalTakeaway:
      'Si aún no tienes congregación o necesitas guía cercana, conversa con el Pastor Jair por WhatsApp.',
  },
  {
    id: 'evang-compartir-fe',
    category: 'Materiales para evangelización',
    title: 'Cómo compartir el evangelio con respeto, claridad y amor',
    scriptureRefs: ['1 Pedro 3:15', 'Colosenses 4:5-6', 'Romanos 1:16'],
    summary:
      'Guía práctica de 4 pasos para dar testimonio de Jesucristo a familiares, amigos y compañeros de trabajo.',
    content: [
      '1. Escucha primero con interés genuino la historia y necesidad de la persona.',
      '2. Comparte brevemente lo que Cristo ha hecho en tu propia vida con humildad.',
      '3. Presenta el mensaje bíblico central: el amor de Dios, la realidad del pecado, Cristo muerto y resucitado, arrepentimiento y fe.',
      '4. Respeta la libertad de respuesta sin discutir ni presionar, ofreciendo seguir orando por esa persona.',
    ],
    practicalTakeaway:
      'Ora hoy por el nombre de tres personas cercanas y pide oportunidad para amarlas y compartirles esperanza.',
  },
];
