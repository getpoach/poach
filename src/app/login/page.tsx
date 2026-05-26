"use client";
import { ChefHat, UtensilsCrossed } from "lucide-react";
const G = ({ icon: I, size=15 }: { icon: React.ElementType; size?: number }) => 
  <I size={size} color="var(--gold)" strokeWidth={1.75} style={{ display:"inline-block", verticalAlign:"middle", marginRight:6 }} />;
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth, UserRole } from "@/context/AuthContext";

type Mode = "login" | "signup";

function AuthPage() {
  const { login, signup } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>(searchParams.get("mode") === "signup" ? "signup" : "login");
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
      style={{ background: "var(--bg)" }}
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
          style={{ background: "var(--bg-secondary)", border: "1px solid #1e1e1e" }}
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
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                  I am a...
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {([
                    { value: "diner" as UserRole, label: "Diner", sub: "Book private chefs" },
                    { value: "chef" as UserRole, label: "Chef", sub: "Offer my services" },
                  ]).map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      style={{
                        flex: 1,
                        padding: "14px 12px",
                        borderRadius: 12,
                        cursor: "pointer",
                        border: `1px solid ${role === r.value ? "var(--gold)" : "var(--border-mid)"}`,
                        background: role === r.value ? "#C8A97E12" : "var(--bg-tertiary)",
                        textAlign: "left",
                        transition: "all 0.2s",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <div style={{ fontSize: 15, marginBottom: 3 }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mode === "signup" && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
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
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#1a1010", border: "1px solid #C8A97E44", fontSize: 12, color: "var(--gold)", lineHeight: 1.5 }}>
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
                  background: loading ? "#a8894e" : "var(--gold)",
                  color: "var(--bg)",
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
            <div style={{ marginTop: 20, padding: "12px 14px", borderRadius: 10, background: "var(--bg-tertiary)", border: "1px solid #1e1e1e" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Demo credentials</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.8 }}>
                <span style={{ color: "var(--text-secondary)" }}>Diner:</span> alex@example.com / password<br />
                <span style={{ color: "var(--text-secondary)" }}>Chef:</span> beau@example.com / password
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "var(--border-strong)" }}>
          © 2026 Poach · Private Dining Experiences
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "var(--text-dim)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-tertiary)",
  border: "1px solid #2a2a2a",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 13,
  color: "var(--text-primary)",
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--gold)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>Loading...</div>
      </div>
    }>
      <AuthPage />
    </Suspense>
  );
}
