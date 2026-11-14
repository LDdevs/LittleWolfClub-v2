export const ATMOSPHERE_THEMES = [
  "spring",
  "summer",
  "autumn",
  "winter",
  "halloween",
  "christmas",
  "easter",
  "bonfire",
] as const;

export type AtmosphereTheme = (typeof ATMOSPHERE_THEMES)[number];
export type AtmosphereMode = "automatic" | "manual";

export type AtmosphereSettings = {
  enabled: boolean;
  mode: AtmosphereMode;
  manual_theme: AtmosphereTheme;
  intensity: number;
};

export const DEFAULT_ATMOSPHERE_SETTINGS: AtmosphereSettings = {
  enabled: true,
  mode: "automatic",
  manual_theme: "autumn",
  intensity: 50,
};

export function getSeasonForDate(date: Date = new Date()): AtmosphereTheme {
  const month = date.getMonth();

  if (month === 11 || month <= 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  return "autumn";
}

export function getActiveAtmosphereTheme(
  settings: AtmosphereSettings,
  date: Date = new Date()
): AtmosphereTheme {
  return settings.mode === "manual"
    ? settings.manual_theme
    : getSeasonForDate(date);
}
