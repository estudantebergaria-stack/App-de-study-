import { useEffect } from 'react';

interface ThemeColorUpdaterProps {
  theme: string;
}

// Theme background mapping (includes gradients)
const THEME_BACKGROUNDS: Record<string, string> = {
  'dark': '#09090b',
  'light': '#f4f4f5',
  'neon-purple': 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
  'neon-blue': 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3557 100%)',
  'neon-green': 'linear-gradient(135deg, #0a2e1a 0%, #0f3d25 50%, #1a5a3a 100%)',
  'neon-pink': 'linear-gradient(135deg, #2e0a1e 0%, #3d1025 50%, #5a1a3a 100%)',
  'elite': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0a0a0a 100%)',
  'mestre': 'linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 50%, #1a1a1a 100%)'
};

// Theme-color for mobile browsers (always dark for consistency)
const THEME_COLOR_DARK = '#09090b';

/**
 * Component that dynamically updates the theme-color meta tag
 * and html/body background colors based on the current theme setting.
 * 
 * Ensures consistent dark browser bars on mobile across all themes:
 * - Android/Chrome: Uses theme-color meta tag
 * - iOS Safari: Uses apple-mobile-web-app-status-bar-style
 * - PWA Manifest: theme_color property
 */
const ThemeColorUpdater: React.FC<ThemeColorUpdaterProps> = ({ theme }) => {
  useEffect(() => {
    // Update theme-color meta tag for Android/Chrome
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', THEME_COLOR_DARK);
    }

    // Ensure Apple status bar style is set to black-translucent
    let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleStatusBar) {
      appleStatusBar = document.createElement('meta');
      appleStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(appleStatusBar);
    }
    appleStatusBar.setAttribute('content', 'black-translucent');

    // Update html and body background colors
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const background = THEME_BACKGROUNDS[theme] || THEME_BACKGROUNDS['dark'];

    // Check if it's a gradient or solid color
    const isGradient = background.includes('gradient(');
    
    if (isGradient) {
      htmlElement.style.background = background;
      htmlElement.style.removeProperty('background-color');
      bodyElement.style.background = background;
      bodyElement.style.removeProperty('background-color');
    } else {
      htmlElement.style.backgroundColor = background;
      htmlElement.style.removeProperty('background');
      bodyElement.style.backgroundColor = background;
      bodyElement.style.removeProperty('background');
    }
  }, [theme]);

  // This component doesn't render anything
  return null;
};

export default ThemeColorUpdater;
