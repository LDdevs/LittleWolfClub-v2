import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import ParallaxBackground from "@/components/ParallaxBackground";
import ParticleBackground from "@/components/ParticleBackground";
import FireflyCursor from "@/components/FireflyCursor";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen overflow-x-hidden text-white bg-neutral-950">

        <ThemeProvider>

          {/* 🌄 BACKGROUND */}
          <div className="fixed inset-0 z-0">
            <ParallaxBackground />
          </div>

          {/* 🍃 PARTICLES */}
          <div className="fixed inset-0 z-10 pointer-events-none">
            <ParticleBackground />
          </div>

          {/* 🌫️ DEPTH OVERLAY */}
          <div className="fixed inset-0 z-20 bg-black/25 pointer-events-none" />

          {/* 🐝 CURSOR */}
          <FireflyCursor />

          {/* 🧭 NAVBAR */}
          <div className="fixed top-0 left-0 w-full z-30">
            <Navbar />
          </div>

          {/* 🧠 CONTENT */}
          <main className="relative z-30">
            {children}
          </main>

        </ThemeProvider>

      </body>
    </html>
  );
}