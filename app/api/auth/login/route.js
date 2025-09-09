// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    const user = await db.collection("employees").findOne({ email });

    if (!user) {
      client.close();
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    // In a real app, you should use proper password hashing (bcrypt)
    if (user.password !== password) {
      client.close();
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    client.close();

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
    });

    // Set employee authentication cookie
    response.cookies.set("employee-authenticated", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
    });

    response.cookies.set("employee-id", userWithoutPassword._id.toString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
