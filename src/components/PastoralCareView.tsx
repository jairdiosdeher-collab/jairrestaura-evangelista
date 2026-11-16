import { useState } from 'react';
import { AlertCircle, HeartHandshake, MessageSquare } from 'lucide-react';
import {
  buildPastorWhatsAppUrl,
  PASTORAL_CARE_TOPICS,
  PASTORAL_IMAGE_PATH,
  PASTOR_WHATSAPP_DEFAULT_MESSAGE,
  PASTOR_WHATSAPP_DISPLAY,
  PASTOR_WHATSAPP_URL,
} from '../constants/pastoral';
import { WhatsAppOfficialIcon } from './WhatsAppButton';

interface PastoralCareViewProps {
  onStartPastoralChat: (prompt: string) => void;
}

const PASTORAL_FOCUS_OPTIONS = [
  'Orientación y acompañamiento espiritual general',
  'Di el paso de fe / Soy nuevo creyente',
  'Dudas bíblicas o doctrina',
  'Oración por situación familiar o personal',
  'Integración a una congregación local',
];

export default function PastoralCareView({
  onStartPastoralChat,
}: PastoralCareViewProps) {
  const [imgError, setImgError] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState(PASTORAL_FOCUS_OPTIONS[0]);
  const [personalNote, setPersonalNote] = useState('');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8 space-y-12">
      {/* Encabezado y Contacto Oficial con el Pastor Jair */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-10 border-b border-[var(--border-default)]">
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)]">
              Escucha respetuosa · Orientación bíblica · Contacto pastoral directo
            </p>
            <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
              Acompañamiento Pastoral
            </h1>
            <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed max-w-prose">
              No estás llamado a caminar solo en medio de tus dudas, luchas familiares o cansancio espiritual. Aquí encontrarás consejo bíblico sereno y el acceso directo al Pastor Jair para acompañamiento personal.
            </p>
          </div>

          {/* Tarjeta destacada de Contacto Oficial WhatsApp */}
          <div className="mt-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
                Contacto oficial con el Pastor Jair
              </h2>
              <span className="tabular-nums text-xs font-semibold text-[var(--wa-text)]">
                WhatsApp: {PASTOR_WHATSAPP_DISPLAY}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-default)] text-xs sm:text-sm text-[var(--text-secondary)]">
              <p className="font-semibold text-[var(--text-primary)] mb-1">Mensaje inicial sugerido:</p>
              <p className="italic">“{PASTOR_WHATSAPP_DEFAULT_MESSAGE}”</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={PASTOR_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg bg-[var(--wa-bg)] hover:bg-[var(--wa-bg-hover)] text-white text-sm font-semibold transition-colors"
              >
                <WhatsAppOfficialIcon className="w-5 h-5" />
                <span>HABLAR CON EL PASTOR JAIR</span>
              </a>
              <span className="text-xs text-[var(--text-muted)]">
                Sin registro previo · Confirmas y envías tu mensaje directamente en WhatsApp
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="h-full min-h-[260px] rounded-xl overflow-hidden border border-[var(--border-default)] bg-[var(--bg-muted)]">
            {!imgError ? (
              <img
                src={PASTORAL_IMAGE_PATH}
                alt="Santuario acogedor con bancas de madera iluminadas por luz natural"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full lg:h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[var(--bg-subtle)]">
                <HeartHandshake className="w-10 h-10 text-[var(--brand-accent)] mb-3" />
                <p className="font-serif text-lg text-[var(--text-primary)]">
                  Sobrellevad los unos las cargas de los otros, y cumplid así la ley de Cristo.
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">Gálatas 6:2</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Aviso de cuidado integral y emergencias */}
      <section
        aria-label="Aviso sobre salud mental y situaciones de emergencia"
        className="bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-xl p-5 flex items-start gap-3.5"
      >
        <AlertCircle className="w-5 h-5 text-[var(--brand-accent)] shrink-0 mt-0.5" />
        <div className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-1">
          <p className="font-semibold text-[var(--text-primary)]">
            Cuidado integral de tu salud y seguridad
          </p>
          <p>
            La orientación espiritual no reemplaza la atención médica, psicológica ni psiquiátrica profesional. Si atraviesas depresión severa, síntomas físicos persistentes o cualquier situación de peligro inmediato, prioriza tu seguridad buscando ayuda humana cercana y comunicándote de inmediato con los servicios de emergencia de tu localidad.
          </p>
        </div>
      </section>

      {/* 8 áreas de acompañamiento pastoral */}
      <section aria-labelledby="topics-heading" className="space-y-6">
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)]">
            Orientación bíblica para momentos clave
          </p>
          <h2
            id="topics-heading"
            className="mt-1 font-serif text-2xl font-semibold text-[var(--text-primary)]"
          >
            Áreas de acompañamiento espiritual
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PASTORAL_CARE_TOPICS.map((topic) => (
            <article
              key={topic.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <p className="text-xs font-medium text-[var(--brand-accent)]">{topic.scripture}</p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-[var(--text-primary)]">
                  {topic.title}
                </h3>
                <p className="mt-2 font-serif italic text-sm text-[var(--text-muted)]">
                  “{topic.verseText}”
                </p>
                <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {topic.guidance}
                </p>
                <p className="mt-3 text-xs sm:text-sm text-[var(--text-primary)]">
                  <strong className="font-semibold">Paso práctico:</strong> {topic.practicalStep}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onStartPastoralChat(topic.chatPrompt)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--brand-accent)] hover:underline cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Conversar con el Asistente</span>
                </button>

                <a
                  href={PASTOR_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--wa-text)] hover:underline"
                >
                  <WhatsAppOfficialIcon className="w-3.5 h-3.5" />
                  <span>Escribir al Pastor Jair</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contacto pastoral directo por WhatsApp (sin almacenamiento en servidor) */}
      <section className="pt-6 border-t border-[var(--border-default)]">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-6 space-y-5">
          <div>
            <p className="text-xs font-medium text-[var(--wa-text)]">
              Privacidad garantizada · Sin contraseñas ni registro en bases de datos
            </p>
            <h2 className="mt-1 font-serif text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
              Solicitar acompañamiento directo con el Pastor Jair
            </h2>
            <p className="mt-1.5 text-sm text-[var(--text-secondary)] max-w-3xl">
              Para cuidar tu privacidad y evitar almacenar información sensible en servidores públicos, la comunicación personal se realiza directamente por WhatsApp con el Pastor Jair ({PASTOR_WHATSAPP_DISPLAY}).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="pastoral-focus"
                className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
              >
                Motivo del contacto
              </label>
              <select
                id="pastoral-focus"
                value={selectedFocus}
                onChange={(e) => setSelectedFocus(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-input)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--wa-text)]"
              >
                {PASTORAL_FOCUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="pastoral-note"
                className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
              >
                Nota opcional para incluir en tu mensaje
              </label>
              <input
                id="pastoral-note"
                type="text"
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                placeholder="Ej. Deseo empezar mi discipulado o hablar sobre mi familia..."
                className="w-full rounded-lg border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--wa-text)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <a
              href={
                personalNote.trim() || selectedFocus !== PASTORAL_FOCUS_OPTIONS[0]
                  ? buildPastorWhatsAppUrl(
                      `Hola, Pastor Jair. Estoy utilizando JAIRRESTAURA – EVANGELISTA (${selectedFocus}). ${personalNote.trim() || 'Deseo recibir orientación y acompañamiento espiritual.'}`
                    )
                  : PASTOR_WHATSAPP_URL
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg bg-[var(--wa-bg)] hover:bg-[var(--wa-bg-hover)] text-white text-sm font-semibold transition-colors"
            >
              <WhatsAppOfficialIcon className="w-5 h-5" />
              <span>HABLAR CON EL PASTOR JAIR</span>
            </a>

            <p className="text-xs text-[var(--text-muted)]">
              No guardamos tus datos en ningún servidor: confirmas y envías el mensaje directamente en WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
