import { useState } from 'react';
import { BookOpen, Check, Loader2, Sparkles, Trash2 } from 'lucide-react';
import {
  buildPastorWhatsAppUrl,
  PASTOR_WHATSAPP_DISPLAY,
  PASTOR_WHATSAPP_URL,
} from '../constants/pastoral';
import { WhatsAppOfficialIcon } from './WhatsAppButton';

interface PrayerItem {
  id: string;
  category: string;
  text: string;
  createdAt: string;
  answered: boolean;
  encouragement?: string;
}

const PRAYER_STORAGE_KEY = 'jairrestaura_prayers';

const CATEGORIES = [
  'Fortaleza espiritual',
  'Familia y hogar',
  'Salvación de un ser querido',
  'Salud y paz interior',
  'Trabajo y provisión',
  'Gratitud a Dios',
];

export default function PrayerRequestsView() {
  const [prayers, setPrayers] = useState<PrayerItem[]>(() => {
    try {
      const saved = localStorage.getItem(PRAYER_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as PrayerItem[]) : [];
    } catch {
      return [];
    }
  });
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [text, setText] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [directPrayerNote, setDirectPrayerNote] = useState('');

  const savePrayers = (next: PrayerItem[]) => {
    setPrayers(next);
    try {
      localStorage.setItem(PRAYER_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const newItem: PrayerItem = {
      id: `prayer-${Date.now()}`,
      category,
      text: trimmed,
      createdAt: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      answered: false,
    };

    savePrayers([newItem, ...prayers]);
    setText('');
    setErrorMsg(null);
  };

  const handleToggleAnswered = (id: string) => {
    savePrayers(
      prayers.map((p) => (p.id === id ? { ...p, answered: !p.answered } : p))
    );
  };

  const handleDelete = (id: string) => {
    savePrayers(prayers.filter((p) => p.id !== id));
  };

  const handleRequestEncouragement = async (item: PrayerItem) => {
    if (loadingId) return;
    setLoadingId(item.id);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/prayer-encouragement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: item.category, requestText: item.text }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        encouragement?: string;
        error?: string;
      };
      if (!res.ok || !data.encouragement) {
        const fallback =
          res.status === 503
            ? 'El asistente de IA no está disponible temporalmente porque falta configurar GEMINI_API_KEY en el servidor.'
            : res.status === 429
            ? 'Se alcanzó temporalmente la cuota de consultas (429). Espera unos momentos antes de intentar de nuevo.'
            : res.status === 401 || res.status === 403
            ? 'El servicio de IA no pudo validar la clave o los permisos configurados en el servidor.'
            : res.status === 400
            ? 'La petición enviada no es válida para generar la palabra de aliento.'
            : 'No se pudo generar la palabra de aliento.';
        throw new Error(data.error || fallback);
      }

      savePrayers(
        prayers.map((p) =>
          p.id === item.id ? { ...p, encouragement: data.encouragement } : p
        )
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Ocurrió un inconveniente al obtener la palabra bíblica.'
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8 space-y-10">
      <header className="pb-6 border-b border-[var(--border-default)] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)]">
            Privacidad respetada · Sin registro obligatorio
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-[var(--text-primary)]">
            Peticiones de Oración
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl">
            Guarda tus motivos de oración de forma privada en tu dispositivo, recibe un pasaje bíblico de aliento o compártelos voluntariamente con el Pastor Jair por WhatsApp.
          </p>
        </div>

        <a
          href={PASTOR_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--wa-bg)] hover:bg-[var(--wa-bg-hover)] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
        >
          <WhatsAppOfficialIcon className="w-4 h-4" />
          <span>Enviar petición al Pastor Jair</span>
        </a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-6">
          <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
            Anotar una petición
          </h2>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Filipenses 4:6 — Sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.
          </p>

          <form onSubmit={handleAddPrayer} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="prayer-category"
                className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
              >
                Motivo
              </label>
              <select
                id="prayer-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-input)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="prayer-text"
                className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
              >
                Tu petición o motivo de gratitud
              </label>
              <textarea
                id="prayer-text"
                rows={4}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe aquí lo que deseas entregar delante del Señor en oración..."
                className="w-full rounded-lg border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
              />
            </div>

            <button
              type="submit"
              disabled={!text.trim()}
              className="w-full py-2.5 px-4 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              Guardar en mi diario de oración
            </button>
          </form>

          <div className="mt-4 p-3.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-default)] text-xs text-[var(--text-muted)] leading-relaxed">
            <strong className="font-semibold text-[var(--text-primary)]">Privacidad y guardado local:</strong>{' '}
            tu diario de oración se almacena únicamente en este navegador (no se envía a servidores ni a bases de datos públicas). Si borras los datos del navegador o cambias de dispositivo, estas anotaciones locales no se conservarán.
          </div>
        </section>

        <section className="lg:col-span-7 space-y-4">
          {errorMsg && (
            <div
              role="alert"
              className="p-4 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] text-sm text-[var(--danger-text)]"
            >
              {errorMsg}
            </div>
          )}

          {prayers.length === 0 ? (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-8 text-center">
              <BookOpen className="w-8 h-8 text-[var(--brand-accent)] mx-auto mb-3" />
              <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                Tu diario de oración está listo
              </h3>
              <p className="mt-1.5 text-sm text-[var(--text-muted)] max-w-md mx-auto">
                Escribe tu primer motivo de oración o agradecimiento a la izquierda para recordar cómo Dios responde y sostiene tu vida.
              </p>
            </div>
          ) : (
            prayers.map((item) => (
              <article
                key={item.id}
                className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-5 space-y-3.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                  <span>
                    {item.category} · {item.createdAt} ·{' '}
                    <strong className={item.answered ? 'text-[var(--wa-text)]' : 'text-[var(--brand-accent)]'}>
                      {item.answered ? 'Respuesta recibida' : 'En oración'}
                    </strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAnswered(item.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[var(--border-input)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] font-medium cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-[var(--wa-text)]" />
                      <span>
                        {item.answered ? 'Marcar pendiente' : 'Marcar respondida'}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Eliminar petición"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--danger-text)] hover:bg-[var(--danger-bg)] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                  {item.text}
                </p>

                {item.encouragement && (
                  <div className="p-4 rounded-lg bg-[var(--bg-input)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                    <p className="text-xs font-semibold text-[var(--brand-accent)] mb-1.5">
                      Palabra bíblica de aliento
                    </p>
                    {item.encouragement}
                  </div>
                )}

                <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={loadingId === item.id}
                    onClick={() => handleRequestEncouragement(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-accent)] hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {loadingId === item.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {item.encouragement
                        ? 'Renovar palabra bíblica de aliento'
                        : 'Recibir palabra bíblica de aliento'}
                    </span>
                  </button>

                  <a
                    href={buildPastorWhatsAppUrl(
                      `Hola, Pastor Jair. Estoy utilizando JAIRRESTAURA – EVANGELISTA y deseo compartir este motivo de oración (${item.category}): ${item.text}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--wa-text)] hover:underline"
                  >
                    <WhatsAppOfficialIcon className="w-3.5 h-3.5" />
                    <span>Compartir por WhatsApp con el Pastor Jair</span>
                  </a>
                </div>
              </article>
            ))
          )}
        </section>
      </div>

      {/* Contacto directo y privado por WhatsApp con el Pastor Jair */}
      <section className="pt-6 border-t border-[var(--border-default)]">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-6 space-y-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)]">
              ¿Deseas pedir oración directamente al Pastor Jair?
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Para proteger tu privacidad, no guardamos solicitudes personales en servidores públicos. Puedes escribir aquí tu petición opcional y abrir WhatsApp para enviársela directamente al Pastor Jair ({PASTOR_WHATSAPP_DISPLAY}).
            </p>
          </div>

          <div>
            <label
              htmlFor="direct-whatsapp-prayer"
              className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5"
            >
              Mensaje opcional para el Pastor Jair
            </label>
            <textarea
              id="direct-whatsapp-prayer"
              rows={3}
              value={directPrayerNote}
              onChange={(e) => setDirectPrayerNote(e.target.value)}
              placeholder="Opcional: escribe el motivo de oración que deseas compartir directamente por WhatsApp..."
              className="w-full rounded-lg border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--wa-text)]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href={
                directPrayerNote.trim()
                  ? buildPastorWhatsAppUrl(
                      `Hola, Pastor Jair. Estoy utilizando JAIRRESTAURA – EVANGELISTA y deseo pedir oración por: ${directPrayerNote.trim()}`
                    )
                  : PASTOR_WHATSAPP_URL
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-lg bg-[var(--wa-bg)] hover:bg-[var(--wa-bg-hover)] text-white text-sm font-semibold transition-colors"
            >
              <WhatsAppOfficialIcon className="w-4 h-4" />
              <span>HABLAR CON EL PASTOR JAIR</span>
            </a>
            <p className="text-xs text-[var(--text-muted)]">
              El envío no es automático ni se almacena aquí: tú confirmas el mensaje dentro de WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
