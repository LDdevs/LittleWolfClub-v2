export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold">
          Little Wolf Pack
        </h1>

        <p className="mt-4 text-neutral-300">
          Nature Discovery Club for Curious Kids
        </p>

        <button className="mt-8 px-6 py-3 rounded-full bg-green-400 text-black font-semibold hover:shadow-lg transition">
          Join the Pack
        </button>
      </div>
    </section>
  );
}