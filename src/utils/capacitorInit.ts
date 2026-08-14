import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';

export async function initCapacitorApp() {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Hide splash screen after app is ready
    await SplashScreen.hide();

    // Set Android status bar color to match theme
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#0369a1' });

    // Handle Android hardware back button
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        // If on root page, exit or minimize
        CapApp.exitApp();
      }
    });
  } catch (err) {
    console.warn('Capacitor native setup error:', err);
  }
}
