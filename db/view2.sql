-- vw_teacher_load
-- Que devuelve: La carga académica de cada profesor por periodo.
-- Grain: 1 fila por profesor + periodo
-- Métricas: El total de grupos y alumnos  y el proedio de las calificaciones.

CREATE OR REPLACE VIEW vw_teacher_load AS
SELECT
    m.nombre AS maestro_nombre,
    m.correo AS maestro_correo,
    g.periodo AS termino,
    COUNT(DISTINCT g.id) AS total_grupos,
    COUNT(i.id) AS total_estudiantes,
    ROUND(AVG(cal.calificacion), 2) AS promedio_calificaciones
FROM Maestros m
JOIN Grupos g ON m.id = g.maestro_id
LEFT JOIN Inscripciones i ON g.id = i.grupo_id
LEFT JOIN Calificaciones cal ON i.id = cal.inscripcion_id
GROUP BY m.id, m.nombre, m.correo, g.periodo;
HAVING COUNT(DISTINCT g.id) > 0;