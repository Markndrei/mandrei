import type { Metadata } from "next";
import "./globals.css";
import { Poppins, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar/Navbar";
import { Analytics } from "@vercel/analytics/next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-poppins",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "markndrei.",
  description:
    "personal portfolio — front-end developer, ui/ux designer, graphic artist.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" enableSystem defaultTheme="dark">
          {/* Film grain — the whole page sits on stock, not on flat black */}
          <div className="grain" aria-hidden="true" />
          <Navbar />
          <Analytics />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
