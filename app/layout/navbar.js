"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDashboardPage, setIsDashboardPage] = useState(false);

  useEffect(() => {
    const dashboardActive = pathname.includes("/admin/dashboard");
    setIsDashboardPage(dashboardActive);
    // console.log(dashboardActive, "dashboard active");
  }, [pathname]);

  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch("/api/auth/logout", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (response.ok) {
  //       setIsAuthenticated(false);
  //       router.push("/admin");
  //       router.refresh();
  //     } else {
  //       const error = await response.json();
  //       alert(error.error || "Logout Failed");
  //     }
  //   } catch (error) {
  //     alert("Logout Failed , Please Try Again");
  //   }
  // };

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
        <section>
          {!isDashboardPage &&
            <button
              onClick={() => router.push("/admin")}
              className="cursor-pointer bg-[#ec3338] text-white px-4 py-1 rounded-lg hover:bg-red-500">
              ADMIN LOGIN
            </button>
          }
        </section>
      </div>
    </nav> 
  );
};
