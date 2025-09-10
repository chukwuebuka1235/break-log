"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BreakManager } from "./layout/BreakManager";
import { Navbar } from "./layout/navbar";
import { Loader } from "./components/Loader"
export default function Home() {
  const [employeeName, setEmployeeName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      const employeeCookie = document.cookie.includes(
        "employee-authenticated=true"
      );

      if (userData && employeeCookie) {
        try {
          const user = JSON.parse(userData);
          if (user && !user.isAdmin) {
            setIsAuthenticated(true);
            setEmployeeName(user.name);
            return;
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      setIsAuthenticated(false);
      router.push("/login");
    };

    checkAuth();
    setIsLoading(false);
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, [router]);

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="font-sans bg-[#fef2f2] min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <BreakManager
          employeeName={employeeName}
          setEmployeeName={setEmployeeName}
        />
      </div>
    </div>
  );
}
