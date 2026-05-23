const reasons = [
  "Encourages outdoor play",
  "Builds curiosity and confidence",
  "Screen-free and educational",
  "Keeps kids engaged for hours",
  "Feels like a special gift experience",
];

export default function WhyParentsLoveIt() {
  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-semibold">Why parents love it</h2>

      <div className="mt-8 grid md:grid-cols-2 gap-3 max-w-3xl mx-auto text-left">
        {reasons.map((r) => (
          <div key={r} className="p-4 bg-white/5 border border-white/10 rounded-xl">
            ✔ {r}
          </div>
        ))}
      </div>
    </section>
  );
}