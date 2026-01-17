
/**
 * Keyboard shortcuts configuration
 * Shared constant to maintain consistency across the app
 */

export interface AppKeyboardShortcut {
  keys: string;
  keysDisplay: string;
  description: string;
  action: string;
}

export const APP_KEYBOARD_SHORTCUTS: AppKeyboardShortcut[] = [
  {
    keys: 'd',
    keysDisplay: 'Ctrl + D',
    description: 'Go to Dashboard',
    action: 'Navegar para o Dashboard'
  },
  {
    keys: 'f',
    keysDisplay: 'Ctrl + F',
    description: 'Go to Focus Timer',
    action: 'Abrir Temporizador de Foco'
  },
  {
    keys: 's',
    keysDisplay: 'Ctrl + S',
    description: 'Go to Statistics',
    action: 'Ver Estatísticas'
  },
  {
    keys: 'r',
    keysDisplay: 'Ctrl + R',
    description: 'Go to Review',
    action: 'Ir para Revisões'
  }
];
