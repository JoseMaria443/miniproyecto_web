"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toNumber, createPaginationLink } from "@/lib/reports";

function TeacherLoadContent() {
	const searchParams = useSearchParams();
	const [data, setData] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const term = searchParams.get("term")?.trim() || "";
	const validTerm = term && term.length > 0 ? term : undefined;
	const rawPage = searchParams.get("page");
	const rawPageSize = searchParams.get("pageSize");

	const page = toNumber(rawPage || "", 1);
	const pageSize = Math.min(toNumber(rawPageSize || "", 10), 50);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const params = new URLSearchParams({
				page: String(page),
				pageSize: String(pageSize),
				...(validTerm && { term: validTerm }),
			});
			const response = await fetch(`/api/reports/vw_teacher_load?${params}`);
			if (!response.ok) throw new Error("Error al obtener datos");
			const result = await response.json();
			setData(result.data);
			setTotal(result.total);
			setTotalPages(result.totalPages);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error desconocido");
		} finally {
			setLoading(false);
		}
	}, [page, pageSize, validTerm]);

	useEffect(() => {
		// Siempre llamar fetchData (con o sin filtro)
		fetchData();
	}, [fetchData]);

	const makeLink = (targetPage: number) =>
		createPaginationLink({ term: validTerm || "" }, targetPage, pageSize);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const params = new URLSearchParams();
		const termValue = formData.get("term");
		if (termValue) params.set("term", termValue.toString());
		params.set("page", "1");
		params.set("pageSize", String(pageSize));
		window.history.pushState({}, "", `?${params.toString()}`);
		// Reload page to trigger new fetch with updated searchParams
		window.location.href = `?${params.toString()}`;
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
					<form className="flex flex-wrap gap-3 mb-6" onSubmit={handleSubmit}>
						<input
							name="term"
							placeholder="Periodo (ej. 2024-A)"
							defaultValue={validTerm || ""}
							className="border border-gray-300 rounded px-3 py-2 text-sm"
						/>
						<button
							type="submit"
							className="bg-gray-900 text-white px-4 py-2 rounded text-sm"
							disabled={loading}
						>
							{loading ? "Cargando..." : "Filtrar"}
						</button>
					</form>

					{error && (
						<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
							<p className="text-red-700 font-bold text-sm">{error}</p>
						</div>
					)}

					{loading ? (
						<div className="text-center py-8">
							<p className="text-gray-600">Cargando datos...</p>
						</div>
) : data.length === 0 ? (
						<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
							<p className="text-yellow-700 font-bold text-sm">
								No hay datos para el período "{validTerm}". Intenta con 2024-A o 2024-B
							</p>
						</div>
					) : (
						<>
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
						</>
					)}
				</div>
			</div>
		</main>
	);
}

export default function TeacherLoadReport() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
			<TeacherLoadContent />
		</Suspense>
	);
}
