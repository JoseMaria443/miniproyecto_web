-- VIEW: vw_students_at_risk
-- Returns: Students at risk per term.
-- Grain: 1 row per student + term.
-- Metrics: promedio_acumulado, porcentaje_inasistencia, riesgo_motivo.
-- Verify:
--   SELECT * FROM vw_students_at_risk WHERE term = '2024-A' LIMIT 10;
--   SELECT term, COUNT(*) AS total_riesgo FROM vw_students_at_risk GROUP BY term;

CREATE OR REPLACE VIEW vw_students_at_risk AS
WITH StudentAtRisk AS (
    SELECT
        e.id AS estudiante_id,
        e.nombre AS estudiante_nombre,
        e.correo AS estudiante_correo,
        e.programa AS programa,
        g.periodo AS term,
        ROUND(
            AVG(
                COALESCE(
                    cal.calificacion,
                    (cal.parcial1 + cal.parcial2 + cal.final) / 3.0
                )
            ),
            2
        ) AS promedio_acumulado,
        COALESCE(
            ROUND(
                (SUM(CASE WHEN a.presente = FALSE THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(a.id), 0)) * 100,
                2
            ),
            0
        ) AS porcentaje_inasistencia
    FROM Estudiantes e
    JOIN Inscripciones i ON e.id = i.estudiante_id
    JOIN Grupos g ON i.grupo_id = g.id
    LEFT JOIN Calificaciones cal ON i.id = cal.inscripcion_id
    LEFT JOIN Asistencia a ON i.id = a.inscripcion_id
    GROUP BY e.id, e.nombre, e.correo, e.programa, g.periodo
)
SELECT
    estudiante_id,
    estudiante_nombre,
    estudiante_correo,
    programa,
    term,
    promedio_acumulado,
    porcentaje_inasistencia,
    CASE
        WHEN promedio_acumulado < 70 AND porcentaje_inasistencia >= 20 THEN 'Bajo promedio e inasistencia'
        WHEN promedio_acumulado < 70 THEN 'Bajo promedio'
        ELSE 'Inasistencia'
    END AS riesgo_motivo
FROM StudentAtRisk
WHERE promedio_acumulado < 70 OR porcentaje_inasistencia >= 20;