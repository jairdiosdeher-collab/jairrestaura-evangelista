import {
  CORE_MOTTO,
  FINAL_MOTTO_LINES,
  PASTOR_WHATSAPP_DISPLAY,
  PASTOR_WHATSAPP_URL,
} from '../constants/pastoral';
import type { AppSection } from './TopNav';
import { WhatsAppOfficialIcon } from './WhatsAppButton';

interface FooterProps {
  onNavigate: (section: AppSection) => void;
  onOpenLibrary?: () => void;
}

export default function Footer({ onNavigate, onOpenLibrary }: FooterProps) {
  const go = (section: AppSection) => {
    onNavigate(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--bg-subtle)] mt-16 pb-20 sm:pb-14 transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[var(--border-default)]">
          <div className="md:col-span-5">
            <p className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              JAIRRESTAURA – EVANGELISTA
            </p>
            <p className="mt-2 text-xs font-medium tracking-wider text-[var(--text-muted)]">
              {CORE_MOTTO}
            </p>
            <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
              Plataforma integral para la evangelización cristiana, escuela bíblica por niveles, discipulado inteligente, biblioteca de recursos y acompañamiento pastoral.
            </p>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Nuestro Lema
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--text-secondary)]">
              {FINAL_MOTTO_LINES.map((line) => (
                <li key={line} className="font-medium">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Secciones y Contacto
            </h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <button
                  type="button"
                  onClick={() => go('inicio')}
                  className="hover:text-[var(--brand-accent)] transition-colors cursor-pointer"
                >
                  Inicio y Evangelio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('escuela')}
                  className="hover:text-[var(--brand-accent)] transition-colors cursor-pointer"
                >
                  Escuela Bíblica (6 Niveles)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenLibrary) {
                      onOpenLibrary();
                    } else {
                      go('escuela');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[var(--brand-accent)] transition-colors cursor-pointer"
                >
                  Biblioteca de Recursos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('discipulado')}
                  className="hover:text-[var(--brand-accent)] transition-colors cursor-pointer"
                >
                  Discipulado Inteligente (90 Días)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('chat')}
                  className="hover:text-[var(--brand-accent)] transition-colors cursor-pointer"
                >
                  Asistente Bíblico IA
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('oracion')}
                  className="hover:text-[var(--brand-accent)] transition-colors cursor-pointer"
                >
                  Peticiones de Oración
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('acompanamiento')}
                  className="hover:text-[var(--brand-accent)] transition-colors cursor-pointer"
                >
                  Acompañamiento Pastoral
                </button>
              </li>
            </ul>
            <a
              href={PASTOR_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[var(--wa-text)] hover:underline transition-colors"
            >
              <WhatsAppOfficialIcon className="w-4 h-4" />
              <span>Pastor Jair: {PASTOR_WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>
            Orientación evangélica, trinitaria y pentecostal · Basada en las Sagradas Escrituras.
          </p>
          <p>
            Acceso 100 % público y gratuito, sin contraseñas ni registro · Este asistente no sustituye la comunión con una iglesia local.
          </p>
        </div>
      </div>
    </footer>
  );
}
