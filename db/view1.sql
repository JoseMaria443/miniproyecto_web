-- vw_attendance_by_group
-- Grain: 1 row per group + term

CREATE OR REPLACE VIEW vw_attendance_by_group AS
SELECT
  g.id AS grupo_id,
  c.codigo AS curso_codigo,
  c.nombre AS curso_nombre,
  g.periodo AS term,
  COUNT(DISTINCT i.id) AS total_inscripciones,
  COUNT(a.id) AS total_sesiones,
  COALESCE(
    ROUND(
      (SUM(CASE WHEN a.presente THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(a.id), 0)) * 100,
      2
    ),
    0
  ) AS porcentaje_asistencia
FROM Grupos g
JOIN Cursos c ON g.curso_id = c.id
LEFT JOIN Inscripciones i ON g.id = i.grupo_id
LEFT JOIN Asistencia a ON i.id = a.inscripcion_id
GROUP BY g.id, c.codigo, c.nombre, g.periodo;
