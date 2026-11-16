import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemePreference } from '../context/ThemeContext';

interface ThemeSelectorProps {
  variant?: 'compact' | 'labeled';
  onSelectDone?: () => void;
}

const THEME_OPTIONS: Array<{
  id: ThemePreference;
  label: string;
  ariaLabel: string;
  Icon: typeof Sun;
}> = [
  {
    id: 'light',
    label: 'Claro',
    ariaLabel: 'Usar modo claro',
    Icon: Sun,
  },
  {
    id: 'dark',
    label: 'Oscuro',
    ariaLabel: 'Usar modo oscuro',
    Icon: Moon,
  },
  {
    id: 'system',
    label: 'Auto',
    ariaLabel: 'Usar modo automático según el dispositivo',
    Icon: Monitor,
  },
];

export default function ThemeSelector({
  variant = 'compact',
  onSelectDone,
}: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  const handleChoose = (next: ThemePreference) => {
    setTheme(next);
    if (onSelectDone) onSelectDone();
  };

  if (variant === 'labeled') {
    return (
      <div className="pt-2 mt-1 border-t border-[var(--border-default)]">
        <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Apariencia visual
        </p>
        <div
          role="radiogroup"
          aria-label="Seleccionar modo de apariencia"
          className="grid grid-cols-3 gap-1.5 px-1"
        >
          {THEME_OPTIONS.map(({ id, label, ariaLabel, Icon }) => {
            const active = theme === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={ariaLabel}
                onClick={() => handleChoose(id)}
                className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)] ${
                  active
                    ? 'bg-[var(--brand-soft)] border-[var(--brand-accent)] text-[var(--brand-accent)] font-semibold'
                    : 'bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Seleccionar modo de apariencia"
      className="inline-flex items-center p-0.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-default)] shrink-0"
    >
      {THEME_OPTIONS.map(({ id, label, ariaLabel, Icon }) => {
        const active = theme === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={ariaLabel}
            title={`Modo ${label.toLowerCase()}`}
            onClick={() => handleChoose(id)}
            className={`inline-flex items-center justify-center gap-1 w-7 h-7 sm:w-8 sm:h-8 rounded-md text-xs font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)] ${
              active
                ? 'bg-[var(--bg-surface)] text-[var(--brand-accent)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
