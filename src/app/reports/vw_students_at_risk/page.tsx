import Link from "next/link";
import { query } from "@/lib/db";
import { toNumber, getParam, buildWhereClause, createPaginationLink } from "@/lib/reports";

export const dynamic = "force-dynamic";

export default async function StudentsAtRiskReport({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	// Extraer parámetros
	const term = getParam(params.term).trim() || undefined;
	const q = getParam(params.q).trim() || undefined;
	const rawPage = getParam(params.page);
	const rawPageSize = getParam(params.pageSize);

	// Validar parámetros
	const validTerm = (term && term.length > 0) ? term : undefined;
	const validQuery = (q && q.length > 0) ? q : undefined;

	const page = toNumber(rawPage, 1);
	const pageSize = Math.min(toNumber(rawPageSize, 10), 50);

	const filters: string[] = [];
	const values: Array<string | number> = [];

	if (validTerm) {
		values.push(validTerm);
		filters.push(`term = $${values.length}`);
	}

	if (validQuery) {
		values.push(`%${validQuery}%`);
		const searchParamIndex = values.length;
		filters.push(
			`(estudiante_nombre ILIKE $${searchParamIndex} OR estudiante_correo ILIKE $${searchParamIndex})`
		);
	}

	const where = buildWhereClause(filters, values);
	const offset = (page - 1) * pageSize;

	const countRes = await query(
		`SELECT COUNT(*)::int AS total FROM vw_students_at_risk ${where}`,
		values
	);
	const total = countRes.rows[0]?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	const dataRes = await query(
		`SELECT * FROM vw_students_at_risk ${where} ORDER BY term DESC, promedio_acumulado ASC LIMIT $${values.length + 1
		} OFFSET $${values.length + 2}`,
		[...values, pageSize, offset]
	);
	const data = dataRes.rows;

	const makeLink = (targetPage: number) =>
		createPaginationLink({ term: validTerm || "", q: validQuery || "" }, targetPage, pageSize);

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
			<div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-2xl border-b-4 border-red-600">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<h1 className="text-3xl font-bold mb-2">Estudiantes en Riesgo</h1>
					<p className="text-gray-300 text-base">
						Promedio bajo o inasistencia alta, con busqueda por nombre o correo.
					</p>
				</div>
			</div>
			<div className="w-full px-6 py-10">
				<div className="max-w-6xl mx-auto bg-white/95 rounded-xl shadow-2xl border border-gray-800/30 p-6">
					<form className="flex flex-wrap gap-3 mb-6" method="get">
						<input
							name="term"
							placeholder="Periodo (ej. 2024-A)"
							defaultValue={validTerm || ""}
							className="border border-gray-300 rounded px-3 py-2 text-sm"
						/>
						<input
							name="q"
							placeholder="Buscar por nombre o correo"
							defaultValue={validQuery || ""}
							className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
						/>
						<input type="hidden" name="pageSize" value={pageSize} />
						<button
							type="submit"
							className="bg-gray-900 text-white px-4 py-2 rounded text-sm"
						>
							Buscar
						</button>
					</form>

					{data.length === 0 ? (
						<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
							<p className="text-yellow-700 font-bold text-sm">
								No hay estudiantes en riesgo {term && `para el período "${term}"`} {q && `que coincidan con "${q}"`}. Intenta con 2024-A o 2024-B
							</p>
						</div>
					) : (
						<>
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
												% Inasistencia
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Motivo
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{data.map((row: any) => (
											<tr key={`${row.estudiante_id}-${row.term}`}>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="font-medium text-gray-900">{row.estudiante_nombre}</div>
													<div className="text-xs text-gray-500">{row.estudiante_correo}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">{row.programa}</td>
												<td className="px-6 py-4 whitespace-nowrap">{row.term}</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.promedio_acumulado}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.porcentaje_inasistencia}%
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
													{row.riesgo_motivo}
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
