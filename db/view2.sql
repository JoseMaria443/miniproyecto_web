-- VIEW: vw_teacher_load
-- Returns: Teacher load and performance per term.
-- Grain: 1 row per teacher + term.
-- Metrics: total_grupos, total_estudiantes, promedio_calificaciones.
-- Verify:
--   SELECT * FROM vw_teacher_load WHERE term = '2024-A' ORDER BY total_grupos DESC;
--   SELECT term, AVG(promedio_calificaciones) AS avg_docente FROM vw_teacher_load GROUP BY term;
CREATE OR REPLACE VIEW vw_teacher_load AS
SELECT
    m.id AS maestro_id,
    m.nombre AS maestro_nombre,
    m.correo AS maestro_correo,
    g.periodo AS term,
    COUNT(DISTINCT g.id) AS total_grupos,
    COUNT(DISTINCT i.estudiante_id) AS total_estudiantes,
    ROUND(
        AVG(
            COALESCE(
                cal.calificacion,
                (cal.parcial1 + cal.parcial2 + cal.final) / 3.0
            )
        ),
        2
    ) AS promedio_calificaciones
FROM Maestros m
JOIN Grupos g ON m.id = g.maestro_id
LEFT JOIN Inscripciones i ON g.id = i.grupo_id
LEFT JOIN Calificaciones cal ON i.id = cal.inscripcion_id
GROUP BY m.id, m.nombre, m.correo, g.periodo
HAVING COUNT(DISTINCT g.id) > 0;