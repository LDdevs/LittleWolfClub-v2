export default function ThemeCMSPage() {
  return (
    <div>

      <p className="uppercase tracking-[0.3em] text-green-400 text-xs mb-3">
        Theme Settings
      </p>

      <h1 className="text-5xl font-black tracking-tight mb-6">
        Theme Controls
      </h1>

      <div className="grid md:grid-cols-2 gap-5">

        <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-3">
            Night Mode
          </h2>

          <p className="text-neutral-400 text-sm">
            Future toggle for default nighttime appearance.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-3">
            Particle Density
          </h2>

          <p className="text-neutral-400 text-sm">
            Control leaf and firefly intensity.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-3">
            Seasonal Themes
          </h2>

          <p className="text-neutral-400 text-sm">
            Future toggle for seasonal appearance (i.e. winter, summer).
          </p>
        </div>

      </div>

    </div>
  );
}