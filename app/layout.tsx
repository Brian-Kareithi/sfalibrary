import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/authcontext";
import { Toaster } from "react-hot-toast";
import AuthWrapper from "./components/authwrapper";
import { Analytics } from "@vercel/analytics/next"
import Layout from "./layouts/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School Library System",
  description: "Secure school library application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics/>
        <AuthProvider>
          
          <AuthWrapper>
            <Layout>
              {children}
            </Layout>
            
          </AuthWrapper>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}