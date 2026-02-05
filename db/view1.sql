-- db/reports_vw.sql
/* VIEW: vw_attendance_by_group 
  Grain: 1 fila por grupo + periodo 
  Métricas: Porcentaje de asistencia promedio por grupo 
*/
CREATE OR REPLACE VIEW vw_attendance_by_group AS
SELECT 
    g.id AS grupo_id,
    c.nombre AS curso_nombre,
    g.periodo AS term,
    COALESCE(
        ROUND((COUNT(CASE WHEN a.presente THEN 1 END)::DECIMAL / NULLIF(COUNT(a.id), 0)) * 100, 2), 
        0
    ) AS ratio_asistencia
FROM Grupos g
JOIN Cursos c ON g.curso_id = c.id
LEFT JOIN Inscripciones i ON g.id = i.grupo_id
LEFT JOIN Asistencia a ON i.id = a.inscripcion_id
GROUP BY g.id, c.nombre, g.periodo;
