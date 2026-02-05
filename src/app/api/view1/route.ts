import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get("term");

    const query = term
      ? { text: "SELECT * FROM vw_attendance_by_group WHERE term = $1", values: [term] }
      : { text: "SELECT * FROM vw_attendance_by_group", values: [] };

    const result = await db.query(query.text, query.values);

    return NextResponse.json({ rows: result.rows });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
