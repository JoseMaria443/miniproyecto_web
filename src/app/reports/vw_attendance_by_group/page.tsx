import { db } from "@/lib/db"; 
import { z } from "zod";


const FilterSchema = z.object({
  term: z.string().optional(),
});

export default async function AttendanceReport({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const { term } = await FilterSchema.parse(searchParams);

  const query = term 
    ? { text: "SELECT * FROM vw_attendance_by_group WHERE term = $1", values: [term] }
    : { text: "SELECT * FROM vw_attendance_by_group", values: [] };

  const res = await db.query(query.text, query.values);
  const data = res.rows;

  const criticalGroup = [...data].sort((a, b) => a.ratio_asistencia - b.ratio_asistencia)[0];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Reporte de Asistencia por Grupo</h1>
      <p className="text-gray-600 mb-6">Visualización del ratio de asistencia por periodo académico.</p>

      {criticalGroup && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-bold text-sm text-uppercase">Grupo Crítico (Menor Asistencia)</p>
          <p className="text-xl font-semibold">{criticalGroup.curso_nombre}: {criticalGroup.ratio_asistencia}%</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Curso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periodo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ratio Asistencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row: any) => (
              <tr key={row.grupo_id}>
                <td className="px-6 py-4 whitespace-nowrap">{row.curso_nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.term}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-mono">
                  <span className={row.ratio_asistencia < 80 ? "text-red-600 font-bold" : ""}>
                    {row.ratio_asistencia}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}