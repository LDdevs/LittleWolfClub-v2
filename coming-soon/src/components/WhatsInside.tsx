const items = [
  "Welcome Letter from Scout",
  "40-page Adventure Workbook",
  "Challenge Cards",
  "Badge System",
  "Official Pack Member Badge",
  "Mystery Explorer Item",
  "Explorer Field Bag (launch bonus)",
  "Completion Certificate",
];

export default function WhatsInside() {
  return (
    <section className="py-20 px-6">
      <h2 className="text-3xl font-semibold text-center text-orange-300">
        What’s inside the Adventure Kit
      </h2>

      <div className="mt-10 grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {items.map((item) => (
          <div
            key={item}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}