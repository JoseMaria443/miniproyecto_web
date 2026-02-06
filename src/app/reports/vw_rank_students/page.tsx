import Link from "next/link";
import { z } from "zod";
import { query } from "@/lib/db";
import { toNumber, getParam, buildWhereClause, createPaginationLink } from "@/lib/reports";

export const dynamic = "force-dynamic";

const ProgramWhitelist = [
	"Ingeniería de Software",
	"Ciencias de Datos",
	"Diseño Digital",
	"Historia del Arte",
] as const;

const FilterSchema = z.object({
	term: z.string().optional(),
	program: z.enum(ProgramWhitelist).optional(),
	page: z.string().optional(),
	pageSize: z.string().optional(),
});

export default async function RankStudentsReport({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const rawTerm = getParam(searchParams.term).trim();
	const rawProgram = getParam(searchParams.program).trim();
	const rawPage = getParam(searchParams.page);
	const rawPageSize = getParam(searchParams.pageSize);

	const parsed = FilterSchema.safeParse({
		term: rawTerm || undefined,
		program: rawProgram || undefined,
		page: rawPage,
		pageSize: rawPageSize,
	});

	const term = parsed.success ? parsed.data.term ?? "" : "";
	const program = parsed.success ? parsed.data.program ?? "" : "";
	const page = toNumber(parsed.success ? parsed.data.page : undefined, 1);
	const pageSize = Math.min(
		toNumber(parsed.success ? parsed.data.pageSize : undefined, 10),
		50
	);

	const filters: string[] = [];
	const values: Array<string | number> = [];

	if (term) {
		values.push(term);
		filters.push(`UPPER(term) = UPPER($${values.length})`);
	}

	if (program) {
		values.push(program);
		filters.push(`programa = $${values.length}`);
	}

	const where = buildWhereClause(filters, values);
	const offset = (page - 1) * pageSize;

	const countRes = await query(
		`SELECT COUNT(*)::int AS total FROM vw_rank_students ${where}`,
		values
	);
	const total = countRes.rows[0]?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	const dataRes = await query(
		`SELECT * FROM vw_rank_students ${where} ORDER BY term DESC, programa ASC, posicion_en_ranking ASC LIMIT $${
			values.length + 1
		} OFFSET $${values.length + 2}`,
		[...values, pageSize, offset]
	);
	const data = dataRes.rows;

	const makeLink = (targetPage: number) =>
		createPaginationLink({ term, program }, targetPage, pageSize);

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
			<div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-2xl border-b-4 border-red-600">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<h1 className="text-3xl font-bold mb-2">Ranking de Estudiantes</h1>
					<p className="text-gray-300 text-base">
						Ranking por programa y periodo, basado en promedio general.
					</p>
				</div>
			</div>
			<div className="w-full px-6 py-10">
				<div className="max-w-6xl mx-auto bg-white/95 rounded-xl shadow-2xl border border-gray-800/30 p-6">
					<form className="flex flex-wrap gap-3 mb-6" method="get">
						<input
							name="term"
							placeholder="Periodo (ej. 2024-A)"
							defaultValue={rawTerm}
							className="border border-gray-300 rounded px-3 py-2 text-sm"
						/>
						<select
							name="program"
							defaultValue={rawProgram}
							className="border border-gray-300 rounded px-3 py-2 text-sm"
						>
							<option value="">Programa (opcional)</option>
							{ProgramWhitelist.map((item) => (
								<option key={item} value={item}>
									{item}
								</option>
							))}
						</select>
						<input type="hidden" name="pageSize" value={pageSize} />
						<button
							type="submit"
							className="bg-gray-900 text-white px-4 py-2 rounded text-sm"
						>
							Filtrar
						</button>
					</form>

					<div className="bg-white shadow rounded-lg overflow-hidden">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Estudiante
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Programa
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Periodo
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
										Promedio
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
										Ranking
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{data.map((row: any) => (
									<tr key={`${row.estudiante_id}-${row.term}-${row.programa}`}>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="font-medium text-gray-900">{row.estudiante_nombre}</div>
											<div className="text-xs text-gray-500">{row.estudiante_correo}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">{row.programa}</td>
										<td className="px-6 py-4 whitespace-nowrap">{row.term}</td>
										<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
											{row.promedio_calificaciones}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
											#{row.posicion_en_ranking}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="flex items-center justify-between mt-6 text-sm">
						<span className="text-gray-600">
							Pagina {page} de {totalPages} ({total} registros)
						</span>
						<div className="flex gap-3">
							{page > 1 ? (
								<Link className="text-blue-600" href={makeLink(page - 1)}>
									Anterior
								</Link>
							) : (
								<span className="text-gray-400">Anterior</span>
							)}
							{page < totalPages ? (
								<Link className="text-blue-600" href={makeLink(page + 1)}>
									Siguiente
								</Link>
							) : (
								<span className="text-gray-400">Siguiente</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
