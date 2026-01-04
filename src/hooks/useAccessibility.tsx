import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ColorblindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'x-large';
  highContrast: boolean;
  speechRate: number;
  colorblindMode: ColorblindMode;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  setFontSize: (size: AccessibilitySettings['fontSize']) => void;
  toggleHighContrast: () => void;
  setSpeechRate: (rate: number) => void;
  setColorblindMode: (mode: ColorblindMode) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  speechRate: 0.9,
  colorblindMode: 'none',
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = 'accessibility-settings';

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return { ...defaultSettings, ...JSON.parse(stored) };
        } catch {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.classList.remove('font-size-normal', 'font-size-large', 'font-size-x-large');
    root.classList.add(`font-size-${settings.fontSize}`);
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Colorblind mode
    root.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia');
    if (settings.colorblindMode !== 'none') {
      root.classList.add(`colorblind-${settings.colorblindMode}`);
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setFontSize = (fontSize: AccessibilitySettings['fontSize']) => {
    setSettings(prev => ({ ...prev, fontSize }));
  };

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const setSpeechRate = (speechRate: number) => {
    setSettings(prev => ({ ...prev, speechRate }));
  };

  const setColorblindMode = (colorblindMode: ColorblindMode) => {
    setSettings(prev => ({ ...prev, colorblindMode }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{
      settings,
      setFontSize,
      toggleHighContrast,
      setSpeechRate,
      setColorblindMode,
      resetSettings,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
