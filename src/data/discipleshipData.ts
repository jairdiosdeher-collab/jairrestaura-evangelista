export interface DiscipleshipPhase {
  id: 'semana-1' | 'mes-1' | 'mes-2' | 'mes-3' | 'trinidad' | 'pentecostal';
  label: string;
  subtitle: string;
  durationHint: string;
}

export interface DiscipleshipLesson {
  id: string;
  phaseId: DiscipleshipPhase['id'];
  dayRangeLabel: string;
  title: string;
  scriptureRef: string;
  scriptureQuote: string;
  objective: string;
  doctrinalPoints: string[];
  everydayExample: string;
  prayerFocus: string;
  reflectionQuestion: string;
  quizQuestion: string;
  quizOptions: string[];
  quizCorrectIndex: number;
  quizFeedback: string;
  nextLessonId?: string;
}

export const DISCIPLESHIP_PHASES: DiscipleshipPhase[] = [
  {
    id: 'semana-1',
    label: 'Semana 1',
    subtitle: 'Primeros pasos en el evangelio y nueva vida en Cristo',
    durationHint: 'Días 1 al 7',
  },
  {
    id: 'mes-1',
    label: 'Mes 1',
    subtitle: 'Fundamentos de salvación, oración y Biblia',
    durationHint: 'Días 8 al 30',
  },
  {
    id: 'mes-2',
    label: 'Mes 2',
    subtitle: 'Carácter cristiano, santificación y ordenanzas',
    durationHint: 'Días 31 al 60',
  },
  {
    id: 'mes-3',
    label: 'Mes 3',
    subtitle: 'Iglesia, servicio, familia y evangelización',
    durationHint: 'Días 61 al 90',
  },
  {
    id: 'trinidad',
    label: 'Doctrina Trinitaria',
    subtitle: 'Un solo Dios verdadero en Padre, Hijo y Espíritu Santo',
    durationHint: 'Estudio doctrinal',
  },
  {
    id: 'pentecostal',
    label: 'Vida en el Espíritu',
    subtitle: 'Pentecostés, dones, fruto del Espíritu y misión',
    durationHint: 'Estudio pentecostal',
  },
];

export const DISCIPLESHIP_LESSONS: DiscipleshipLesson[] = [
  {
    id: 'dia-1',
    phaseId: 'semana-1',
    dayRangeLabel: 'Día 1–2',
    title: 'La certeza del amor de Dios y el nuevo nacimiento',
    scriptureRef: 'Juan 3:16 · 2 Corintios 5:17',
    scriptureQuote:
      'De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.',
    objective:
      'Comprender que la vida cristiana no comienza con esfuerzos externos sino con una relación real y nueva con Dios por medio de Jesucristo.',
    doctrinalPoints: [
      'Texto bíblico: El nuevo nacimiento es obra espiritual de Dios en quien cree en Jesucristo.',
      'Doctrina: La regeneración nos traslada de muerte espiritual a ser hijos de Dios por fe.',
      'Aplicación: No te apoyes solo en emociones pasajeras; afirma tu confianza en la promesa escrita de Cristo.',
    ],
    everydayExample:
      'Así como un recién nacido no comienza corriendo sino respirando y alimentándose cada día, el nuevo creyente crece poco a poco con la Palabra.',
    prayerFocus:
      'Agradece a Dios por Su misericordia y pídele que confirme cada mañana tu identidad nueva en Cristo.',
    reflectionQuestion:
      '¿Qué diferencia práctica notas entre cumplir reglas religiosas por temor y caminar como hijo amado de Dios?',
    quizQuestion: 'Según 2 Corintios 5:17, ¿qué ocurre cuando alguien está verdaderamente en Cristo?',
    quizOptions: [
      'Se vuelve inmediatamente libre de toda prueba o dificultad.',
      'Es hecho una nueva criatura con un comienzo nuevo en Dios.',
      'Debe pagar sus culpas pasadas con buenas obras antes de acercarse a Dios.',
    ],
    quizCorrectIndex: 1,
    quizFeedback:
      'Correcto. Cristo nos da una nueva vida e identidad en Dios, aunque sigamos creciendo y enfrentando pruebas con Su ayuda.',
    nextLessonId: 'dia-3',
  },
  {
    id: 'dia-3',
    phaseId: 'semana-1',
    dayRangeLabel: 'Día 3–4',
    title: 'Cómo hablar con Dios cada día mediante la oración',
    scriptureRef: 'Mateo 6:6-9 · Filipenses 4:6',
    scriptureQuote:
      'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.',
    objective:
      'Aprender a orar con sencillez, sinceridad y constancia sin fórmulas vacías ni temor.',
    doctrinalPoints: [
      'Texto bíblico: Jesús enseña a dirigirnos a Dios como Padre en lo secreto, sin vanas repeticiones.',
      'Doctrina: Por medio de Cristo y el Espíritu Santo tenemos libre acceso al trono de la gracia.',
      'Aplicación: Combina adoración, gratitud, confesión sincera e intercesión en un momento fijo del día.',
    ],
    everydayExample:
      'Orar no es dar un discurso elegante; es conversar con un Padre amoroso mientras desayunas, antes de trabajar o al cerrar el día.',
    prayerFocus:
      'Separa hoy diez minutos tranquilos para hablar con Dios con tus propias palabras sobre lo que vives.',
    reflectionQuestion:
      '¿En qué momento del día te resulta más constante y tranquilo reservar un espacio diario de oración?',
    quizQuestion: '¿Qué actitud enseña Jesús en Mateo 6 respecto a la oración?',
    quizOptions: [
      'Sinceridad de corazón delante del Padre, evitando aparentar ante los demás.',
      'Repetir frases largas sin pensar en lo que se dice.',
      'Orar únicamente cuando ya no quede ninguna otra salida.',
    ],
    quizCorrectIndex: 0,
    quizFeedback:
      'Exacto. Dios valora la sinceridad y la confianza filial por encima de las palabras rebuscadas.',
    nextLessonId: 'dia-5',
  },
  {
    id: 'dia-5',
    phaseId: 'semana-1',
    dayRangeLabel: 'Día 5–7',
    title: 'La Biblia: alimento diario y guía segura',
    scriptureRef: 'Salmos 119:105 · 1 Pedro 2:2',
    scriptureQuote:
      'Desead, como niños recién nacidos, la leche espiritual no adulterada, para que por ella crezcáis para salvación.',
    objective:
      'Descubrir cómo comenzar a leer la Biblia diariamente entendiendo lo que lees y aplicándolo con obediencia.',
    doctrinalPoints: [
      'Texto bíblico: La Palabra es lámpara que alumbra los pasos concretos del creyente.',
      'Doctrina: Las Sagradas Escrituras son inspiradas por Dios y constituyen la regla suprema de fe y conducta.',
      'Aplicación: Comienza por los Evangelios (Marcos o Juan), lee el contexto completo y anota una verdad para practicar hoy.',
    ],
    everydayExample:
      'Una linterna en la noche no siempre muestra todo el camino a cinco kilómetros, pero ilumina con claridad el siguiente paso seguro.',
    prayerFocus:
      'Pide al Espíritu Santo entendimiento cada vez que abras la Biblia.',
    reflectionQuestion:
      '¿Qué capítulo de los Evangelios leerás hoy para escuchar la voz de Jesús?',
    quizQuestion: '¿Para qué compara 1 Pedro 2:2 la Palabra de Dios con la leche espiritual?',
    quizOptions: [
      'Para indicar que solo sirve durante la infancia.',
      'Porque nutre y hace crecer espiritualmente al creyente día tras día.',
      'Para sustituir la necesidad de orar y congregarse.',
    ],
    quizCorrectIndex: 1,
    quizFeedback:
      'Correcto. La lectura constante de la Escritura alimenta nuestra fe y fortalece nuestro discernimiento.',
    nextLessonId: 'mes1-1',
  },
  {
    id: 'mes1-1',
    phaseId: 'mes-1',
    dayRangeLabel: 'Días 8–15',
    title: 'Arrepentimiento genuino, confesión y perdón',
    scriptureRef: '1 Juan 1:9 · Hechos 3:19',
    scriptureQuote:
      'Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad.',
    objective:
      'Aprender la diferencia entre remordimiento destructivo y arrepentimiento bíblico que conduce a restauración.',
    doctrinalPoints: [
      'Texto bíblico: Dios promete fidelidad y justicia para limpiar al que confiesa su pecado con verdad.',
      'Doctrina: El creyente no justifica el pecado; lo reconoce, se aparta de él y confía en la sangre de Cristo.',
      'Aplicación: Si fallas, no te escondas de Dios; acude de inmediato en confesión humilde y restaura lo dañado cuando corresponda.',
    ],
    everydayExample:
      'Cuando un niño se ensucia y huye de su padre sigue sucio; cuando vuelve con confianza, es lavado y abrazado.',
    prayerFocus:
      'Examínate delante del Señor con paz y agradece por la limpieza diaria en Jesucristo.',
    reflectionQuestion:
      '¿Hay algún hábito o resentimiento que necesitas entregar hoy delante de Dios?',
    quizQuestion: '¿Qué nos asegura 1 Juan 1:9 cuando confesamos nuestros pecados con sinceridad?',
    quizOptions: [
      'Que Dios nos perdona y nos limpia de toda maldad por Su fidelidad.',
      'Que debemos esperar varios meses para volver a orar.',
      'Que el pecado ya no tiene ninguna consecuencia práctica en la tierra.',
    ],
    quizCorrectIndex: 0,
    quizFeedback:
      'Así es. Dios perdona y limpia de veras al corazón contrito y humillado.',
    nextLessonId: 'mes1-2',
  },
  {
    id: 'mes1-2',
    phaseId: 'mes-1',
    dayRangeLabel: 'Días 16–30',
    title: 'Fe viva, confianza en la prueba y obediencia',
    scriptureRef: 'Hebreos 11:1,6 · Santiago 2:17',
    scriptureQuote:
      'Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve.',
    objective:
      'Entender que la fe bíblica no es pensamiento positivo ni negación de la realidad, sino confianza obediente en el carácter de Dios.',
    doctrinalPoints: [
      'Texto bíblico: Sin fe es imposible agradar a Dios, creyendo que Él existe y recompensa a los que le buscan.',
      'Doctrina: La salvación es por fe sola, pero la fe verdadera nunca está sola: produce fruto de obediencia y amor.',
      'Aplicación: En los días nublados, obedece lo que ya sabes de la Escritura aunque aún no veas la respuesta completa.',
    ],
    everydayExample:
      'Confiar en un puente firme no depende de gritar fuerte, sino de atreverte a caminar sobre él.',
    prayerFocus:
      'Pide al Señor aumentar tu fe y obediencia en una decisión concreta de esta semana.',
    reflectionQuestion:
      '¿En qué área concreta de tu vida estás llamado hoy a confiar en Dios más allá de lo que ves?',
    quizQuestion: '¿Cómo describe la Biblia la relación entre la fe verdadera y las obras de obediencia?',
    quizOptions: [
      'Las obras compran la salvación primero y luego viene la fe.',
      'La fe salvadora es genuina cuando se expresa en obediencia y amor práctico.',
      'La fe es solo una idea mental que no cambia la conducta.',
    ],
    quizCorrectIndex: 1,
    quizFeedback:
      'Correcto. Somos salvos por gracia mediante la fe (Efesios 2:8-9), y esa fe viva da fruto de buenas obras (Efesios 2:10).',
    nextLessonId: 'mes2-1',
  },
  {
    id: 'mes2-1',
    phaseId: 'mes-2',
    dayRangeLabel: 'Días 31–45',
    title: 'Santificación y transformación diaria del carácter',
    scriptureRef: '1 Tesalonicenses 4:3 · Romanos 12:1-2',
    scriptureQuote:
      'Pues la voluntad de Dios es vuestra santificación... No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento.',
    objective:
      'Comprender la santidad bíblica como separación del pecado y consagración gozosa a Dios, no como orgullo ni legalismo.',
    doctrinalPoints: [
      'Texto bíblico: La transformación comienza renovando la mente por medio de la Palabra y el Espíritu.',
      'Doctrina: El creyente es apartado posicionalmente en Cristo y llamado a crecer progresivamente en santidad práctica.',
      'Aplicación: Cuida lo que miras, escuchas, hablas y deseas para honrar al Señor en lo público y lo privado.',
    ],
    everydayExample:
      'Así como una casa limpia requiere cuidado diario y no solo una limpieza al año, el alma necesita renovación constante.',
    prayerFocus:
      'Consagra hoy tus pensamientos, palabras y decisiones al Señor.',
    reflectionQuestion:
      '¿Qué influencia cotidiana te está alejando de la paz y pureza cristiana?',
    quizQuestion: 'Según Romanos 12:2, ¿cómo ocurre la transformación práctica del creyente?',
    quizOptions: [
      'Imitando las modas del mundo sin discernimiento.',
      'Por medio de la renovación del entendimiento conforme a la voluntad de Dios.',
      'Aislándose completamente de toda persona que no sea creyente.',
    ],
    quizCorrectIndex: 1,
    quizFeedback:
      'Exacto. Cuando la Palabra renueva nuestra manera de pensar, nuestra conducta cambia desde adentro.',
    nextLessonId: 'mes2-2',
  },
  {
    id: 'mes2-2',
    phaseId: 'mes-2',
    dayRangeLabel: 'Días 46–60',
    title: 'El bautismo en agua y la Santa Cena',
    scriptureRef: 'Romanos 6:3-4 · 1 Corintios 11:23-26',
    scriptureQuote:
      'Porque somos sepultados juntamente con él para muerte por el bautismo, a fin de que como Cristo resucitó de los muertos... así también nosotros andemos en vida nueva.',
    objective:
      'Valorar el significado bíblico de las dos ordenanzas instituidas por Jesucristo para Su Iglesia.',
    doctrinalPoints: [
      'Texto bíblico: El bautismo en agua simboliza muerte al viejo hombre y resurrección a vida nueva; la Santa Cena anuncia la muerte del Señor hasta que Él venga.',
      'Doctrina: No son ritos mágicos que salvan por sí solos, sino actos solemnes de obediencia y comunión de quien ya creyó.',
      'Aplicación: Prepárate con discernimiento pastoral para bautizarte en una congregación sana y participar con reverencia de la mesa del Señor.',
    ],
    everydayExample:
      'Un anillo de matrimonio no crea el amor por arte de magia, pero da testimonio público y solemne de un compromiso verdadero.',
    prayerFocus:
      'Agradece a Cristo por Su sacrificio recordado en el pan y la copa, y ora por tu próximo paso de obediencia.',
    reflectionQuestion:
      'Si ya creíste en Jesús, ¿has dado o te estás preparando para dar el paso del bautismo en agua?',
    quizQuestion: '¿Qué proclama la Iglesia cada vez que participa con fe de la Santa Cena?',
    quizOptions: [
      'Los méritos propios de los asistentes.',
      'La muerte redentora del Señor Jesucristo hasta que Él vuelva.',
      'Una tradición cultural sin significado espiritual.',
    ],
    quizCorrectIndex: 1,
    quizFeedback:
      'Correcto. Conforme a 1 Corintios 11:26, anunciamos la muerte del Señor hasta que Él venga.',
    nextLessonId: 'mes3-1',
  },
  {
    id: 'mes3-1',
    phaseId: 'mes-3',
    dayRangeLabel: 'Días 61–75',
    title: 'La Iglesia, la comunión fraternal y la familia cristiana',
    scriptureRef: 'Hebreos 10:24-25 · Efesios 5:21-6:4',
    scriptureQuote:
      'Y considerémonos unos a otros para estimularnos al amor y a las buenas obras; no dejando de congregarnos.',
    objective:
      'Integrar la fe en la vida congregacional y en el hogar, superando el individualismo espiritual.',
    doctrinalPoints: [
      'Texto bíblico: La Iglesia es el cuerpo de Cristo donde nos exhortamos, servimos y sostenemos mutuamente.',
      'Doctrina: Ningún asistente digital sustituye la comunión presencial, el cuidado pastoral y la mesa de una iglesia local.',
      'Aplicación: Busca integrarte a una congregación bíblica saludable y lleva el trato amable de Cristo a tu propia casa.',
    ],
    everydayExample:
      'Una brasa encendida fuera de la hoguera se enfría pronto; unida a las demás mantiene vivo el fuego.',
    prayerFocus:
      'Ora por tu familia y por la congregación donde Dios te guíe a servir.',
    reflectionQuestion:
      '¿Cómo puedes servir esta semana a un hermano en la fe o a alguien de tu hogar?',
    quizQuestion: '¿Por qué exhorta Hebreos 10:24-25 a no dejar de congregarnos?',
    quizOptions: [
      'Para cumplir una estadística de asistencia.',
      'Para estimularnos mutuamente al amor, a las buenas obras y a la perseverancia.',
      'Porque Dios solo escucha las oraciones dentro de un edificio.',
    ],
    quizCorrectIndex: 1,
    quizFeedback:
      'Exacto. Dios diseñó la comunidad cristiana para edificarnos y sostenernos unos a otros.',
    nextLessonId: 'mes3-2',
  },
  {
    id: 'mes3-2',
    phaseId: 'mes-3',
    dayRangeLabel: 'Días 76–90',
    title: 'Mayordomía, servicio y misión evangelizadora',
    scriptureRef: 'Marcos 16:15 · 1 Pedro 3:15 · 4:10',
    scriptureQuote:
      'Cada uno según el don que ha recibido, minístrelo a los otros, como buenos administradores de la multiforme gracia de Dios.',
    objective:
      'Asumir la vocación de todo discípulo: administrar tiempo, dones y recursos con fidelidad y compartir el evangelio con respeto.',
    doctrinalPoints: [
      'Texto bíblico: Todo creyente es llamado a servir según el don recibido y dar razón de su esperanza con mansedumbre y reverencia.',
      'Doctrina: La gran comisión no pertenece únicamente a pastores; cada discípulo es testigo de Cristo en su entorno.',
      'Aplicación: Ora por tres personas de tu entorno y comparte el evangelio con testimonio íntegro y palabras claras.',
    ],
    everydayExample:
      'No necesitas saber teología avanzada para invitar a alguien a conocer el pan que sació tu propia hambre espiritual.',
    prayerFocus:
      'Pide a Dios amor genuino por las personas que aún no conocen a Cristo.',
    reflectionQuestion:
      '¿Qué don, tiempo o testimonio puedes poner esta semana al servicio del Señor?',
    quizQuestion: 'Según 1 Pedro 3:15, ¿con qué actitud debemos responder cuando alguien pregunta por nuestra fe?',
    quizOptions: [
      'Con arrogancia y discusiones interminables.',
      'Con mansedumbre y reverencia, presentando nuestra esperanza en Cristo.',
      'Guardando silencio por temor a equivocarnos.',
    ],
    quizCorrectIndex: 1,
    quizFeedback:
      'Correcto. La verdad del evangelio siempre debe compartirse con amor, mansedumbre y respeto.',
    nextLessonId: 'trin-1',
  },
  {
    id: 'trin-1',
    phaseId: 'trinidad',
    dayRangeLabel: 'Trinidad · 1',
    title: 'Un solo Dios en tres personas: Padre, Hijo y Espíritu Santo',
    scriptureRef: 'Deuteronomio 6:4 · Mateo 28:19 · 2 Corintios 13:14',
    scriptureQuote:
      'La gracia del Señor Jesucristo, el amor de Dios, y la comunión del Espíritu Santo sean con todos vosotros.',
    objective:
      'Afirmar la fe bíblica trinitaria: un solo Dios verdadero, eterno y perfecto en tres personas distintas.',
    doctrinalPoints: [
      'Texto bíblico: La Escritura enseña un único Dios vivo (Deuteronomio 6:4) y nombra conjuntamente al Padre, al Hijo y al Espíritu Santo en unidad divina (Mateo 28:19).',
      'Doctrina: No existen tres dioses (triteísmo) ni un Dios que cambia de máscara (modalismo); el Padre no es el Hijo, el Hijo no es el Espíritu, pero los tres comparten la misma naturaleza divina.',
      'Aplicación: Honra plenamente al Padre, adora a Jesucristo como Dios y Señor, y camina en obediencia al Espíritu Santo.',
    ],
    everydayExample:
      'Ninguna analogía humana agota el misterio de Dios; por eso nos sujetamos con reverencia a lo que la Biblia revela directamente en el bautismo de Jesús (Mateo 3:16-17).',
    prayerFocus:
      'Adora al Dios Trino reconociendo la obra armoniosa del Padre, del Hijo y del Espíritu en tu salvación.',
    reflectionQuestion:
      '¿Cómo te ayuda saber que el Padre te ama, el Hijo intercede por ti y el Espíritu mora contigo?',
    quizQuestion: '¿Qué afirma la doctrina bíblica trinitaria?',
    quizOptions: [
      'Que existen tres dioses distintos que trabajan por separado.',
      'Que hay un solo Dios verdadero eternamente existente en tres personas: Padre, Hijo y Espíritu Santo.',
      'Que Jesús fue únicamente un ángel creado antes que el mundo.',
    ],
    quizCorrectIndex: 1,
    quizFeedback:
      'Correcto. Esta es la confesión histórica evangélica y trinitaria fiel a toda la Escritura.',
    nextLessonId: 'pent-1',
  },
  {
    id: 'pent-1',
    phaseId: 'pentecostal',
    dayRangeLabel: 'Pentecostés · 1',
    title: 'El bautismo en el Espíritu Santo, dones y fruto espiritual',
    scriptureRef: 'Hechos 1:8 · Hechos 2:4 · Gálatas 5:22-23 · 1 Corintios 12',
    scriptureQuote:
      'Pero recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos.',
    objective:
      'Comprender la enseñanza bíblica pentecostal sobre la promesa del Espíritu Santo con equilibrio pastoral, sin presiones ni comparaciones.',
    doctrinalPoints: [
      'Texto bíblico: Jesús prometió revestimiento de poder desde lo alto para testificar (Hechos 1:8), lo cual se cumplió en Pentecostés (Hechos 2).',
      'Doctrina: Conforme al MMM y la doctrina pentecostal, los dones del Espíritu siguen vigentes para edificar la Iglesia y deben ir siempre acompañados del fruto del Espíritu (amor, gozo, paz, dominio propio).',
      'Aplicación: Nunca compares tu proceso con el de otros ni midas tu valor por emociones; busca con sinceridad la llenura del Espíritu para amar, obedecer y testificar.',
    ],
    everydayExample:
      'Una vela encendida no brilla para competir con otras velas, sino para disipar la oscuridad donde fue puesta.',
    prayerFocus:
      'Pide al Padre que llene tu vida del Espíritu Santo conforme a Lucas 11:13 y Gálatas 5:22-23.',
    reflectionQuestion:
      '¿Qué aspecto del fruto del Espíritu necesitas pedir hoy con mayor urgencia para tu familia o trabajo?',
    quizQuestion: 'Según Hechos 1:8, ¿cuál es el propósito central del poder del Espíritu Santo sobre el creyente?',
    quizOptions: [
      'Presumir superioridad espiritual sobre otros hermanos.',
      'Capacitar al creyente para ser testigo fiel de Jesucristo con poder y amor.',
      'Evitar tener que estudiar las Sagradas Escrituras.',
    ],
    quizCorrectIndex: 1,
    quizFeedback:
      'Exacto. El poder del Espíritu Santo glorifica a Cristo y nos hace testigos suyos con humildad y valentía.',
  },
];
