import type { Metadata } from "next";
import "../styles/globals.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillNest",
  description:
    "SkillNest is a modern learning platform where students watch structured video lessons and track progress."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4">
          <header className="flex items-center justify-between py-6">
            <div className="text-lg font-semibold tracking-tight">SkillNest</div>
            <nav className="text-sm text-slate-600">
              <a className="hover:text-slate-900" href="/auth/login">
                Login
              </a>
              <span className="px-3 text-slate-300">/</span>
              <a className="hover:text-slate-900" href="/auth/register">
                Register
              </a>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="py-10 text-sm text-slate-500">© SkillNest</footer>
        </div>
      </body>
    </html>
  );
}

