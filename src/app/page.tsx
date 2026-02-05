import Link from "next/link";
import { title } from "process";

export default function Home(){
  const reports = [
    {id: 1, title: "Asistencia por grupo", path: "/reports/vw_attendance_by_group", color: "fron-red-600 to-blue-700"},
    {id: 2, title: "Rendimiento del curso", path: "/reports/vw_course_performance", color: "from-green-600 to-blue-700"},
    {id: 3, title: "Ranking de los estudiantes", path: "/reports/vw_student_ranking", color: "from-yellow-600 to-blue-700"}
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-2xl border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Operativo</h1>
          <p className="text-gray-300 text-base">
            Monitoreo integral de ventas, inventario y desempeño empresarial
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-6 py-12">
        <div className="grid grid-cols-1 gap-6">
          {reports.map((r) => (
            <Link key={r.id} href={r.path}>
              <div className={`mx-4 w-full bg-gradient-to-br ${r.color} text-white p-8 rounded-xl shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 cursor-pointer h-full border-2 border-gray-700`}>
                <h2 className="text-2xl font-bold mb-2">Reporte #{r.id}</h2>
                <p className="text-white/90 text-sm">{r.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}