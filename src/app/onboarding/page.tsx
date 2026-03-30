"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CUISINES = ["French","Italian","Japanese","Mexican","Indian","Mediterranean","West African","Fusion","Omakase","Pastry","Oaxacan"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const STEPS = [
  { number: 1, label: "Welcome" },
  { number: 2, label: "About You" },
  { number: 3, label: "Your Cuisine" },
  { number: 4, label: "Availability" },
  { number: 5, label: "First Menu" },
  { number: 6, label: "Ready!" },
];

export default function ChefOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 2
  const [bio, setBio] = useState("");
  const [trained, setTrained] = useState("");
  const [experience, setExperience] = useState("");
  const [specialty, setSpecialty] = useState("");

  // Step 3
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [pricePerPerson, setPricePerPerson] = useState(75);
  const [serviceRadius, setServiceRadius] = useState(10);

  // Step 4
  const [availableDays, setAvailableDays] = useState<string[]>([]);

  // Step 5
  const [menuName, setMenuName] = useState("");
  const [menuDesc, setMenuDesc] = useState("");
  const [menuCourses, setMenuCourses] = useState([
    { name: "", description: "" },
    { name: "", description: "" },
    { name: "", description: "" },
  ]);

  function toggleCuisine(c: string) {
    setSelectedCuisines((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function toggleDay(d: string) {
    setAvailableDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  function canProceed() {
    if (step === 2) return bio.length > 20 && trained && experience;
    if (step === 3) return selectedCuisines.length > 0;
    if (step === 4) return availableDays.length > 0;
    if (step === 5) return menuName.length > 0;
    return true;
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }}>
      {/* Logo */}
      <div style={{ marginBottom: 32 }}>
        <Image src="/poachnav.png" alt="Poach" width={120} height={36} style={{ height: 32, width: "auto", mixBlendMode: "screen" }} />
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: 560, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          {STEPS.map((s) => (
            <div key={s.number} style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: step >= s.number ? "#C8A97E" : "#1a1a1a",
                border: `2px solid ${step >= s.number ? "#C8A97E" : "#2a2a2a"}`,
                margin: "0 auto",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800,
                color: step >= s.number ? "#080808" : "#52525b",
                transition: "all 0.3s",
              }}>
                {step > s.number ? "✓" : s.number}
              </div>
              <div style={{ fontSize: 9, color: step >= s.number ? "#C8A97E" : "#52525b", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 2, background: "#1a1a1a", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#C8A97E", borderRadius: 99, transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 560, background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 20, overflow: "hidden" }}>

        {/* Step 1 — Welcome */}
        {step === 1 && (
          <div style={{ padding: "40px 36px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>👨‍🍳</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 12px" }}>
              Welcome to Poach, Chef.
            </h1>
            <p style={{ fontSize: 14, color: "#71717a", lineHeight: 1.7, maxWidth: 380, margin: "0 auto 28px" }}>
              Let's set up your chef profile in just a few minutes. You'll be accepting bookings before you know it.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
              {[["🍽️","Set your menus"],["📅","Set availability"],["💰","Start earning"]].map(([icon, label]) => (
                <div key={label} style={{ padding: "16px 12px", background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: 11, color: "#a1a1aa", fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — About */}
        {step === 2 && (
          <div style={{ padding: "36px" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>About You</h2>
            <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 24px" }}>Tell diners who you are and what makes your cooking special.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Bio", value: bio, set: setBio, placeholder: "Your culinary story — background, style, passion...", multiline: true },
                { label: "Where you trained", value: trained, set: setTrained, placeholder: "e.g. Le Cordon Bleu, Paris" },
                { label: "Years of experience", value: experience, set: setExperience, placeholder: "e.g. 8 years" },
                { label: "Signature specialty", value: specialty, set: setSpecialty, placeholder: "e.g. Crawfish Bisque & Duck Confit" },
              ].map(({ label, value, set, placeholder, multiline }) => (
                <div key={label}>
                  <label style={labelStyle}>{label}</label>
                  {multiline ? (
                    <textarea value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} rows={3}
                      style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} />
                  ) : (
                    <input type="text" value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} style={inputStyle} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Cuisine */}
        {step === 3 && (
          <div style={{ padding: "36px" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>Your Cuisine</h2>
            <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 20px" }}>Select all cuisine styles you offer. You can add more later.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
              {CUISINES.map((c) => {
                const active = selectedCuisines.includes(c);
                return (
                  <button key={c} onClick={() => toggleCuisine(c)}
                    style={{ padding: "8px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${active ? "#C8A97E" : "#2a2a2a"}`, background: active ? "#C8A97E" : "transparent", color: active ? "#080808" : "#a1a1aa", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
                    {c}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Price per person (starting from)</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="range" min={30} max={200} step={5} value={pricePerPerson} onChange={(e) => setPricePerPerson(Number(e.target.value))}
                    style={{ flex: 1, accentColor: "#C8A97E" }} />
                  <span style={{ color: "#C8A97E", fontWeight: 800, fontSize: 16, minWidth: 52 }}>${pricePerPerson}</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Service radius (miles)</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="range" min={5} max={20} step={1} value={serviceRadius} onChange={(e) => setServiceRadius(Number(e.target.value))}
                    style={{ flex: 1, accentColor: "#C8A97E" }} />
                  <span style={{ color: "#C8A97E", fontWeight: 800, fontSize: 16, minWidth: 52 }}>{serviceRadius} mi</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Availability */}
        {step === 4 && (
          <div style={{ padding: "36px" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>Your Availability</h2>
            <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 24px" }}>Which days are you generally available for bookings?</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {DAYS.map((d) => {
                const active = availableDays.includes(d);
                return (
                  <button key={d} onClick={() => toggleDay(d)}
                    style={{ width: 60, height: 60, borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", border: `1px solid ${active ? "#C8A97E" : "#2a2a2a"}`, background: active ? "#C8A97E" : "#141414", color: active ? "#080808" : "#71717a", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
                    {d}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: "#52525b", marginTop: 20 }}>
              You can manage your availability in detail from your calendar after setup.
            </p>
          </div>
        )}

        {/* Step 5 — First Menu */}
        {step === 5 && (
          <div style={{ padding: "36px" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>Create Your First Menu</h2>
            <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 24px" }}>Give diners a taste of what to expect. You can add more menus later.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Menu Name</label>
                <input type="text" value={menuName} onChange={(e) => setMenuName(e.target.value)}
                  placeholder='e.g. "Bayou Tasting Menu" or "Sunday Family Feast"' style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Menu Description</label>
                <textarea value={menuDesc} onChange={(e) => setMenuDesc(e.target.value)} rows={2}
                  placeholder="A brief description of the overall dining experience..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div>
                <label style={labelStyle}>Courses (optional)</label>
                {menuCourses.map((course, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8, marginBottom: 8 }}>
                    <input type="text" value={course.name} onChange={(e) => {
                      const updated = [...menuCourses];
                      updated[i] = { ...updated[i], name: e.target.value };
                      setMenuCourses(updated);
                    }} placeholder={`Course ${i + 1} name`} style={{ ...inputStyle, fontSize: 12 }} />
                    <input type="text" value={course.description} onChange={(e) => {
                      const updated = [...menuCourses];
                      updated[i] = { ...updated[i], description: e.target.value };
                      setMenuCourses(updated);
                    }} placeholder="Description" style={{ ...inputStyle, fontSize: 12 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6 — Done */}
        {step === 6 && (
          <div style={{ padding: "48px 36px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 12px" }}>
              You're all set, Chef!
            </h1>
            <p style={{ fontSize: 14, color: "#71717a", lineHeight: 1.7, maxWidth: 380, margin: "0 auto 32px" }}>
              Your profile is live on Poach. Diners can now discover and book you. Head to your dashboard to manage everything.
            </p>
            <button onClick={() => router.push("/chef/dashboard")}
              style={{ padding: "14px 32px", borderRadius: 12, background: "#C8A97E", color: "#080808", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Go to My Dashboard →
            </button>
          </div>
        )}

        {/* Footer nav */}
        {step < 6 && (
          <div style={{ padding: "16px 36px 24px", display: "flex", justifyContent: "space-between", borderTop: "1px solid #1a1a1a" }}>
            <button onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              style={{ padding: "10px 20px", borderRadius: 10, background: "transparent", border: "1px solid #27272a", color: step === 1 ? "#3f3f46" : "#a1a1aa", fontSize: 13, cursor: step === 1 ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              ← Back
            </button>
            <button onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              style={{ padding: "10px 28px", borderRadius: 10, background: canProceed() ? "#C8A97E" : "#2a2a2a", color: canProceed() ? "#080808" : "#52525b", fontWeight: 700, fontSize: 13, border: "none", cursor: canProceed() ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
              {step === 5 ? "Finish Setup →" : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: "#52525b",
  textTransform: "uppercase", letterSpacing: "0.08em",
  display: "block", marginBottom: 7,
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#141414", border: "1px solid #2a2a2a",
  borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f5f0e8",
  outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
};
