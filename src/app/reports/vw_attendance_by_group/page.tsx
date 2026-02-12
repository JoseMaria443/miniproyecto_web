"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AttendanceContent() {
	const searchParams = useSearchParams();
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const term = searchParams.get("term")?.trim() || "";
	const validTerm = term && term.length > 0 ? term : undefined;

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const params = new URLSearchParams({
				...(validTerm && { term: validTerm }),
			});
			const response = await fetch(`/api/reports/vw_attendance_by_group?${params}`);
			if (!response.ok) throw new Error("Error al obtener datos");
			const result = await response.json();
			setData(result.data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error desconocido");
		} finally {
			setLoading(false);
		}
	}, [validTerm]);

	useEffect(() => {
		// Siempre llamar fetchData (con o sin filtro)
		fetchData();
	}, [fetchData]);

	const criticalGroup = data[0];

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const params = new URLSearchParams();
		const termValue = formData.get("term");
		if (termValue) params.set("term", termValue.toString());
		window.location.href = `?${params.toString()}`;
	};

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-2xl border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Reporte de Asistencia por Grupo</h1>
          <p className="text-gray-300 text-base">
            Visualizacion del porcentaje de asistencia por periodo.
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
          ) : (
            <>
              {criticalGroup && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <p className="text-red-700 font-bold text-sm text-uppercase">
                    Grupo Critico (Menor Asistencia)
                  </p>
                  <p className="text-xl font-semibold">
                    {criticalGroup.curso_nombre}: {criticalGroup.porcentaje_asistencia}%
                  </p>
                </div>
              )}

              {data.length === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <p className="text-yellow-700 font-bold text-sm">
                    No hay datos disponibles. Intenta con 2024-A o 2024-B
                  </p>
                </div>
              ) : (
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
                      % Asistencia
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((row: any) => (
                    <tr key={row.grupo_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.curso_nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.term}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono">
                        <span
                          className={
                            row.porcentaje_asistencia < 80
                              ? "text-red-600 font-bold"
                              : ""
                          }
                        >
                          {row.porcentaje_asistencia}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AttendanceReport() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
			<AttendanceContent />
		</Suspense>
	);
}