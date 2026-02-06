-- =====================================================================
-- ROLES Y PERMISOS
-- =====================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'chema') THEN
        CREATE ROLE chema LOGIN PASSWORD 'chema3001';
    END IF;
END $$;

-- permisos de conexion
GRANT CONNECT ON DATABASE postgres TO chema;
GRANT USAGE ON SCHEMA public TO chema;

-- solo puede leer las tablas
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM chema;
GRANT SELECT ON TABLE Estudiantes TO chema;
GRANT SELECT ON TABLE Maestros TO chema;
GRANT SELECT ON TABLE Cursos TO chema;
GRANT SELECT ON TABLE Grupos TO chema;
GRANT SELECT ON TABLE Inscripciones TO chema;
GRANT SELECT ON TABLE Calificaciones TO chema;
GRANT SELECT ON TABLE Asistencia TO chema;


