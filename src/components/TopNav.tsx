import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

export type AppSection =
  | 'inicio'
  | 'escuela'
  | 'discipulado'
  | 'chat'
  | 'oracion'
  | 'acompanamiento';

interface TopNavProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const NAV_ITEMS: Array<{ id: AppSection; label: string }> = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'escuela', label: 'Escuela' },
  { id: 'discipulado', label: 'Discipulado' },
  { id: 'oracion', label: 'Oración' },
  { id: 'acompanamiento', label: 'Acompañamiento' },
];

export default function TopNav({ activeSection, onNavigate }: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelect = (section: AppSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-header)] backdrop-blur-sm border-b border-[var(--border-default)] transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-6">
        {/* Zona 1: Brand wordmark único */}
        <button
          type="button"
          onClick={() => handleSelect('inicio')}
          className="font-serif text-base sm:text-xl font-semibold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-accent)] cursor-pointer"
        >
          JAIRRESTAURA
        </button>

        {/* Zona 2: 5 enlaces concisos en una línea */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors duration-150 border-b-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-accent)] ${
                  isActive
                    ? 'text-[var(--brand-accent)] border-[var(--brand-accent)] font-semibold'
                    : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-input)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zona 3: Selector de apariencia + 1 acción principal + menú móvil */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeSelector variant="compact" />

          <button
            type="button"
            onClick={() => handleSelect('chat')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
          >
            Asistente IA
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-3">
          <nav aria-label="Navegación móvil" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)] ${
                    isActive
                      ? 'bg-[var(--brand-soft)] text-[var(--brand-accent)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleSelect('chat')}
              className="mt-1 w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
            >
              Asistente IA
            </button>

            <ThemeSelector variant="labeled" />
          </nav>
        </div>
      )}
    </header>
  );
}
