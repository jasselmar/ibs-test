import React, { useContext, createContext, useState } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export function useThemeContext() {
    return useContext(ThemeContext)
}

export function ThemeProvider({children}) {
    
    const [themeMode, setThemeMode] = useState('light');

    function toggleTheme() {
        const nextTheme = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(nextTheme);
    }

    const value = {
        themeMode,
        toggleTheme
    }
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}