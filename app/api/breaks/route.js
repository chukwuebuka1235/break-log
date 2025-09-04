import { openDb } from "../../../lib/db";

// Handle GET requests
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date"); // Get date from query parameter

  const db = await openDb();
  try {
    let query = "SELECT * FROM breaks";
    let params = [];

    if (date) {
      // Filter by date (ignoring time component)
      query += " WHERE date(breakStart) = ?";
      params.push(date);
    }

    query += " ORDER BY breakStart DESC";

    const breaks = await db.all(query, params);
    return Response.json(breaks);
  } catch (error) {
    return Response.json({ error: "Failed to fetch Breaks" }, { status: 500 });
  } finally {
    await db.close();
  }
}

// Handle POST requests
export async function POST(request) {
  const db = await openDb();
  try {
    const { employeeName, description } = await request.json(); // Get data from the request body
    const result = await db.run(
      "INSERT INTO breaks (employeeName, breakStart, description) VALUES (?, datetime('now', '+1 hour'), ?)",
      employeeName,
      description
    );

    return Response.json(
      {
        message: "Break Started",
        id: result.lastID,
        employeeName,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error: "Failed to start Break" }, { status: 500 });
  } finally {
    await db.close();
  }
}
