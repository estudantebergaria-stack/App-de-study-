import { useEffect } from 'react';

interface ThemeColorUpdaterProps {
  theme: string;
}

// Theme color mapping
const THEME_COLORS: Record<string, string> = {
  'dark': '#09090b',
  'light': '#f4f4f5',
  'neon-purple': '#1a0a2e',
  'neon-blue': '#0a192f',
  'neon-green': '#0a2e1a',
  'neon-pink': '#2e0a1e',
  'elite': '#0f0f0f',
  'mestre': '#1c1c1c'
};

/**
 * Component that dynamically updates the theme-color meta tag
 * based on the current theme setting
 */
const ThemeColorUpdater: React.FC<ThemeColorUpdaterProps> = ({ theme }) => {
  useEffect(() => {
    // Get the meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (metaThemeColor) {
      // Update the theme color based on current theme
      const color = THEME_COLORS[theme] || THEME_COLORS['dark'];
      metaThemeColor.setAttribute('content', color);
    }
  }, [theme]);

  // This component doesn't render anything
  return null;
};

export default ThemeColorUpdater;
