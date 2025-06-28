import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes } from '../styles/themes';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('swiftsummary_theme');
    const savedSystemPreference = localStorage.getItem('swiftsummary_system_theme');
    
    if (savedTheme && savedSystemPreference === 'false') {
      setIsDark(savedTheme === 'dark');
      setIsSystemTheme(false);
    } else {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemPrefersDark);
      setIsSystemTheme(true);
    }
  }, []);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (isSystemTheme) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemTheme]);

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    setIsSystemTheme(false);
    localStorage.setItem('swiftsummary_theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('swiftsummary_system_theme', 'false');
  };

  const setSystemTheme = () => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(systemPrefersDark);
    setIsSystemTheme(true);
    localStorage.removeItem('swiftsummary_theme');
    localStorage.setItem('swiftsummary_system_theme', 'true');
  };

  const setLightTheme = () => {
    setIsDark(false);
    setIsSystemTheme(false);
    localStorage.setItem('swiftsummary_theme', 'light');
    localStorage.setItem('swiftsummary_system_theme', 'false');
  };

  const setDarkTheme = () => {
    setIsDark(true);
    setIsSystemTheme(false);
    localStorage.setItem('swiftsummary_theme', 'dark');
    localStorage.setItem('swiftsummary_system_theme', 'false');
  };

  const currentTheme = isDark ? themes.dark : themes.light;

  const value = {
    isDark,
    isSystemTheme,
    theme: currentTheme,
    toggleTheme,
    setSystemTheme,
    setLightTheme,
    setDarkTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};