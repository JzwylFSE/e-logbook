import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-logbook",
  description: "An E-logbook application to record my IT activities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <header className="flex items-center p-4">
          <Image
            src="/e-logbook logo.png"
            alt="E-Logbook Logo"
            width={48}
            height={48}
            priority
          />
          <span className="ml-2 font-bold text-xl">E-Logbook</span>
        </header> */}
        {children}
      </body>
    </html>
  );
}
