import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/contexts/query-provider";
import { ThemeProvider } from "@/contexts/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-arabic",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "آل شايع | Al-Shaya Family Tree",
  description: "Al-Shaya Family Tree Database Application - تطبيق قاعدة بيانات شجرة عائلة آل شايع",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
                <TooltipProvider>
                  {children}
                  <ToastViewport />
                </TooltipProvider>
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
