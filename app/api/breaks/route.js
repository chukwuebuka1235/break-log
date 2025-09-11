import { connectToDatabase } from "../../../lib/mongodb";

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
      endDate.setDate(endDate.getDate() + 1); 

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

    const newBreak = {
      employeeName,
      description,
      breakStart: new Date(),
      breakEnd: null,
    };

    const result = await db.collection("breaks").insertOne(newBreak);

    return Response.json(
      {
        message: "Break Started",
        id: result.insertedId,  
        employeeName,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MongoDB error:", error);
    return Response.json({ error: "Failed to start Break" }, { status: 500 });
  }
}
