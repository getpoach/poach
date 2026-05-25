"use client";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { chefs } from "@/data/chefs";

const CUISINE_OPTIONS = [
  "French", "Italian", "Japanese", "Mexican", "Indian",
  "Mediterranean", "West African", "Fusion", "Omakase",
  "Pastry", "Oaxacan", "Cajun", "Creole", "American",
];

const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PRESET_COLORS = [
  "#C8A97E", "#7EC8C8", "#C87E7E", "#B87EC8",
  "#C8B87E", "#7EC87E", "#7E9BC8", "#C8C87E",
  "#E8A87C", "#A8C8A8", "#C8A8C8", "#A8B8C8",
];

type SaveState = "idle" | "saving" | "saved" | "error";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #1a1a1a", background: "#0a0a0a" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#f5f0e8" }}>{title}</span>
      </div>
      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "#3f3f46", marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

export default function ChefProfile() {
  const { user } = useAuth();
  const chef = chefs.find(c => c.id === user?.chefId) ?? chefs[0];

  // Form state — mirrors the Chef type
  const [name, setName]           = useState(chef.name);
  const [bio, setBio]             = useState(chef.bio);
  const [specialty, setSpecialty] = useState(chef.specialty);
  const [trained, setTrained]     = useState(chef.trained);
  const [experience, setExperience] = useState(chef.experience);
  const [location, setLocation]   = useState(chef.location);
  const [cuisines, setCuisines]   = useState<string[]>(chef.cuisine);
  const [available, setAvailable] = useState<string[]>(chef.available);
  const [price, setPrice]         = useState(chef.price);
  const [serviceRadius, setServiceRadius] = useState(chef.serviceRadius ?? 10);
  const [color, setColor]         = useState(chef.color);
  const [customColor, setCustomColor] = useState(chef.color);
  const [headshot, setHeadshot]   = useState(chef.headshot ?? "");
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>(chef.portfolioImages ?? []);
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite]     = useState("");

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [activeTab, setActiveTab] = useState<"identity" | "about" | "availability" | "portfolio" | "social">("identity");

  const fileInputRef = useRef<HTMLInputElement>(null);

  function toggleCuisine(c: string) {
    setCuisines(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  function toggleDay(d: string) {
    setAvailable(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  }

  function handleHeadshotUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setHeadshot(reader.result as string);
    reader.readAsDataURL(file);
  }

  function addPortfolioUrl() {
    if (portfolioUrls.length < 10) setPortfolioUrls(prev => [...prev, ""]);
  }

  function updatePortfolioUrl(i: number, val: string) {
    setPortfolioUrls(prev => prev.map((u, idx) => idx === i ? val : u));
  }

  function removePortfolioUrl(i: number) {
    setPortfolioUrls(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaveState("saving");
    await new Promise(r => setTimeout(r, 900));
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2500);
  }

  const TABS = [
    { id: "identity",     label: "Identity"     },
    { id: "about",        label: "About"        },
    { id: "availability", label: "Availability" },
    { id: "portfolio",    label: "Portfolio"    },
    { id: "social",       label: "Social"       },
  ] as const;

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#141414", border: "1px solid #2a2a2a",
    borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f5f0e8",
    outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "32px 36px", maxWidth: 860, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>
            My Profile
          </h1>
          <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>
            How you appear to diners browsing Poach
          </p>
        </div>

        {/* Live preview pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 14px", borderRadius: 99,
            background: color + "15", border: `1px solid ${color}55`,
          }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", border: `2px solid ${color}`, flexShrink: 0 }}>
              {headshot
                ? <img src={headshot} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", background: color + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color }}>{name.split(" ").map(n => n[0]).join("").slice(0,2)}</div>
              }
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f5f0e8" }}>{name}</div>
              <div style={{ fontSize: 10, color: "#71717a" }}>{location}</div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saveState === "saving"}
            style={{
              padding: "10px 22px", borderRadius: 10, border: "none",
              background: saveState === "saved" ? "#7EC87E" : saveState === "saving" ? "#a8894e" : "#C8A97E",
              color: "#080808", fontWeight: 800, fontSize: 13,
              cursor: saveState === "saving" ? "wait" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.3s",
            }}
          >
            {saveState === "saving" ? "Saving..." : saveState === "saved" ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid #1e1e1e" }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 18px", background: "transparent", border: "none",
              borderBottom: activeTab === tab.id ? `2px solid ${color}` : "2px solid transparent",
              color: activeTab === tab.id ? "#f5f0e8" : "#52525b",
              fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s", marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Identity tab ─────────────────────────────────────────────────── */}
      {activeTab === "identity" && (
        <>
          <Section title="👤 Profile Photo">
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: `3px solid ${color}`, flexShrink: 0 }}>
                  {headshot
                    ? <img src={headshot} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color }}>{name.split(" ").map(n => n[0]).join("").slice(0,2)}</div>
                  }
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleHeadshotUpload} style={{ display: "none" }} />
                <button onClick={() => fileInputRef.current?.click()}
                  style={{ padding: "10px 18px", borderRadius: 10, background: "#141414", border: "1px solid #2a2a2a", color: "#a1a1aa", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 8, display: "block" }}>
                  Upload New Photo
                </button>
                <div style={{ fontSize: 11, color: "#3f3f46" }}>JPG, PNG or WebP · Square works best · Max 5MB</div>
                {headshot && headshot.startsWith("data:") && (
                  <button onClick={() => setHeadshot("")}
                    style={{ marginTop: 8, fontSize: 11, color: "#C87E7E", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </Section>

          <Section title="✦ Profile Color">
            <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 14px" }}>
              Your color appears on your map pin, chef card border, and throughout your profile.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
              {PRESET_COLORS.map(c => (
                <button key={c} onClick={() => { setColor(c); setCustomColor(c); }}
                  style={{
                    width: 36, height: 36, borderRadius: "50%", background: c,
                    border: color === c ? `3px solid #fff` : "3px solid transparent",
                    cursor: "pointer", boxShadow: color === c ? `0 0 0 2px ${c}` : "none",
                    transition: "all 0.15s",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: customColor, border: "2px solid #2a2a2a", flexShrink: 0 }} />
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>Custom Color</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="color" value={customColor} onChange={e => { setCustomColor(e.target.value); setColor(e.target.value); }}
                    style={{ width: 36, height: 32, borderRadius: 6, border: "1px solid #2a2a2a", cursor: "pointer", background: "transparent", padding: 2 }} />
                  <input type="text" value={customColor} onChange={e => { setCustomColor(e.target.value); if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) setColor(e.target.value); }}
                    style={{ ...inputStyle, width: 110, fontSize: 12 }} />
                </div>
              </div>
            </div>
          </Section>

          <Section title="🪪 Basic Info">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Display Name">
                <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
              </Field>
              <Field label="Location">
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} placeholder="City, State" />
              </Field>
              <Field label="Years of Experience">
                <input type="text" value={experience} onChange={e => setExperience(e.target.value)} style={inputStyle} placeholder="e.g. 14 years" />
              </Field>
              <Field label="Where You Trained">
                <input type="text" value={trained} onChange={e => setTrained(e.target.value)} style={inputStyle} placeholder="e.g. Le Cordon Bleu, Paris" />
              </Field>
            </div>
            <Field label="Signature Specialty" hint="The one dish or style that defines you">
              <input type="text" value={specialty} onChange={e => setSpecialty(e.target.value)} style={inputStyle} placeholder="e.g. Crawfish Bisque & Duck Confit" />
            </Field>
          </Section>
        </>
      )}

      {/* ── About tab ────────────────────────────────────────────────────── */}
      {activeTab === "about" && (
        <>
          <Section title="📝 Your Story">
            <Field label="Bio" hint="This appears on your public profile. Be personal — diners want to know who you are.">
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={6}
                style={{ ...inputStyle, resize: "vertical", minHeight: 120, lineHeight: 1.7 }}
                placeholder="Tell diners your story — your background, your inspiration, what makes your cooking unique..." />
              <div style={{ fontSize: 11, color: bio.length > 400 ? "#C87E7E" : "#3f3f46", marginTop: 5, textAlign: "right" }}>
                {bio.length} / 500 characters
              </div>
            </Field>
          </Section>

          <Section title="🍽️ Cuisines You Offer">
            <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 14px" }}>Select all styles you're comfortable cooking.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CUISINE_OPTIONS.map(c => {
                const active = cuisines.includes(c);
                return (
                  <button key={c} onClick={() => toggleCuisine(c)}
                    style={{
                      padding: "8px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      border: `1px solid ${active ? color : "#2a2a2a"}`,
                      background: active ? color : "transparent",
                      color: active ? "#080808" : "#a1a1aa",
                      transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
                    }}>
                    {c}
                  </button>
                );
              })}
            </div>
          </Section>
        </>
      )}

      {/* ── Availability tab ─────────────────────────────────────────────── */}
      {activeTab === "availability" && (
        <>
          <Section title="🗓️ Available Days">
            <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 16px" }}>These show on your public profile to help diners find you.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {DAY_OPTIONS.map(d => {
                const active = available.includes(d);
                return (
                  <button key={d} onClick={() => toggleDay(d)}
                    style={{
                      width: 64, height: 64, borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer",
                      border: `1px solid ${active ? color : "#2a2a2a"}`,
                      background: active ? color : "#141414",
                      color: active ? "#080808" : "#71717a",
                      transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
                    }}>
                    {d}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="💰 Pricing & Range">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <Field label="Starting Price (per person)" hint="Your minimum — diners see this on your card">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input type="range" min={30} max={250} step={5} value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    style={{ flex: 1, accentColor: color }} />
                  <span style={{ fontWeight: 800, color, fontSize: 18, minWidth: 52 }}>${price}</span>
                </div>
              </Field>
              <Field label="Service Radius (miles)" hint="How far you'll travel from your location">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input type="range" min={5} max={20} step={1} value={serviceRadius}
                    onChange={e => setServiceRadius(Number(e.target.value))}
                    style={{ flex: 1, accentColor: color }} />
                  <span style={{ fontWeight: 800, color, fontSize: 18, minWidth: 52 }}>{serviceRadius} mi</span>
                </div>
              </Field>
            </div>
          </Section>
        </>
      )}

      {/* ── Portfolio tab ────────────────────────────────────────────────── */}
      {activeTab === "portfolio" && (
        <>
          <Section title="📸 Portfolio Photos">
            <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 16px" }}>
              Add up to 10 photos of your dishes, plating, and dining setups. These appear in your public drawer.
            </p>

            {/* Preview grid */}
            {portfolioUrls.filter(u => u.trim()).length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
                {portfolioUrls.filter(u => u.trim()).map((url, i) => (
                  <div key={i} style={{ aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", background: "#141414", border: "1px solid #2a2a2a" }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                ))}
              </div>
            )}

            {/* URL inputs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {portfolioUrls.map((url, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", background: "#141414", border: "1px solid #2a2a2a", flexShrink: 0 }}>
                    {url.trim() && <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }} />}
                  </div>
                  <input type="text" value={url} onChange={e => updatePortfolioUrl(i, e.target.value)}
                    placeholder={`Photo ${i + 1} URL`}
                    style={{ ...inputStyle, flex: 1, fontSize: 12 }} />
                  <button onClick={() => removePortfolioUrl(i)}
                    style={{ padding: "10px 12px", borderRadius: 8, background: "transparent", border: "1px solid #27272a", color: "#71717a", cursor: "pointer", fontSize: 13 }}>
                    ×
                  </button>
                </div>
              ))}
            </div>

            {portfolioUrls.length < 10 && (
              <button onClick={addPortfolioUrl}
                style={{ marginTop: 12, padding: "9px 16px", borderRadius: 10, background: "transparent", border: `1px dashed ${color}55`, color, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                + Add Photo URL
              </button>
            )}
            <div style={{ fontSize: 11, color: "#3f3f46", marginTop: 8 }}>
              {portfolioUrls.length}/10 photos · Paste image URLs from Unsplash, your website, or anywhere public
            </div>
          </Section>
        </>
      )}

      {/* ── Social tab ───────────────────────────────────────────────────── */}
      {activeTab === "social" && (
        <>
          <Section title="🔗 Social & Web">
            <Field label="Instagram Handle" hint="Shown on your profile so diners can follow your work">
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <div style={{ padding: "10px 12px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRight: "none", borderRadius: "10px 0 0 10px", fontSize: 13, color: "#52525b" }}>@</div>
                <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)}
                  placeholder="yourhandle"
                  style={{ ...inputStyle, borderRadius: "0 10px 10px 0", flex: 1 }} />
              </div>
            </Field>
            <Field label="Personal Website" hint="Link to your food blog, catering site, or any personal page">
              <input type="url" value={website} onChange={e => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com" style={inputStyle} />
            </Field>
          </Section>

          <Section title="⭐ Your Stats (Read Only)">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#1a1a1a", borderRadius: 12, overflow: "hidden" }}>
              {[
                { label: "Rating", value: String(chef.rating), sub: `${chef.reviewCount} reviews` },
                { label: "Total Bookings", value: String(chef.bookingCount), sub: "All time" },
                { label: "Member Since", value: "Jan 2024", sub: "Poach Verified ✓" },
              ].map(({ label, value, sub }) => (
                <div key={label} style={{ padding: "16px 18px", background: "#0f0f0f" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "var(--font-playfair)" }}>{value}</div>
                  <div style={{ fontSize: 11, color: "#52525b", marginTop: 3 }}>{sub}</div>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* Floating save bar */}
      <div style={{
        position: "sticky", bottom: 24,
        display: "flex", justifyContent: "flex-end",
        pointerEvents: "none",
      }}>
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          style={{
            pointerEvents: "auto",
            padding: "12px 28px", borderRadius: 12, border: "none",
            background: saveState === "saved" ? "#7EC87E" : saveState === "saving" ? "#a8894e" : "#C8A97E",
            color: "#080808", fontWeight: 800, fontSize: 14,
            cursor: saveState === "saving" ? "wait" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            transition: "background 0.3s",
          }}
        >
          {saveState === "saving" ? "Saving..." : saveState === "saved" ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
