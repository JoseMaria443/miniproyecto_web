-- ==========================================================================
-- Indices
-- ==========================================================================

CREATE INDEX IF NOT EXISTS idx_estudiantes_correo ON Estudiantes(correo);
CREATE INDEX IF NOT EXISTS idx_estudiantes_programa ON Estudiantes(programa);
CREATE INDEX IF NOT EXISTS idx_grupos_periodo ON Grupos(periodo);
CREATE INDEX IF NOT EXISTS idx_inscripciones_grupo ON Inscripciones(grupo_id);
CREATE INDEX IF NOT EXISTS idx_asistencia_inscripcion ON Asistencia(inscripcion_id);