import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    console.log('Dark mode state changed:', isDarkMode);
    // Apply dark mode class to html element
    if (isDarkMode) {
      console.log('Adding dark class to html');
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      console.log('Removing dark class from html');
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    console.log('HTML classes:', document.documentElement.className);
    // Save to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    console.log('toggleTheme called, current isDarkMode:', isDarkMode);
    setIsDarkMode(prev => {
      console.log('Setting isDarkMode to:', !prev);
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
