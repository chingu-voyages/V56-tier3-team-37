import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.scss";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-provider";
import ClientWrapper from "@/components/ClientWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Care Flow - Real-Time Surgery Updates",
  description: "Reduce stress during surgery with real-time updates and workflow transparency. Track surgery progress and stay informed about your loved one's medical procedure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ClientWrapper>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 main-background">
                  {children}
                </main>
                <Footer />
              </div>
            </ClientWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
