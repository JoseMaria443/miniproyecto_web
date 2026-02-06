import { query } from "@/lib/db";
import { z } from "zod";
import { getParam, buildWhereClause } from "@/lib/reports";

export const dynamic = "force-dynamic";

const FilterSchema = z.object({
  term: z.string().optional(),
});

export default async function AttendanceReport({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const rawTerm = getParam(searchParams.term).trim();
  const parsed = FilterSchema.safeParse({ term: rawTerm || undefined });
  const term = parsed.success ? parsed.data.term : undefined;

  const filters: string[] = [];
  const values: Array<string | number> = [];

  if (term) {
    values.push(term);
    filters.push(`UPPER(term) = UPPER($${values.length})`);
  }

  const where = buildWhereClause(filters, values);

  const res = await query(
    `SELECT * FROM vw_attendance_by_group ${where} ORDER BY porcentaje_asistencia ASC`,
    values
  );
  const data = res.rows;

  const criticalGroup = data[0];

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
          <form className="flex flex-wrap gap-3 mb-6" method="get">
            <input
              name="term"
              placeholder="Periodo (ej. 2024-A)"
              defaultValue={rawTerm}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded text-sm"
            >
              Filtrar
            </button>
          </form>

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
        </div>
      </div>
    </main>
  );
}