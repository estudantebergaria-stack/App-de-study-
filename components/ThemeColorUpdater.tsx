import { useEffect } from 'react';

interface ThemeColorUpdaterProps {
  theme: string;
}

// Theme color mapping for solid colors
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

/**
 * Component that dynamically updates the theme-color meta tag
 * and html/body background colors based on the current theme setting
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

    // Update html and body background colors
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const background = THEME_BACKGROUNDS[theme] || THEME_BACKGROUNDS['dark'];

    // Check if it's a gradient or solid color
    if (background.startsWith('linear-gradient')) {
      htmlElement.style.background = background;
      htmlElement.style.backgroundColor = ''; // Clear background-color when using gradient
      bodyElement.style.background = background;
      bodyElement.style.backgroundColor = ''; // Clear background-color when using gradient
    } else {
      htmlElement.style.backgroundColor = background;
      htmlElement.style.background = ''; // Clear background when using solid color
      bodyElement.style.backgroundColor = background;
      bodyElement.style.background = ''; // Clear background when using solid color
    }
  }, [theme]);

  // This component doesn't render anything
  return null;
};

export default ThemeColorUpdater;
