import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/app/layout/navbar";
import Toast from "./components/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata = {
  title: "Break Management System",
  description: "Streamline your workforce management with our intuitive break tracking system. Monitor employee breaks in real-time, generate reports, and optimize productivity.",
  keywords: "break management, employee tracking, productivity, workforce management, break tracker, time management",
  authors: [{ name: "Kadick Integrated Limited" }],
  openGraph: {
    title: "Break Management System",
    description: "Streamline your workforce management with our intuitive break tracking system.",
    url: baseUrl,
    siteName: "Break Management System",
    images: [
      {
        url: `${baseUrl}/kadick.png`,
        width: 1200,
        height: 630,
        alt: "Break Management System Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Break Management System",
    description: "Streamline your workforce management with our intuitive break tracking system.",
    images: [`${baseUrl}/kadick.png`], 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Toast />
        {children}
      </body>
    </html>
  );
}