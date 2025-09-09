// app/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BreakManager } from "./layout/BreakManager";
// import { Navbar } from "./layout/navbar";

export default function Home() {
  const [employeeName, setEmployeeName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setEmployeeName(user.name);
      setIsAuthenticated(true);
    } else {
      // Redirect to login if not authenticated
      router.push("/login");
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="font-sans bg-[#fef2f2] min-h-screen">
      {/* <Navbar /> */}
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <BreakManager
          employeeName={employeeName}
          setEmployeeName={setEmployeeName}
        />
      </div>
    </div>
  );
}
