import { chefs } from "@/data/chefs";
import { reviews } from "@/data/reviews";
import { notFound } from "next/navigation";
import { Avatar, Tag, Stars, SectionLabel } from "@/components/ui/index";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function generateStaticParams() {
  return chefs.map((c) => ({ id: c.id }));
}

export default async function ChefProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chef = chefs.find((c) => c.id === id);
  
  if (!chef) notFound();

  const chefReviews = reviews.filter((r) => r.chefId === chef.id);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-5 mb-8">
        <Avatar label={chef.avatar} color={chef.color} size={80} />
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            {chef.name}
          </h1>
          <Stars rating={chef.rating} size={15} />
          <div className="text-sm text-muted mt-1">
            {chef.reviewCount} reviews · {chef.bookingCount} bookings ·{" "}
            {chef.experience}
          </div>
          <div className="text-sm text-zinc-500 mt-0.5">🎓 {chef.trained}</div>
        </div>
      </div>

      {/* About */}
      <div
        className="rounded-xl p-5 mb-4"
        style={{ background: "#141414", border: "1px solid #222" }}
      >
        <SectionLabel>About</SectionLabel>
        <p className="text-zinc-300 text-sm leading-relaxed">{chef.bio}</p>
      </div>

      {/* Cuisine */}
      <div
        className="rounded-xl p-5 mb-4"
        style={{ background: "#141414", border: "1px solid #222" }}
      >
        <SectionLabel>Cuisines & Specialty</SectionLabel>
        <div className="flex flex-wrap gap-2 mb-3">
          {chef.cuisine.map((c) => (
            <Tag key={c} label={c} color={chef.color} />
          ))}
        </div>
        <div
          className="text-sm text-zinc-400 pl-3"
          style={{ borderLeft: `2px solid ${chef.color}` }}
        >
          {chef.specialty}
        </div>
      </div>

      {/* Availability */}
      <div
        className="rounded-xl p-5 mb-4"
        style={{ background: "#141414", border: "1px solid #222" }}
      >
        <SectionLabel>Availability</SectionLabel>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((d) => {
            const avail = chef.available.includes(d);
            return (
              <span
                key={d}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  background: avail ? chef.color + "20" : "#1A1A1A",
                  border: `1px solid ${avail ? chef.color + "44" : "#222"}`,
                  color: avail ? chef.color : "#444",
                }}
              >
                {d}
              </span>
            );
          })}
        </div>
      </div>

      {/* Pricing */}
      <div
        className="rounded-xl p-5 mb-4"
        style={{ background: "#141414", border: "1px solid #222" }}
      >
        <div className="flex justify-between items-center">
          <SectionLabel>Session Rate</SectionLabel>
          <span
            className="font-display text-2xl font-bold"
            style={{ color: chef.color }}
          >
            ${chef.price}
          </span>
        </div>
        <p className="text-xs text-zinc-600 mt-1">
          Up to 3 hours · ingredients billed separately
        </p>
      </div>

      {/* Reviews */}
      {chefReviews.length > 0 && (
        <div className="mb-6">
          <SectionLabel>Reviews</SectionLabel>
          <div className="flex flex-col gap-3">
            {chefReviews.map((r) => (
              <div
                key={r.id}
                className="rounded-xl p-4"
                style={{ background: "#141414", border: "1px solid #222" }}
              >
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-bold text-white">{r.author}</span>
                  <span className="text-xs text-muted">{r.date}</span>
                </div>
                <Stars rating={r.rating} size={12} />
                <p className="text-sm text-zinc-400 leading-relaxed mt-2">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book CTA */}
      <a
        href="/"
        className="block w-full text-center font-bold text-sm py-4 rounded-xl hover:opacity-85 transition-opacity"
        style={{ background: chef.color, color: "#0A0A0A" }}
      >
        Book {chef.name.split(" ")[0]} →
      </a>
    </div>
  );
}
