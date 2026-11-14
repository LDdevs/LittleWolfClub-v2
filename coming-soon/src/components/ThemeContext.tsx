"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEFAULT_ATMOSPHERE_SETTINGS,
  getActiveAtmosphereTheme,
  type AtmosphereSettings,
  type AtmosphereTheme,
} from "@/lib/atmosphere";

type ThemeContextType = {
  mood: number;
  toggle: () => void;
  atmosphere: AtmosphereSettings;
  activeAtmosphere: AtmosphereTheme;
};

const ThemeContext = createContext<ThemeContextType>({
  mood: 1,
  toggle: () => {},
  atmosphere: DEFAULT_ATMOSPHERE_SETTINGS,
  activeAtmosphere: "autumn",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMood] = useState(1);
  const [atmosphere, setAtmosphere] = useState<AtmosphereSettings>(
    DEFAULT_ATMOSPHERE_SETTINGS
  );

  const toggle = () => {
    setMood((m) => (m === 1 ? 0 : 1));
  };

  const loadAtmosphere = useCallback(async () => {
    try {
      const response = await fetch("/api/atmosphere", { cache: "no-store" });
      if (!response.ok) return;

      const data = await response.json();
      if (
        typeof data.enabled === "boolean" &&
        (data.mode === "automatic" || data.mode === "manual") &&
        typeof data.manual_theme === "string" &&
        typeof data.intensity === "number"
      ) {
        setAtmosphere(data as AtmosphereSettings);
      }
    } catch (error) {
      console.error("Could not load seasonal atmosphere:", error);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      if (cancelled) return;
      await loadAtmosphere();
    };

    void refresh();
    const interval = window.setInterval(refresh, 5 * 60 * 1000);
    window.addEventListener("focus", refresh);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
    };
  }, [loadAtmosphere]);

  const activeAtmosphere = atmosphere.enabled
    ? getActiveAtmosphereTheme(atmosphere)
    : "autumn";

  return (
    <ThemeContext.Provider
      value={{ mood, toggle, atmosphere, activeAtmosphere }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
