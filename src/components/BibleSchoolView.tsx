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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border-default)]">
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)]">
            Enseñanza sistemática y recursos gratuitos · Sin registro obligatorio
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-[var(--text-primary)]">
            {activeTab === 'escuela'
              ? 'Escuela Bíblica Avanzada'
              : 'Biblioteca de Recursos Cristianos'}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl">
            {activeTab === 'escuela'
              ? 'Seis niveles progresivos con fundamentos evangélicos, trinitarios y pentecostales, ejemplos cotidianos y evaluación interactiva.'
              : 'Estudios bíblicos, devocionales, planes de lectura y guías prácticas basadas en referencias directas a las Sagradas Escrituras.'}
          </p>
          <p className="mt-1.5 text-xs text-[var(--text-muted)] max-w-2xl">
            Tu avance y notas personales se guardan localmente en este navegador (sin registro ni envío a servidores); pueden perderse si limpias los datos del navegador o cambias de dispositivo.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Secciones de estudio"
          className="inline-flex items-center gap-1 p-1 bg-[var(--bg-muted)] rounded-xl self-start md:self-auto shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'escuela'}
            onClick={() => setActiveTab('escuela')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'escuela'
                ? 'bg-[var(--bg-surface)] text-[var(--brand-accent)] font-semibold shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
                ? 'bg-[var(--bg-surface)] text-[var(--brand-accent)] font-semibold shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
                      ? 'bg-[var(--bg-surface)] border-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-default)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                    <span className="tabular-nums font-semibold text-[var(--brand-accent)]">
                      Nivel {course.levelNumber}
                    </span>
                    <span className="tabular-nums">
                      {doneCount}/{course.lessons.length} lecciones
                    </span>
                  </div>
                  <p className="mt-1 font-serif text-base font-semibold text-[var(--text-primary)]">
                    {course.levelTitle.replace(/^NIVEL \d+:\s*/, '')}
                  </p>
                </button>
              );
            })}
          </div>

          <section className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <p className="text-xs font-medium text-[var(--brand-accent)]">
                  {currentCourse.levelTitle}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-3xl">
                  {currentCourse.presentation}
                </p>
              </div>
              <div className="shrink-0 sm:text-right">
                <p className="tabular-nums text-xs font-semibold text-[var(--text-primary)]">
                  Avance del nivel: {courseProgressPct}% ({completedInCourse}/{currentCourse.lessons.length})
                </p>
                <p className="tabular-nums text-[11px] text-[var(--text-muted)]">
                  Avance total Escuela: {completedLessonIds.length}/{totalSchoolLessons} lecciones
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">
                Objetivos del nivel:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm text-[var(--text-secondary)]">
                {currentCourse.objectives.map((obj, idx) => (
                  <li key={idx} className="p-3 rounded-lg bg-[var(--bg-input)] border border-[var(--border-default)]">
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <aside className="lg:col-span-4 space-y-2">
              <p className="text-xs font-semibold text-[var(--text-muted)] px-1">
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
                        ? 'bg-[var(--bg-surface)] border-[var(--brand-accent)] shadow-xs'
                        : 'bg-[var(--bg-page)] border-[var(--border-default)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[var(--wa-text)]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[var(--text-placeholder)]" />
                      )}
                    </span>
                    <div>
                      <p className="tabular-nums text-[11px] font-semibold text-[var(--brand-accent)]">
                        Lección {idx + 1} · {lesson.scriptureRefs[0]}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
                        {lesson.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </aside>

            <article className="lg:col-span-8 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[var(--border-subtle)]">
                <div>
                  <p className="text-xs font-semibold text-[var(--brand-accent)]">
                    {currentLesson.scriptureRefs.join(' · ')}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
                    {currentLesson.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => toggleLessonComplete(currentLesson.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                    completedLessonIds.includes(currentLesson.id)
                      ? 'bg-[var(--wa-soft-bg)] border-[var(--wa-soft-border)] text-[var(--wa-soft-text)]'
                      : 'bg-[var(--bg-input)] border-[var(--border-input)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {completedLessonIds.includes(currentLesson.id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[var(--wa-text)]" />
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

              <div className="space-y-4 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)]">
                  <p className="text-xs font-semibold text-[var(--brand-accent)] mb-1">
                    1. Lo que dice el texto bíblico
                  </p>
                  <p>{currentLesson.biblicalTextSummary}</p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)]">
                  <p className="text-xs font-semibold text-[var(--brand-accent)] mb-1">
                    2. Desarrollo doctrinal
                  </p>
                  <p>{currentLesson.doctrinalDevelopment}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
                    <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                      3. Aplicación práctica
                    </p>
                    <p className="text-sm">{currentLesson.practicalApplication}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
                    <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                      Ejemplo cotidiano
                    </p>
                    <p className="text-sm">{currentLesson.everydayExample}</p>
                  </div>
                </div>
              </div>

              {/* Evaluación interactiva */}
              <div className="p-5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] space-y-3">
                <p className="text-xs font-semibold text-[var(--brand-accent)]">
                  Evaluación de la lección
                </p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {currentLesson.question}
                </p>
                <div className="space-y-2">
                  {currentLesson.options.map((opt, idx) => {
                    const isPicked = quizAnswer === idx;
                    const isRight = idx === currentLesson.correctIndex;
                    let cls =
                      'bg-[var(--bg-surface)] border-[var(--border-input)] text-[var(--text-secondary)] hover:border-[var(--brand-accent)]';
                    if (quizAnswer !== null) {
                      if (isRight) {
                        cls = 'bg-[var(--wa-soft-bg)] border-[var(--wa-text)] text-[var(--wa-soft-text)] font-medium';
                      } else if (isPicked) {
                        cls = 'bg-[var(--danger-bg)] border-[var(--danger-border)] text-[var(--danger-text)]';
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
                        ? 'text-[var(--wa-soft-text)]'
                        : 'text-[var(--danger-text)]'
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
                  className="block text-xs font-semibold text-[var(--text-primary)]"
                >
                  Tus notas de estudio (guardadas solo en este navegador)
                </label>
                <textarea
                  id="lesson-notes"
                  rows={3}
                  value={notesByLesson[currentLesson.id] || ''}
                  onChange={(e) => updateNote(currentLesson.id, e.target.value)}
                  placeholder="Anota aquí versículos clave, preguntas o aplicaciones personales..."
                  className="w-full rounded-lg border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                />
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    onAskAssistant(
                      `${currentCourse.levelTitle} – ${currentLesson.title}`,
                      `Estoy estudiando la lección "${currentLesson.title}" (${currentLesson.scriptureRefs.join(', ')}) en la Escuela Bíblica. ¿Puedes ayudarme a profundizar en su contexto bíblico y aplicación práctica?`
                    )
                  }
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--brand-accent)] hover:underline cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Consultar al Asistente IA sobre esta lección</span>
                </button>

                <a
                  href={PASTOR_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--wa-text)] hover:underline"
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
                      ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white'
                      : 'bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
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
                        ? 'bg-[var(--bg-surface)] border-[var(--brand-accent)] shadow-xs'
                        : 'bg-[var(--bg-page)] border-[var(--border-default)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <p className="text-[11px] font-semibold text-[var(--brand-accent)]">
                      {res.category}
                    </p>
                    <h3 className="mt-0.5 font-serif text-base font-semibold text-[var(--text-primary)]">
                      {res.title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-2">
                      {res.summary}
                    </p>
                  </button>
                );
              })}
            </aside>

            <article className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--brand-accent)] font-semibold">
                  <BookOpen className="w-4 h-4" />
                  <span>{activeResource.category}</span>
                  <span>·</span>
                  <span>{activeResource.scriptureRefs.join(' · ')}</span>
                </div>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-[var(--text-primary)]">
                  {activeResource.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{activeResource.summary}</p>
              </div>

              <div className="space-y-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {activeResource.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  Paso práctico recomendado
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {activeResource.practicalTakeaway}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    onAskAssistant(
                      activeResource.title,
                      `Estoy leyendo "${activeResource.title}" (${activeResource.scriptureRefs.join(', ')}) en la Biblioteca de Recursos. ¿Puedes ampliar este tema con base bíblica y aplicación práctica?`
                    )
                  }
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--brand-accent)] hover:underline cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Profundizar este recurso con el Asistente IA</span>
                </button>

                <a
                  href={PASTOR_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--wa-text)] hover:underline"
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
