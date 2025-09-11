import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs"; 

export async function POST(request) {
  const { idCard, password } = await request.json();

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const user = await db.collection("employees").findOne({ idCard });

    if (!user) {
      client.close();
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
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

    response.cookies.set("employee-authenticated", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400,
    });

    response.cookies.set("employee-id", userWithoutPassword._id.toString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, 
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
