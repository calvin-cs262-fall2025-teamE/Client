import React, { createContext, ReactNode, useContext, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  background: string[];
  surface: string;
  surfaceElev: string;
  text: string;
  textSecondary: string;
  primary: string;
  accent: string;
  border: string;
  chip: string;
  cardBackground: string;
}

interface Theme {
  colors: ThemeColors;
  radii: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const darkTheme: Theme = {
  colors: {
    background: ["#000000", "#000000", "#000000"],
    surface: "#000000",
    surfaceElev: "#1a1a1a",
    text: "#FFFFFF",
    textSecondary: "#9CA3AF",
    primary: "#FF9898",
    accent: "#FF9176",
    border: "#2a2a2a",
    chip: "rgba(255,255,255,0.12)",
    cardBackground: "#000000",
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
};

const lightTheme: Theme = {
  colors: {
    background: ["#f8f9fa", "#ffffff", "#fefefe"],
    surface: "#ffffff",
    surfaceElev: "#f1f3f5",
    text: "#0f1419",
    textSecondary: "#536471",
    primary: "#FF9898",
    accent: "#FF9176",
    border: "#d1d5db",
    chip: "rgba(0,0,0,0.06)",
    cardBackground: "#ffffff",
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
