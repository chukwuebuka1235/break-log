// app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
    });

    // Clear the authentication cookie
    response.cookies.set("admin-authenticated", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
      path: "/",
    });
    //clear JS Readable Cookie
    response.cookies.set("admin-log", "", {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      maxAge: 86400,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
