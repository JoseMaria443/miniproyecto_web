-- vw_rank_students
-- Grain: 1 row per student + program + term

CREATE OR REPLACE VIEW vw_rank_students AS
WITH StudentCalificaciones AS (
    SELECT
        e.id AS estudiante_id,
        e.nombre AS estudiante_nombre,
        e.correo AS estudiante_correo,
        e.programa AS programa,
        g.periodo AS term,
        COALESCE(
            cal.calificacion,
            (cal.parcial1 + cal.parcial2 + cal.final) / 3.0
        ) AS calificacion_final
    FROM Estudiantes e
    JOIN Inscripciones i ON e.id = i.estudiante_id
    JOIN Grupos g ON i.grupo_id = g.id
    LEFT JOIN Calificaciones cal ON i.id = cal.inscripcion_id
)
SELECT
    estudiante_id,
    estudiante_nombre,
    estudiante_correo,
    programa,
    term,
    ROUND(AVG(calificacion_final), 2) AS promedio_calificaciones,
    RANK() OVER (
        PARTITION BY programa, term
        ORDER BY AVG(calificacion_final) DESC
    ) AS posicion_en_ranking
FROM StudentCalificaciones
GROUP BY estudiante_id, estudiante_nombre, estudiante_correo, programa, term;