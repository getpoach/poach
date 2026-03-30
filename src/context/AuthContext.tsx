"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "diner" | "chef";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  // Chef-specific
  chefId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user database
const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id: "diner-1",
    name: "Alex Thibodeaux",
    email: "alex@example.com",
    password: "password",
    role: "diner",
  },
  {
    id: "chef-1",
    name: "Beau Thibodaux",
    email: "beau@example.com",
    password: "password",
    role: "chef",
    chefId: "1",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    try {
      const stored = localStorage.getItem("poach_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { error: "Invalid email or password." };
    const { password: _, ...authUser } = found;
    setUser(authUser);
    localStorage.setItem("poach_user", JSON.stringify(authUser));
    return {};
  }

  async function signup(name: string, email: string, password: string, role: UserRole) {
    await new Promise((r) => setTimeout(r, 700));
    if (MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: "An account with that email already exists." };
    }
    const newUser: AuthUser = {
      id: `${role}-${Date.now()}`,
      name,
      email,
      role,
    };
    MOCK_USERS.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem("poach_user", JSON.stringify(newUser));
    return {};
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("poach_user");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
