import { useEffect, useRef, useState } from 'react';
import { Loader2, RotateCcw, Send } from 'lucide-react';
import {
  INITIAL_WELCOME_MESSAGE,
  PASTOR_WHATSAPP_DISPLAY,
  PASTOR_WHATSAPP_URL,
  SPIRITUAL_PROFILES,
} from '../constants/pastoral';
import { WhatsAppOfficialIcon } from './WhatsAppButton';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface EvangelistChatViewProps {
  pendingPrompt: string | null;
  pendingContextTitle?: string | null;
  onClearPendingPrompt: () => void;
  onNavigateToSchool?: () => void;
  onNavigateToLibrary?: () => void;
  onNavigateToDiscipleship?: () => void;
}

const CONVERSATION_OPTIONS: Array<{
  number: number;
  label: string;
  prompt: string;
  highlightWhatsApp?: boolean;
}> = [
  {
    number: 1,
    label: 'Quiero conocer a Jesús.',
    prompt:
      'Quiero conocer a Jesús y comprender con claridad el mensaje del evangelio paso a paso.',
  },
  {
    number: 2,
    label: 'Necesito comenzar mi discipulado.',
    prompt:
      'Necesito comenzar mi discipulado cristiano. ¿Cómo puedo dar mis primeros pasos en la Biblia, la oración y el programa de 90 días?',
  },
  {
    number: 3,
    label: 'Tengo una pregunta bíblica.',
    prompt:
      'Tengo una pregunta bíblica y quisiera estudiarla entendiendo el texto, su contexto y su aplicación práctica.',
  },
  {
    number: 4,
    label: 'Quiero aprender doctrina.',
    prompt:
      'Quiero aprender doctrina bíblica evangélica, trinitaria y pentecostal (la Trinidad, el Espíritu Santo y los fundamentos cristianos).',
  },
  {
    number: 5,
    label: 'Necesito oración.',
    prompt:
      'Estoy pasando por un momento en el que necesito oración y una palabra bíblica de aliento.',
  },
  {
    number: 6,
    label: 'Quiero hablar con el Pastor Jair.',
    prompt:
      'Quiero hablar personalmente con el Pastor Jair para recibir acompañamiento pastoral.',
    highlightWhatsApp: true,
  },
];

const BIBLICAL_LEVELS = [
  { id: 'Principiante', label: 'Principiante' },
  { id: 'Creyente en crecimiento', label: 'En crecimiento' },
  { id: 'Creyente avanzado', label: 'Avanzado' },
];

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split('\n');

  const renderInlineBold = (line: string) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-[var(--text-primary)]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-2.5 text-sm sm:text-[15px] leading-relaxed text-[var(--text-secondary)]">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={idx} className="h-1" />;
        }
        if (line.startsWith('### ') || line.startsWith('## ')) {
          const clean = line.replace(/^#{2,3}\s+/, '');
          return (
            <h4 key={idx} className="font-serif text-base font-semibold text-[var(--text-primary)] pt-1">
              {renderInlineBold(clean)}
            </h4>
          );
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span aria-hidden="true" className="text-[var(--brand-accent)] font-semibold mt-0.5">
                ·
              </span>
              <p className="flex-1">{renderInlineBold(line.slice(2))}</p>
            </div>
          );
        }
        const numberedMatch = line.match(/^(\d+\.)\s+(.*)$/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="tabular-nums text-xs font-semibold text-[var(--brand-accent)] mt-1 shrink-0">
                {numberedMatch[1]}
              </span>
              <p className="flex-1">{renderInlineBold(numberedMatch[2])}</p>
            </div>
          );
        }
        return <p key={idx}>{renderInlineBold(line)}</p>;
      })}
    </div>
  );
}

export default function EvangelistChatView({
  pendingPrompt,
  pendingContextTitle,
  onClearPendingPrompt,
  onNavigateToSchool,
  onNavigateToLibrary,
  onNavigateToDiscipleship,
}: EvangelistChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: INITIAL_WELCOME_MESSAGE,
    },
  ]);
  const [input, setInput] = useState('');
  const [profile, setProfile] = useState(SPIRITUAL_PROFILES[0]);
  const [level, setLevel] = useState(BIBLICAL_LEVELS[0].id);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPastorPromptCard, setShowPastorPromptCard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastHandledPromptRef = useRef<string | null>(null);
  const cooldownUntilRef = useRef<number>(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const formatHttpError = (status: number, serverMessage?: string): string => {
    if (serverMessage && serverMessage.trim()) return serverMessage.trim();
    switch (status) {
      case 400:
        return 'La consulta no pudo procesarse por formato inválido o extensión excesiva (400).';
      case 401:
        return 'La clave de API configurada en el servidor no fue autorizada (401).';
      case 403:
        return 'Acceso denegado por permisos del servicio de IA en el servidor (403).';
      case 429:
        return 'Se alcanzó temporalmente el límite de consultas (429). Espera unos segundos antes de volver a intentar.';
      case 503:
        return 'El asistente de IA no está disponible temporalmente porque falta configurar GEMINI_API_KEY en el servidor o el servicio está en mantenimiento.';
      default:
        return 'No se pudo obtener respuesta del asistente.';
    }
  };

  const sendMessage = async (
    textToSend: string,
    lessonTitle?: string | null,
    highlightPastor?: boolean
  ) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isStreaming) return;

    const now = Date.now();
    if (now < cooldownUntilRef.current) {
      const waitSec = Math.ceil((cooldownUntilRef.current - now) / 1000);
      setErrorMsg(
        `Por favor espera ${waitSec} ${waitSec === 1 ? 'segundo' : 'segundos'} antes de enviar otra consulta para cuidar la disponibilidad gratuita del asistente.`
      );
      return;
    }

    if (highlightPastor) {
      setShowPastorPromptCard(true);
    }

    setErrorMsg(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMessage];
    const assistantId = `model-${Date.now() + 1}`;
    setMessages([...nextHistory, { id: assistantId, role: 'model', text: '' }]);
    setInput('');
    setIsStreaming(true);

    try {
      const apiMessages = nextHistory
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          context: {
            profile,
            level,
            lessonTitle: lessonTitle || undefined,
            module: 'Chat de Inteligencia Artificial',
          },
        }),
      });

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as { error?: string };
        if (response.status === 429) {
          const retryHeader = Number(response.headers.get('Retry-After'));
          const waitMs = Number.isFinite(retryHeader) && retryHeader > 0 ? retryHeader * 1000 : 10_000;
          cooldownUntilRef.current = Date.now() + waitMs;
        }
        throw new Error(formatHttpError(response.status, errData.error));
      }

      cooldownUntilRef.current = Date.now() + 1500;

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No se pudo abrir la lectura de respuesta en vivo.');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const event of events) {
          const line = event.trim();
          if (!line.startsWith('data:')) continue;
          const payloadStr = line.slice(5).trim();
          if (!payloadStr) continue;

          try {
            const payload = JSON.parse(payloadStr) as {
              text?: string;
              error?: string;
              done?: boolean;
            };
            if (payload.error) {
              throw new Error(payload.error);
            }
            if (payload.text) {
              accumulated += payload.text;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, text: accumulated } : m))
              );
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== 'Unexpected end of JSON input') {
              throw parseErr;
            }
          }
        }
      }

      if (!accumulated.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  text: 'Disculpa, no pude generar una respuesta en este instante. Por favor intenta de nuevo o conversa con el Pastor Jair por WhatsApp.',
                }
              : m
          )
        );
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Ocurrió un inconveniente al conectar con el asistente.';
      setErrorMsg(msg);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId || m.text.length > 0));
    } finally {
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (pendingPrompt && pendingPrompt !== lastHandledPromptRef.current) {
      lastHandledPromptRef.current = pendingPrompt;
      sendMessage(pendingPrompt, pendingContextTitle);
      onClearPendingPrompt();
    }
  }, [pendingPrompt, pendingContextTitle]);

  const handleReset = () => {
    if (isStreaming) return;
    setMessages([{ id: 'welcome', role: 'model', text: INITIAL_WELCOME_MESSAGE }]);
    setErrorMsg(null);
    setShowPastorPromptCard(false);
    lastHandledPromptRef.current = null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-5">
            <p className="text-xs font-medium text-[var(--text-muted)]">
              Orientación bíblica · Principiante y avanzado
            </p>
            <h1 className="mt-1 font-serif text-2xl font-semibold text-[var(--text-primary)]">
              Asistente Bíblico IA
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Consulta las Escrituras con contexto, distinción entre texto bíblico, interpretación doctrinal y aplicación práctica.
            </p>

            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
              <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">
                Nivel de explicación
              </p>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--bg-muted)] rounded-lg">
                {BIBLICAL_LEVELS.map((lvl) => {
                  const active = level === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setLevel(lvl.id)}
                      className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap truncate ${
                        active
                          ? 'bg-[var(--bg-surface)] text-[var(--brand-accent)] font-semibold shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
              <label
                htmlFor="spiritual-profile"
                className="block text-xs font-semibold text-[var(--text-primary)] mb-2"
              >
                Tu situación actual
              </label>
              <select
                id="spiritual-profile"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-input)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
              >
                {SPIRITUAL_PROFILES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
              <p className="text-xs font-semibold text-[var(--text-primary)] mb-2.5">
                Opciones rápidas de conversación
              </p>
              <div className="space-y-1.5">
                {CONVERSATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.number}
                    type="button"
                    disabled={isStreaming}
                    onClick={() =>
                      sendMessage(opt.prompt, undefined, opt.highlightWhatsApp)
                    }
                    className="w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm text-[var(--text-secondary)] bg-[var(--bg-input)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand-accent)] border border-[var(--border-default)] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <span className="tabular-nums text-xs font-semibold text-[var(--brand-accent)] shrink-0">
                      {opt.number}.
                    </span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`border rounded-xl p-5 transition-colors ${
              showPastorPromptCard
                ? 'bg-[var(--wa-soft-bg)] border-[var(--wa-soft-border)]'
                : 'bg-[var(--bg-subtle)] border-[var(--border-default)]'
            }`}
          >
            <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Contacto directo con el Pastor Jair
            </h2>
            <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
              Este asistente no sustituye al pastor ni a la congregación local. Para hablar personalmente con el Pastor Jair, abre WhatsApp y confirma el envío de tu mensaje.
            </p>
            <a
              href={PASTOR_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--wa-bg)] hover:bg-[var(--wa-bg-hover)] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <WhatsAppOfficialIcon className="w-4 h-4" />
              <span>HABLAR CON EL PASTOR JAIR</span>
            </a>
            <p className="mt-2 text-xs text-[var(--text-muted)] text-center">
              WhatsApp oficial: {PASTOR_WHATSAPP_DISPLAY}
            </p>
          </div>
        </aside>

        <section
          aria-label="Conversación bíblica"
          className="lg:col-span-8 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl flex flex-col h-[74vh] min-h-[540px] max-h-[820px]"
        >
          <div className="px-5 py-3.5 border-b border-[var(--border-default)] flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                JAIRRESTAURA – EVANGELISTA
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Nivel: {level} · Doctrina evangélica, trinitaria y pentecostal (MMM)
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              disabled={isStreaming}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-input)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nueva conversación</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[82%] rounded-xl px-4 py-3.5 ${
                    msg.role === 'user'
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-[var(--bg-input)] border border-[var(--border-default)] text-[var(--text-primary)]'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  ) : msg.text ? (
                    <FormattedMessage text={msg.text} />
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] py-1">
                      <Loader2 className="w-4 h-4 animate-spin text-[var(--brand-accent)]" />
                      <span>Consultando las Escrituras y preparando respuesta...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {errorMsg && (
              <div
                role="alert"
                className="p-4 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] text-sm text-[var(--danger-text)] space-y-3"
              >
                <p className="font-medium">{errorMsg}</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {onNavigateToSchool && (
                    <button
                      type="button"
                      onClick={onNavigateToSchool}
                      className="px-3 py-1.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-input)] text-xs font-semibold text-[var(--brand-accent)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                    >
                      Ir a Escuela Bíblica
                    </button>
                  )}
                  {onNavigateToDiscipleship && (
                    <button
                      type="button"
                      onClick={onNavigateToDiscipleship}
                      className="px-3 py-1.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-input)] text-xs font-semibold text-[var(--brand-accent)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                    >
                      Ir al Discipulado 90 Días
                    </button>
                  )}
                  {onNavigateToLibrary && (
                    <button
                      type="button"
                      onClick={onNavigateToLibrary}
                      className="px-3 py-1.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-input)] text-xs font-semibold text-[var(--brand-accent)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                    >
                      Explorar Biblioteca
                    </button>
                  )}
                  <a
                    href={PASTOR_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--wa-bg)] text-white text-xs font-semibold hover:bg-[var(--wa-bg-hover)]"
                  >
                    <WhatsAppOfficialIcon className="w-3.5 h-3.5" />
                    <span>Hablar con el Pastor Jair</span>
                  </a>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-subtle)] rounded-b-xl"
          >
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label htmlFor="chat-input" className="sr-only">
                  Escribe tu pregunta bíblica o inquietud espiritual
                </label>
                <textarea
                  id="chat-input"
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Escribe tu pregunta sobre la Biblia, el evangelio, doctrina o acompañamiento..."
                  className="w-full resize-none rounded-lg border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 h-[44px] rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shrink-0 whitespace-nowrap"
              >
                {isStreaming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
