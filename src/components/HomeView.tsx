import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  GraduationCap,
  HeartHandshake,
  Library,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import {
  BIBLICAL_FOUNDATIONS,
  CORE_MOTTO,
  DISCIPLESHIP_IMAGE_PATH,
  EVANGELISM_STEPS,
  HERO_IMAGE_PATH,
  PASTORAL_IMAGE_PATH,
  PASTOR_WHATSAPP_URL,
} from '../constants/pastoral';
import type { DiscipleshipPhase } from '../data/discipleshipData';
import type { AppSection } from './TopNav';
import { WhatsAppOfficialIcon } from './WhatsAppButton';

interface HomeViewProps {
  onNavigate: (section: AppSection) => void;
  onStartChatWithPrompt: (prompt: string) => void;
  onOpenDiscipleshipPhase: (phaseId: DiscipleshipPhase['id']) => void;
  onOpenSchoolTab: (tab: 'escuela' | 'biblioteca') => void;
}

export default function HomeView({
  onNavigate,
  onStartChatWithPrompt,
  onOpenDiscipleshipPhase,
  onOpenSchoolTab,
}: HomeViewProps) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [heroImgErr, setHeroImgErr] = useState(false);
  const [discImgErr, setDiscImgErr] = useState(false);
  const [pastoralImgErr, setPastoralImgErr] = useState(false);

  const currentStep = EVANGELISM_STEPS[activeStepIdx];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-10 space-y-16">
      {/* ================= HERO EDITORIAL ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pb-12 border-b border-[#E5E2DC]">
        <div className="lg:col-span-7 space-y-5">
          <p className="text-xs font-semibold tracking-wider text-[#1E3A8A]">
            {CORE_MOTTO}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#1C1B18] leading-[1.15]">
            Conoce a Jesucristo, afirma tu fe en la Biblia y camina en comunidad.
          </h1>
          <p className="text-base sm:text-lg text-[#44403C] leading-relaxed max-w-2xl">
            JAIRRESTAURA – EVANGELISTA es un espacio público, gratuito y sin contraseñas para descubrir el evangelio, estudiar la Escuela Bíblica por niveles, avanzar en el discipulado de 90 días y recibir acompañamiento pastoral directo.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('chat')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#1E3A8A] hover:bg-[#172D6B] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Conversar con el Asistente IA</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenSchoolTab('escuela')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#D6D3CD] bg-white hover:bg-[#F3F1EC] text-[#1C1B18] text-sm font-semibold transition-colors cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-[#1E3A8A]" />
              <span>Explorar Escuela Bíblica</span>
            </button>

            <a
              href={PASTOR_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-[#0F7B43] hover:bg-[#0B6335] text-white text-sm font-semibold transition-colors"
            >
              <WhatsAppOfficialIcon className="w-4 h-4" />
              <span>Hablar con el Pastor Jair</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5E2DC] bg-[#EFECE6]">
            {!heroImgErr ? (
              <img
                src={HERO_IMAGE_PATH}
                alt="Santa Biblia abierta sobre un atril de madera iluminada por la luz de la mañana"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgErr(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#F3F1EC]">
                <BookOpen className="w-10 h-10 text-[#1E3A8A] mb-3" />
                <p className="font-serif text-lg text-[#1C1B18]">
                  Lámpara es a mis pies tu palabra, y lumbrera a mi camino.
                </p>
                <p className="mt-1 text-xs text-[#57534E]">Salmos 119:105</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= MÓDULO INTERACTIVO DE EVANGELIZACIÓN (7 PASOS) ================= */}
      <section aria-labelledby="evangelism-heading" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#1E3A8A]">
              El mensaje del Evangelio · Paso a paso sin presiones
            </p>
            <h2
              id="evangelism-heading"
              className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B18]"
            >
              ¿Quieres conocer a Dios y el camino de salvación?
            </h2>
          </div>
          <span className="tabular-nums text-xs font-semibold text-[#57534E]">
            Paso {currentStep.step} de {EVANGELISM_STEPS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Lista de los 7 pasos */}
          <div className="lg:col-span-4 space-y-2">
            {EVANGELISM_STEPS.map((step, idx) => {
              const isSelected = idx === activeStepIdx;
              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setActiveStepIdx(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-colors cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-white border-[#1E3A8A] text-[#1C1B18] shadow-xs'
                      : 'bg-[#FAF9F6] border-[#E5E2DC] text-[#44403C] hover:bg-white'
                  }`}
                >
                  <span
                    className={`tabular-nums w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                      isSelected
                        ? 'bg-[#1E3A8A] text-white'
                        : 'bg-[#EFECE6] text-[#57534E]'
                    }`}
                  >
                    {step.step}
                  </span>
                  <span className="text-sm font-semibold">{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Detalle del paso activo */}
          <article className="lg:col-span-8 bg-white border border-[#E5E2DC] rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#EFECE6]">
              <div>
                <p className="text-xs font-semibold text-[#1E3A8A]">
                  Paso {currentStep.step} · {currentStep.scriptureRef}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-semibold text-[#1C1B18]">
                  {currentStep.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={activeStepIdx === 0}
                  onClick={() => setActiveStepIdx((i) => Math.max(0, i - 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#D6D3CD] text-xs font-medium text-[#44403C] hover:bg-[#FAF9F6] disabled:opacity-40 cursor-pointer"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={activeStepIdx === EVANGELISM_STEPS.length - 1}
                  onClick={() =>
                    setActiveStepIdx((i) => Math.min(EVANGELISM_STEPS.length - 1, i + 1))
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#1E3A8A] text-white text-xs font-medium hover:bg-[#172D6B] disabled:opacity-40 cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            </div>

            <blockquote className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E2DC] font-serif italic text-base text-[#1C1B18]">
              “{currentStep.scriptureQuote}”
              <footer className="mt-1.5 not-italic font-sans text-xs font-semibold text-[#1E3A8A]">
                — {currentStep.scriptureRef}
              </footer>
            </blockquote>

            <div className="space-y-3 text-sm sm:text-base text-[#44403C] leading-relaxed">
              <p>
                <strong className="font-semibold text-[#1C1B18]">Lo que dice el texto: </strong>
                {currentStep.biblicalTextNote}
              </p>
              <p>
                <strong className="font-semibold text-[#1C1B18]">Explicación pastoral: </strong>
                {currentStep.explanation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F3F1EC] border border-[#E5E2DC] space-y-3">
              <p className="text-xs font-semibold text-[#1C1B18]">
                Pregunta de reflexión:
              </p>
              <p className="text-sm text-[#44403C]">{currentStep.reflectionQuestion}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    onStartChatWithPrompt(
                      `Estoy leyendo el Paso ${currentStep.step} ("${currentStep.title}", ${currentStep.scriptureRef}) y quisiera profundizar en esta pregunta: ${currentStep.reflectionQuestion}`
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Conversar sobre este paso con el Asistente IA</span>
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
            </div>
          </article>
        </div>
      </section>

      {/* ================= RUTAS PRINCIPALES DE CRECIMIENTO ================= */}
      <section aria-labelledby="modules-heading" className="space-y-6">
        <div>
          <p className="text-xs font-medium text-[#57534E]">
            Acceso 100 % abierto y gratuito
          </p>
          <h2
            id="modules-heading"
            className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#1C1B18]"
          >
            Camino de formación y acompañamiento
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden flex flex-col">
            <div className="aspect-[16/10] bg-[#EFECE6]">
              {!discImgErr ? (
                <img
                  src={DISCIPLESHIP_IMAGE_PATH}
                  alt="Biblia abierta y libreta de estudio junto a la ventana"
                  referrerPolicy="no-referrer"
                  onError={() => setDiscImgErr(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F3F1EC]">
                  <Compass className="w-8 h-8 text-[#1E3A8A]" />
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#1E3A8A]">90 Días · Ritmo Propio</p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-[#1C1B18]">
                  Discipulado Inteligente
                </h3>
                <p className="mt-2 text-sm text-[#44403C] leading-relaxed">
                  Lecciones progresivas desde la Semana 1 hasta el Mes 3, calendario diario de lectura, recordatorio (.ics) y seguimiento guardado en tu navegador.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenDiscipleshipPhase('semana-1')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  <span>Iniciar desde Semana 1</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>

          <article className="bg-white border border-[#E5E2DC] rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-[#1E3A8A]">6 Niveles · 40 Lecciones</p>
              <h3 className="font-serif text-xl font-semibold text-[#1C1B18]">
                Escuela Bíblica Avanzada y Biblioteca
              </h3>
              <p className="text-sm text-[#44403C] leading-relaxed">
                Evangelización, Fundamentos Cristianos, Doctrina Trinitaria, Doctrina Pentecostal, Vida Cristiana y Formación de Discípulos, junto con devocionales y planes de lectura.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onOpenSchoolTab('escuela')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
              >
                <span>Abrir Escuela</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenSchoolTab('biblioteca')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#44403C] hover:text-[#1E3A8A] cursor-pointer"
              >
                <Library className="w-4 h-4" />
                <span>Ver Biblioteca</span>
              </button>
            </div>
          </article>

          <article className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden flex flex-col">
            <div className="aspect-[16/10] bg-[#EFECE6]">
              {!pastoralImgErr ? (
                <img
                  src={PASTORAL_IMAGE_PATH}
                  alt="Bancas de santuario cristiano iluminadas por la luz de la tarde"
                  referrerPolicy="no-referrer"
                  onError={() => setPastoralImgErr(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#F3F1EC]">
                  <HeartHandshake className="w-8 h-8 text-[#1E3A8A]" />
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#0F7B43]">Oración y Consejo Bíblico</p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-[#1C1B18]">
                  Acompañamiento Pastoral y Oración
                </h3>
                <p className="mt-2 text-sm text-[#44403C] leading-relaxed">
                  Diario privado de oración en tu dispositivo, orientación bíblica en momentos de crisis y contacto directo por WhatsApp con el Pastor Jair.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('acompanamiento')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  <span>Ir a Acompañamiento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('oracion')}
                  className="text-sm font-semibold text-[#44403C] hover:text-[#1E3A8A] cursor-pointer"
                >
                  Diario de Oración
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ================= FUNDAMENTOS DOCTRINALES ================= */}
      <section aria-labelledby="foundations-heading" className="space-y-6 pt-4 border-t border-[#E5E2DC]">
        <div>
          <p className="text-xs font-medium text-[#57534E]">
            Declaración evangélica, trinitaria y pentecostal (MMM)
          </p>
          <h2
            id="foundations-heading"
            className="mt-1 font-serif text-2xl font-semibold text-[#1C1B18]"
          >
            Doce pilares bíblicos de nuestra enseñanza
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BIBLICAL_FOUNDATIONS.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-[#E5E2DC] rounded-xl p-4 space-y-1.5"
            >
              <p className="text-[11px] font-semibold text-[#1E3A8A]">{item.ref}</p>
              <h3 className="font-serif text-base font-semibold text-[#1C1B18]">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                {item.summary}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
