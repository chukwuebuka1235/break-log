// app/admin/page.js
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push("/admin/dashboard");
        router.refresh(); // Refresh to apply the new cookie
      } else {
        const error = await response.json();
        alert(error.error || "Login failed");
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fef2f2] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          ADMIN LOGIN
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            placeholder="Enter admin password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ec3338] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 border border-gray-300">
          GO HOME
        </button>
      </div>
    </div>
  );
}
