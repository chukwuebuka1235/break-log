// app/api/auth/login/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === adminPassword) {
      const response = NextResponse.json({
        message: "Login successful",
      });

      // Set authentication cookie
      response.cookies.set("admin-authenticated", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400, // 1 day
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
