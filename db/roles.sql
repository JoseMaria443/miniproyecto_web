-- =====================================================================
-- ROLES Y PERSIMOs
-- =====================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'chema') THEN
        CREATE ROLE web_user LOGIN PASSWORD 'chema3001';
    END IF;
END

--persimos de conexion
GRANT CONNECT ON DATABASE miniproyecto_web TO chema;
GRANT USAGE ON SCHEMA public TO chema;

--solo puede leer las tablas
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM chema;
GRANT SELECT ON Estudiante TO chema;
GRANT SELECT ON Maestros TO chema;
GRANT SELECT ON Cursos TO chema;
GRANT SELECT ON Grupos TO chema;
GRANT SELECT ON Inscripciones TO chema;
GRANT SELECT ON Calificaciones TO chema;
GRANT SELECT ON Asistencia TO chema;


