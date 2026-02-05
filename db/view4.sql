-- vw_attendance_by_group
-- Que devuelve: El total de asistencias registradas por grupo y periodo.
-- Grain: 1 fila por grupo + periodo
-- Métricas: Porcentaje de asistencias registradas.

CREATE ON REPLACE VIEW vw_attendance_by_group AS
SELECT 
    g.id AS grupo_id,
    c.nombre AS curso_nombre,
    g.periodo AS termino,
    COALASCE(
        ROUND((COUNT(CASE WHEN a.asistio = THEN 1 END):: DECIMAL / NULLIF(COUNT(a.id), 0)) * 100, 2),
        0
    ) AS porcentaje_asistencias
FROM Grupos g
JOIN Cursos c ON g.curso_id = c.id
LEFT JOIN Inscripciones i ON g.id = i.grupo_id
LEFT JOIN Asistencias a ON i.id = a.inscripcion_id
GROUP BY g.id, c.nombre, g.periodo;
