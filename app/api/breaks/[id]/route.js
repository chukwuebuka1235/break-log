import { connectToDatabase } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

// Handle PUT requests to end a break
export async function PUT(request, context) {
  try {
    const { db } = await connectToDatabase();
    const { id } = await context.params;

    // Validate ID format
    if (!ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid break ID" }, { status: 400 });
    }

    // Update the break to set end time
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

// // Add a GET handler to fetch a specific break by ID
// export async function GET(request, { params }) {
//   try {
//     const { db } = await connectToDatabase();
//     const { id } = params;

//     // Validate ID format
//     if (!ObjectId.isValid(id)) {
//       return Response.json({ error: "Invalid break ID" }, { status: 400 });
//     }

//     const breakRecord = await db
//       .collection("breaks")
//       .findOne({ _id: new ObjectId(id) });

//     if (!breakRecord) {
//       return Response.json({ error: "Break not found" }, { status: 404 });
//     }

//     return Response.json(breakRecord);
//   } catch (error) {
//     console.error("MongoDB error:", error);
//     return Response.json({ error: "Failed to fetch break" }, { status: 500 });
//   }
// }

// // Add a DELETE handler to remove a break record
// export async function DELETE(request, { params }) {
//   try {
//     const { db } = await connectToDatabase();
//     const { id } = params;

//     // Validate ID format
//     if (!ObjectId.isValid(id)) {
//       return Response.json({ error: "Invalid break ID" }, { status: 400 });
//     }

//     const result = await db
//       .collection("breaks")
//       .deleteOne({ _id: new ObjectId(id) });

//     if (result.deletedCount === 0) {
//       return Response.json({ error: "Break not found" }, { status: 404 });
//     }

//     return Response.json({ message: "Break deleted successfully" });
//   } catch (error) {
//     console.error("MongoDB error:", error);
//     return Response.json({ error: "Failed to delete break" }, { status: 500 });
//   }
// }
