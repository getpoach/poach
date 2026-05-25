"use client";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Camera } from "lucide-react";

type SaveState = "idle" | "saving" | "saved";

export default function DinerProfile() {
  const { user, updateAvatar } = useAuth();

  const [name,     setName]     = useState(user?.name ?? "");
  const [email,    setEmail]    = useState(user?.email ?? "");
  const [phone,    setPhone]    = useState("");
  const [city,     setCity]     = useState("");
  const [dietaryRestrictions, setDietary] = useState("");
  const [allergies, setAllergies] = useState("");
  const [preferredCuisines, setCuisines] = useState("");
  const [avatar,   setAvatar]  = useState(user?.avatar ?? "");
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
      updateAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaveState("saving");
    await new Promise(r => setTimeout(r, 800));
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2500);
  }

  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#141414", border: "1px solid #2a2a2a",
    borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f5f0e8",
    outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: "#52525b",
    textTransform: "uppercase", letterSpacing: "0.08em",
    display: "block", marginBottom: 7,
  };

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "13px 20px", borderBottom: "1px solid #1a1a1a", background: "#0a0a0a" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#f5f0e8" }}>{title}</span>
        </div>
        <div style={{ padding: "20px" }}>{children}</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>
            My Profile
          </h1>
          <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>Manage your personal details and preferences</p>
        </div>
        <button onClick={handleSave}
          style={{
            padding: "10px 22px", borderRadius: 10, border: "none",
            background: saveState === "saved" ? "#7EC87E" : saveState === "saving" ? "#a8894e" : "#C8A97E",
            color: "#080808", fontWeight: 800, fontSize: 13,
            cursor: saveState === "saving" ? "wait" : "pointer",
            fontFamily: "'DM Sans', sans-serif", transition: "background 0.3s",
          }}>
          {saveState === "saving" ? "Saving..." : saveState === "saved" ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Photo */}
      <Section title="Profile Photo">
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", border: "3px solid #C8A97E", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {avatar
                ? <img src={avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 26, fontWeight: 800, color: "#C8A97E" }}>{initials}</span>
              }
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                position: "absolute", bottom: 0, right: 0,
                width: 26, height: 26, borderRadius: "50%",
                background: "#C8A97E", border: "2px solid #080808",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
              <Camera size={13} color="#080808" strokeWidth={2} />
            </button>
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
            <button onClick={() => fileRef.current?.click()}
              style={{ padding: "9px 16px", borderRadius: 10, background: "#141414", border: "1px solid #2a2a2a", color: "#a1a1aa", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 6 }}>
              Upload Photo
            </button>
            <div style={{ fontSize: 11, color: "#3f3f46" }}>JPG, PNG or WebP · Max 5MB</div>
            {avatar && (
              <button onClick={() => { setAvatar(""); updateAvatar(""); }}
                style={{ marginTop: 6, fontSize: 11, color: "#C87E7E", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Remove photo
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* Personal Info */}
      <Section title="Personal Info">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>City</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Lafayette, LA" style={inputStyle} />
          </div>
        </div>
      </Section>

      {/* Dining Preferences */}
      <Section title="Dining Preferences">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Preferred Cuisines</label>
            <input type="text" value={preferredCuisines} onChange={e => setCuisines(e.target.value)}
              placeholder="e.g. French, Cajun, Mediterranean" style={inputStyle} />
            <div style={{ fontSize: 11, color: "#3f3f46", marginTop: 5 }}>Separate with commas</div>
          </div>
          <div>
            <label style={labelStyle}>Dietary Restrictions</label>
            <input type="text" value={dietaryRestrictions} onChange={e => setDietary(e.target.value)}
              placeholder="e.g. Vegetarian, Gluten-free" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Allergies</label>
            <input type="text" value={allergies} onChange={e => setAllergies(e.target.value)}
              placeholder="e.g. Tree nuts, Shellfish" style={inputStyle} />
            <div style={{ fontSize: 11, color: "#C87E7E88", marginTop: 5 }}>⚠ These are shared with your chef at booking</div>
          </div>
        </div>
      </Section>

      {/* Floating save */}
      <div style={{ position: "sticky", bottom: 24, display: "flex", justifyContent: "flex-end", pointerEvents: "none" }}>
        <button onClick={handleSave}
          style={{
            pointerEvents: "auto",
            padding: "12px 28px", borderRadius: 12, border: "none",
            background: saveState === "saved" ? "#7EC87E" : saveState === "saving" ? "#a8894e" : "#C8A97E",
            color: "#080808", fontWeight: 800, fontSize: 14,
            cursor: saveState === "saving" ? "wait" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            transition: "background 0.3s",
          }}>
          {saveState === "saving" ? "Saving..." : saveState === "saved" ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
