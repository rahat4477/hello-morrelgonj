import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initCapacitorApp } from './utils/capacitorInit.ts';

// Initialize Capacitor native features if running inside Android APK
initCapacitorApp();

// Register Service Worker for PWA & Offline Support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
} else if ('serviceWorker' in navigator) {
  // Also register in dev mode if needed for PWABuilder tests
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
