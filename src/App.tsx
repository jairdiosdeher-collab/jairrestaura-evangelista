import { useCallback, useEffect, useState } from 'react';
import BibleSchoolView from './components/BibleSchoolView';
import DiscipleshipView from './components/DiscipleshipView';
import EvangelistChatView from './components/EvangelistChatView';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import PastoralCareView from './components/PastoralCareView';
import PrayerRequestsView from './components/PrayerRequestsView';
import TopNav, { type AppSection } from './components/TopNav';
import WhatsAppButton from './components/WhatsAppButton';
import type { DiscipleshipPhase } from './data/discipleshipData';

function resolveRouteFromPathname(pathname: string): {
  section: AppSection;
  schoolTab: 'escuela' | 'biblioteca';
} {
  const clean = pathname.replace(/\/+$/, '').toLowerCase() || '/';
  switch (clean) {
    case '/escuela':
      return { section: 'escuela', schoolTab: 'escuela' };
    case '/biblioteca':
      return { section: 'escuela', schoolTab: 'biblioteca' };
    case '/discipulado':
      return { section: 'discipulado', schoolTab: 'escuela' };
    case '/asistente':
    case '/chat':
      return { section: 'chat', schoolTab: 'escuela' };
    case '/oracion':
      return { section: 'oracion', schoolTab: 'escuela' };
    case '/acompanamiento':
      return { section: 'acompanamiento', schoolTab: 'escuela' };
    default:
      return { section: 'inicio', schoolTab: 'escuela' };
  }
}

function getPathnameForSection(
  section: AppSection,
  schoolTab: 'escuela' | 'biblioteca'
): string {
  switch (section) {
    case 'escuela':
      return schoolTab === 'biblioteca' ? '/biblioteca' : '/escuela';
    case 'discipulado':
      return '/discipulado';
    case 'chat':
      return '/asistente';
    case 'oracion':
      return '/oracion';
    case 'acompanamiento':
      return '/acompanamiento';
    case 'inicio':
    default:
      return '/';
  }
}

export default function App() {
  const initialRoute = resolveRouteFromPathname(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [activeSection, setActiveSection] = useState<AppSection>(initialRoute.section);
  const [schoolTab, setSchoolTab] = useState<'escuela' | 'biblioteca'>(
    initialRoute.schoolTab
  );
  const [discipleshipPhase, setDiscipleshipPhase] =
    useState<DiscipleshipPhase['id']>('semana-1');
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);
  const [pendingLessonTitle, setPendingLessonTitle] = useState<string | null>(null);

  const navigateTo = useCallback(
    (section: AppSection, nextSchoolTab?: 'escuela' | 'biblioteca') => {
      const resolvedTab = nextSchoolTab ?? (section === 'escuela' ? 'escuela' : schoolTab);
      if (nextSchoolTab) {
        setSchoolTab(nextSchoolTab);
      } else if (section === 'escuela') {
        setSchoolTab('escuela');
      }
      setActiveSection(section);

      if (typeof window !== 'undefined') {
        const targetPath = getPathnameForSection(section, resolvedTab);
        if (window.location.pathname !== targetPath) {
          window.history.pushState(null, '', targetPath);
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [schoolTab]
  );

  useEffect(() => {
    const handlePopState = () => {
      const next = resolveRouteFromPathname(window.location.pathname);
      setActiveSection(next.section);
      setSchoolTab(next.schoolTab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleStartChatWithPrompt = (prompt: string, lessonTitle?: string) => {
    setPendingChatPrompt(prompt);
    setPendingLessonTitle(lessonTitle || null);
    navigateTo('chat');
  };

  const handleOpenDiscipleshipPhase = (phaseId: DiscipleshipPhase['id']) => {
    setDiscipleshipPhase(phaseId);
    navigateTo('discipulado');
  };

  const handleOpenSchoolTab = (tab: 'escuela' | 'biblioteca') => {
    navigateTo('escuela', tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1C1B18]">
      <TopNav activeSection={activeSection} onNavigate={(sec) => navigateTo(sec)} />

      <main className="flex-1">
        {activeSection === 'inicio' && (
          <HomeView
            onNavigate={(sec) => navigateTo(sec)}
            onStartChatWithPrompt={(prompt) => handleStartChatWithPrompt(prompt)}
            onOpenDiscipleshipPhase={handleOpenDiscipleshipPhase}
            onOpenSchoolTab={handleOpenSchoolTab}
          />
        )}

        {activeSection === 'escuela' && (
          <BibleSchoolView
            initialTab={schoolTab}
            onAskAssistant={(lessonTitle, prompt) =>
              handleStartChatWithPrompt(prompt, lessonTitle)
            }
          />
        )}

        {activeSection === 'chat' && (
          <EvangelistChatView
            pendingPrompt={pendingChatPrompt}
            pendingContextTitle={pendingLessonTitle}
            onClearPendingPrompt={() => {
              setPendingChatPrompt(null);
              setPendingLessonTitle(null);
            }}
            onNavigateToSchool={() => handleOpenSchoolTab('escuela')}
            onNavigateToLibrary={() => handleOpenSchoolTab('biblioteca')}
            onNavigateToDiscipleship={() => navigateTo('discipulado')}
          />
        )}

        {activeSection === 'discipulado' && (
          <DiscipleshipView
            initialPhaseId={discipleshipPhase}
            onAskAboutLesson={(lessonTitle, prompt) =>
              handleStartChatWithPrompt(prompt, lessonTitle)
            }
          />
        )}

        {activeSection === 'oracion' && <PrayerRequestsView />}

        {activeSection === 'acompanamiento' && (
          <PastoralCareView
            onStartPastoralChat={(prompt) => handleStartChatWithPrompt(prompt)}
          />
        )}
      </main>

      <Footer
        onNavigate={(sec) => navigateTo(sec)}
        onOpenLibrary={() => handleOpenSchoolTab('biblioteca')}
      />
      <WhatsAppButton />
    </div>
  );
}
