import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eventundo.in — ഇവന്റ് ഉണ്ടോ?",
  description:
    "കേരളത്തിലെ ഇവന്റുകൾ ഒരൊറ്റ പേജിൽ — Discover local events across Kerala.",
  keywords: "Kerala events, local events Kerala, festivals Kerala, eventundo, ഇവന്റ്",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ml" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col transition-colors duration-200">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
