import Link from "next/link";
import { query } from "@/lib/db";
import { toNumber, getParam, buildWhereClause, createPaginationLink } from "@/lib/reports";

export const dynamic = "force-dynamic";

const ProgramWhitelist = [
	"Ingeniería de Software",
	"Ciencias de Datos",
	"Diseño Digital",
	"Historia del Arte",
] as const;

export default async function CoursePerformanceReport({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	// Extraer parámetros
	const term = getParam(params.term).trim() || undefined;
	const program = getParam(params.program).trim() || undefined;
	const rawPage = getParam(params.page);
	const rawPageSize = getParam(params.pageSize);

	// Validar que term es obligatorio
	const validTerm = (term && term.length > 0) ? term : undefined;
	const validProgram = (program && ProgramWhitelist.includes(program as any)) ? program : undefined;

	const page = toNumber(rawPage, 1);
	const pageSize = Math.min(toNumber(rawPageSize, 10), 50);

	// Si no hay term, mostrar formulario de búsqueda
	if (!validTerm) {
		return (
			<main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
				<div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-2xl border-b-4 border-red-600">
					<div className="max-w-7xl mx-auto px-6 py-8">
						<h1 className="text-3xl font-bold mb-2">Rendimiento por Curso</h1>
						<p className="text-gray-300 text-base">
							Promedios, aprobados y reprobados por curso y periodo.
						</p>
					</div>
				</div>
				<div className="w-full px-6 py-10">
					<div className="max-w-3xl mx-auto bg-white/95 rounded-xl shadow-2xl border border-gray-800/30 p-6">
						<form className="flex flex-wrap gap-3" method="get">
							<input
								name="term"
								placeholder="Periodo (ej. 2024-A)"
								defaultValue={term || ""}
								className="border border-gray-300 rounded px-3 py-2 text-sm"
							/>
							<select
								name="program"
								defaultValue={program || ""}
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
						<p className="text-sm text-red-700 mt-4">
							El periodo es obligatorio para consultar este reporte.
						</p>
					</div>
				</div>
			</main>
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
		`SELECT v.* FROM vw_course_performance v ${where} ORDER BY v.term DESC, v.curso_nombre ASC LIMIT $${values.length + 1
		} OFFSET $${values.length + 2}`,
		[...values, pageSize, offset]
	);
	const data = dataRes.rows;

	const makeLink = (targetPage: number) =>
		createPaginationLink({ term: validTerm || "", program: validProgram || "" }, targetPage, pageSize);

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
			<div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-2xl border-b-4 border-red-600">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<h1 className="text-3xl font-bold mb-2">Rendimiento por Curso</h1>
					<p className="text-gray-300 text-base">
						Promedios, aprobados y reprobados por curso y periodo.
					</p>
				</div>
			</div>
			<div className="w-full px-6 py-10">
				<div className="max-w-6xl mx-auto bg-white/95 rounded-xl shadow-2xl border border-gray-800/30 p-6">
					<form className="flex flex-wrap gap-3 mb-6" method="get">
						<input
							name="term"
							placeholder="Periodo (ej. 2024-A)"
							defaultValue={term || ""}
							className="border border-gray-300 rounded px-3 py-2 text-sm"
						/>
						<select
							name="program"
							defaultValue={program || ""}
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

					{data.length === 0 ? (
						<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
							<p className="text-yellow-700 font-bold text-sm">
								No hay datos para el período: "{term}" {program && `+ Programa: "${program}"`}. Intenta con 2024-A o 2024-B
							</p>
						</div>
					) : (
						<>
							<div className="bg-white shadow rounded-lg overflow-hidden">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Curso
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Periodo
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												Promedio
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												Reprobados
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												% Reprobacion
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{data.map((row: any) => (
											<tr key={`${row.curso_id}-${row.term}`}>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="font-medium text-gray-900">{row.curso_nombre}</div>
													<div className="text-xs text-gray-500">{row.curso_codigo}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">{row.term}</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.promedio_calificaciones}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.total_reprobados}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.tasa_reprobacion}%
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
						</>
					)}
				</div>
			</div>
		</main>
	);
}
