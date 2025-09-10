import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs"; // Add this import

export async function POST(request) {
  const { name, email, idCard, password } = await request.json();

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const existingUser = await db.collection("employees").findOne({
      $or: [{ idCard }, { email }],
    });

    if (existingUser) {
      client.close();
      return NextResponse.json(
        { message: "User with this ID card or email already exists" },
        { status: 409 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection("employees").insertOne({
      name,
      email,
      idCard,
      password: hashedPassword, // Store hashed password
      createdAt: new Date(),
    });

    client.close();

    return NextResponse.json(
      { message: "Registration successful", userId: result.insertedId },
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
