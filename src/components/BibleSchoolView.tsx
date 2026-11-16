import { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  GraduationCap,
  Library,
  MessageSquare,
} from 'lucide-react';
import { BIBLE_SCHOOL_COURSES } from '../data/bibleSchoolData';
import {
  RESOURCE_CATEGORIES,
  RESOURCE_LIBRARY,
  type ResourceCategory,
} from '../data/resourceLibraryData';
import { PASTOR_WHATSAPP_URL } from '../constants/pastoral';
import { WhatsAppOfficialIcon } from './WhatsAppButton';

interface BibleSchoolViewProps {
  initialTab?: 'escuela' | 'biblioteca';
  onAskAssistant: (lessonTitle: string, prompt: string) => void;
}

const SCHOOL_PROGRESS_KEY = 'jairrestaura_school_completed';
const SCHOOL_NOTES_KEY = 'jairrestaura_school_notes';

export default function BibleSchoolView({
  initialTab = 'escuela',
  onAskAssistant,
}: BibleSchoolViewProps) {
  const [activeTab, setActiveTab] = useState<'escuela' | 'biblioteca'>(initialTab);
  const [selectedCourseId, setSelectedCourseId] = useState(BIBLE_SCHOOL_COURSES[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState(
    BIBLE_SCHOOL_COURSES[0].lessons[0].id
  );
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SCHOOL_PROGRESS_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [notesByLesson, setNotesByLesson] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(SCHOOL_NOTES_KEY);
      return saved ? (JSON.parse(saved) as Record<string, string>) : {};
    } catch {
      return {};
    }
  });
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<'Todos' | ResourceCategory>('Todos');
  const [selectedResourceId, setSelectedResourceId] = useState<string>(RESOURCE_LIBRARY[0].id);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const currentCourse =
    BIBLE_SCHOOL_COURSES.find((c) => c.id === selectedCourseId) ||
    BIBLE_SCHOOL_COURSES[0];

  const currentLesson =
    currentCourse.lessons.find((l) => l.id === selectedLessonId) ||
    currentCourse.lessons[0];

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const course = BIBLE_SCHOOL_COURSES.find((c) => c.id === courseId);
    if (course && course.lessons[0]) {
      setSelectedLessonId(course.lessons[0].id);
    }
    setQuizAnswer(null);
  };

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const next = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      try {
        localStorage.setItem(SCHOOL_PROGRESS_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  const updateNote = (lessonId: string, value: string) => {
    setNotesByLesson((prev) => {
      const next = { ...prev, [lessonId]: value };
      try {
        localStorage.setItem(SCHOOL_NOTES_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  const totalSchoolLessons = BIBLE_SCHOOL_COURSES.reduce(
    (sum, c) => sum + c.lessons.length,
    0
  );
  const completedInCourse = currentCourse.lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length;
  const courseProgressPct = Math.round(
    (completedInCourse / currentCourse.lessons.length) * 100
  );

  const filteredResources =
    selectedCategory === 'Todos'
      ? RESOURCE_LIBRARY
      : RESOURCE_LIBRARY.filter((r) => r.category === selectedCategory);

  const activeResource =
    filteredResources.find((r) => r.id === selectedResourceId) ||
    filteredResources[0] ||
    RESOURCE_LIBRARY[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E2DC]">
        <div>
          <p className="text-xs font-medium text-[#57534E]">
            Enseñanza sistemática y recursos gratuitos · Sin registro obligatorio
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-[#1C1B18]">
            {activeTab === 'escuela'
              ? 'Escuela Bíblica Avanzada'
              : 'Biblioteca de Recursos Cristianos'}
          </h1>
          <p className="mt-2 text-sm text-[#44403C] max-w-2xl">
            {activeTab === 'escuela'
              ? 'Seis niveles progresivos con fundamentos evangélicos, trinitarios y pentecostales, ejemplos cotidianos y evaluación interactiva.'
              : 'Estudios bíblicos, devocionales, planes de lectura y guías prácticas basadas en referencias directas a las Sagradas Escrituras.'}
          </p>
          <p className="mt-1.5 text-xs text-[#57534E] max-w-2xl">
            Tu avance y notas personales se guardan localmente en este navegador (sin registro ni envío a servidores); pueden perderse si limpias los datos del navegador o cambias de dispositivo.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Secciones de estudio"
          className="inline-flex items-center gap-1 p-1 bg-[#EFECE6] rounded-xl self-start md:self-auto shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'escuela'}
            onClick={() => setActiveTab('escuela')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'escuela'
                ? 'bg-white text-[#1E3A8A] font-semibold shadow-sm'
                : 'text-[#44403C] hover:text-[#1C1B18]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Escuela Bíblica (6 Niveles)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'biblioteca'}
            onClick={() => setActiveTab('biblioteca')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'biblioteca'
                ? 'bg-white text-[#1E3A8A] font-semibold shadow-sm'
                : 'text-[#44403C] hover:text-[#1C1B18]'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Biblioteca de Recursos</span>
          </button>
        </div>
      </div>

      {/* ================= PESTAÑA 1: ESCUELA BÍBLICA (6 NIVELES) ================= */}
      {activeTab === 'escuela' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BIBLE_SCHOOL_COURSES.map((course) => {
              const isSelected = course.id === currentCourse.id;
              const doneCount = course.lessons.filter((l) =>
                completedLessonIds.includes(l.id)
              ).length;
              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => handleSelectCourse(course.id)}
                  className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#1E3A8A] ring-1 ring-[#1E3A8A]'
                      : 'bg-white border-[#E5E2DC] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-[#57534E]">
                    <span className="tabular-nums font-semibold text-[#1E3A8A]">
                      Nivel {course.levelNumber}
                    </span>
                    <span className="tabular-nums">
                      {doneCount}/{course.lessons.length} lecciones
                    </span>
                  </div>
                  <p className="mt-1 font-serif text-base font-semibold text-[#1C1B18]">
                    {course.levelTitle.replace(/^NIVEL \d+:\s*/, '')}
                  </p>
                </button>
              );
            })}
          </div>

          <section className="bg-white border border-[#E5E2DC] rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFECE6]">
              <div>
                <p className="text-xs font-medium text-[#1E3A8A]">
                  {currentCourse.levelTitle}
                </p>
                <p className="mt-1 text-sm text-[#44403C] max-w-3xl">
                  {currentCourse.presentation}
                </p>
              </div>
              <div className="shrink-0 sm:text-right">
                <p className="tabular-nums text-xs font-semibold text-[#1C1B18]">
                  Avance del nivel: {courseProgressPct}% ({completedInCourse}/{currentCourse.lessons.length})
                </p>
                <p className="tabular-nums text-[11px] text-[#57534E]">
                  Avance total Escuela: {completedLessonIds.length}/{totalSchoolLessons} lecciones
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#1C1B18] mb-2">
                Objetivos del nivel:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-[#44403C]">
                {currentCourse.objectives.map((obj, idx) => (
                  <li key={idx} className="p-3 rounded-lg bg-[#FAF9F6] border border-[#E5E2DC]">
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <aside className="lg:col-span-4 space-y-2">
              <p className="text-xs font-semibold text-[#57534E] px-1">
                Lecciones del Nivel {currentCourse.levelNumber}
              </p>
              {currentCourse.lessons.map((lesson, idx) => {
                const isSelected = lesson.id === currentLesson.id;
                const isDone = completedLessonIds.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => {
                      setSelectedLessonId(lesson.id);
                      setQuizAnswer(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-white border-[#1E3A8A] shadow-xs'
                        : 'bg-[#FAF9F6] border-[#E5E2DC] hover:bg-white'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0F7B43]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#A8A29E]" />
                      )}
                    </span>
                    <div>
                      <p className="tabular-nums text-[11px] font-semibold text-[#1E3A8A]">
                        Lección {idx + 1} · {lesson.scriptureRefs[0]}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-[#1C1B18]">
                        {lesson.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </aside>

            <article className="lg:col-span-8 bg-white border border-[#E5E2DC] rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#EFECE6]">
                <div>
                  <p className="text-xs font-semibold text-[#1E3A8A]">
                    {currentLesson.scriptureRefs.join(' · ')}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B18]">
                    {currentLesson.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => toggleLessonComplete(currentLesson.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                    completedLessonIds.includes(currentLesson.id)
                      ? 'bg-[#0F7B43]/10 border-[#0F7B43]/40 text-[#0B6335]'
                      : 'bg-[#FAF9F6] border-[#D6D3CD] text-[#1C1B18] hover:bg-[#F3F1EC]'
                  }`}
                >
                  {completedLessonIds.includes(currentLesson.id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#0F7B43]" />
                      <span>Completada</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      <span>Marcar lección</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#44403C] leading-relaxed">
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E2DC]">
                  <p className="text-xs font-semibold text-[#1E3A8A] mb-1">
                    1. Lo que dice el texto bíblico
                  </p>
                  <p>{currentLesson.biblicalTextSummary}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E2DC]">
                  <p className="text-xs font-semibold text-[#1E3A8A] mb-1">
                    2. Desarrollo doctrinal
                  </p>
                  <p>{currentLesson.doctrinalDevelopment}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#F3F1EC] border border-[#E5E2DC]">
                    <p className="text-xs font-semibold text-[#1C1B18] mb-1">
                      3. Aplicación práctica
                    </p>
                    <p className="text-sm">{currentLesson.practicalApplication}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F3F1EC] border border-[#E5E2DC]">
                    <p className="text-xs font-semibold text-[#1C1B18] mb-1">
                      Ejemplo cotidiano
                    </p>
                    <p className="text-sm">{currentLesson.everydayExample}</p>
                  </div>
                </div>
              </div>

              {/* Evaluación interactiva */}
              <div className="p-5 rounded-xl bg-[#FAF9F6] border border-[#E5E2DC] space-y-3">
                <p className="text-xs font-semibold text-[#1E3A8A]">
                  Evaluación de la lección
                </p>
                <p className="text-sm font-semibold text-[#1C1B18]">
                  {currentLesson.question}
                </p>
                <div className="space-y-2">
                  {currentLesson.options.map((opt, idx) => {
                    const isPicked = quizAnswer === idx;
                    const isRight = idx === currentLesson.correctIndex;
                    let cls =
                      'bg-white border-[#D6D3CD] text-[#44403C] hover:border-[#1E3A8A]';
                    if (quizAnswer !== null) {
                      if (isRight) {
                        cls = 'bg-[#0F7B43]/10 border-[#0F7B43] text-[#0B6335] font-medium';
                      } else if (isPicked) {
                        cls = 'bg-[#FEF2F2] border-[#B91C1C] text-[#991B1B]';
                      }
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuizAnswer(idx)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors cursor-pointer ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizAnswer !== null && (
                  <p
                    className={`text-xs sm:text-sm font-medium pt-1 ${
                      quizAnswer === currentLesson.correctIndex
                        ? 'text-[#0B6335]'
                        : 'text-[#991B1B]'
                    }`}
                  >
                    {quizAnswer === currentLesson.correctIndex
                      ? currentLesson.feedback
                      : `Revisa la respuesta bíblica: ${currentLesson.feedback}`}
                  </p>
                )}
              </div>

              {/* Notas personales locales */}
              <div className="space-y-2">
                <label
                  htmlFor="lesson-notes"
                  className="block text-xs font-semibold text-[#1C1B18]"
                >
                  Tus notas de estudio (guardadas solo en este navegador)
                </label>
                <textarea
                  id="lesson-notes"
                  rows={3}
                  value={notesByLesson[currentLesson.id] || ''}
                  onChange={(e) => updateNote(currentLesson.id, e.target.value)}
                  placeholder="Anota aquí versículos clave, preguntas o aplicaciones personales..."
                  className="w-full rounded-lg border border-[#D6D3CD] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1C1B18] placeholder:text-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>

              <div className="pt-4 border-t border-[#EFECE6] flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    onAskAssistant(
                      `${currentCourse.levelTitle} – ${currentLesson.title}`,
                      `Estoy estudiando la lección "${currentLesson.title}" (${currentLesson.scriptureRefs.join(', ')}) en la Escuela Bíblica. ¿Puedes ayudarme a profundizar en su contexto bíblico y aplicación práctica?`
                    )
                  }
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Consultar al Asistente IA sobre esta lección</span>
                </button>

                <a
                  href={PASTOR_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F7B43] hover:underline"
                >
                  <WhatsAppOfficialIcon className="w-3.5 h-3.5" />
                  <span>Preguntar al Pastor Jair</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      )}

      {/* ================= PESTAÑA 2: BIBLIOTECA DE RECURSOS ================= */}
      {activeTab === 'biblioteca' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(['Todos', ...RESOURCE_CATEGORIES] as const).map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    const first =
                      cat === 'Todos'
                        ? RESOURCE_LIBRARY[0]
                        : RESOURCE_LIBRARY.find((r) => r.category === cat);
                    if (first) setSelectedResourceId(first.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white'
                      : 'bg-white border-[#E5E2DC] text-[#44403C] hover:bg-[#FAF9F6]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <aside className="lg:col-span-5 space-y-2.5">
              {filteredResources.map((res) => {
                const active = res.id === activeResource.id;
                return (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => setSelectedResourceId(res.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      active
                        ? 'bg-white border-[#1E3A8A] shadow-xs'
                        : 'bg-[#FAF9F6] border-[#E5E2DC] hover:bg-white'
                    }`}
                  >
                    <p className="text-[11px] font-semibold text-[#1E3A8A]">
                      {res.category}
                    </p>
                    <h3 className="mt-0.5 font-serif text-base font-semibold text-[#1C1B18]">
                      {res.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#57534E] line-clamp-2">
                      {res.summary}
                    </p>
                  </button>
                );
              })}
            </aside>

            <article className="lg:col-span-7 bg-white border border-[#E5E2DC] rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="pb-4 border-b border-[#EFECE6]">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#1E3A8A] font-semibold">
                  <BookOpen className="w-4 h-4" />
                  <span>{activeResource.category}</span>
                  <span>·</span>
                  <span>{activeResource.scriptureRefs.join(' · ')}</span>
                </div>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-[#1C1B18]">
                  {activeResource.title}
                </h2>
                <p className="mt-2 text-sm text-[#57534E]">{activeResource.summary}</p>
              </div>

              <div className="space-y-3 text-sm sm:text-base text-[#44403C] leading-relaxed">
                {activeResource.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#F3F1EC] border border-[#E5E2DC]">
                <p className="text-xs font-semibold text-[#1C1B18]">
                  Paso práctico recomendado
                </p>
                <p className="mt-1 text-sm text-[#44403C]">
                  {activeResource.practicalTakeaway}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EFECE6] flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    onAskAssistant(
                      activeResource.title,
                      `Estoy leyendo "${activeResource.title}" (${activeResource.scriptureRefs.join(', ')}) en la Biblioteca de Recursos. ¿Puedes ampliar este tema con base bíblica y aplicación práctica?`
                    )
                  }
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Profundizar este recurso con el Asistente IA</span>
                </button>

                <a
                  href={PASTOR_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F7B43] hover:underline"
                >
                  <WhatsAppOfficialIcon className="w-3.5 h-3.5" />
                  <span>Hablar con el Pastor Jair</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
