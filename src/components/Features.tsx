const features = [
  {
    title: "Simple",
    desc: "No unnecessary complexity. Just what you need.",
  },
  {
    title: "Fast",
    desc: "Optimised for performance and speed.",
  },
  {
    title: "Scalable",
    desc: "Built to grow with your product.",
  },
];

export default function Features() {
  return (
    <section className="py-24">
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-neutral-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}