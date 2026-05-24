const steps = [
  "Open the box with Scout’s letter",
  "Join the Little Wolf Pack",
  "Complete outdoor challenges",
  "Earn badges along the way",
  "Finish and receive your certificate",
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-semibold">How it works</h2>

      <div className="mt-10 space-y-4 max-w-xl mx-auto text-left">
        {steps.map((s, i) => (
          <div key={s} className="flex gap-3 items-start">
            <span className="text-green-300 font-semibold">{i + 1}.</span>
            <p className="text-neutral-300">{s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}