import { useState } from 'react';
import { Menu, X } from 'lucide-react';

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
    <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E5E2DC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zona 1: Brand wordmark único */}
        <button
          type="button"
          onClick={() => handleSelect('inicio')}
          className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#1C1B18] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A] cursor-pointer"
        >
          JAIRRESTAURA
        </button>

        {/* Zona 2: 5 enlaces concisos en una línea */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors duration-150 border-b-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A] ${
                  isActive
                    ? 'text-[#1E3A8A] border-[#1E3A8A] font-semibold'
                    : 'text-[#57534E] border-transparent hover:text-[#1C1B18] hover:border-[#D6D3CD]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zona 3: 1 acción principal */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleSelect('chat')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#172D6B] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
          >
            Asistente IA
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#1C1B18] hover:bg-[#EFECE6] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E2DC] bg-[#FAF9F6] px-4 py-3">
          <nav aria-label="Navegación móvil" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] font-semibold'
                      : 'text-[#44403C] hover:bg-[#EFECE6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleSelect('chat')}
              className="mt-1 w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold bg-[#1E3A8A] text-white cursor-pointer"
            >
              Asistente IA
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
