import { connectToDatabase } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

//  PUT requests to end a break
export async function PUT(request, context) {
  try {
    const { db } = await connectToDatabase();
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid break ID" }, { status: 400 });
    }
    const result = await db
      .collection("breaks")
      .updateOne({ _id: new ObjectId(id) }, { $set: { breakEnd: new Date() } });

    if (result.matchedCount === 0) {
      return Response.json({ error: "Break not found" }, { status: 404 });
    }

    return Response.json({ message: "Break Ended Successfully" });
  } catch (error) {
    console.error("MongoDB error:", error);
    return Response.json({ error: "Failed to end break" }, { status: 500 });
  }
}
