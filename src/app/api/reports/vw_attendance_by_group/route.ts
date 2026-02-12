import { query } from "@/lib/db";
import { buildWhereClause } from "@/lib/reports";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const term = searchParams.get("term")?.trim() || undefined;

		const validTerm = term && term.length > 0 ? term : undefined;

		const filters: string[] = [];
		const values: Array<string | number> = [];

		if (validTerm) {
			values.push(validTerm);
			filters.push(`term = $${values.length}`);
		}

		const where = buildWhereClause(filters, values);
		const sql = `SELECT * FROM vw_attendance_by_group ${where} ORDER BY porcentaje_asistencia ASC`;

		const res = await query(sql, values);
		const data = res.rows;

		return NextResponse.json({ data });
	} catch (error) {
		console.error("Error en API vw_attendance_by_group:", error);
		return NextResponse.json(
			{ error: "Error al obtener datos" },
			{ status: 500 }
		);
	}
}
