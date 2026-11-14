"use client";

import { useTheme } from "@/components/ThemeContext";
import AtmosphereParticleCanvas from "@/components/AtmosphereParticleCanvas";

export default function ParticleBackground() {
  const { atmosphere, activeAtmosphere, effectsEnabled } = useTheme();

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <AtmosphereParticleCanvas
        theme={activeAtmosphere}
        intensity={atmosphere.intensity}
        enabled={atmosphere.enabled && effectsEnabled}
        respondToScroll
      />
    </div>
  );
}
