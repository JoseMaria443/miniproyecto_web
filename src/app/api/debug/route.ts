import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Test de conexión a la BD
    const connectionTest = await query("SELECT 1 as status");
    
    // Datos de vw_attendance_by_group sin filtros
    const attendance = await query(
      "SELECT * FROM vw_attendance_by_group LIMIT 5"
    );

    // Datos de vw_attendance_by_group con filtro año 2024-A
    const attendanceFiltered = await query(
      "SELECT * FROM vw_attendance_by_group WHERE UPPER(term) = UPPER($1) LIMIT 5",
      ["2024-A"]
    );

    // Datos de vw_students_at_risk
    const studentsAtRisk = await query(
      "SELECT * FROM vw_students_at_risk LIMIT 5"
    );

    // Búsqueda de estudiante
    const searchTest = await query(
      "SELECT * FROM vw_students_at_risk WHERE estudiante_nombre ILIKE $1 OR estudiante_correo ILIKE $1 LIMIT 5",
      ["%Carlos%"]
    );

    // Datos de vw_course_performance
    const coursePerf = await query(
      "SELECT * FROM vw_course_performance WHERE UPPER(v.term) = UPPER($1) LIMIT 5",
      ["2024-A"]
    );

    // Verificar columnas disponibles
    const attendanceColumns = attendance.rows.length > 0 
      ? Object.keys(attendance.rows[0]) 
      : [];

    return Response.json({
      status: "ok",
      connection: connectionTest.rows[0],
      available_views: {
        attendance: {
          total: attendance.rowCount,
          columns: attendanceColumns,
          sample_data: attendance.rows[0],
          filtered_2024A: {
            total: attendanceFiltered.rowCount,
            sample: attendanceFiltered.rows[0]
          }
        },
        students_at_risk: {
          total: studentsAtRisk.rowCount,
          columns: studentsAtRisk.rows.length > 0 ? Object.keys(studentsAtRisk.rows[0]) : [],
          search_test: {
            query: "%Carlos%",
            results: searchTest.rowCount,
            sample: searchTest.rows[0]
          }
        },
        course_performance: {
          results: coursePerf.rowCount,
          sample: coursePerf.rows[0]
        }
      }
    });
  } catch (error) {
    return Response.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      details: error
    }, { status: 500 });
  }
}
