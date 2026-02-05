-- vw_rank_studen
-- Que devuelve: El ranking de estudiantes por promedio de calificaciones en un periodo.
-- Grain: 1 fila por estudiante + programa + periodo
-- Metricas: Ranking academico de los programas 

CREATE OR REPLACE VIEW vw_rank_student AS
SELECT
    e.nombre AS estudiante_nombre,
    e.programa AS programa,
    e.periodo AS termino,
    ROUND(AVG(cal.calificacion), 2) AS promedio_calificaciones,
    RANK() OVER(
        PARTITION BY e.programa, e.periodo
        ORDER BY AVG(cal.calificacion) DESC
    ) AS posicion_en_ranking
    ROW_NUMBER() OVER(
        PARTITION BY e.programa, e.periodo
        ORDER BY AVG(cal.calificacion) DESC
    )
    FROM Estudiantes e
    JOIN Inscripciones i ON e.id = i.estudiante_id
    JOIN Grupos g ON i.grupo_id = g.id
    JOIN Calificaciones cal ON i.id = cal.inscripcion_id
    GROUP BY e.id, e.nombre, e.programa, e.periodo;