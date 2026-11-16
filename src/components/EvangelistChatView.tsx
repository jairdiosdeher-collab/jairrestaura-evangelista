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
          <strong key={idx} className="font-semibold text-[#1C1B18]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-2.5 text-sm sm:text-[15px] leading-relaxed text-[#292524]">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={idx} className="h-1" />;
        }
        if (line.startsWith('### ') || line.startsWith('## ')) {
          const clean = line.replace(/^#{2,3}\s+/, '');
          return (
            <h4 key={idx} className="font-serif text-base font-semibold text-[#1C1B18] pt-1">
              {renderInlineBold(clean)}
            </h4>
          );
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span aria-hidden="true" className="text-[#1E3A8A] font-semibold mt-0.5">
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
              <span className="tabular-nums text-xs font-semibold text-[#1E3A8A] mt-1 shrink-0">
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const sendMessage = async (
    textToSend: string,
    lessonTitle?: string | null,
    highlightPastor?: boolean
  ) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isStreaming) return;

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
        throw new Error(errData.error || 'No se pudo obtener respuesta del asistente.');
      }

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
          <div className="bg-white border border-[#E5E2DC] rounded-xl p-5">
            <p className="text-xs font-medium text-[#57534E]">
              Orientación bíblica · Principiante y avanzado
            </p>
            <h1 className="mt-1 font-serif text-2xl font-semibold text-[#1C1B18]">
              Asistente Bíblico IA
            </h1>
            <p className="mt-2 text-sm text-[#44403C] leading-relaxed">
              Consulta las Escrituras con contexto, distinción entre texto bíblico, interpretación doctrinal y aplicación práctica.
            </p>

            <div className="mt-4 pt-4 border-t border-[#EFECE6]">
              <p className="text-xs font-semibold text-[#1C1B18] mb-2">
                Nivel de explicación
              </p>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#EFECE6] rounded-lg">
                {BIBLICAL_LEVELS.map((lvl) => {
                  const active = level === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setLevel(lvl.id)}
                      className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap truncate ${
                        active
                          ? 'bg-white text-[#1E3A8A] font-semibold shadow-sm'
                          : 'text-[#44403C] hover:text-[#1C1B18]'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#EFECE6]">
              <label
                htmlFor="spiritual-profile"
                className="block text-xs font-semibold text-[#1C1B18] mb-2"
              >
                Tu situación actual
              </label>
              <select
                id="spiritual-profile"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full rounded-lg border border-[#D6D3CD] bg-[#FAF9F6] px-3 py-2 text-sm text-[#1C1B18] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              >
                {SPIRITUAL_PROFILES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EFECE6]">
              <p className="text-xs font-semibold text-[#1C1B18] mb-2.5">
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
                    className="w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm text-[#44403C] bg-[#FAF9F6] hover:bg-[#1E3A8A]/8 hover:text-[#1E3A8A] border border-[#E5E2DC] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <span className="tabular-nums text-xs font-semibold text-[#1E3A8A] shrink-0">
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
                ? 'bg-[#0F7B43]/10 border-[#0F7B43]'
                : 'bg-[#F3F1EC] border-[#E5E2DC]'
            }`}
          >
            <h2 className="font-serif text-lg font-semibold text-[#1C1B18]">
              Contacto directo con el Pastor Jair
            </h2>
            <p className="mt-1.5 text-sm text-[#44403C] leading-relaxed">
              Este asistente no sustituye al pastor ni a la congregación local. Para hablar personalmente con el Pastor Jair, abre WhatsApp y confirma el envío de tu mensaje.
            </p>
            <a
              href={PASTOR_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F7B43] hover:bg-[#0B6335] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <WhatsAppOfficialIcon className="w-4 h-4" />
              <span>HABLAR CON EL PASTOR JAIR</span>
            </a>
            <p className="mt-2 text-xs text-[#57534E] text-center">
              WhatsApp oficial: {PASTOR_WHATSAPP_DISPLAY}
            </p>
          </div>
        </aside>

        <section
          aria-label="Conversación bíblica"
          className="lg:col-span-8 bg-white border border-[#E5E2DC] rounded-xl flex flex-col h-[74vh] min-h-[540px] max-h-[820px]"
        >
          <div className="px-5 py-3.5 border-b border-[#E5E2DC] flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#1C1B18]">
                JAIRRESTAURA – EVANGELISTA
              </p>
              <p className="text-xs text-[#57534E]">
                Nivel: {level} · Doctrina evangélica, trinitaria y pentecostal (MMM)
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              disabled={isStreaming}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6D3CD] text-xs font-medium text-[#44403C] hover:bg-[#F3F1EC] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
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
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-[#FAF9F6] border border-[#E5E2DC] text-[#1C1B18]'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  ) : msg.text ? (
                    <FormattedMessage text={msg.text} />
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-[#57534E] py-1">
                      <Loader2 className="w-4 h-4 animate-spin text-[#1E3A8A]" />
                      <span>Consultando las Escrituras y preparando respuesta...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {errorMsg && (
              <div
                role="alert"
                className="p-4 rounded-lg border border-[#B91C1C]/30 bg-[#FEF2F2] text-sm text-[#991B1B] space-y-3"
              >
                <p className="font-medium">{errorMsg}</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {onNavigateToSchool && (
                    <button
                      type="button"
                      onClick={onNavigateToSchool}
                      className="px-3 py-1.5 rounded-md bg-white border border-[#D6D3CD] text-xs font-semibold text-[#1E3A8A] hover:bg-[#FAF9F6] cursor-pointer"
                    >
                      Ir a Escuela Bíblica
                    </button>
                  )}
                  {onNavigateToDiscipleship && (
                    <button
                      type="button"
                      onClick={onNavigateToDiscipleship}
                      className="px-3 py-1.5 rounded-md bg-white border border-[#D6D3CD] text-xs font-semibold text-[#1E3A8A] hover:bg-[#FAF9F6] cursor-pointer"
                    >
                      Ir al Discipulado 90 Días
                    </button>
                  )}
                  {onNavigateToLibrary && (
                    <button
                      type="button"
                      onClick={onNavigateToLibrary}
                      className="px-3 py-1.5 rounded-md bg-white border border-[#D6D3CD] text-xs font-semibold text-[#1E3A8A] hover:bg-[#FAF9F6] cursor-pointer"
                    >
                      Explorar Biblioteca
                    </button>
                  )}
                  <a
                    href={PASTOR_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0F7B43] text-white text-xs font-semibold hover:bg-[#0B6335]"
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
            className="p-4 border-t border-[#E5E2DC] bg-[#FAF9F6] rounded-b-xl"
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
                  className="w-full resize-none rounded-lg border border-[#D6D3CD] bg-white px-3.5 py-2.5 text-sm text-[#1C1B18] placeholder:text-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 h-[44px] rounded-lg bg-[#1E3A8A] hover:bg-[#172D6B] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shrink-0 whitespace-nowrap"
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
