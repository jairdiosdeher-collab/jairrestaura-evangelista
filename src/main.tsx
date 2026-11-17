import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Animador from './Animador.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import './index.css';

const isAnimatorRoute = window.location.pathname.replace(/\/+$/g, '').toLowerCase() === '/animador';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      {isAnimatorRoute ? <Animador /> : <App />}
    </ThemeProvider>
  </StrictMode>
);
