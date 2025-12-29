import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MusicToggle from "../components/audio/MusicToggle";
import { PomodoroProvider } from "../context/PomodoroContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Santa Study Sleigh 🎅📚",
  description: "A festive productivity app to study with focus and joy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PomodoroProvider>
          {children}
          {/* Global music button */}
          <MusicToggle />
        </PomodoroProvider>
      </body>
    </html>
  );
}