import "./globals.css";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { RightRail } from "./components/RightRail";
import { Tape } from "./components/Tape";
import { CommandPalette } from "./components/CommandPalette";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>MEME INTEL // QUANT — Terminal</title>
      </head>
      <body>
        <div className="scanlines" aria-hidden="true"></div>
        <div className="app">
          {/* SIDEBAR */}
          <Sidebar />

          {/* MAIN */}
          <main className="main">
            <TopBar />
            <section className="views">
              <div className="view active" style={{ display: 'block' }}>
                {children}
              </div>
            </section>
          </main>

          {/* RIGHT RAIL */}
          <RightRail />
        </div>

        {/* FOOTER TAPE */}
        <Tape />
        <CommandPalette />
      </body>
    </html>
  );
}
