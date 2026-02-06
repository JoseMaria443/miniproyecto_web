import Link from "next/link";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const toNumber = (value: string | undefined, fallback: number) => {
	const n = Number(value);
	return Number.isFinite(n) && n > 0 ? n : fallback;
};

export default async function TeacherLoadReport({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const term = searchParams.term?.trim() || "";
	const page = toNumber(searchParams.page, 1);
	const pageSize = Math.min(toNumber(searchParams.pageSize, 10), 50);
	const offset = (page - 1) * pageSize;

	const filters: string[] = [];
	const values: Array<string | number> = [];

	if (term) {
		values.push(term);
		filters.push(`term = $${values.length}`);
	}

	const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

	const countRes = await query(
		`SELECT COUNT(*)::int AS total FROM vw_teacher_load ${where}`,
		values
	);
	const total = countRes.rows[0]?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	const dataRes = await query(
		`SELECT * FROM vw_teacher_load ${where} ORDER BY term DESC, total_grupos DESC LIMIT $${
			values.length + 1
		} OFFSET $${values.length + 2}`,
		[...values, pageSize, offset]
	);
	const data = dataRes.rows;

	const makeLink = (targetPage: number) => {
		const params = new URLSearchParams();
		if (term) params.set("term", term);
		params.set("page", String(targetPage));
		params.set("pageSize", String(pageSize));
		return `?${params.toString()}`;
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
			<div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-2xl border-b-4 border-red-600">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<h1 className="text-3xl font-bold mb-2">Carga Docente por Periodo</h1>
					<p className="text-gray-300 text-base">
						Grupos, alumnos y promedio general por docente y periodo.
					</p>
				</div>
			</div>
			<div className="w-full px-6 py-10">
				<div className="max-w-6xl mx-auto bg-white/95 rounded-xl shadow-2xl border border-gray-800/30 p-6">
					<form className="flex flex-wrap gap-3 mb-6" method="get">
						<input
							name="term"
							placeholder="Periodo (ej. 2024-A)"
							defaultValue={term}
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
										Docente
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Periodo
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
										Grupos
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
										Alumnos
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
										Promedio
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{data.map((row: any) => (
									<tr key={`${row.maestro_id}-${row.term}`}>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="font-medium text-gray-900">{row.maestro_nombre}</div>
											<div className="text-xs text-gray-500">{row.maestro_correo}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">{row.term}</td>
										<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
											{row.total_grupos}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
											{row.total_estudiantes}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
											{row.promedio_calificaciones}
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
