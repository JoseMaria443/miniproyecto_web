import Link from "next/link";
import { query } from "@/lib/db";

const toNumber = (value: string | undefined, fallback: number) => {
	const n = Number(value);
	return Number.isFinite(n) && n > 0 ? n : fallback;
};

export default async function StudentsAtRiskReport({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const term = searchParams.term?.trim() || "";
	const q = searchParams.q?.trim() || "";
	const page = toNumber(searchParams.page, 1);
	const pageSize = Math.min(toNumber(searchParams.pageSize, 10), 50);
	const offset = (page - 1) * pageSize;

	const filters: string[] = [];
	const values: Array<string | number> = [];

	if (term) {
		values.push(term);
		filters.push(`term = $${values.length}`);
	}

	if (q) {
		values.push(`%${q}%`);
		filters.push(
			`(estudiante_nombre ILIKE $${values.length} OR estudiante_correo ILIKE $${values.length})`
		);
	}

	const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

	const countRes = await query(
		`SELECT COUNT(*)::int AS total FROM vw_students_at_risk ${where}`,
		values
	);
	const total = countRes.rows[0]?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	const dataRes = await query(
		`SELECT * FROM vw_students_at_risk ${where} ORDER BY term DESC, promedio_acumulado ASC LIMIT $${
			values.length + 1
		} OFFSET $${values.length + 2}`,
		[...values, pageSize, offset]
	);
	const data = dataRes.rows;

	const makeLink = (targetPage: number) => {
		const params = new URLSearchParams();
		if (term) params.set("term", term);
		if (q) params.set("q", q);
		params.set("page", String(targetPage));
		params.set("pageSize", String(pageSize));
		return `?${params.toString()}`;
	};

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-2">Estudiantes en Riesgo</h1>
			<p className="text-gray-600 mb-6">
				Promedio bajo o inasistencia alta, con busqueda por nombre o correo.
			</p>

			<form className="flex flex-wrap gap-3 mb-6" method="get">
				<input
					name="term"
					placeholder="Periodo (ej. 2024-A)"
					defaultValue={term}
					className="border border-gray-300 rounded px-3 py-2 text-sm"
				/>
				<input
					name="q"
					placeholder="Buscar por nombre o correo"
					defaultValue={q}
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
		</div>
	);
}
