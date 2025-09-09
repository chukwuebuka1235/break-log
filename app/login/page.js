// app/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    idCard: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Admin login validation
    if (adminPassword === "admin123" && adminId === "ADMIN100") {
      try {
        // Set admin authentication cookie via API
        const response = await fetch("/api/auth/login/admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminId, password: adminPassword }),
        });

        if (response.ok) {
          // Store admin auth in localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              email: "ADMIN100",
              isAdmin: true,
              name: "Admin",
            })
          );
          router.push("/admin/dashboard");
        } else {
          alert("Authentication failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed. Please try again.");
      }
    } else {
      alert("Invalid admin credentials");
    }
    setIsLoading(false);
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Employee login
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: employeeData.email,
            password: employeeData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/");
        } else {
          alert(data.message || "Login failed");
        }
      } else {
        // Employee registration
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registration successful! Please login.");
          setIsLogin(true);
          setEmployeeData({
            ...employeeData,
            password: "",
          });
        } else {
          alert(data.message || "Registration failed");
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Authentication error:", error);
      alert("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEmployeeChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fef2f2] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isAdminLogin
            ? "ADMIN LOGIN"
            : isLogin
            ? "EMPLOYEE LOGIN"
            : "EMPLOYEE REGISTRATION"}
        </h1>

        {/* Toggle between Admin and Employee */}
        <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setIsAdminLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              isAdminLogin
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}>
            Admin
          </button>
          <button
            type="button"
            onClick={() => setIsAdminLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              !isAdminLogin
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}>
            Employee
          </button>
        </div>

        {isAdminLogin ? (
          // Admin Login Form
          <form onSubmit={handleAdminSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Admin ID"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ec3338] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              disabled={isLoading}
              required
            />
            <input
              type="password"
              placeholder="Enter admin password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ec3338] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ec3338] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#dc2626] transition-colors duration-200 disabled:bg-[#f8b4b4] disabled:cursor-not-allowed shadow-md hover:shadow-lg">
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </form>
        ) : (
          // Employee Login/Registration Form
          <form onSubmit={handleEmployeeSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ec3338] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={employeeData.name}
                  onChange={handleEmployeeChange}
                  disabled={isLoading}
                  required
                />
                <input
                  type="text"
                  name="idCard"
                  placeholder="ID Card Number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ec3338] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={employeeData.idCard}
                  onChange={handleEmployeeChange}
                  disabled={isLoading}
                  required
                />
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Company Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ec3338] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={employeeData.email}
              onChange={handleEmployeeChange}
              disabled={isLoading}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ec3338] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={employeeData.password}
              onChange={handleEmployeeChange}
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ec3338] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#dc2626] transition-colors duration-200 disabled:bg-[#f8b4b4] disabled:cursor-not-allowed shadow-md hover:shadow-lg">
              {isLoading ? "LOGGING IN..." : isLogin ? "LOGIN" : "REGISTER"}
            </button>

            {!isAdminLogin && (
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-center text-sm text-[#ec3338] hover:underline mt-2">
                {isLogin
                  ? "No account? Register here"
                  : "Already have an account? Login here"}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
