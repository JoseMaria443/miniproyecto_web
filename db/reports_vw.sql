-- ==========================================================================
-- VIEWS PARA REPORTES ACADÉMICOS
-- ==========================================================================

-- VIEW: vw_attendance_by_group (CASE/COALESCE)
-- Returns: Attendance summary per group and term.
-- Grain: 1 row per group + term.
-- Metrics: total_inscripciones, total_sesiones, porcentaje_asistencia.
-- Verify:
--   SELECT * FROM vw_attendance_by_group WHERE term = '2024-A' LIMIT 5;
--   SELECT term, AVG(porcentaje_asistencia) AS avg_asistencia FROM vw_attendance_by_group GROUP BY term;
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
GROUP BY g.id, c.codigo, c.nombre, g.periodo
HAVING COUNT(DISTINCT i.id) > 0;

-- VIEW: vw_teacher_load (HAVING)
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

-- VIEW: vw_students_at_risk (CTE)
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

-- VIEW: vw_course_performance (CASE)
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
        e.programa AS estudiante_programa,
        COALESCE(
            cal.calificacion,
            (cal.parcial1 + cal.parcial2 + cal.final) / 3.0
        ) AS calificacion_final
    FROM Cursos c
    JOIN Grupos g ON g.curso_id = c.id
    LEFT JOIN Inscripciones i ON g.id = i.grupo_id
    LEFT JOIN Estudiantes e ON i.estudiante_id = e.id
    LEFT JOIN Calificaciones cal ON i.id = cal.inscripcion_id
)
SELECT
    curso_id,
    curso_codigo,
    curso_nombre,
    term,
    ARRAY_REMOVE(ARRAY_AGG(DISTINCT estudiante_programa), NULL) AS programas,
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

-- VIEW: vw_rank_students (Window Function)
-- Returns: Student ranking by average grade per term.
-- Grain: 1 row per student + program + term.
-- Metrics: promedio_calificaciones, posicion_en_ranking, nivel_desempeno.
-- Verify:
--   SELECT * FROM vw_rank_students WHERE term = '2024-A' LIMIT 10;
--   SELECT term, COUNT(*) AS total_ranked FROM vw_rank_students GROUP BY term;
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
