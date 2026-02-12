import { query } from "@/lib/db";
import { buildWhereClause } from "@/lib/reports";
import { NextRequest, NextResponse } from "next/server";

const ProgramWhitelist = [
	"Ingeniería de Software",
	"Ciencias de Datos",
	"Diseño Digital",
	"Historia del Arte",
] as const;

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const term = searchParams.get("term")?.trim() || undefined;
		const program = searchParams.get("program")?.trim() || undefined;
		const page = parseInt(searchParams.get("page") || "1");
		const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "10"), 50);

		const validTerm = term && term.length > 0 ? term : undefined;
		const validProgram = program && ProgramWhitelist.includes(program as any) ? program : undefined;

		if (!validTerm) {
			return NextResponse.json(
				{ error: "El periodo es obligatorio" },
				{ status: 400 }
			);
		}

		const filters: string[] = [];
		const values: Array<string | number> = [];

		values.push(validTerm);
		filters.push(`v.term = $${values.length}`);

		if (validProgram) {
			values.push(validProgram);
			filters.push(`$${values.length} = ANY (v.programas)`);
		}

		const where = buildWhereClause(filters, values);
		const offset = (page - 1) * pageSize;

		const countRes = await query(
			`SELECT COUNT(*)::int AS total FROM vw_course_performance v ${where}`,
			values
		);
		const total = countRes.rows[0]?.total ?? 0;
		const totalPages = Math.max(1, Math.ceil(total / pageSize));

		const dataRes = await query(
			`SELECT v.* FROM vw_course_performance v ${where} ORDER BY v.term DESC, v.curso_nombre ASC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
			[...values, pageSize, offset]
		);
		const data = dataRes.rows;

		return NextResponse.json({ data, total, totalPages, page, pageSize });
	} catch (error) {
		console.error("Error en API vw_course_performance:", error);
		return NextResponse.json(
			{ error: "Error al obtener datos" },
			{ status: 500 }
		);
	}
}
