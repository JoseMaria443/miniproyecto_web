-- vw_students_at_risk
-- Que devuelve: Lista de estudiantes en riesgo académico por periodo.
-- Grain: 1 fila por estudiante + periodo
-- Metricas: Alumnos con premedio menor a 70 o con inasistencias >= 80%

CREATE OR REPLACE VIEW vw_students_at_risk AS
WITH StudentAsRisk AS (
    SELECT
        e.id,
        e.nombre AS estudiante_nombre,
        e.correo AS estudiante_correo,
        g.periodo,
        AVG(cal.promedio_calificaciones) AS promedio_acumulado,
        (COUNT(CASE WHEN i.asistencias < 0.8 THEN 1 END) * 100.0 / COUNT(i.id)) AS porcentaje_inasistencias
    FROM Estudiantes e
    JOIN Inscripciones i ON e.id = i.estudiante_id
    LEFT JOIN Calificaciones i ON e.id = i.estudiante_id
    LEFT JOIN asistencias a ON i.id = a.inscripcion_id
    GROUP BY e.id, e.nombre, e.correo, g.periodo
)
SELECT
    estudiante_nombre,
    estudiante_correo,
    programa,
    ROUND(promedio_acumulado, 2) AS promedio_acumulado,
    ROUND(porcentaje_inasistencias, 2) AS asistencias_totales,
FROM StudentAsRisk
WHERE promedio_acumulado < 70 OR porcentaje_inasistencias >= 80;