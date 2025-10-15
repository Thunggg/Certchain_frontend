import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layouts/header";
import ContextProvider from "@/context";
import { headers } from "next/headers";
import { Sidebar } from "@/components/layouts/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blockchain Certificate System",
  description: "Issue and verify blockchain certificates and creative NFTs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col w-full min-h-0">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <ContextProvider cookies={cookies}>{children}</ContextProvider>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
