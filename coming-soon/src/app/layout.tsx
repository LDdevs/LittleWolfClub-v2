import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import ParallaxBackground from "@/components/ParallaxBackground";
import ParticleBackground from "@/components/ParticleBackground";
import WoodlandAmbience from "@/components/WoodlandAmbience";
import FireflyCursor from "@/components/FireflyCursor";
import Navbar from "@/components/Navbar";
import { BasketProvider } from "@/components/BasketContext";
import AnnouncementBanner from "@/components/AnnouncementBanner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen overflow-x-hidden text-white bg-neutral-950">
        <ThemeProvider>
          <BasketProvider>
            <div className="fixed inset-0 z-0">
              <ParallaxBackground />
            </div>

            <div className="fixed inset-0 z-10 pointer-events-none">
              <ParticleBackground />
            </div>

            <div className="fixed inset-0 z-20 bg-black/25 pointer-events-none" />

            <WoodlandAmbience />
            <FireflyCursor />

            <div className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
              <div className="pointer-events-auto">
                <Navbar />
              </div>
            </div>

            <AnnouncementBanner />

            <main className="relative z-30">
              {children}
            </main>
          </BasketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
