import { openDb } from "../../../../lib/db";

// Handle PUT requests to end a break
export async function PUT(request, { params }) {
  const { id } = params; // Get the id from the URL parameters
  const db = await openDb();

  try {
    await db.run(
      'UPDATE breaks SET breakEnd = datetime("now", "+1 hour") WHERE id = ?',
      id
    );
    return Response.json({ message: "Break Ended Successfully" });
  } catch (error) {
    return Response.json({ error: "Failed to end break" }, { status: 500 });
  } finally {
    await db.close();
  }
}

//  Add a GET handler to fetch a specific break by ID
export async function GET(request, { params }) {
  const { id } = params;
  const db = await openDb();

  try {
    const breakRecord = await db.get("SELECT * FROM breaks WHERE id = ?", id);

    if (!breakRecord) {
      return Response.json({ error: "Break not found" }, { status: 404 });
    }

    return Response.json(breakRecord);
  } catch (error) {
    return Response.json({ error: "Failed to fetch break" }, { status: 500 });
  } finally {
    await db.close();
  }
}

// Add a DELETE handler to remove a break record
export async function DELETE(request, { params }) {
  const { id } = params;
  const db = await openDb();

  try {
    await db.run("DELETE FROM breaks WHERE id = ?", id);
    return Response.json({ message: "Break deleted successfully" });
  } catch (error) {
    return Response.json({ error: "Failed to delete break" }, { status: 500 });
  } finally {
    await db.close();
  }
}
