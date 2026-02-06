-- VIEW: vw_course_performance
-- Returns: Course performance per term.
-- Grain: 1 row per course + term.
-- Metrics: promedio_calificaciones, total_reprobados, tasa_reprobacion.
-- Verify:
--   SELECT * FROM vw_course_performance WHERE term = '2024-A' ORDER BY tasa_reprobacion DESC;
--   SELECT term, AVG(promedio_calificaciones) AS avg_curso FROM vw_course_performance GROUP BY term;
CREATE OR REPLACE VIEW vw_course_performance AS
WITH CursoCalificaciones AS (
    SELECT
        c.id AS curso_id,
        c.codigo AS curso_codigo,
        c.nombre AS curso_nombre,
        g.periodo AS term,
        g.id AS grupo_id,
        i.id AS inscripcion_id,
        COALESCE(
            cal.calificacion,
            (cal.parcial1 + cal.parcial2 + cal.final) / 3.0
        ) AS calificacion_final
    FROM Cursos c
    JOIN Grupos g ON g.curso_id = c.id
    LEFT JOIN Inscripciones i ON g.id = i.grupo_id
    LEFT JOIN Calificaciones cal ON i.id = cal.inscripcion_id
)
SELECT
    curso_id,
    curso_codigo,
    curso_nombre,
    term,
    COUNT(DISTINCT grupo_id) AS total_grupos,
    COUNT(DISTINCT inscripcion_id) AS total_inscripciones,
    ROUND(AVG(calificacion_final), 2) AS promedio_calificaciones,
    MIN(calificacion_final) AS min_calificacion,
    MAX(calificacion_final) AS max_calificacion,
    SUM(CASE WHEN calificacion_final < 70 THEN 1 ELSE 0 END) AS total_reprobados,
    SUM(CASE WHEN calificacion_final >= 70 THEN 1 ELSE 0 END) AS total_aprobados,
    COALESCE(
        ROUND(
            (SUM(CASE WHEN calificacion_final < 70 THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(calificacion_final), 0)) * 100,
            2
        ),
        0
    ) AS tasa_reprobacion
FROM CursoCalificaciones
GROUP BY curso_id, curso_codigo, curso_nombre, term
HAVING COUNT(DISTINCT inscripcion_id) > 0;