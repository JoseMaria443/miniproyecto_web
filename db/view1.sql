-- vw_course_performance:
-- Qué devuelve: El rendimiento de los estudiantes de cada curso y periodo.
-- Grain: 1 fila por curso + periodo
-- Metricas: Promedio general, el conteo de los alumnos y los alumnos que se encuentran reprobados.

CREATE ON REPLACE VIEW vw_course_performance AS
SELECT 
    c.nombre AS curso_nombre,
    C.codigo AS curso_codigo,
    g.periodo AS termino,
    e.programa AS programa_academico,
    ROUND(AVG(cal.calificacion), 2) AS promedio_general,
    COUNT(i.is) AS total_estudiantes,
    SUM(CASE WHEN cal.calificacion < 60 THEN 1 ELSE 0 END) AS estudiantes_reprobados
FROM Cursos c
JOIN Grupos g ON c.id = g.curso_id
JOIN Inscripciones i ON g.id = i.grupo_id
JOIN Estudiantes e ON i.estudiante_id = e.id
JOIN Calificaciones cal ON i.id = cal.inscripcion_id
GROUP BY c.nombre, c.codigo, g.periodo, e.programa;

