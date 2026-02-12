-- ==========================================
-- SEED DATA PARA SISTEMA ESCOLAR
-- ==========================================

-- 1. Insertar Estudiantes
INSERT INTO Estudiantes (nombre, correo, programa, anio_inscripcion) VALUES
('Carlos Rodríguez', '243001@ids.upchiapas.edu.mx', 'Ingeniería de Software', 2023),
('Ana Martínez', '243002@ids.upchiapas.edu.mx', 'Ciencias de Datos', 2023),
('Luis Gerardo Pérez', '243003@ids.upchiapas.edu.mx', 'Ingeniería de Software', 2022),
('María Fernanda López', '243004@ids.upchiapas.edu.mx', 'Diseño Digital', 2024),
('Sofía Castro', '243005@ids.upchiapas.edu.mx', 'Ciencias de Datos', 2023),
('Diego Torres', '243006@ids.upchiapas.edu.mx', 'Ingeniería de Software', 2022),
('Paula Rivas', '243007@ids.upchiapas.edu.mx', 'Ciencias de Datos', 2024),
('Javier Mora', '243008@ids.upchiapas.edu.mx', 'Diseño Digital', 2021),
('Carla Vega', '243009@ids.upchiapas.edu.mx', 'Diseño Digital', 2023),
('Rafael Ortiz', '243010@ids.upchiapas.edu.mx', 'Ingeniería de Software', 2021),
('Lucia Prado', '243011@ids.upchiapas.edu.mx', 'Ciencias de Datos', 2022),
('Hugo Santos', '243012@ids.upchiapas.edu.mx', 'Diseño Digital', 2023),
('Marta Soler', '243013@ids.upchiapas.edu.mx', 'Diseño Digital', 2024),
('Enrique Nunez', '243014@ids.upchiapas.edu.mx', 'Ingeniería de Software', 2024),
('Gabriela Reyes', '243015@ids.upchiapas.edu.mx', 'Ciencias de Datos', 2021);

-- 2. Insertar Maestros
INSERT INTO Maestros (nombre, correo) VALUES
('Dr. Roberto Gómez', 'roberto.gomez@profe.edu'),
('Mtra. Elena Jiménez', 'elena.jimenez@profe.edu'),
('Ing. Samuel García', 'samuel.garcia@profe.edu'),
('Dra. Beatriz Solís', 'beatriz.solis@profe.edu'),
('Mtro. Ricardo Luna', 'ricardo.luna@profe.edu'),
('Mtra. Julia Ramos', 'julia.ramos@profe.edu'),
('Dr. Andres Silva', 'andres.silva@profe.edu'),
('Mtro. Felipe Cruz', 'felipe.cruz@profe.edu'),
('Dra. Laura Nieto', 'laura.nieto@profe.edu'),
('Ing. Pablo Leon', 'pablo.leon@profe.edu'),
('Mtra. Irene Soto', 'irene.soto@profe.edu'),
('Dr. Victor Mena', 'victor.mena@profe.edu'),
('Mtro. Sergio Cano', 'sergio.cano@profe.edu'),
('Dra. Noemi Gil', 'noemi.gil@profe.edu'),
('Ing. Tomas Lara', 'tomas.lara@profe.edu');

-- 3. Insertar Cursos
INSERT INTO Cursos (codigo, nombre, creditos) VALUES
('MAT101', 'Cálculo Diferencial', 8),
('PROG202', 'Programación Orientada a Objetos', 10),
('BD303', 'Bases de Datos I', 9),
('EST505', 'Estadística Descriptiva', 8),
('RED101', 'Redes de Computadoras', 8),
('IA201', 'Introducción a la IA', 9),
('WEB301', 'Desarrollo Web', 7),
('UX102', 'Diseño de Experiencia de Usuario', 6),
('ALG210', 'Algoritmos', 9),
('BD401', 'Bases de Datos II', 9),
('EST510', 'Estadística Inferencial', 8),
('ARQ200', 'Arquitectura de Computadoras', 8),
('TEC150', 'Tecnologías Emergentes', 6),
('DISE301', 'Principios del Diseño Gráfico', 7),
('DISE302', 'Diseño Interactivo', 6);

-- 4. Insertar Grupos
INSERT INTO Grupos (curso_id, maestro_id, periodo) VALUES
(1, 1, '2025-B'), 
(2, 3, '2025-B'), 
(3, 5, '2025-B'), 
(4, 4, '2025-B'), 
(5, 2, '2025-B'),
(6, 6, '2025-B'),
(7, 7, '2025-B'),
(8, 8, '2025-B'),
(9, 9, '2025-B'),
(10, 10, '2025-B'),
(11, 11, '2025-B'),
(12, 12, '2025-B'),
(13, 13, '2025-B'),
(14, 14, '2025-B'),
(15, 15, '2025-B');

-- 5. Insertar Inscripciones
-- Estudiantes de Ingeniería de Software en cursos de programación
INSERT INTO Inscripciones (estudiante_id, grupo_id) VALUES
(1, 1),   -- Carlos: Cálculo Diferencial
(1, 2),   -- Carlos: Programación Orientada a Objetos
(3, 1),   -- Luis: Cálculo Diferencial
(3, 2),   -- Luis: Programación Orientada a Objetos
(3, 3),   -- Luis: Bases de Datos I
(6, 2),   -- Diego: Programación Orientada a Objetos
(6, 3),   -- Diego: Bases de Datos I
(10, 1),  -- Rafael: Cálculo Diferencial
(10, 2),  -- Rafael: Programación Orientada a Objetos
(14, 1),  -- Enrique: Cálculo Diferencial
(14, 2),  -- Enrique: Programación Orientada a Objetos
-- Estudiantes de Ciencias de Datos
(2, 1),   -- Ana: Cálculo Diferencial
(2, 4),   -- Ana: Estadística Descriptiva
(5, 4),   -- Sofía: Estadística Descriptiva
(5, 11),  -- Sofía: Estadística Inferencial
(7, 4),   -- Paula: Estadística Descriptiva
(11, 1),  -- Lucia: Cálculo Diferencial
(11, 4),  -- Lucia: Estadística Descriptiva
(15, 4),  -- Gabriela: Estadística Descriptiva
-- Estudiantes de Diseño Digital
(4, 7),   -- María: Desarrollo Web
(4, 8),   -- María: Diseño de Experiencia de Usuario
(8, 8),   -- Javier: Diseño de Experiencia de Usuario
(9, 8),   -- Carla: Diseño de Experiencia de Usuario
(12, 7),  -- Hugo: Desarrollo Web
(12, 8),  -- Hugo: Diseño de Experiencia de Usuario
(13, 7),  -- Marta: Desarrollo Web
(13, 14), -- Marta: Principios del Diseño Gráfico
(13, 15); -- Marta: Diseño Interactivo

-- 6. Insertar Calificaciones
-- Nota: 'puntiacion_media' se calcula automáticamente, no se incluye en el INSERT
INSERT INTO Calificaciones (inscripcion_id, calificacion, parcial1, parcial2, final) VALUES
(1, 85.0, 82.0, 88.0, 85.0),   -- Carlos: Cálculo Diferencial
(2, 92.0, 94.0, 91.0, 91.0),   -- Carlos: Programación OOP
(3, 88.0, 86.0, 90.0, 88.0),   -- Luis: Cálculo Diferencial
(4, 91.0, 92.0, 90.0, 91.0),   -- Luis: Programación OOP
(5, 78.0, 76.0, 78.0, 80.0),   -- Luis: Bases de Datos I
(6, 82.0, 80.0, 84.0, 82.0),   -- Diego: Programación OOP
(7, 85.0, 84.0, 86.0, 85.0),   -- Diego: Bases de Datos I
(8, 90.0, 88.0, 92.0, 90.0),   -- Rafael: Cálculo Diferencial
(9, 87.0, 86.0, 88.0, 87.0),   -- Rafael: Programación OOP
(10, 79.0, 78.0, 80.0, 79.0),  -- Enrique: Cálculo Diferencial
(11, 84.0, 83.0, 85.0, 84.0),  -- Enrique: Programación OOP
(12, 91.0, 90.0, 92.0, 91.0),  -- Ana: Cálculo Diferencial
(13, 88.0, 87.0, 89.0, 88.0),  -- Ana: Estadística Descriptiva
(14, 86.0, 85.0, 87.0, 86.0),  -- Sofía: Estadística Descriptiva
(15, 92.0, 91.0, 93.0, 92.0),  -- Sofía: Estadística Inferencial
(16, 81.0, 80.0, 82.0, 81.0),  -- Paula: Estadística Descriptiva
(17, 85.0, 84.0, 86.0, 85.0),  -- Lucia: Cálculo Diferencial
(18, 89.0, 88.0, 90.0, 89.0),  -- Lucia: Estadística Descriptiva
(19, 83.0, 82.0, 84.0, 83.0),  -- Gabriela: Estadística Descriptiva
(20, 84.0, 83.0, 85.0, 84.0),  -- María: Desarrollo Web
(21, 90.0, 89.0, 91.0, 90.0),  -- María: Diseño de Experiencia de Usuario
(22, 87.0, 86.0, 88.0, 87.0),  -- Javier: Diseño de Experiencia de Usuario
(23, 88.0, 87.0, 89.0, 88.0),  -- Carla: Diseño de Experiencia de Usuario
(24, 82.0, 81.0, 83.0, 82.0),  -- Hugo: Desarrollo Web
(25, 85.0, 84.0, 86.0, 85.0),  -- Hugo: Diseño de Experiencia de Usuario
(26, 80.0, 79.0, 81.0, 80.0),  -- Marta: Desarrollo Web
(27, 86.0, 85.0, 87.0, 86.0),  -- Marta: Principios del Diseño Gráfico
(28, 91.0, 90.0, 92.0, 91.0);  -- Marta: Diseño Interactivo

-- 7. Insertar Asistencia
-- Datos más realistas de 2025-2026 con múltiples registros por estudiante
INSERT INTO Asistencia (inscripcion_id, fecha, presente) VALUES
-- Semana 1 (Diciembre 1-5, 2025)
(1, '2025-12-01', TRUE),   (1, '2025-12-02', TRUE),   (1, '2025-12-03', TRUE),   (1, '2025-12-04', FALSE),
(2, '2025-12-01', TRUE),   (2, '2025-12-02', TRUE),   (2, '2025-12-03', FALSE),  (2, '2025-12-04', TRUE),
(3, '2025-12-01', TRUE),   (3, '2025-12-02', FALSE),  (3, '2025-12-03', TRUE),   (3, '2025-12-04', TRUE),
(4, '2025-12-01', TRUE),   (4, '2025-12-02', TRUE),   (4, '2025-12-03', TRUE),   (4, '2025-12-04', TRUE),
(5, '2025-12-01', FALSE),  (5, '2025-12-02', TRUE),   (5, '2025-12-03', TRUE),   (5, '2025-12-04', TRUE),
-- Semana 2 (Diciembre 8-12, 2025)
(6, '2025-12-08', TRUE),   (6, '2025-12-09', TRUE),   (6, '2025-12-10', FALSE),  (6, '2025-12-11', TRUE),
(7, '2025-12-08', TRUE),   (7, '2025-12-09', TRUE),   (7, '2025-12-10', TRUE),   (7, '2025-12-11', TRUE),
(8, '2025-12-08', TRUE),   (8, '2025-12-09', FALSE),  (8, '2025-12-10', TRUE),   (8, '2025-12-11', TRUE),
(9, '2025-12-08', FALSE),  (9, '2025-12-09', TRUE),   (9, '2025-12-10', TRUE),   (9, '2025-12-11', TRUE),
(10, '2025-12-08', TRUE),  (10, '2025-12-09', TRUE),  (10, '2025-12-10', TRUE),  (10, '2025-12-11', FALSE),
(11, '2025-12-08', TRUE),  (11, '2025-12-09', TRUE),  (11, '2025-12-10', TRUE),  (11, '2025-12-11', TRUE),
-- Semana 3 (Diciembre 15-19, 2025)
(12, '2025-12-15', TRUE),  (12, '2025-12-16', TRUE),  (12, '2025-12-17', TRUE),  (12, '2025-12-18', TRUE),
(13, '2025-12-15', FALSE), (13, '2025-12-16', TRUE),  (13, '2025-12-17', TRUE),  (13, '2025-12-18', TRUE),
(14, '2025-12-15', TRUE),  (14, '2025-12-16', TRUE),  (14, '2025-12-17', FALSE), (14, '2025-12-18', TRUE),
(15, '2025-12-15', TRUE),  (15, '2025-12-16', TRUE),  (15, '2025-12-17', TRUE),  (15, '2025-12-18', TRUE),
(16, '2025-12-15', TRUE),  (16, '2025-12-16', FALSE), (16, '2025-12-17', TRUE),  (16, '2025-12-18', TRUE),
-- Semana 4 (Diciembre 22-23, 2025)
(20, '2025-12-22', TRUE),  (20, '2025-12-23', TRUE),  (20, '2025-12-24', FALSE),
(21, '2025-12-22', TRUE),  (21, '2025-12-23', TRUE),  (21, '2025-12-24', TRUE),
(22, '2025-12-22', FALSE), (22, '2025-12-23', TRUE),  (22, '2025-12-24', TRUE),
(23, '2025-12-22', TRUE),  (23, '2025-12-23', TRUE),  (23, '2025-12-24', TRUE),
(24, '2025-12-22', TRUE),  (24, '2025-12-23', FALSE), (24, '2025-12-24', TRUE),
(25, '2025-12-22', TRUE),  (25, '2025-12-23', TRUE),  (25, '2025-12-24', TRUE),
-- Semana 5 (Enero 12-16, 2026)
(26, '2026-01-12', TRUE),  (26, '2026-01-13', TRUE),  (26, '2026-01-14', TRUE),  (26, '2026-01-15', FALSE),
(27, '2026-01-12', TRUE),  (27, '2026-01-13', TRUE),  (27, '2026-01-14', FALSE), (27, '2026-01-15', TRUE),
(28, '2026-01-12', TRUE),  (28, '2026-01-13', TRUE),  (28, '2026-01-14', TRUE),  (28, '2026-01-15', TRUE);