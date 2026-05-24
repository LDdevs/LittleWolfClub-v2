"use client";

import { createContext, useContext, useState } from "react";

type ThemeContextType = {
  mood: number; // 0 = day, 1 = night
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  mood: 1,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMood] = useState(1); // start night (fits your brand)

  const toggle = () => {
    setMood((m) => (m === 1 ? 0 : 1));
  };

  return (
    <ThemeContext.Provider value={{ mood, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);