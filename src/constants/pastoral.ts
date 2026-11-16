export const PASTOR_WHATSAPP_NUMBER = '+573124710702';
export const PASTOR_WHATSAPP_DISPLAY = '+57 312 471 0702';

export const PASTOR_WHATSAPP_DEFAULT_MESSAGE =
  'Hola, Pastor Jair. Estoy utilizando JAIRRESTAURA – EVANGELISTA y deseo recibir orientación y acompañamiento espiritual.';

export const PASTOR_WHATSAPP_URL =
  'https://wa.me/573124710702?text=Hola%2C%20Pastor%20Jair.%20Estoy%20utilizando%20JAIRRESTAURA%20%E2%80%93%20EVANGELISTA%20y%20deseo%20recibir%20orientaci%C3%B3n%20y%20acompa%C3%B1amiento%20espiritual.';

export function buildPastorWhatsAppUrl(customText?: string): string {
  if (!customText || !customText.trim()) {
    return PASTOR_WHATSAPP_URL;
  }
  return `https://wa.me/573124710702?text=${encodeURIComponent(customText.trim())}`;
}

export const INITIAL_WELCOME_MESSAGE = `¡Bienvenido a JAIRRESTAURA – EVANGELISTA!

Este es un espacio para conocer a Jesucristo, aprender de la Palabra de Dios y crecer en la fe.

No importa si apenas estás comenzando tu camino cristiano o si llevas tiempo buscando respuestas: aquí encontrarás orientación bíblica para avanzar paso a paso.

Podemos comenzar conociendo el evangelio, estudiando la Biblia o iniciando tu discipulado.

Y si necesitas hablar personalmente con un pastor, puedes comunicarte con el Pastor Jair por WhatsApp.

¡Comencemos este camino de crecimiento espiritual!`;

export const CORE_MOTTO = 'EVANGELIZAR · ENSEÑAR · DISCIPULAR · ACOMPAÑAR';

export const FINAL_MOTTO_LINES = [
  'EVANGELIZAR PARA ALCANZAR.',
  'ENSEÑAR PARA FUNDAMENTAR.',
  'DISCIPULAR PARA CONSOLIDAR.',
  'ACOMPAÑAR PARA CRECER EN CRISTO.',
];

export const HERO_IMAGE_PATH = '/src/assets/images/hero_sanctuary_bible_1794845043879.jpg';
export const DISCIPLESHIP_IMAGE_PATH = '/src/assets/images/module_discipleship_path_1794845044071.jpg';
export const PASTORAL_IMAGE_PATH = '/src/assets/images/module_pastoral_care_1794845043811.jpg';

export interface EvangelismStep {
  step: number;
  title: string;
  scriptureRef: string;
  scriptureQuote: string;
  biblicalTextNote: string;
  explanation: string;
  reflectionQuestion: string;
}

export const EVANGELISM_STEPS: EvangelismStep[] = [
  {
    step: 1,
    title: 'El amor de Dios por ti',
    scriptureRef: 'Juan 3:16',
    scriptureQuote:
      'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
    biblicalTextNote:
      'El texto afirma expresamente que la iniciativa de la salvación nace del amor de Dios hacia toda la humanidad.',
    explanation:
      'Dios no es distante ni indiferente a tu vida. Antes de que lo busques, Él ya dio muestra de su amor eterno enviando a Jesucristo para ofrecerte reconciliación y esperanza.',
    reflectionQuestion:
      '¿Cómo cambia tu perspectiva saber que Dios te ama de forma personal y busca tu bienestar eterno?',
  },
  {
    step: 2,
    title: 'Quién es Jesucristo',
    scriptureRef: 'Juan 14:6 · Colosenses 2:9',
    scriptureQuote:
      'Jesús le dijo: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.',
    biblicalTextNote:
      'Jesús se presenta en los Evangelios como el único mediador que conduce al Padre, verdadero Dios y verdadero hombre.',
    explanation:
      'Jesucristo no es solo un buen maestro moral. Conforme a las Escrituras, es el Hijo eterno de Dios que se hizo hombre, vivió sin pecado y reveló plenamente el corazón del Padre.',
    reflectionQuestion:
      '¿Qué significa para ti que Jesús se ofrezca como el camino directo hacia Dios?',
  },
  {
    step: 3,
    title: 'El problema del pecado',
    scriptureRef: 'Romanos 3:23 · Romanos 6:23',
    scriptureQuote:
      'Por cuanto todos pecaron, y están destituidos de la gloria de Dios... Porque la paga del pecado es muerte, mas la dádiva de Dios es vida eterna en Cristo Jesús Señor nuestro.',
    biblicalTextNote:
      'La Escritura señala con claridad que toda persona ha fallado delante de Dios y que el pecado produce separación espiritual.',
    explanation:
      'El pecado no es únicamente un error pequeño; es vivir apartados de la voluntad de Dios. Nuestros propios méritos o buenas obras no alcanzan para borrar esa distancia.',
    reflectionQuestion:
      '¿Has sentido alguna vez el peso de decisiones o faltas que te alejan de la paz con Dios?',
  },
  {
    step: 4,
    title: 'La muerte y resurrección de Jesús',
    scriptureRef: '1 Corintios 15:3-4 · Romanos 5:8',
    scriptureQuote:
      'Que Cristo murió por nuestros pecados, conforme a las Escrituras; y que fue sepultado, y que resucitó al tercer día, conforme a las Escrituras.',
    biblicalTextNote:
      'El núcleo histórico y espiritual del evangelio es la muerte vicaria de Cristo en la cruz y su resurrección corporal al tercer día.',
    explanation:
      'En la cruz, Jesús tomó nuestro lugar y cargó la culpa de nuestros pecados. Su resurrección demuestra que el sacrificio fue aceptado y que Él tiene poder sobre la muerte para darnos vida nueva.',
    reflectionQuestion:
      '¿Qué esperanza trae a tu vida saber que Cristo venció la muerte y hoy vive?',
  },
  {
    step: 5,
    title: 'El arrepentimiento sincero',
    scriptureRef: 'Hechos 3:19 · Lucas 13:3',
    scriptureQuote:
      'Así que, arrepentíos y convertíos, para que sean borrados vuestros pecados; para que vengan de la presencia del Señor tiempos de refrigerio.',
    biblicalTextNote:
      'Arrepentirse en el Nuevo Testamento implica un cambio genuino de mente, actitud y dirección hacia Dios.',
    explanation:
      'Arrepentirse no es simplemente sentir remordimiento momentáneo ni cumplir un rito externo. Es reconocer con humildad nuestra necesidad de Dios, dolernos por el pecado y volvernos a Cristo con sinceridad.',
    reflectionQuestion:
      '¿Hay áreas de tu vida en las que sientes el llamado a cambiar de rumbo y volverte a Dios?',
  },
  {
    step: 6,
    title: 'La salvación por gracia mediante la fe',
    scriptureRef: 'Efesios 2:8-9 · Romanos 10:9',
    scriptureQuote:
      'Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios; no por obras, para que nadie se gloríe.',
    biblicalTextNote:
      'La salvación se recibe como un regalo inmerecido (gracia) mediante la confianza personal (fe) en Jesucristo.',
    explanation:
      'No compramos el perdón con sacrificios ni perfeccionismo. Creer en Jesucristo es confiar plenamente en lo que Él hizo en la cruz y recibirlo como Señor y Salvador, lo cual produce fruto de obediencia.',
    reflectionQuestion:
      '¿Comprendes la diferencia entre intentar ganarte el favor de Dios por mérito propio y recibir su gracia por fe?',
  },
  {
    step: 7,
    title: 'Una invitación libre y voluntaria',
    scriptureRef: 'Apocalipsis 3:20 · Josué 24:15',
    scriptureQuote:
      'He aquí, yo estoy a la puerta y llamo; si alguno oye mi voz y abre la puerta, entraré a él, y cenaré con él, y él conmigo.',
    biblicalTextNote:
      'Dios llama con amor a la puerta del corazón humano, respetando siempre la libertad de conciencia.',
    explanation:
      'Nadie debe presionarte ni manipularte para tomar una decisión espiritual. Cristo toca la puerta con paciencia. Si hoy deseas conocerlo, puedes orar con tus propias palabras pidiéndole perdón y abriéndole tu vida; o si prefieres seguir leyendo y preguntando, este espacio camina contigo a tu ritmo.',
    reflectionQuestion:
      '¿Deseas hablar hoy con Dios en oración o conversar tus preguntas con el asistente o el Pastor Jair?',
  },
];

export const BIBLICAL_FOUNDATIONS = [
  {
    title: 'Inspiración de las Escrituras',
    ref: '2 Timoteo 3:16-17',
    summary: 'La Biblia es la Palabra inspirada por Dios y autoridad suprema de fe y conducta.',
  },
  {
    title: 'Un Dios en tres personas',
    ref: 'Mateo 28:19 · 2 Co. 13:14',
    summary: 'Un solo Dios verdadero eternamente existente en Padre, Hijo y Espíritu Santo.',
  },
  {
    title: 'Divinidad y humanidad de Cristo',
    ref: 'Juan 1:1,14 · Fil. 2:6-8',
    summary: 'Jesucristo es verdadero Dios y verdadero hombre, concebido por el Espíritu Santo.',
  },
  {
    title: 'El pecado y la necesidad de salvación',
    ref: 'Romanos 3:23',
    summary: 'Toda la humanidad necesita redención y reconciliación con el Creador.',
  },
  {
    title: 'Salvación por gracia mediante la fe',
    ref: 'Efesios 2:8-9',
    summary: 'El perdón y la vida eterna son don de Dios en Cristo Jesús.',
  },
  {
    title: 'Arrepentimiento y nuevo nacimiento',
    ref: 'Juan 3:3-5 · Hechos 3:19',
    summary: 'La regeneración espiritual transforma el corazón y nos hace hijos de Dios.',
  },
  {
    title: 'Santificación y vida de obediencia',
    ref: '1 Tesalonicenses 4:3 · Heb. 12:14',
    summary: 'El creyente es llamado a crecer en santidad práctica cada día.',
  },
  {
    title: 'El bautismo en agua',
    ref: 'Mateo 28:19 · Romanos 6:4',
    summary: 'Ordenanza instituida por Cristo como testimonio público de fe y vida nueva.',
  },
  {
    title: 'El bautismo en el Espíritu Santo',
    ref: 'Hechos 1:8 · Hechos 2:4',
    summary: 'Promesa del Padre que reviste al creyente de poder para testificar.',
  },
  {
    title: 'Dones y fruto del Espíritu',
    ref: '1 Co. 12 · Gálatas 5:22-23',
    summary: 'Vigencia de los dones espirituales para edificación y carácter cristiano.',
  },
  {
    title: 'La segunda venida de Cristo',
    ref: '1 Tesalonicenses 4:16-17',
    summary: 'La esperanza bienaventurada del regreso glorioso del Señor Jesucristo.',
  },
  {
    title: 'Resurrección, vida eterna y misión',
    ref: 'Juan 11:25 · Marcos 16:15',
    summary: 'La Iglesia es enviada a predicar el evangelio a toda criatura.',
  },
];

export interface PastoralTopic {
  id: string;
  title: string;
  scripture: string;
  verseText: string;
  guidance: string;
  practicalStep: string;
  chatPrompt: string;
}

export const PASTORAL_CARE_TOPICS: PastoralTopic[] = [
  {
    id: 'dudas-fe',
    title: 'Dudas de fe',
    scripture: 'Marcos 9:24 · Judas 1:22',
    verseText: 'Creo; ayuda mi incredulidad.',
    guidance:
      'Tener preguntas no te convierte en alguien rechazado por Dios. La Escritura muestra hombres y mujeres sinceros que llevaron sus dudas delante del Señor y encontraron luz en Su Palabra.',
    practicalStep:
      'Anota tu pregunta principal sin temor y léela a la luz del contexto bíblico junto con el asistente o un pastor.',
    chatPrompt:
      'Estoy atravesando dudas en mi fe y me gustaría conversar con sinceridad sobre ellas desde la Biblia.',
  },
  {
    id: 'temor-ansiedad',
    title: 'Temor y ansiedad',
    scripture: 'Filipenses 4:6-7 · 1 Pedro 5:7',
    verseText: 'Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.',
    guidance:
      'La paz de Dios guarda el corazón en medio de la incertidumbre. Recordar Su fidelidad nos sostiene, sin descuidar el acompañamiento humano o médico cuando la ansiedad afecta la salud diaria.',
    practicalStep:
      'Entrega en oración específica aquello que hoy te inquieta y conversa con alguien de confianza o un profesional si la carga es intensa.',
    chatPrompt:
      'Siento temor y ansiedad en esta etapa de mi vida. ¿Qué orientación bíblica me puede dar paz?',
  },
  {
    id: 'conflictos-familiares',
    title: 'Conflictos familiares',
    scripture: 'Colosenses 3:13 · Proverbios 15:1',
    verseText: 'La blanda respuesta quita la ira; mas la palabra áspera hace subir el furor.',
    guidance:
      'El hogar es un lugar clave donde se prueba la paciencia y el amor cristiano. La Biblia llama a escuchar antes de responder, procurar la paz y poner límites sanos con respeto.',
    practicalStep:
      'Ora antes de hablar sobre un tema difícil y busca una conversación serena buscando comprensión mutua.',
    chatPrompt:
      'Estoy viviendo un conflicto familiar y necesito sabiduría bíblica para manejarlo con amor y firmeza.',
  },
  {
    id: 'perdon',
    title: 'El perdón',
    scripture: 'Efesios 4:32 · Mateo 6:14-15',
    verseText:
      'Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo.',
    guidance:
      'Perdonar no significa justificar el daño recibido ni exponerse a maltrato; significa entregar la justicia a Dios y soltar el rencor que lastima el alma.',
    practicalStep:
      'Pide al Espíritu Santo disposición para perdonar paso a paso, y busca consejo pastoral si la herida es profunda.',
    chatPrompt:
      'Me cuesta perdonar a alguien que me lastimó mucho. ¿Cómo enseña la Biblia a dar ese paso sin negar el dolor?',
  },
  {
    id: 'relaciones',
    title: 'Relaciones interpersonales',
    scripture: 'Romanos 12:18 · 1 Corintios 13:4-7',
    verseText: 'Si es posible, en cuanto dependa de vosotros, estad en paz con todos los hombres.',
    guidance:
      'Las relaciones sanas se edifican sobre la verdad, el respeto, la humildad y la pureza de propósito. Aprender a amar como Cristo transforma nuestras amistades y vínculos.',
    practicalStep:
      'Evalúa si tus palabras y actitudes edifican a quienes te rodean y pide sabiduría para cultivar amistades sanas.',
    chatPrompt:
      'Quiero aprender a construir relaciones interpersonales sanas y honrar a Dios en mi trato con los demás.',
  },
  {
    id: 'habitos-disciplina',
    title: 'Hábitos y disciplina cristiana',
    scripture: '1 Timoteo 4:7-8 · Salmos 119:9',
    verseText:
      'Ejercítate para la piedad; porque el ejercicio corporal para poco es provechoso, pero la piedad para todo aprovecha.',
    guidance:
      'La vida cristiana se fortalece mediante hábitos constantes: lectura diaria de la Escritura, oración perseverante, dominio propio y abandono gradual de prácticas que dañan.',
    practicalStep:
      'Establece un horario fijo de 15 minutos diarios para leer un capítulo bíblico y orar sin distracciones.',
    chatPrompt:
      'Necesito ayuda práctica y bíblica para mejorar mis hábitos y tener constancia en mi disciplina cristiana.',
  },
  {
    id: 'desanimo',
    title: 'Desánimo espiritual',
    scripture: 'Isaías 40:31 · Salmos 42:11',
    verseText:
      'Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.',
    guidance:
      'Todos los creyentes atraviesan temporadas de cansancio interior. El desánimo no significa que Dios te haya abandonado; Él renueva las fuerzas del que espera en Su promesa.',
    practicalStep:
      'Descansa adecuadamente, vuelve a los Salmos y comparte tu carga con el Pastor Jair o hermanos maduros en la fe.',
    chatPrompt:
      'Me siento espiritualmente desanimado y sin fuerzas para orar. ¿Cómo puedo renovar mi comunión con Dios?',
  },
  {
    id: 'congregarse',
    title: 'Dificultades para congregarse',
    scripture: 'Hebreos 10:24-25 · Salmos 133:1',
    verseText: 'No dejando de congregarnos, como algunos tienen por costumbre, sino exhortándonos.',
    guidance:
      'La fe cristiana no se vive en aislamiento. Si has tenido malas experiencias, horarios complejos o temor de acercarte a una iglesia, Dios puede guiarte hacia una comunidad bíblica sana.',
    practicalStep:
      'Conversa con el Pastor Jair sobre cómo encontrar o integrarte a una congregación sana cerca de ti.',
    chatPrompt:
      'Tengo dificultades para congregarme en una iglesia local y quisiera orientación bíblica sobre este tema.',
  },
];

export const SPIRITUAL_PROFILES = [
  'Buscando conocer a Dios',
  'Recién convertido',
  'Creciendo en la fe',
  'Atravesando una crisis',
  'Deseo aprender a evangelizar',
];
