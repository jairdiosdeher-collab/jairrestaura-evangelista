export interface SchoolLesson {
  id: string;
  title: string;
  scriptureRefs: string[];
  biblicalTextSummary: string;
  doctrinalDevelopment: string;
  practicalApplication: string;
  everydayExample: string;
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

export interface SchoolCourse {
  id: string;
  levelNumber: number;
  levelTitle: string;
  presentation: string;
  objectives: string[];
  lessons: SchoolLesson[];
}

interface LessonSeed {
  id: string;
  title: string;
  scriptureRefs: string[];
  biblicalTextSummary: string;
  doctrinalDevelopment: string;
  practicalApplication: string;
  everydayExample: string;
  question: string;
  options: [string, string, string];
  correctIndex: number;
  feedback: string;
}

function makeLesson(seed: LessonSeed): SchoolLesson {
  return seed;
}

export const BIBLE_SCHOOL_COURSES: SchoolCourse[] = [
  {
    id: 'nivel-1-evangelizacion',
    levelNumber: 1,
    levelTitle: 'NIVEL 1: EVANGELIZACIÓN',
    presentation:
      'Presenta con claridad, respeto y fidelidad bíblica el corazón del evangelio de Jesucristo para quien busca conocer a Dios.',
    objectives: [
      'Comprender el amor eterno de Dios y la gravedad espiritual del pecado.',
      'Conocer quién es Jesucristo y el significado de Su muerte y resurrección.',
      'Entender el arrepentimiento genuino y la salvación por gracia mediante la fe.',
    ],
    lessons: [
      makeLesson({
        id: 'n1-l1',
        title: 'El amor de Dios',
        scriptureRefs: ['Juan 3:16', 'Romanos 5:8', '1 Juan 4:9-10'],
        biblicalTextSummary:
          'La Escritura declara expresamente que Dios amó al mundo de tal manera que dio a Su Hijo unigénito, aun cuando éramos pecadores.',
        doctrinalDevelopment:
          'El amor de Dios no es una tolerancia indiferente al mal, sino amor santo y redentor que toma la iniciativa para rescatar al ser humano.',
        practicalApplication:
          'Acércate a Dios sin pensar que debes merecer Su afecto primero; responde con gratitud y confianza a Su llamado.',
        everydayExample:
          'Un padre que busca a su hijo perdido en medio de la noche no espera a que el hijo encuentre el camino solo; sale a su encuentro.',
        question: 'Según Romanos 5:8, ¿cuándo demostró Dios Su amor hacia nosotros?',
        options: [
          'Cuando ya éramos espiritualmente perfectos.',
          'Siendo aún pecadores, Cristo murió por nosotros.',
          'Únicamente después de cumplir muchos ritos.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. La iniciativa salvadora nace de la pura gracia y amor de Dios.',
      }),
      makeLesson({
        id: 'n1-l2',
        title: 'El pecado',
        scriptureRefs: ['Romanos 3:23', 'Romanos 6:23', 'Isaías 59:2'],
        biblicalTextSummary:
          'Todos pecaron y están destituidos de la gloria de Dios; nuestras iniquidades hicieron división entre nosotros y Dios.',
        doctrinalDevelopment:
          'El pecado no es solo una falta social; es rebelión o desvío respecto a la voluntad santa de Dios que produce separación espiritual y muerte.',
        practicalApplication:
          'Reconoce con honestidad tu necesidad de salvación sin minimizar el pecado ni caer en desesperación.',
        everydayExample:
          'Una cuerda puede resistir diez eslabones fuertes, pero si uno se rompe, toda la cadena deja de sostener.',
        question: '¿Qué consecuencia espiritual señala Romanos 6:23 como paga del pecado?',
        options: [
          'Solo una molestia pasajera sin importancia eterna.',
          'La muerte espiritual y separación de Dios.',
          'Una deuda que se borra con dinero.',
        ],
        correctIndex: 1,
        feedback: 'Exacto. Por eso necesitamos la dádiva gratuita de Dios en Cristo Jesús.',
      }),
      makeLesson({
        id: 'n1-l3',
        title: 'Jesucristo',
        scriptureRefs: ['Juan 1:1,14', 'Juan 14:6', 'Filipenses 2:6-8'],
        biblicalTextSummary:
          'El Verbo era Dios y se hizo carne; Jesús afirma ser el camino, la verdad y la vida hacia el Padre.',
        doctrinalDevelopment:
          'Jesucristo es verdadero Dios y verdadero hombre en una sola persona, único mediador entre Dios y los hombres (1 Timoteo 2:5).',
        practicalApplication:
          'Conoce a Jesús directamente leyendo los Evangelios y confía en Él como Señor y Salvador.',
        everydayExample:
          'Para cruzar un abismo imposible, no basta admirar el mapa: necesitamos el único puente firme que une ambos lados.',
        question: '¿Por qué es Jesucristo el único mediador entre Dios y la humanidad?',
        options: [
          'Porque es verdadero Dios y verdadero hombre sin pecado.',
          'Porque fue únicamente un filósofo antiguo.',
          'Porque escribió un código político.',
        ],
        correctIndex: 0,
        feedback: 'Correcto. Su naturaleza divina y humana hace posible nuestra reconciliación con el Padre.',
      }),
      makeLesson({
        id: 'n1-l4',
        title: 'La cruz',
        scriptureRefs: ['1 Pedro 2:24', 'Isaías 53:5-6', '2 Corintios 5:21'],
        biblicalTextSummary:
          'Cristo llevó Él mismo nuestros pecados en Su cuerpo sobre el madero y fue herido por nuestras rebeliones.',
        doctrinalDevelopment:
          'En la cruz ocurrió una sustitución redentora: el Justo murió por los injustos para satisfacer la justicia divina y ofrecernos perdón.',
        practicalApplication:
          'Cuando la culpa del pasado te acuse, recuerda que el precio ya fue pagado en el Calvario.',
        everydayExample:
          'Si un juez justo paga de su propio bolsillo la multa impagable de un acusado, la justicia se cumple y la persona queda libre.',
        question: '¿Qué realizó Cristo en la cruz según 1 Pedro 2:24?',
        options: [
          'Solo dio un ejemplo de valentía política.',
          'Llevó nuestros pecados en Su cuerpo para reconciliarnos con Dios.',
          'Permitió que cada uno pague sus propios pecados.',
        ],
        correctIndex: 1,
        feedback: 'Así es. La cruz revela al mismo tiempo la justicia y la misericordia de Dios.',
      }),
      makeLesson({
        id: 'n1-l5',
        title: 'La resurrección',
        scriptureRefs: ['1 Corintios 15:3-4,17', 'Romanos 4:25', 'Juan 11:25'],
        biblicalTextSummary:
          'Cristo resucitó al tercer día conforme a las Escrituras; si no hubiera resucitado, vana sería nuestra fe.',
        doctrinalDevelopment:
          'La resurrección corporal de Jesús certifica que Su sacrificio fue aceptado y garantiza vida eterna a los que creen.',
        practicalApplication:
          'Vive con esperanza real sabiendo que sirves a un Salvador vivo que intercede por ti hoy.',
        everydayExample:
          'Un recibo sellado como “pagado” confirma ante todos que la deuda quedó cancelada.',
        question: '¿Qué demuestra la resurrección corporal de Jesucristo al tercer día?',
        options: [
          'Que Su obra redentora fue aceptada por el Padre y Él venció la muerte.',
          'Que Su enseñanza fue solo una leyenda simbólica.',
          'Que los discípulos olvidaron lo ocurrido.',
        ],
        correctIndex: 0,
        feedback: 'Correcto. La tumba vacía es la garantía histórica y espiritual del evangelio.',
      }),
      makeLesson({
        id: 'n1-l6',
        title: 'El arrepentimiento',
        scriptureRefs: ['Hechos 3:19', 'Lucas 13:3', '2 Corintios 7:10'],
        biblicalTextSummary:
          'Arrepentíos y convertíos para que sean borrados vuestros pecados y vengan tiempos de refrigerio.',
        doctrinalDevelopment:
          'El arrepentimiento bíblico incluye reconocer el pecado, dolerse sinceramente delante de Dios y cambiar de dirección hacia Cristo.',
        practicalApplication:
          'No confundas tristeza momentánea con arrepentimiento; da pasos concretos para apartarte de lo que ofende a Dios.',
        everydayExample:
          'Si vas por una carretera equivocada, lamentarte no cambia tu destino; necesitas girar y tomar el rumbo correcto.',
        question: '¿Qué implica el arrepentimiento genuino en el Nuevo Testamento?',
        options: [
          'Sentir miedo un minuto y seguir exactamente igual.',
          'Un cambio sincero de mente, corazón y dirección hacia Dios.',
          'Cumplir castigos físicos impuestos por hombres.',
        ],
        correctIndex: 1,
        feedback: 'Exacto. Dios siempre recibe al corazón arrepentido que se vuelve a Él.',
      }),
      makeLesson({
        id: 'n1-l7',
        title: 'La salvación',
        scriptureRefs: ['Efesios 2:8-9', 'Romanos 10:9-10', 'Tito 3:5'],
        biblicalTextSummary:
          'Por gracia sois salvos por medio de la fe; no por obras para que nadie se gloríe.',
        doctrinalDevelopment:
          'La salvación es don gratuito de Dios recibido mediante la fe en Jesucristo como Señor y Salvador.',
        practicalApplication:
          'Recibe este regalo con humildad y deja que la gratitud produzca una vida nueva de obediencia.',
        everydayExample:
          'Un regalo costoso ya pagado por quien te ama no se compra dando monedas: se recibe extendiendo la mano con gratitud.',
        question: 'Según Efesios 2:8-9, ¿cómo se recibe la salvación?',
        options: [
          'Por obras religiosas acumuladas durante años.',
          'Por gracia de Dios mediante la fe en Jesucristo.',
          'Por herencia familiar automática.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. La salvación es gracia pura de Dios que transforma la vida.',
      }),
    ],
  },
  {
    id: 'nivel-2-fundamentos',
    levelNumber: 2,
    levelTitle: 'NIVEL 2: FUNDAMENTOS CRISTIANOS',
    presentation:
      'Establece bases firmes para el recién convertido y para todo creyente que desea afirmar su caminar diario.',
    objectives: [
      'Entender el nuevo nacimiento y la seguridad de salvación en Cristo.',
      'Cultivar hábitos firmes de oración y lectura bíblica.',
      'Practicar la fe, el perdón y la santificación cotidiana.',
    ],
    lessons: [
      makeLesson({
        id: 'n2-l1',
        title: 'Nuevo nacimiento',
        scriptureRefs: ['Juan 3:3-7', '1 Pedro 1:23', '2 Corintios 5:17'],
        biblicalTextSummary:
          'El que no naciere de nuevo no puede ver el reino de Dios; somos renacidos por la Palabra viva.',
        doctrinalDevelopment:
          'La regeneración es la obra soberana del Espíritu Santo que imparte vida espiritual nueva al creyente.',
        practicalApplication:
          'Alimenta tu nueva naturaleza leyendo la Escritura y evitando lo que nutre viejos hábitos.',
        everydayExample:
          'Una semilla sembrada en tierra fértil inicia una vida nueva que antes no existía.',
        question: '¿Quién produce el nuevo nacimiento espiritual en la persona que cree?',
        options: [
          'El Espíritu Santo mediante la Palabra de Dios.',
          'El esfuerzo humano aislado.',
          'El simple cambio de apellido.',
        ],
        correctIndex: 0,
        feedback: 'Correcto. Nacer de nuevo es una obra real de Dios en el espíritu humano.',
      }),
      makeLesson({
        id: 'n2-l2',
        title: 'Seguridad de salvación',
        scriptureRefs: ['1 Juan 5:11-13', 'Romanos 8:1,38-39', 'Juan 10:27-29'],
        biblicalTextSummary:
          'Estas cosas os he escrito para que sepáis que tenéis vida eterna los que creéis en el Hijo de Dios.',
        doctrinalDevelopment:
          'La certeza de salvación descansa en la fidelidad de Cristo y Su promesa, unida a una fe perseverante (evitando la presunción y también el temor enfermizo).',
        practicalApplication:
          'Cuando dudes, vuelve a las promesas escritas de Cristo en lugar de medir tu salvación por tu estado de ánimo.',
        everydayExample:
          'Un pasajero en un barco firme puede sentirse mareado, pero su seguridad depende de la solidez del barco y del capitán.',
        question: '¿En qué se apoya fundamentalmente la seguridad de salvación del creyente?',
        options: [
          'En la perfección absoluta de nuestras emociones diarias.',
          'En la obra y promesa fiel de Jesucristo recibida por fe perseverante.',
          'En compararnos favorablemente con vecinos.',
        ],
        correctIndex: 1,
        feedback: 'Exacto. Cristo es nuestra roca fiel y nos guarda mientras permanecemos en Él.',
      }),
      makeLesson({
        id: 'n2-l3',
        title: 'Oración',
        scriptureRefs: ['Mateo 6:5-13', '1 Tesalonicenses 5:17', 'Lucas 11:9-13'],
        biblicalTextSummary:
          'Orad sin cesar; pedid y se os dará, pues el Padre celestial dará el Espíritu Santo a los que se lo pidan.',
        doctrinalDevelopment:
          'La oración es comunión personal del hijo con su Padre celestial en el nombre de Jesús y guiada por el Espíritu.',
        practicalApplication:
          'Reserva un tiempo diario fijo e incluye adoración, confesión, acción de gracias y peticiones por otros.',
        everydayExample:
          'La respiración mantiene vivo el cuerpo; la oración mantiene despierta la comunión del alma con Dios.',
        question: '¿Qué significa “orad sin cesar” en 1 Tesalonicenses 5:17?',
        options: [
          'No dormir ni trabajar nunca.',
          'Mantener una actitud constante de comunión y dependencia de Dios durante el día.',
          'Repetir mecánicamente una sola frase mil veces.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. Es vivir conscientes de la presencia del Señor en todo lugar.',
      }),
      makeLesson({
        id: 'n2-l4',
        title: 'Lectura bíblica',
        scriptureRefs: ['Josué 1:8', 'Salmos 119:11', '2 Timoteo 2:15'],
        biblicalTextSummary:
          'Nunca se apartará de tu boca este libro de la ley; en mi corazón he guardado tus dichos.',
        doctrinalDevelopment:
          'La lectura reverente y contextualizada de toda la Biblia nos libra de errores doctrinales y fortalece la obediencia.',
        practicalApplication:
          'Lee cada día con una libreta anotando qué dice el texto, qué enseña de Dios y cómo aplicarlo hoy.',
        everydayExample:
          'Comer una vez al mes no nutre el cuerpo; la alimentación diaria sostiene las fuerzas.',
        question: '¿Por qué es importante leer los pasajes bíblicos dentro de su contexto?',
        options: [
          'Para comprender el sentido real que comunicó Dios y evitar interpretaciones forzadas.',
          'Para alargar el tiempo sin motivo.',
          'Solo para los historiadores.',
        ],
        correctIndex: 0,
        feedback: 'Exacto. Respetar el contexto protege la pureza de la enseñanza bíblica.',
      }),
      makeLesson({
        id: 'n2-l5',
        title: 'Fe',
        scriptureRefs: ['Hebreos 11:1,6', 'Romanos 10:17', 'Marcos 11:22'],
        biblicalTextSummary:
          'La fe viene por el oír, y el oír por la palabra de Dios.',
        doctrinalDevelopment:
          'La fe bíblica no es credulidad ciega; es confianza razonada y obediente en el Dios que habla en Su Palabra.',
        practicalApplication:
          'Alimenta tu fe escuchando y meditando en la Escritura cuando las circunstancias parezcan contrarias.',
        everydayExample:
          'Un agricultor siembra confiando en las leyes del Creador antes de ver el fruto maduro.',
        question: 'Según Romanos 10:17, ¿cómo crece y se fortalece la fe cristiana?',
        options: [
          'Oyendo y recibiendo la Palabra de Dios.',
          'Repitiendo afirmaciones mágicas sin base bíblica.',
          'Ignorando la realidad.',
        ],
        correctIndex: 0,
        feedback: 'Correcto. La Palabra de Cristo es el alimento genuino de nuestra fe.',
      }),
      makeLesson({
        id: 'n2-l6',
        title: 'Perdón',
        scriptureRefs: ['Efesios 4:32', 'Colosenses 3:13', 'Mateo 18:21-22'],
        biblicalTextSummary:
          'Perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo.',
        doctrinalDevelopment:
          'El perdón cristiano fluye del perdón inmerecido que recibimos de Cristo; libera el corazón del odio, aunque no obliga a tolerar abuso.',
        practicalApplication:
          'Ora por quien te hirió y busca sabiduría pastoral para establecer límites sanos cuando sea necesario.',
        everydayExample:
          'Soltar un carbón encendido que sostenías esperando lanzarlo a otro te sana primero las manos a ti.',
        question: '¿Cuál es el motivo más profundo del perdón cristiano según Efesios 4:32?',
        options: [
          'Fingir que la herida no dolió.',
          'Imitar la misericordia con la que Dios nos perdonó en Cristo.',
          'Olvidar la justicia divina.',
        ],
        correctIndex: 1,
        feedback: 'Exacto. Quien ha recibido tanta gracia aprende, con ayuda de Dios, a soltar el rencor.',
      }),
      makeLesson({
        id: 'n2-l7',
        title: 'Santificación',
        scriptureRefs: ['1 Tesalonicenses 4:3-7', 'Hebreos 12:14', '1 Pedro 1:15-16'],
        biblicalTextSummary:
          'Seguid la paz con todos, y la santidad, sin la cual nadie verá al Señor.',
        doctrinalDevelopment:
          'La santificación significa ser apartados para Dios y transformados progresivamente a la imagen de Cristo por el Espíritu.',
        practicalApplication:
          'Revisa tus decisiones diarias preguntando si edifican, limpian el corazón y honran a Jesús.',
        everydayExample:
          'Los vasos de oro en el templo no eran comunes porque estaban reservados exclusivamente para un uso sagrado.',
        question: '¿Qué es la santificación práctica en la vida del creyente?',
        options: [
          'Creerse superior a los demás por la ropa o apariencias.',
          'Crecer cada día en pureza, obediencia y amor apartado para Dios.',
          'No volver a equivocarse jamás en nada humano.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. La verdadera santidad siempre produce humildad, pureza y amor.',
      }),
    ],
  },
  {
    id: 'nivel-3-trinidad',
    levelNumber: 3,
    levelTitle: 'NIVEL 3: DOCTRINA TRINITARIA',
    presentation:
      'Estudia con fidelidad bíblica la revelación de un solo Dios verdadero eternamente existente en Padre, Hijo y Espíritu Santo.',
    objectives: [
      'Afirmar el monoteísmo bíblico frente a toda forma de politeísmo o error.',
      'Conocer la deidad plena y distinción personal del Padre, del Hijo y del Espíritu Santo.',
      'Contemplar la obra armoniosa de la Trinidad en la creación y la redención.',
    ],
    lessons: [
      makeLesson({
        id: 'n3-l1',
        title: 'La unidad de Dios',
        scriptureRefs: ['Deuteronomio 6:4', 'Isaías 45:5', '1 Timoteo 2:5'],
        biblicalTextSummary:
          'Oye, Israel: Jehová nuestro Dios, Jehová uno es. Fuera de mí no hay Dios.',
        doctrinalDevelopment:
          'El cristianismo bíblico confiesa firmemente que existe un único Dios vivo, Creador eterno e indivisible.',
        practicalApplication:
          'Rinde tu adoración y confianza suprema únicamente al Dios verdadero, rechazando toda idolatría.',
        everydayExample:
          'La base de toda arquitectura bíblica comienza con un fundamento firme: no hay varios dioses compitiendo en el cielo.',
        question: '¿Qué enseña Deuteronomio 6:4 sobre la naturaleza de Dios?',
        options: [
          'Que existe un solo Dios verdadero.',
          'Que cada nación tiene su propio dios válido.',
          'Que Dios apareció después del universo.',
        ],
        correctIndex: 0,
        feedback: 'Correcto. La fe cristiana es estrictamente monoteísta y trinitaria.',
      }),
      makeLesson({
        id: 'n3-l2',
        title: 'Dios Padre',
        scriptureRefs: ['Mateo 6:9', 'Santiago 1:17', 'Juan 3:16'],
        biblicalTextSummary:
          'Padre nuestro que estás en los cielos... Toda buena dádiva desciende del Padre de las luces.',
        doctrinalDevelopment:
          'Dios Padre es fuente eterna de la deidad, Creador soberano y Padre amoroso que envió al Hijo para nuestra salvación.',
        practicalApplication:
          'Acércate con reverencia y confianza filial, sabiendo que el Padre conoce tus necesidades antes de que pidas.',
        everydayExample:
          'Un padre sabio no concede caprichos dañinos, pero cuida, corrige y provee con amor fiel.',
        question: '¿Cómo revela Jesús al Padre celestial en los Evangelios?',
        options: [
          'Como un juez distante sin interés por Sus hijos.',
          'Como santo, soberano y cercano Padre lleno de amor y verdad.',
          'Como una fuerza impersonal sin voluntad.',
        ],
        correctIndex: 1,
        feedback: 'Exacto. En Cristo conocemos el corazón santo y paternal de Dios.',
      }),
      makeLesson({
        id: 'n3-l3',
        title: 'Jesucristo, Dios Hijo',
        scriptureRefs: ['Juan 1:1-3', 'Colosenses 2:9', 'Hebreos 1:3,8'],
        biblicalTextSummary:
          'En él habita corporalmente toda la plenitud de la Deidad; todas las cosas por él fueron hechas.',
        doctrinalDevelopment:
          'El Hijo no fue creado; es Dios eterno igual al Padre en esencia, quien se encarnó para redimirnos.',
        practicalApplication:
          'Adora y obedece a Jesucristo como Señor absoluto de tu historia y de tu eternidad.',
        everydayExample:
          'El resplandor inseparable del sol manifiesta su luz sin dividir su fuente.',
        question: '¿Qué enseña Colosenses 2:9 sobre Jesucristo?',
        options: [
          'Que solo recibió una porción temporal de sabiduría.',
          'Que en Él habita corporalmente toda la plenitud de la Deidad.',
          'Que dejó de ser Dios al nacer en Belén.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. Jesucristo es plenamente Dios y plenamente hombre.',
      }),
      makeLesson({
        id: 'n3-l4',
        title: 'El Espíritu Santo',
        scriptureRefs: ['Hechos 5:3-4', 'Juan 14:26', 'Efesios 4:30'],
        biblicalTextSummary:
          'El Espíritu Santo enseña, consuela, puede ser contristado y Pedro declara: No has mentido a los hombres, sino a Dios.',
        doctrinalDevelopment:
          'El Espíritu Santo no es una mera energía o corriente impersonal; es la tercera Persona divina, coigual y coeterna con el Padre y el Hijo.',
        practicalApplication:
          'Trata al Espíritu Santo con reverencia personal, escuchando Su convicción y cuidando no contristarlo con pecado.',
        everydayExample:
          'Una energía eléctrica no puede amar, enseñar ni entristecerse; una Persona divina sí.',
        question: '¿Cómo demuestra la Biblia que el Espíritu Santo es una Persona divina y no solo una fuerza?',
        options: [
          'Porque habla, enseña, intercede, ama y es llamado Dios en la Escritura.',
          'Porque solo aparece en símbolos naturales.',
          'Porque únicamente actúa sobre objetos.',
        ],
        correctIndex: 0,
        feedback: 'Exacto. Posee mente, voluntad y amor divinos.',
      }),
      makeLesson({
        id: 'n3-l5',
        title: 'La Trinidad',
        scriptureRefs: ['Mateo 3:16-17', 'Mateo 28:19', '2 Corintios 13:14'],
        biblicalTextSummary:
          'En el bautismo de Jesús, el Hijo sale del agua, el Espíritu desciende y el Padre habla desde el cielo.',
        doctrinalDevelopment:
          'Hay un solo Dios verdadero en tres personas distintas (Padre, Hijo y Espíritu Santo), evitando tanto decir “tres dioses” como confundir las personas en una sola.',
        practicalApplication:
          'Confiesa con sencillez lo que la Escritura afirma aunque nuestra mente finita adore ante el misterio de Dios.',
        everydayExample:
          'En Mateo 3:16-17 las tres personas están presentes simultáneamente en perfecta comunión y unidad.',
        question: '¿Cuál es el error que evita la doctrina bíblica de la Trinidad?',
        options: [
          'Afirmar tres dioses separados o confundir al Padre, Hijo y Espíritu como una sola persona.',
          'Leer el Antiguo y Nuevo Testamento juntos.',
          'Orar al Padre en el nombre de Jesús.',
        ],
        correctIndex: 0,
        feedback: 'Correcto. Un solo Dios en esencia, tres personas reales en comunión eterna.',
      }),
      makeLesson({
        id: 'n3-l6',
        title: 'La obra de las tres personas divinas',
        scriptureRefs: ['Efesios 1:3-14', 'Efesios 2:18', '1 Pedro 1:2'],
        biblicalTextSummary:
          'El Padre planifica y bendice, el Hijo nos redime con Su sangre y el Espíritu Santo nos sella como arras de nuestra herencia.',
        doctrinalDevelopment:
          'Toda obra exterior de Dios hacia la humanidad refleja la armonía perfecta de las tres personas divinas.',
        practicalApplication:
          'Vive cada oración agradeciendo el plan del Padre, la redención de Cristo y el sello del Espíritu.',
        everydayExample:
          'En Efesios 2:18, por medio de Cristo tenemos entrada por un mismo Espíritu al Padre.',
        question: 'En Efesios 1:3-14, ¿cómo participan el Padre, el Hijo y el Espíritu en nuestra salvación?',
        options: [
          'Trabajan en desorden compitiendo entre sí.',
          'En perfecta unidad: el Padre elige y bendice, el Hijo redime y el Espíritu sella.',
          'Solo una persona participa mientras las otras observan.',
        ],
        correctIndex: 1,
        feedback: 'Exacto. Nuestra salvación entera es obra gloriosa del Dios Trino.',
      }),
    ],
  },
  {
    id: 'nivel-4-pentecostal',
    levelNumber: 4,
    levelTitle: 'NIVEL 4: DOCTRINA PENTECOSTAL',
    presentation:
      'Explora el obrar del Espíritu Santo en Pentecostés, sus dones vigentes y su fruto transformador conforme a las Escrituras y al MMM.',
    objectives: [
      'Entender Pentecostés y la promesa del bautismo en el Espíritu Santo.',
      'Valorar los dones espirituales con orden bíblico y el fruto del Espíritu.',
      'Crecer en adoración, vida de oración y pasión misionera.',
    ],
    lessons: [
      makeLesson({
        id: 'n4-l1',
        title: 'Pentecostés',
        scriptureRefs: ['Hechos 2:1-4,16-18', 'Joel 2:28-29'],
        biblicalTextSummary:
          'Al cumplirse el día de Pentecostés fueron todos llenos del Espíritu Santo, cumpliendo la profecía de Joel.',
        doctrinalDevelopment:
          'Pentecostés marca el derramamiento prometido del Espíritu sobre la Iglesia para dar testimonio universal del Señor resucitado.',
        practicalApplication:
          'Valora la historia de los Hechos reconociendo que el mismo Espíritu sostiene hoy a la Iglesia.',
        everydayExample:
          'Un barco con velas listas necesita el viento del cielo para avanzar con fuerza hacia su destino.',
        question: '¿Qué profecía del Antiguo Testamento citó Pedro en Hechos 2 para explicar Pentecostés?',
        options: [
          'La profecía de Joel sobre el derramamiento del Espíritu sobre toda carne.',
          'Un proverbio romano.',
          'Una norma agrícola.',
        ],
        correctIndex: 0,
        feedback: 'Correcto. Dios había prometido este derramamiento glorioso desde Joel 2.',
      }),
      makeLesson({
        id: 'n4-l2',
        title: 'Bautismo en el Espíritu Santo',
        scriptureRefs: ['Hechos 1:8', 'Hechos 2:4', 'Hechos 8:14-17', 'Lucas 11:13'],
        biblicalTextSummary:
          'Recibiréis poder cuando haya venido sobre vosotros el Espíritu Santo y me seréis testigos.',
        doctrinalDevelopment:
          'La enseñanza pentecostal distingue la morada del Espíritu en el nuevo nacimiento de la investidura de poder del bautismo en el Espíritu Santo; algunas tradiciones hermanas las unen en un solo momento, lo cual reconocemos con respeto sin perder nuestra convicción bíblica.',
        practicalApplication:
          'Busca con fe, humildad y paciencia ser revestido de poder desde lo alto, sin compararte ni sentirte menos que otros.',
        everydayExample:
          'Tener agua viva en un pozo calma la sed; un río desbordado riega además todo el campo alrededor.',
        question: '¿Con qué actitud pastoral debe buscarse el bautismo en el Espíritu Santo?',
        options: [
          'Con presión o comparándose con los demás.',
          'Con fe, humildad y oración sincera, buscando poder para testificar de Cristo.',
          'Buscando espectáculo personal.',
        ],
        correctIndex: 1,
        feedback: 'Exacto. Dios da el Espíritu Santo a quienes lo piden con corazón sincero.',
      }),
      makeLesson({
        id: 'n4-l3',
        title: 'Dones espirituales',
        scriptureRefs: ['1 Corintios 12:4-11', '1 Corintios 14:1,26,40'],
        biblicalTextSummary:
          'A cada uno le es dada la manifestación del Espíritu para provecho; hágase todo para edificación y con orden.',
        doctrinalDevelopment:
          'Los dones espirituales siguen vigentes hoy y no son premios al orgullo, sino herramientas de servicio que el Espíritu reparte para edificar al cuerpo de Cristo.',
        practicalApplication:
          'Procura los dones espirituales acompañados siempre del amor bíblico de 1 Corintios 13.',
        everydayExample:
          'En una orquesta cada instrumento tiene una función distinta para crear armonía bajo la dirección del director.',
        question: 'Según 1 Corintios 12:7 y 14:26, ¿para qué da el Espíritu Santo los dones?',
        options: [
          'Para competir en fama dentro de la congregación.',
          'Para provecho común y edificación de la Iglesia con orden y amor.',
          'Para reemplazar el estudio de la Biblia.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. Todo don genuino glorifica a Cristo y edifica al prójimo.',
      }),
      makeLesson({
        id: 'n4-l4',
        title: 'Fruto del Espíritu',
        scriptureRefs: ['Gálatas 5:22-25', 'Mateo 7:16-20'],
        biblicalTextSummary:
          'Mas el fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza.',
        doctrinalDevelopment:
          'Mientras los dones capacitan para el servicio, el fruto del Espíritu refleja el carácter maduro de Cristo en la vida diaria.',
        practicalApplication:
          'Evalúa tu crecimiento espiritual observando cómo tratas a tu familia cuando estás cansado o bajo presión.',
        everydayExample:
          'Un adorno se cuelga de un árbol en minutos; el fruto real crece desde la raíz con savia y constancia.',
        question: '¿Qué distingue al fruto del Espíritu en Gálatas 5:22-23?',
        options: [
          'Nueve rasgos de carácter cristiano centrados en el amor de Cristo.',
          'Solo hablar en público.',
          'Ausencia total de pruebas.',
        ],
        correctIndex: 0,
        feedback: 'Correcto. El carácter de Cristo es la señal más clara de una vida guiada por el Espíritu.',
      }),
      makeLesson({
        id: 'n4-l5',
        title: 'Vida de oración',
        scriptureRefs: ['Efesios 6:18', 'Judas 1:20', 'Romanos 8:26'],
        biblicalTextSummary:
          'El Espíritu nos ayuda en nuestra debilidad y ora conforme a la voluntad de Dios.',
        doctrinalDevelopment:
          'La oración perseverante en el Espíritu sostiene al creyente en la batalla espiritual y lo mantiene sensible a la voz de Dios.',
        practicalApplication:
          'Cuando no sepas qué palabras usar ante una crisis, descansa en la intercesión del Espíritu Santo.',
        everydayExample:
          'Mantener comunicación abierta con el guía de montaña evita perder el sendero en la neblina.',
        question: '¿Qué promete Romanos 8:26 cuando no sabemos cómo pedir como conviene?',
        options: [
          'Que Dios ignora nuestras oraciones débiles.',
          'Que el Espíritu mismo nos ayuda en nuestra debilidad e intercede conforme a Dios.',
          'Que debemos esperar hasta sentir euforia.',
        ],
        correctIndex: 1,
        feedback: 'Exacto. No oramos con nuestras fuerzas solas, sino asistidos por el Espíritu.',
      }),
      makeLesson({
        id: 'n4-l6',
        title: 'Adoración',
        scriptureRefs: ['Juan 4:23-24', 'Salmos 95:6', 'Romanos 12:1'],
        biblicalTextSummary:
          'Los verdaderos adoradores adorarán al Padre en espíritu y en verdad.',
        doctrinalDevelopment:
          'La adoración cristiana une verdad bíblica y corazón rendido, expresándose tanto en el culto congregacional como en la obediencia diaria.',
        practicalApplication:
          'Adora a Dios con integridad el lunes en tu trabajo igual que el domingo en el templo.',
        everydayExample:
          'Cantar una canción hermosa cobra sentido real cuando refleja fidelidad diaria en casa.',
        question: '¿Qué significa adorar al Padre “en espíritu y en verdad” (Juan 4:24)?',
        options: [
          'Adorar solo mediante música fuerte sin leer la Biblia.',
          'Adorar con sinceridad espiritual guiada por la verdad revelada de Dios en Cristo.',
          'Asistir únicamente a lugares históricos.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. Espíritu y verdad caminan siempre unidos en la adoración bíblica.',
      }),
      makeLesson({
        id: 'n4-l7',
        title: 'Misión evangelizadora',
        scriptureRefs: ['Mateo 28:18-20', 'Marcos 16:15', 'Hechos 1:8'],
        biblicalTextSummary:
          'Id por todo el mundo y predicad el evangelio a toda criatura; seréis testigos hasta lo último de la tierra.',
        doctrinalDevelopment:
          'La unción pentecostal siempre impulsa hacia afuera: amar a los perdidos, anunciar a Cristo y hacer discípulos.',
        practicalApplication:
          'Ora por oportunidades semanales para compartir el amor y la verdad de Jesús en tu entorno cercano.',
        everydayExample:
          'Quien encontró agua pura en el desierto no la esconde; guía a otros hacia la fuente.',
        question: '¿Cuál es el resultado natural de la llenura del Espíritu Santo en la Iglesia?',
        options: [
          'Encerrarse sin interés por la necesidad del mundo.',
          'Compasión activa y valentía humilde para evangelizar y hacer discípulos.',
          'Discutir sin amor.',
        ],
        correctIndex: 1,
        feedback: 'Exacto. Evangelizar y discipular están en el corazón de la misión de la Iglesia.',
      }),
    ],
  },
  {
    id: 'nivel-5-vida-cristiana',
    levelNumber: 5,
    levelTitle: 'NIVEL 5: VIDA CRISTIANA',
    presentation:
      'Aplica las ordenanzas de Cristo, la santidad práctica, la vida familiar, la iglesia y la mayordomía fiel.',
    objectives: [
      'Comprender el bautismo en agua y la Santa Cena según el Nuevo Testamento.',
      'Aplicar principios bíblicos en la familia, congregación, servicio y finanzas.',
    ],
    lessons: [
      makeLesson({
        id: 'n5-l1',
        title: 'Bautismo en agua',
        scriptureRefs: ['Mateo 28:19', 'Romanos 6:3-4', 'Hechos 8:36-38'],
        biblicalTextSummary:
          'Bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo; sepultados con Él para andar en vida nueva.',
        doctrinalDevelopment:
          'El bautismo en agua es ordenanza instituida por Cristo para creyentes arrepentidos como testimonio público de unión con Su muerte y resurrección.',
        practicalApplication:
          'Si ya creíste en Cristo y aún no te has bautizado, conversa con tu pastor o con el Pastor Jair para dar este paso con instrucción bíblica.',
        everydayExample:
          'Ponerse el uniforme oficial delante de todos declara públicamente a qué equipo perteneces con honor.',
        question: '¿Qué simboliza el bautismo en agua según Romanos 6:4?',
        options: [
          'Un baño físico que quita pecados por sí solo.',
          'Testimonio público de muerte al pecado y resurrección a una vida nueva en Cristo.',
          'Un trámite administrativo sin valor espiritual.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. El agua no salva por magia; da testimonio público de una fe viva en Cristo.',
      }),
      makeLesson({
        id: 'n5-l2',
        title: 'Santa Cena',
        scriptureRefs: ['1 Corintios 11:23-28', 'Lucas 22:19-20'],
        biblicalTextSummary:
          'Haced esto en memoria de mí... todas las veces que comiereis este pan y bebiereis esta copa, la muerte del Señor anunciáis.',
        doctrinalDevelopment:
          'La Santa Cena es memorial solemne y comunión espiritual con Cristo y Su cuerpo, precedida por examen propio.',
        practicalApplication:
          'Antes de participar, examina tu corazón en oración, confiesa cualquier falta y reconcíliate si ofendiste a alguien.',
        everydayExample:
          'Sentarse alrededor de una misma mesa familiar renueva el vínculo de unidad y memoria agradecida.',
        question: '¿Qué recomienda 1 Corintios 11:28 antes de participar de la Santa Cena?',
        options: [
          'Examinarse cada uno a sí mismo delante del Señor con reverencia.',
          'Participar distraído sin pensar en el sacrificio de Cristo.',
          'Creerse perfecto sin necesidad de gracia.',
        ],
        correctIndex: 0,
        feedback: 'Exacto. El examen propio conduce al arrepentimiento y a una comunión gozosa.',
      }),
      makeLesson({
        id: 'n5-l3',
        title: 'Santidad',
        scriptureRefs: ['2 Corintios 7:1', 'Efesios 4:22-32', '1 Tesalonicenses 5:22'],
        biblicalTextSummary:
          'Despojaos del viejo hombre... vestíos del nuevo hombre creado según Dios en la justicia y santidad de la verdad.',
        doctrinalDevelopment:
          'La santidad abarca el habla veraz, la pureza moral, la integridad laboral y el dominio propio.',
        practicalApplication:
          'Cambia la murmuración, la ira y la mentira por palabras que impartan gracia a los oyentes.',
        everydayExample:
          'Quitarse ropa manchada antes de ponerse un traje limpio ilustra el cambio diario del carácter.',
        question: '¿Cómo se manifiesta la santidad bíblica en el trato con el prójimo (Efesios 4)?',
        options: [
          'Con amargura y críticas constantes.',
          'Con verdad, mansedumbre, trabajo honesto y perdón mutuo.',
          'Despreciando a quienes aún no conocen a Dios.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. La santidad auténtica brilla en integridad y misericordia.',
      }),
      makeLesson({
        id: 'n5-l4',
        title: 'Familia cristiana',
        scriptureRefs: ['Efesios 5:21-6:4', 'Colosenses 3:18-21', 'Josué 24:15'],
        biblicalTextSummary:
          'Someteos unos a otros en el temor de Dios... Padres, no provoquéis a ira a vuestros hijos, sino criadlos en disciplina y amonestación del Señor.',
        doctrinalDevelopment:
          'El hogar cristiano se edifica sobre el respeto mutuo, la fidelidad matrimonial, el amor sacrificial y la enseñanza de la Palabra.',
        practicalApplication:
          'Dedica un momento semanal para orar en familia, escuchar con paciencia y pedir perdón cuando te equivoques.',
        everydayExample:
          'Un hogar donde se pide perdón y se ora juntos se convierte en un refugio frente a las tormentas externas.',
        question: '¿Qué principio gobierna las relaciones familiares en Efesios 5:21-6:4?',
        options: [
          'El autoritarismo duro sin diálogo.',
          'El amor sacrificial, el respeto mutuo y la instrucción paciente en el Señor.',
          'La indiferencia entre padres e hijos.',
        ],
        correctIndex: 1,
        feedback: 'Exacto. El amor de Cristo transforma primero nuestra manera de amar en casa.',
      }),
      makeLesson({
        id: 'n5-l5',
        title: 'Iglesia',
        scriptureRefs: ['Efesios 4:11-16', 'Hebreos 10:24-25', 'Hechos 2:42'],
        biblicalTextSummary:
          'Perseveraban en la doctrina de los apóstoles, en la comunión unos con otros, en el partimiento del pan y en las oraciones.',
        doctrinalDevelopment:
          'La Iglesia local es la familia visible de Dios donde somos instruidos, cuidados pastoralmente y enviados a servir.',
        practicalApplication:
          'Intégrate activamente a una iglesia cristiana bíblica sana en tu ciudad.',
        everydayExample:
          'Un órgano del cuerpo sano vive conectado al organismo completo; separado pierde vitalidad.',
        question: '¿Cuáles eran las cuatro columnas de la iglesia primitiva en Hechos 2:42?',
        options: [
          'Doctrina apostólica, comunión fraternal, partimiento del pan y oraciones.',
          'Entretenimiento, competencia y aislamiento.',
          'Solo discursos anuales.',
        ],
        correctIndex: 0,
        feedback: 'Correcto. Ese modelo bíblico sigue vigente para toda congregación saludable.',
      }),
      makeLesson({
        id: 'n5-l6',
        title: 'Servicio',
        scriptureRefs: ['Marcos 10:45', 'Gálatas 5:13', 'Colosenses 3:23-24'],
        biblicalTextSummary:
          'El Hijo del Hombre no vino para ser servido, sino para servir; servíos por amor los unos a los otros.',
        doctrinalDevelopment:
          'El servicio cristiano nace del ejemplo humilde de Jesús y convierte cualquier tarea cotidiana en ofrenda para Dios.',
        practicalApplication:
          'Pregúntate cada semana: ¿a quién puedo ayudar hoy de forma silenciosa y práctica?',
        everydayExample:
          'Jesús lavando los pies de sus discípulos redefinió la verdadera grandeza espiritual.',
        question: '¿Qué actitud motiva el servicio cristiano auténtico?',
        options: [
          'Buscar aplausos y cargos visibles.',
          'El amor a Dios y al prójimo siguiendo el ejemplo humilde de Jesús.',
          'Sentir obligación amarga.',
        ],
        correctIndex: 1,
        feedback: 'Exacto. Servimos con gozo sabiendo que servimos a Cristo el Señor.',
      }),
      makeLesson({
        id: 'n5-l7',
        title: 'Mayordomía',
        scriptureRefs: ['Salmos 24:1', '1 Corintios 4:2', '2 Corintios 9:7'],
        biblicalTextSummary:
          'De Jehová es la tierra y su plenitud; cada uno dé como propuso en su corazón, no con tristeza ni por necesidad.',
        doctrinalDevelopment:
          'Todo lo que somos y tenemos (tiempo, salud, dones y bienes) pertenece a Dios; la generosidad cristiana es alegre y libre, nunca manipulada.',
        practicalApplication:
          'Administra con orden tu tiempo, honra tu trabajo y practica la generosidad voluntaria con corazón agradecido.',
        everydayExample:
          'Un buen administrador cuida los bienes confiados con fidelidad, sabiendo que rinde cuentas al dueño.',
        question: 'Según 2 Corintios 9:7, ¿cómo enseña el Nuevo Testamento a practicar la generosidad?',
        options: [
          'Bajo presión o esperando ganancias mágicas garantizadas.',
          'Con libertad, alegría y gratitud en el corazón, no por obligación triste.',
          'Únicamente para recibir reconocimiento público.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. Dios ama al dador alegre y rechaza toda manipulación.',
      }),
    ],
  },
  {
    id: 'nivel-6-discipulos',
    levelNumber: 6,
    levelTitle: 'NIVEL 6: FORMACIÓN DE DISCÍPULOS',
    presentation:
      'Capacita al creyente maduro para evangelizar con respeto, acompañar a nuevos convertidos y ejercer un liderazgo de servicio.',
    objectives: [
      'Aprender a compartir el evangelio con claridad y mansedumbre.',
      'Acompañar bíblicamente a otros en sus primeros pasos.',
      'Desarrollar carácter cristiano íntegro y liderazgo servicial.',
    ],
    lessons: [
      makeLesson({
        id: 'n6-l1',
        title: 'Evangelización personal',
        scriptureRefs: ['Juan 1:40-46', 'Colosenses 4:5-6', '1 Pedro 3:15'],
        biblicalTextSummary:
          'Andrés halló primero a su hermano Simón y le trajo a Jesús; sea vuestra palabra siempre con gracia.',
        doctrinalDevelopment:
          'La evangelización personal fluye de un corazón agradecido que ama a su prójimo y respeta su conciencia.',
        practicalApplication:
          'Aprende a escuchar primero las cargas de tus amigos antes de compartir la esperanza en Cristo.',
        everydayExample:
          'Felipe simplemente invitó a Natanael con naturalidad: “Ven y ve”.',
        question: '¿Qué caracteriza una buena evangelización personal según Colosenses 4:6?',
        options: [
          'Imponer argumentos con agresividad.',
          'Hablar con gracia, sabiduría y respeto a cada persona.',
          'Evitar mencionar a Jesús.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. La verdad del evangelio siempre brilla mejor acompañada de gracia.',
      }),
      makeLesson({
        id: 'n6-l2',
        title: 'Cómo compartir el evangelio',
        scriptureRefs: ['Romanos 1:16', '1 Corintios 15:1-4', 'Hechos 26:16-18'],
        biblicalTextSummary:
          'No me avergüenzo del evangelio, porque es poder de Dios para salvación a todo aquel que cree.',
        doctrinalDevelopment:
          'Un mensaje claro presenta quién es Dios, nuestra necesidad por el pecado, la obra de Cristo en la cruz y resurrección, y la invitación al arrepentimiento y fe.',
        practicalApplication:
          'Practica explicar el mensaje central del evangelio en tres minutos usando citas bíblicas claras.',
        everydayExample:
          'Contar brevemente “cómo era mi vida, cómo conocí a Cristo y qué esperanza tengo hoy” abre muchos corazones.',
        question: '¿Qué elemento NO puede faltar al compartir el mensaje bíblico del evangelio?',
        options: [
          'La persona, muerte y resurrección de Jesucristo para salvación por gracia mediante la fe.',
          'Promesas de éxito económico automático.',
          'Debates políticos.',
        ],
        correctIndex: 0,
        feedback: 'Exacto. Jesucristo crucificado y resucitado es el centro mismo del evangelio.',
      }),
      makeLesson({
        id: 'n6-l3',
        title: 'Discipulado',
        scriptureRefs: ['Mateo 28:19-20', '2 Timoteo 2:2'],
        biblicalTextSummary:
          'Lo que has oído de mí ante muchos testigos, esto encarga a hombres fieles que sean idóneos para enseñar también a otros.',
        doctrinalDevelopment:
          'El discipulado no termina en una oración inicial; es caminar junto a otros enseñándoles a guardar todo lo que Cristo mandó.',
        practicalApplication:
          'Acompaña a alguien nuevo leyéndole juntos un capítulo bíblico por semana y orando por sus necesidades.',
        everydayExample:
          'Una antorcha encendida transmite su llama a otra sin perder su propia luz.',
        question: '¿Qué enseña 2 Timoteo 2:2 sobre el crecimiento de la Iglesia?',
        options: [
          'Que solo una persona debe hacer todo sin enseñar a otros.',
          'Una cadena fiel de discípulos que aprenden y capacitan a otros en la Palabra.',
          'Que el estudio termina después de la primera semana.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. Todo discípulo maduro aprende para luego servir y acompañar a otros.',
      }),
      makeLesson({
        id: 'n6-l4',
        title: 'Servicio cristiano',
        scriptureRefs: ['Romanos 12:6-11', '1 Pedro 4:10-11'],
        biblicalTextSummary:
          'En lo que requiere diligencia, no perezosos; fervientes en espíritu, sirviendo al Señor.',
        doctrinalDevelopment:
          'Servir con diligencia y constancia protege a la congregación y glorifica al Padre.',
        practicalApplication:
          'Cumple con puntualidad y humildad los compromisos que asumas en tu iglesia local.',
        everydayExample:
          'Quien barre la entrada o recibe con una sonrisa a un visitante sirve al mismo Señor que quien predica.',
        question: '¿Cómo glorifica a Dios nuestro servicio según 1 Pedro 4:11?',
        options: [
          'Sirviendo conforme al poder que Dios da, para que Él sea glorificado en Cristo.',
          'Buscando reconocimiento propio.',
          'Trabajando solo cuando hay público.',
        ],
        correctIndex: 0,
        feedback: 'Exacto. Dependemos de la fuerza que Dios provee y Le damos toda la gloria.',
      }),
      makeLesson({
        id: 'n6-l5',
        title: 'Carácter cristiano',
        scriptureRefs: ['Filipenses 2:3-5', '1 Timoteo 4:12', 'Tito 2:7-8'],
        biblicalTextSummary:
          'Haya en vosotros este sentir que hubo también en Cristo Jesús; sé ejemplo de los creyentes en palabra, conducta, amor, espíritu, fe y pureza.',
        doctrinalDevelopment:
          'El carácter vale más que el talento: integridad en lo privado, humildad, veracidad y dominio propio.',
        practicalApplication:
          'Rinde cuentas a un pastor o creyente maduro y corrige con humildad cualquier incoherencia en tu trato diario.',
        everydayExample:
          'Los cimientos ocultos bajo tierra determinan cuánta tormenta resiste un edificio.',
        question: 'Según 1 Timoteo 4:12, ¿en qué áreas debe ser ejemplo el creyente?',
        options: [
          'Solo en discursos dominicales.',
          'En palabra, conducta, amor, espíritu, fe y pureza.',
          'Únicamente en conocimientos teóricos.',
        ],
        correctIndex: 1,
        feedback: 'Correcto. El testimonio de vida respalda cada palabra que predicamos.',
      }),
      makeLesson({
        id: 'n6-l6',
        title: 'Liderazgo de servicio',
        scriptureRefs: ['1 Pedro 5:2-4', 'Juan 13:12-15', 'Lucas 22:26'],
        biblicalTextSummary:
          'Apacentad la grey de Dios... no como teniendo señorío sobre los que están a vuestro cuidado, sino siendo ejemplos de la grey.',
        doctrinalDevelopment:
          'El liderazgo cristiano nunca manipula ni domina por interés; cuida, protege, enseña con ejemplo y responde ante el Príncipe de los pastores.',
        practicalApplication:
          'Si Dios te confía guiar a otros en casa o en la iglesia, escucha con paciencia y sirve primero.',
        everydayExample:
          'Un buen pastor camina delante para guiar y detrás para recoger al que cojea, nunca empujando con dureza.',
        question: '¿Qué advierte 1 Pedro 5:3 a quienes cuidan o guían a otros creyentes?',
        options: [
          'No tener señorío ni imposición sobre ellos, sino ser ejemplos humildes.',
          'Exigir obediencia ciega.',
          'Buscar ganancia personal.',
        ],
        correctIndex: 0,
        feedback: 'Correcto. Cristo es el único Señor de la Iglesia; los líderes son siervos y ejemplos.',
      }),
    ],
  },
];
