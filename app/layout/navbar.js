"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showAuthUI, setShowAuthUI] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDashboardPage, setIsDashboardPage] = useState(false);
  const firstName = userName.split(" ")[0];

  useEffect(() => {
    const dashboardActive = pathname.includes("/admin/dashboard");
    setIsDashboardPage(dashboardActive);

    const checkAuthStatus = () => {
      const adminCookie = document.cookie.includes("admin-authenticated=true");
      const employeeCookie = document.cookie.includes(
        "employee-authenticated=true"
      );

      const userData = localStorage.getItem("user");
      let user = null;

      if (userData) {
        try {
          user = JSON.parse(userData);
        } catch (error) {
          localStorage.removeItem("user");
        }
      }

      if (pathname.includes("/admin") && adminCookie && user && user.isAdmin) {
        setShowAuthUI(true);
        setUserName(user.name);
      } else if (
        !pathname.includes("/admin") &&
        employeeCookie &&
        user &&
        !user.isAdmin
      ) {
        setShowAuthUI(true);
        setUserName(user.name);
      } else {
        setShowAuthUI(false);
        setUserName("");

        // Clear inconsistent state
        if ((adminCookie || employeeCookie) && !user) {
          document.cookie =
            "admin-authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie =
            "employee-authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      }
    };

    checkAuthStatus();

    const interval = setInterval(checkAuthStatus, 1000); 
    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("user");
      document.cookie =
        "admin-authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "employee-authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "employee-id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setShowAuthUI(false);
      setUserName("");
      router.push("/");
    }
  };

  return (
    <nav className="bg-[#fef2f2] shadow-sm ">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <section className="flex items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={70}
            height={40}
            onClick={() => router.push("/")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </section>

        <section className="flex items-center gap-1 md:gap-4">
          {showAuthUI && (
            <>
              <span className="text-gray-700">Welcome, {firstName}</span>
              <button
                onClick={handleLogout}
                className="cursor-pointer bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-colors">
                LOGOUT
              </button>
            </>
          )}
        </section>
      </div>
    </nav>
  );
};
