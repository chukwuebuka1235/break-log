import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { adminId, password } = await request.json();
    const adminpass = process.env.ADMIN_PASSWORD;
    const adminid = process.env.ADMIN_ID;

    // Validate admin credentials
    if (adminId === adminid && password === adminpass) {
      const response = NextResponse.json(
        { message: "Authentication successful" },
        { status: 200 }
      );
      response.cookies.set("admin-authenticated", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400,
      });
      return response;
    } else {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
