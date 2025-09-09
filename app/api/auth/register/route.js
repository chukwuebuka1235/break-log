// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(request) {
  const { name, email, idCard, password } = await request.json();

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection("employees").findOne({
      $or: [{ email }, { idCard }],
    });

    if (existingUser) {
      client.close();
      return NextResponse.json(
        { message: "User with this email or ID card already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const result = await db.collection("employees").insertOne({
      name,
      email,
      idCard,
      password, // In a real app, hash this password before storing
      createdAt: new Date(),
    });

    client.close();

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
