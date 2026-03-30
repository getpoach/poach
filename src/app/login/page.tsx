"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth, UserRole } from "@/context/AuthContext";

type Mode = "login" | "signup";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<UserRole>("diner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let result: { error?: string };
    if (mode === "login") {
      result = await login(email, password);
    } else {
      if (!name.trim()) { setError("Please enter your name."); setLoading(false); return; }
      result = await signup(name, email, password, role);
    }

    setLoading(false);
    if (result.error) { setError(result.error); return; }

    // Redirect based on role
    const stored = localStorage.getItem("poach_user");
    const user = stored ? JSON.parse(stored) : null;
    if (user?.role === "chef") {
      router.push("/chef/dashboard");
    } else {
      router.push("/");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#080808" }}
    >
      {/* Background grain */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
          zIndex: 0,
        }}
      />

      <div className="w-full max-w-md relative" style={{ zIndex: 1 }}>
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/poachlogo.png"
            alt="Poach"
            width={140}
            height={48}
            style={{ height: 40, width: "auto", objectFit: "contain", mixBlendMode: "screen" }}
          />
        </div>

        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#0f0f0f", border: "1px solid #1e1e1e" }}
        >
          {/* Mode toggle */}
          <div style={{ display: "flex", borderBottom: "1px solid #1e1e1e" }}>
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                style={{
                  flex: 1,
                  padding: "14px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  background: mode === m ? "#161616" : "transparent",
                  color: mode === m ? "#F5F0E8" : "#555",
                  border: "none",
                  borderBottom: mode === m ? "2px solid #C8A97E" : "2px solid transparent",
                  transition: "all 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.02em",
                }}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div style={{ padding: "28px 28px 32px" }}>
            {/* Role selection — signup only */}
            {mode === "signup" && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                  I am a...
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {([
                    { value: "diner" as UserRole, label: "🍽️ Diner", sub: "Book private chefs" },
                    { value: "chef" as UserRole, label: "👨‍🍳 Chef", sub: "Offer my services" },
                  ]).map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      style={{
                        flex: 1,
                        padding: "14px 12px",
                        borderRadius: 12,
                        cursor: "pointer",
                        border: `1px solid ${role === r.value ? "#C8A97E" : "#2a2a2a"}`,
                        background: role === r.value ? "#C8A97E12" : "#141414",
                        textAlign: "left",
                        transition: "all 0.2s",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <div style={{ fontSize: 15, marginBottom: 3 }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: "#71717a" }}>{r.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mode === "signup" && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    style={inputStyle}
                  />
                </div>
              )}

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  style={inputStyle}
                />
              </div>

              {error && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#1a1010", border: "1px solid #C8A97E44", fontSize: 12, color: "#C8A97E", lineHeight: 1.5 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 4,
                  padding: "13px",
                  borderRadius: 12,
                  background: loading ? "#a8894e" : "#C8A97E",
                  color: "#080808",
                  fontWeight: 800,
                  fontSize: 14,
                  border: "none",
                  cursor: loading ? "wait" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.02em",
                  transition: "opacity 0.2s",
                }}
              >
                {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
              </button>
            </form>

            {/* Demo hint */}
            <div style={{ marginTop: 20, padding: "12px 14px", borderRadius: 10, background: "#141414", border: "1px solid #1e1e1e" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Demo credentials</div>
              <div style={{ fontSize: 11, color: "#71717a", lineHeight: 1.8 }}>
                <span style={{ color: "#a1a1aa" }}>Diner:</span> alex@example.com / password<br />
                <span style={{ color: "#a1a1aa" }}>Chef:</span> beau@example.com / password
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#3f3f46" }}>
          © 2026 Poach · Private Dining Experiences
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#52525b",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#141414",
  border: "1px solid #2a2a2a",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 13,
  color: "#f5f0e8",
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};
