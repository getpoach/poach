import { Navbar } from "@/components/nav/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </>
  );
}
