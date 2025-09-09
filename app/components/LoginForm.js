// components/LoginForm.js
"use client";
import { useState } from "react";

export default function LoginForm({
  onLogin,
  onRegister,
  isAdmin,
  toggleAdmin,
}) {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    name: "",
    idCard: "",
  });
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdmin) {
      // Admin login logic
      onLogin(loginData.email, loginData.password, true);
    } else {
      if (isLogin) {
        // Employee login
        onLogin(loginData.email, loginData.password, false);
      } else {
        // Employee registration
        onRegister(
          loginData.name,
          loginData.email,
          loginData.idCard,
          loginData.password
        );
      }
    }
  };

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isAdmin
          ? "Admin Login"
          : isLogin
          ? "Employee Login"
          : "Employee Registration"}
      </h2>

      <div className="mb-4 flex justify-center">
        <button
          type="button"
          onClick={toggleAdmin}
          className={`px-4 py-2 rounded-lg mr-2 ${
            !isAdmin ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}>
          Employee
        </button>
        <button
          type="button"
          onClick={toggleAdmin}
          className={`px-4 py-2 rounded-lg ${
            isAdmin ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}>
          Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isAdmin && !isLogin && (
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={loginData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {!isAdmin && !isLogin && (
          <div>
            <label className="block text-sm font-medium mb-1">
              ID Card Number
            </label>
            <input
              type="text"
              name="idCard"
              value={loginData.idCard}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            {isAdmin ? "Admin ID" : "Email"}
          </label>
          <input
            type={isAdmin ? "text" : "email"}
            name="email"
            value={loginData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
          {isAdmin ? "Sign In" : isLogin ? "Login" : "Register"}
        </button>
      </form>

      {!isAdmin && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline">
            {isLogin
              ? "Need to register? Create account"
              : "Already have an account? Login"}
          </button>
        </div>
      )}
    </div>
  );
}
