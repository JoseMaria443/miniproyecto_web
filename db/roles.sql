DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app') THEN
        CREATE ROLE app LOGIN PASSWORD 'app_secure_password_2024';
    END IF;
END $$;

GRANT CONNECT ON DATABASE postgres TO app;
GRANT USAGE ON SCHEMA public TO app;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app;


GRANT SELECT ON TABLE vw_attendance_by_group TO app;
GRANT SELECT ON TABLE vw_teacher_load TO app;
GRANT SELECT ON TABLE vw_students_at_risk TO app;
GRANT SELECT ON TABLE vw_course_performance TO app;
GRANT SELECT ON TABLE vw_rank_students TO app;



