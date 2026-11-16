import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Circle,
  Download,
  MessageSquare,
  Play,
} from 'lucide-react';
import {
  DISCIPLESHIP_LESSONS,
  DISCIPLESHIP_PHASES,
  type DiscipleshipPhase,
} from '../data/discipleshipData';
import {
  NINETY_DAY_CALENDAR,
  generateCalendarReminderICS,
} from '../data/smartDiscipleshipData';
import { PASTOR_WHATSAPP_URL } from '../constants/pastoral';
import { WhatsAppOfficialIcon } from './WhatsAppButton';

interface DiscipleshipViewProps {
  initialPhaseId?: DiscipleshipPhase['id'];
  onAskAboutLesson: (lessonTitle: string, prompt: string) => void;
}

const STORAGE_KEY = 'jairrestaura_completed_lessons';
const LAST_LESSON_KEY = 'jairrestaura_last_lesson_id';
const CALENDAR_DAYS_KEY = 'jairrestaura_calendar_days_done';
const REMINDER_TIME_KEY = 'jairrestaura_reminder_time';

export default function DiscipleshipView({
  initialPhaseId = 'semana-1',
  onAskAboutLesson,
}: DiscipleshipViewProps) {
  const [workspaceMode, setWorkspaceMode] = useState<'lecciones' | 'calendario'>('lecciones');
  const [selectedPhase, setSelectedPhase] = useState<DiscipleshipPhase['id']>(initialPhaseId);
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [lastLessonId, setLastLessonId] = useState<string>(() => {
    try {
      return localStorage.getItem(LAST_LESSON_KEY) || 'dia-1';
    } catch {
      return 'dia-1';
    }
  });
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(CALENDAR_DAYS_KEY);
      return saved ? (JSON.parse(saved) as number[]) : [];
    } catch {
      return [];
    }
  });
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [reminderTime, setReminderTime] = useState<string>(() => {
    try {
      return localStorage.getItem(REMINDER_TIME_KEY) || '07:00';
    } catch {
      return '07:00';
    }
  });
  const [reminderSavedNotice, setReminderSavedNotice] = useState(false);

  const phaseLessons = useMemo(
    () => DISCIPLESHIP_LESSONS.filter((l) => l.phaseId === selectedPhase),
    [selectedPhase]
  );

  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    () => phaseLessons[0]?.id || DISCIPLESHIP_LESSONS[0].id
  );
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);

  useEffect(() => {
    setSelectedPhase(initialPhaseId);
  }, [initialPhaseId]);

  useEffect(() => {
    if (!phaseLessons.some((l) => l.id === selectedLessonId)) {
      setSelectedLessonId(phaseLessons[0]?.id || DISCIPLESHIP_LESSONS[0].id);
    }
    setSelectedQuizOption(null);
  }, [selectedPhase, phaseLessons]);

  const selectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setSelectedQuizOption(null);
    setLastLessonId(lessonId);
    try {
      localStorage.setItem(LAST_LESSON_KEY, lessonId);
    } catch {
      // Ignore storage error
    }
  };

  const handleContinueFromLast = () => {
    const target =
      DISCIPLESHIP_LESSONS.find((l) => l.id === lastLessonId) || DISCIPLESHIP_LESSONS[0];
    setWorkspaceMode('lecciones');
    setSelectedPhase(target.phaseId);
    setSelectedLessonId(target.id);
    setSelectedQuizOption(null);
  };

  const currentLesson =
    DISCIPLESHIP_LESSONS.find((l) => l.id === selectedLessonId) ||
    phaseLessons[0] ||
    DISCIPLESHIP_LESSONS[0];

  const currentPhaseMeta = DISCIPLESHIP_PHASES.find((p) => p.id === selectedPhase)!;

  const programLessons = DISCIPLESHIP_LESSONS.filter(
    (l) => l.phaseId !== 'trinidad' && l.phaseId !== 'pentecostal'
  );
  const completedProgramCount = programLessons.filter((l) =>
    completedIds.includes(l.id)
  ).length;
  const programPct = Math.round((completedProgramCount / programLessons.length) * 100);

  const toggleCompleted = (lessonId: string) => {
    setCompletedIds((prev) => {
      const next = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  };

  const toggleCalendarDay = (day: number) => {
    setCompletedDays((prev) => {
      const next = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
      try {
        localStorage.setItem(CALENDAR_DAYS_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  };

  const handleGoToNextLesson = (nextId?: string) => {
    if (!nextId) return;
    const target = DISCIPLESHIP_LESSONS.find((l) => l.id === nextId);
    if (target) {
      setSelectedPhase(target.phaseId);
      selectLesson(target.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDownloadICS = () => {
    try {
      localStorage.setItem(REMINDER_TIME_KEY, reminderTime);
    } catch {
      // Ignore
    }
    const ics = generateCalendarReminderICS(reminderTime);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recordatorio-discipulado-jairrestaura.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setReminderSavedNotice(true);
    setTimeout(() => setReminderSavedNotice(false), 4000);
  };

  const isCompleted = completedIds.includes(currentLesson.id);
  const activeCalendarEntry =
    NINETY_DAY_CALENDAR.find((e) => e.day === selectedDay) || NINETY_DAY_CALENDAR[0];
  const lastLessonObj =
    DISCIPLESHIP_LESSONS.find((l) => l.id === lastLessonId) || DISCIPLESHIP_LESSONS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8 space-y-8">
      <div className="pb-6 border-b border-[var(--border-default)] space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)]">
              Discipulado Inteligente · Programa de 90 días a tu propio ritmo
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-[var(--text-primary)]">
              Lecciones y Discipulado Bíblico
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl">
              Avanza con libertad sin imposición de tiempos. Completar las lecciones ordena tu estudio de la Palabra, recordando que la madurez espiritual es obra continua de Dios en tu vida.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleContinueFromLast}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Continuar: {lastLessonObj.dayRangeLabel}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-4">
          <div className="lg:col-span-7 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-[var(--text-primary)]">
                Progreso en módulos ({completedProgramCount}/{programLessons.length} ·{' '}
                <span className="tabular-nums">{programPct}%</span>)
              </span>
              <span className="tabular-nums text-[var(--text-muted)]">
                Calendario 90 días: {completedDays.length}/90 días leídos
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--brand-primary)] transition-all duration-300"
                style={{ width: `${programPct}%` }}
              />
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Tu progreso y días marcados se guardan localmente en este navegador sin cuentas ni registro; si limpias los datos del sitio o cambias de dispositivo, el historial local no se transfiere.
            </p>
          </div>

          <div className="lg:col-span-5 flex lg:justify-end">
            <div className="inline-flex items-center gap-1 p-1 bg-[var(--bg-muted)] rounded-lg">
              <button
                type="button"
                onClick={() => setWorkspaceMode('lecciones')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  workspaceMode === 'lecciones'
                    ? 'bg-[var(--bg-surface)] text-[var(--brand-accent)] font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Lecciones por Etapa
              </button>
              <button
                type="button"
                onClick={() => setWorkspaceMode('calendario')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  workspaceMode === 'calendario'
                    ? 'bg-[var(--bg-surface)] text-[var(--brand-accent)] font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendario 90 Días y Lectura</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {workspaceMode === 'calendario' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
                Calendario voluntario de 90 días
              </h2>
              <span className="tabular-nums text-xs text-[var(--text-muted)]">
                {completedDays.length} de 90 días marcados
              </span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
              {NINETY_DAY_CALENDAR.map((entry) => {
                const isSelected = entry.day === selectedDay;
                const isDone = completedDays.includes(entry.day);
                return (
                  <button
                    key={entry.day}
                    type="button"
                    onClick={() => setSelectedDay(entry.day)}
                    title={`Día ${entry.day}: ${entry.theme}`}
                    className={`tabular-nums h-9 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white font-semibold'
                        : isDone
                          ? 'bg-[var(--wa-soft-bg)] border-[var(--wa-soft-border)] text-[var(--wa-soft-text)]'
                          : 'bg-[var(--bg-input)] border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'
                    }`}
                  >
                    {entry.day}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  Recordatorio devocional opcional
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Descarga un evento diario (.ics) para tu calendario personal si deseas ayuda para mantener tu hábito.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="time"
                  aria-label="Hora preferida para recordatorio devocional"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="rounded-lg border border-[var(--border-input)] bg-[var(--bg-input)] px-2.5 py-1.5 text-xs text-[var(--text-primary)]"
                />
                <button
                  type="button"
                  onClick={handleDownloadICS}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--brand-accent)] text-xs font-semibold text-[var(--brand-accent)] hover:bg-[var(--brand-soft)] cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar .ics</span>
                </button>
              </div>
            </div>
            {reminderSavedNotice && (
              <p className="text-xs text-[var(--wa-text)] font-medium">
                Archivo de recordatorio (.ics) generado para las {reminderTime}.
              </p>
            )}
          </div>

          <article className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <p className="text-xs font-semibold text-[var(--brand-accent)]">
                  Día {activeCalendarEntry.day} · Semana {activeCalendarEntry.week}
                </p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-[var(--text-primary)]">
                  {activeCalendarEntry.theme}
                </h3>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                  {activeCalendarEntry.phaseTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleCalendarDay(activeCalendarEntry.day)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                  completedDays.includes(activeCalendarEntry.day)
                    ? 'bg-[var(--wa-soft-bg)] border-[var(--wa-soft-border)] text-[var(--wa-soft-text)]'
                    : 'bg-[var(--bg-input)] border-[var(--border-input)] text-[var(--text-secondary)]'
                }`}
              >
                {completedDays.includes(activeCalendarEntry.day) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[var(--wa-text)]" />
                    <span>Leído</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>Marcar día</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-input)] border border-[var(--border-default)]">
              <p className="text-xs font-semibold text-[var(--text-primary)]">Lectura bíblica sugerida</p>
              <p className="mt-1 font-serif text-lg font-semibold text-[var(--brand-accent)]">
                {activeCalendarEntry.reading}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                Aplicación devocional del día
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {activeCalendarEntry.actionStep}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  onAskAboutLesson(
                    `Día ${activeCalendarEntry.day}: ${activeCalendarEntry.reading}`,
                    `Estoy en el Día ${activeCalendarEntry.day} del calendario de 90 días leyendo ${activeCalendarEntry.reading} ("${activeCalendarEntry.theme}"). ¿Puedes explicarme brevemente el texto, su contexto y aplicación práctica?`
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-accent)] hover:underline cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Estudiar pasaje con el Asistente IA</span>
              </button>

              <a
                href={PASTOR_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--wa-text)] hover:underline"
              >
                <WhatsAppOfficialIcon className="w-3.5 h-3.5" />
                <span>Pastor Jair</span>
              </a>
            </div>
          </article>
        </div>
      )}

      {workspaceMode === 'lecciones' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {DISCIPLESHIP_PHASES.map((phase) => {
              const active = selectedPhase === phase.id;
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => setSelectedPhase(phase.id)}
                  className={`text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--bg-surface)] border-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]'
                      : 'bg-[var(--bg-page)] border-[var(--border-default)] hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  <p className="text-[11px] font-semibold text-[var(--brand-accent)]">
                    {phase.durationHint}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)] truncate">
                    {phase.label}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <aside className="lg:col-span-4 space-y-3">
              <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-[var(--brand-accent)]">
                  {currentPhaseMeta.label} · {currentPhaseMeta.durationHint}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">{currentPhaseMeta.subtitle}</p>
              </div>

              <div className="space-y-2">
                {phaseLessons.map((lesson) => {
                  const active = lesson.id === currentLesson.id;
                  const done = completedIds.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => selectLesson(lesson.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 ${
                        active
                          ? 'bg-[var(--bg-surface)] border-[var(--brand-accent)] shadow-xs'
                          : 'bg-[var(--bg-page)] border-[var(--border-default)] hover:bg-[var(--bg-surface)]'
                      }`}
                    >
                      <span className="mt-0.5 shrink-0">
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-[var(--wa-text)]" />
                        ) : (
                          <Circle className="w-4 h-4 text-[var(--text-placeholder)]" />
                        )}
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold text-[var(--brand-accent)]">
                          {lesson.dayRangeLabel} · {lesson.scriptureRef}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
                          {lesson.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <article className="lg:col-span-8 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[var(--border-subtle)]">
                <div>
                  <p className="text-xs font-semibold text-[var(--brand-accent)]">
                    {currentLesson.dayRangeLabel} · {currentLesson.scriptureRef}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
                    {currentLesson.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => toggleCompleted(currentLesson.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                    isCompleted
                      ? 'bg-[var(--wa-soft-bg)] border-[var(--wa-soft-border)] text-[var(--wa-soft-text)]'
                      : 'bg-[var(--bg-input)] border-[var(--border-input)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[var(--wa-text)]" />
                      <span>Lección completada</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      <span>Marcar completada</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
                <p className="text-xs font-semibold text-[var(--text-primary)]">Objetivo espiritual</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {currentLesson.objective}
                </p>
              </div>

              <blockquote className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] font-serif italic text-base text-[var(--text-primary)]">
                “{currentLesson.scriptureQuote}”
                <footer className="mt-1.5 not-italic font-sans text-xs font-semibold text-[var(--brand-accent)]">
                  — {currentLesson.scriptureRef}
                </footer>
              </blockquote>

              <div className="space-y-3">
                <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  Desarrollo bíblico y doctrinal
                </h3>
                <ul className="space-y-2.5 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  {currentLesson.doctrinalPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-[var(--brand-accent)] font-bold mt-0.5">·</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] space-y-1">
                  <p className="text-xs font-semibold text-[var(--brand-accent)]">Ejemplo cotidiano</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {currentLesson.everydayExample}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] space-y-1">
                  <p className="text-xs font-semibold text-[var(--wa-text)]">Enfoque de oración</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {currentLesson.prayerFocus}
                  </p>
                </div>
              </div>

              {/* Pregunta interactiva / Evaluación */}
              <div className="p-5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] space-y-3">
                <p className="text-xs font-semibold text-[var(--brand-accent)]">
                  Evaluación de comprensión
                </p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {currentLesson.quizQuestion}
                </p>
                <div className="space-y-2">
                  {currentLesson.quizOptions.map((option, idx) => {
                    const isPicked = selectedQuizOption === idx;
                    const isRight = idx === currentLesson.quizCorrectIndex;
                    let cls =
                      'bg-[var(--bg-surface)] border-[var(--border-input)] text-[var(--text-secondary)] hover:border-[var(--brand-accent)]';
                    if (selectedQuizOption !== null) {
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
                        onClick={() => setSelectedQuizOption(idx)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors cursor-pointer ${cls}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {selectedQuizOption !== null && (
                  <p
                    className={`text-xs sm:text-sm font-medium pt-1 ${
                      selectedQuizOption === currentLesson.quizCorrectIndex
                        ? 'text-[var(--wa-soft-text)]'
                        : 'text-[var(--danger-text)]'
                    }`}
                  >
                    {selectedQuizOption === currentLesson.quizCorrectIndex
                      ? currentLesson.quizFeedback
                      : `Observa nuevamente la respuesta bíblica: ${currentLesson.quizFeedback}`}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    onAskAboutLesson(
                      currentLesson.title,
                      `Estoy estudiando "${currentLesson.title}" (${currentLesson.scriptureRef}) en el Discipulado de 90 días. Reflexiono en esta pregunta: ${currentLesson.reflectionQuestion}`
                    )
                  }
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--brand-accent)] hover:underline cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Preguntar al Asistente sobre esta lección</span>
                </button>

                {currentLesson.nextLessonId && (
                  <button
                    type="button"
                    onClick={() => handleGoToNextLesson(currentLesson.nextLessonId)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs sm:text-sm font-semibold cursor-pointer"
                  >
                    <span>Siguiente lección</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </article>
          </div>
        </>
      )}
    </div>
  );
}
