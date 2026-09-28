import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "Sunday Quest",
  description: "A pixel-art food adventure tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} font-pixel antialiased bg-light-sky text-ink flex h-screen w-screen overflow-hidden`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
