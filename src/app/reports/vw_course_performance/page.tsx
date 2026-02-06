import Link from "next/link";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const toNumber = (value: string | undefined, fallback: number) => {
	const n = Number(value);
	return Number.isFinite(n) && n > 0 ? n : fallback;
};

export default async function CoursePerformanceReport({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const term = searchParams.term?.trim() || "";
	const program = searchParams.program?.trim() || "";
	const page = toNumber(searchParams.page, 1);
	const pageSize = Math.min(toNumber(searchParams.pageSize, 10), 50);
	const offset = (page - 1) * pageSize;

	const filters: string[] = [];
	const values: Array<string | number> = [];

	if (term) {
		values.push(term);
		filters.push(`v.term = $${values.length}`);
	}

	if (program) {
		values.push(program);
		filters.push(
			`EXISTS (
				SELECT 1
				FROM Inscripciones i
				JOIN Grupos g2 ON i.grupo_id = g2.id
				JOIN Estudiantes e ON i.estudiante_id = e.id
				WHERE g2.curso_id = v.curso_id
					AND g2.periodo = v.term
					AND e.programa = $${values.length}
			)`
		);
	}

	const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

	const countRes = await query(
		`SELECT COUNT(*)::int AS total FROM vw_course_performance v ${where}`,
		values
	);
	const total = countRes.rows[0]?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	const dataRes = await query(
		`SELECT v.* FROM vw_course_performance v ${where} ORDER BY v.term DESC, v.curso_nombre ASC LIMIT $${
			values.length + 1
		} OFFSET $${values.length + 2}`,
		[...values, pageSize, offset]
	);
	const data = dataRes.rows;

	const makeLink = (targetPage: number) => {
		const params = new URLSearchParams();
		if (term) params.set("term", term);
		if (program) params.set("program", program);
		params.set("page", String(targetPage));
		params.set("pageSize", String(pageSize));
		return `?${params.toString()}`;
	};

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-2">Rendimiento por Curso</h1>
			<p className="text-gray-600 mb-6">
				Promedios, aprobados y reprobados por curso y periodo.
			</p>

			<form className="flex flex-wrap gap-3 mb-6" method="get">
				<input
					name="term"
					placeholder="Periodo (ej. 2024-A)"
					defaultValue={term}
					className="border border-gray-300 rounded px-3 py-2 text-sm"
				/>
				<input
					name="program"
					placeholder="Programa (opcional)"
					defaultValue={program}
					className="border border-gray-300 rounded px-3 py-2 text-sm"
				/>
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
		</div>
	);
}
