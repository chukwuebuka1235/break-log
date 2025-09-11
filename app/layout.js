import { Inter } from "next/font/google";
import "./globals.css";
import Toast from "./components/Toast";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Break Management System",
  description: "Streamline your workforce management with our intuitive break tracking system. Monitor employee breaks in real-time, generate reports, and optimize productivity.",
  keywords: "break management, employee tracking, productivity, workforce management, break tracker, time management",
  authors: [{ name: "Kadick Integrated Limited" }],
  icons: {
    icon: "/kadick.png", 
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