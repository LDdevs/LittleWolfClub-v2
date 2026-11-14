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

function getEasterSunday(year: number): Date {
  // Gregorian computus: calculate Easter Sunday without an external dependency.
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function getSeasonForDate(date: Date = new Date()): AtmosphereTheme {
  const month = date.getMonth();
  const day = date.getDate();

  // Special occasions take priority over the normal seasonal palette.
  if (month === 9) return "halloween"; // October
  if (month === 10 && day === 5) return "bonfire";
  if (month === 11 && day <= 26) return "christmas";

  const easter = getEasterSunday(date.getFullYear());
  const easterStart = new Date(easter);
  easterStart.setDate(easter.getDate() - 7);
  const easterEnd = new Date(easter);
  easterEnd.setDate(easter.getDate() + 1);
  if (date >= easterStart && date <= easterEnd) return "easter";

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
