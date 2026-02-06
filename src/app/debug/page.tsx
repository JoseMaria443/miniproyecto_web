import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  let dbStatus = "error";
  let statusMessage = "No se pudo conectar a la base de datos";
  let debugInfo: any = null;

  try {
    // Test de conexión
    const connectionTest = await query("SELECT 1 as connected");
    dbStatus = "connected";
    statusMessage = "Conectado a la base de datos";

    // Obtener info de las vistas
    const viewsInfo = await query(`
      SELECT table_name as view_name 
      FROM information_schema.views 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'vw_%'
      ORDER BY table_name
    `);

    // Datos por vista
    const views = await Promise.all(
      viewsInfo.rows.map(async (row: any) => {
        try {
          const countRes = await query(
            `SELECT COUNT(*) as total FROM ${row.view_name}`
          );
          const sampleRes = await query(
            `SELECT * FROM ${row.view_name} LIMIT 1`
          );
          const columnsRes = await query(
            `SELECT column_name, data_type 
             FROM information_schema.columns 
             WHERE table_name = $1`,
            [row.view_name]
          );

          return {
            name: row.view_name,
            status: "ok",
            total_records: countRes.rows[0]?.total || 0,
            columns: columnsRes.rows.map((c: any) => c.column_name),
            sample: sampleRes.rows[0] || null,
          };
        } catch (e) {
          return {
            name: row.view_name,
            status: "error",
            error: e instanceof Error ? e.message : "Error desconocido",
          };
        }
      })
    );

    // Prueba de búsqueda específica
    let searchTest = null;
    try {
      const searchRes = await query(
        `SELECT * FROM vw_students_at_risk 
         WHERE estudiante_nombre ILIKE $1 OR estudiante_correo ILIKE $1 LIMIT 3`,
        ["%Carlos%"]
      );
      searchTest = {
        query: "%Carlos%",
        results: searchRes.rowCount,
        data: searchRes.rows,
      };
    } catch (e) {
      searchTest = {
        error: e instanceof Error ? e.message : "Error",
      };
    }

    debugInfo = {
      views,
      search_test: searchTest,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    dbStatus = "error";
    statusMessage =
      error instanceof Error ? error.message : "Error desconocido";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 shadow-2xl border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Debug Dashboard</h1>
          <p className="text-gray-300">Estado de la base de datos y vistas</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Status Card */}
        <div
          className={`rounded-lg p-6 mb-8 border-2 ${
            dbStatus === "connected"
              ? "bg-green-900/20 border-green-500"
              : "bg-red-900/20 border-red-500"
          }`}
        >
          <h2 className="text-xl font-bold mb-2">
            Estado de Conexión:{" "}
            <span
              className={
                dbStatus === "connected"
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {statusMessage}
            </span>
          </h2>
          {debugInfo && (
            <p className="text-sm text-gray-300">
              Última actualización: {debugInfo.timestamp}
            </p>
          )}
        </div>

        {/* Views Status */}
        {debugInfo?.views && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Vistas Disponibles</h2>
            <div className="grid grid-cols-1 gap-4">
              {debugInfo.views.map((view: any) => (
                <div
                  key={view.name}
                  className="bg-white/5 border border-gray-600/30 rounded-lg p-4 hover:border-blue-500/50 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-mono font-bold text-blue-400">
                      {view.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded text-sm font-bold ${
                        view.status === "ok"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {view.status}
                    </span>
                  </div>

                  {view.error ? (
                    <p className="text-red-400 text-sm">{view.error}</p>
                  ) : (
                    <>
                      <p className="text-gray-300 mb-3">
                        <strong>Registros:</strong>{" "}
                        <span className="text-yellow-400">{view.total_records}</span>
                      </p>

                      <details className="mb-3">
                        <summary className="cursor-pointer text-gray-400 hover:text-gray-300 text-sm">
                          Columnas ({view.columns.length})
                        </summary>
                        <div className="mt-2 pl-4 border-l border-gray-600 space-y-1">
                          {view.columns.map((col: string) => (
                            <code
                              key={col}
                              className="block text-xs text-gray-400"
                            >
                              {col}
                            </code>
                          ))}
                        </div>
                      </details>

                      {view.sample && (
                        <details>
                          <summary className="cursor-pointer text-gray-400 hover:text-gray-300 text-sm">
                            Mostrar ejemplo de datos
                          </summary>
                          <pre className="mt-2 bg-black/30 p-3 rounded text-xs overflow-auto max-h-48 text-gray-300">
                            {JSON.stringify(view.sample, null, 2)}
                          </pre>
                        </details>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Test */}
        {debugInfo?.search_test && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Prueba de Búsqueda</h2>
            <div className="bg-white/5 border border-gray-600/30 rounded-lg p-4">
              <p className="mb-3">
                <strong>Query:</strong>{" "}
                <code className="bg-black/30 px-2 py-1 rounded text-sm">
                  {debugInfo.search_test.query}
                </code>
              </p>
              <p className="mb-3">
                <strong>Resultados encontrados:</strong>{" "}
                <span className="text-yellow-400">
                  {debugInfo.search_test.results || 0}
                </span>
              </p>
              {debugInfo.search_test.data && debugInfo.search_test.data.length > 0 && (
                <details>
                  <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
                    Ver datos
                  </summary>
                  <pre className="mt-2 bg-black/30 p-3 rounded text-xs overflow-auto max-h-64 text-gray-300">
                    {JSON.stringify(debugInfo.search_test.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        {/* URL Examples */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">URLs para Probar</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Asistencia por Grupo:</strong>
              <code className="block bg-black/30 p-2 rounded mt-1 text-gray-300">
                /reports/vw_attendance_by_group?term=2024-A
              </code>
            </p>
            <p>
              <strong>Rendimiento por Curso:</strong>
              <code className="block bg-black/30 p-2 rounded mt-1 text-gray-300">
                /reports/vw_course_performance?term=2024-A&program=Ingeniería%20de%20Software
              </code>
            </p>
            <p>
              <strong>Ranking de Estudiantes:</strong>
              <code className="block bg-black/30 p-2 rounded mt-1 text-gray-300">
                /reports/vw_rank_students?term=2024-A
              </code>
            </p>
            <p>
              <strong>Estudiantes en Riesgo:</strong>
              <code className="block bg-black/30 p-2 rounded mt-1 text-gray-300">
                /reports/vw_students_at_risk?term=2024-A&q=Carlos
              </code>
            </p>
            <p>
              <strong>Carga Docente:</strong>
              <code className="block bg-black/30 p-2 rounded mt-1 text-gray-300">
                /reports/vw_teacher_load?term=2024-A
              </code>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
