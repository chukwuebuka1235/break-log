import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { adminId, password } = await request.json();

    // Validate admin credentials
    if (adminId === "ADMIN100" && password === "admin123") {
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
