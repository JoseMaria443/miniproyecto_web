import { query } from "@/lib/db";
import { getParam, buildWhereClause } from "@/lib/reports";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const rawTerm = getParam(searchParams.get("term") as string | undefined).trim();
    
    // Debug: Mostrar qué recibimos
    const filters: string[] = [];
    const values: Array<string | number> = [];

    console.log("DEBUG - rawTerm:", rawTerm);
    console.log("DEBUG - rawTerm length:", rawTerm.length);
    console.log("DEBUG - rawTerm type:", typeof rawTerm);

    if (rawTerm && rawTerm.length > 0) {
      values.push(rawTerm);
      filters.push(`UPPER(term) = UPPER($${values.length})`);
    }

    const where = buildWhereClause(filters, values);
    
    console.log("DEBUG - filters:", filters);
    console.log("DEBUG - values:", values);
    console.log("DEBUG - where clause:", where);

    // Consulta sin filtro
    const noFilterRes = await query(
      `SELECT term, COUNT(*) as count FROM vw_attendance_by_group GROUP BY term`
    );

    // Consulta con filtro
    const sqlQuery = `SELECT * FROM vw_attendance_by_group ${where} ORDER BY porcentaje_asistencia ASC`;
    console.log("DEBUG - SQL Query:", sqlQuery);
    console.log("DEBUG - SQL Values:", values);

    const res = await query(sqlQuery, values);

    return Response.json({
      debug: {
        rawTerm,
        rawTermLength: rawTerm.length,
        filters,
        values,
        where,
        sqlQuery,
        sqlValues: values,
      },
      data: {
        totalWithoutFilter: noFilterRes.rows,
        totalWithFilter: res.rowCount,
        samples: res.rows.slice(0, 5),
      },
    });
  } catch (error) {
    return Response.json({
      error: error instanceof Error ? error.message : "Error desconocido",
      stack: error instanceof Error ? error.stack : null,
    }, { status: 500 });
  }
}
