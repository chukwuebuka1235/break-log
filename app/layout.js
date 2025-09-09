import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Navbar} from "@/app/layout/navbar"
import Toast from "./components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Break Management System",
  description:
    "Streamline your workforce management with our intuitive break tracking system. Monitor employee breaks in real-time, generate reports, and optimize productivity.",
  keywords:
    "break management, employee tracking, productivity, workforce management, break tracker, time management",
  authors: [{ name: "Kadick Integrated Limited" }],
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <Toast />
        {children}
      </body>
    </html>
  );
}
