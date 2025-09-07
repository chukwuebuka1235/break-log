import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    let query = {};

    if (date) {
      // Filter by date (create start and end of day for the given date)
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1); // Next day

      query.breakStart = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const breaks = await db
      .collection("breaks")
      .find(query)
      .sort({ breakStart: -1 }) // Sort by breakStart descending
      .toArray();

    return Response.json(breaks);
  } catch (error) {
    console.error("MongoDB error:", error);
    return Response.json({ error: "Failed to fetch Breaks" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const { employeeName, description } = await request.json();

    // Create new break document
    const newBreak = {
      employeeName,
      description,
      breakStart: new Date(), // Current time (adjust timezone if needed)
      breakEnd: null, // Break hasn't ended yet
    };

    const result = await db.collection("breaks").insertOne(newBreak);

    return Response.json(
      {
        message: "Break Started",
        id: result.insertedId, // MongoDB uses insertedId instead of lastID
        employeeName,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MongoDB error:", error);
    return Response.json({ error: "Failed to start Break" }, { status: 500 });
  }
}
