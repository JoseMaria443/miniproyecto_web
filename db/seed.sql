-- ==========================================
-- SEED DATA PARA SISTEMA ESCOLAR
-- ==========================================

-- 1. Insertar Estudiantes
INSERT INTO Estudiantes (nombre, correo, programa, anio_inscripcion) VALUES
('Carlos Rodríguez', 'carlos.rod@universidad.edu', 'Ingeniería de Software', 2023),
('Ana Martínez', 'ana.mtz@universidad.edu', 'Ciencias de Datos', 2023),
('Luis Gerardo Pérez', 'luis.perez@universidad.edu', 'Ingeniería de Software', 2022),
('María Fernanda López', 'mafer.lopez@universidad.edu', 'Diseño Digital', 2024),
('Sofía Castro', 'sofia.castro@universidad.edu', 'Ciencias de Datos', 2023),
('Diego Torres', 'diego.torres@universidad.edu', 'Ingeniería de Software', 2022),
('Paula Rivas', 'paula.rivas@universidad.edu', 'Ciencias de Datos', 2024),
('Javier Mora', 'javier.mora@universidad.edu', 'Diseño Digital', 2021),
('Carla Vega', 'carla.vega@universidad.edu', 'Historia del Arte', 2023),
('Rafael Ortiz', 'rafael.ortiz@universidad.edu', 'Ingeniería de Software', 2021),
('Lucia Prado', 'lucia.prado@universidad.edu', 'Ciencias de Datos', 2022),
('Hugo Santos', 'hugo.santos@universidad.edu', 'Diseño Digital', 2023),
('Marta Soler', 'marta.soler@universidad.edu', 'Historia del Arte', 2024),
('Enrique Nunez', 'enrique.nunez@universidad.edu', 'Ingeniería de Software', 2024),
('Gabriela Reyes', 'gabriela.reyes@universidad.edu', 'Ciencias de Datos', 2021);

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
('MAT101', 'Cálculo Diferencial', '8 créditos'),
('PROG202', 'Programación Orientada a Objetos', '10 créditos'),
('BD303', 'Bases de Datos I', '9 créditos'),
('HIS404', 'Historia del Arte', '5 créditos'),
('EST505', 'Estadística Descriptiva', '8 créditos'),
('RED101', 'Redes de Computadoras', '8 créditos'),
('IA201', 'Introducción a la IA', '9 créditos'),
('WEB301', 'Desarrollo Web', '7 créditos'),
('UX102', 'Diseño de Experiencia de Usuario', '6 créditos'),
('ALG210', 'Algoritmos', '9 créditos'),
('BD401', 'Bases de Datos II', '9 créditos'),
('EST510', 'Estadística Inferencial', '8 créditos'),
('ARQ200', 'Arquitectura de Computadoras', '8 créditos'),
('TEC150', 'Tecnologías Emergentes', '6 créditos'),
('HIS410', 'Historia Moderna', '5 créditos');

-- 4. Insertar Grupos
INSERT INTO Grupos (curso_id, maestro_id, periodo) VALUES
(1, 1, '2024-A'), 
(2, 3, '2024-A'), 
(3, 5, '2024-A'), 
(4, 4, '2024-B'), 
(5, 2, '2024-A'),
(6, 6, '2024-B'),
(7, 7, '2024-A'),
(8, 8, '2024-B'),
(9, 9, '2024-A'),
(10, 10, '2024-B'),
(11, 11, '2024-A'),
(12, 12, '2024-B'),
(13, 13, '2024-A'),
(14, 14, '2024-B'),
(15, 15, '2024-A'); 

-- 5. Insertar Inscripciones
-- Relacionamos a los estudiantes con los grupos creados arriba
INSERT INTO Inscripciones (estudiante_id, grupo_id) VALUES
(1, 1), 
(1, 2), 
(2, 2), 
(3, 3), 
(4, 4), 
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15); 

-- 6. Insertar Calificaciones
-- Nota: 'puntiacion_media' se calcula automáticamente, no se incluye en el INSERT
INSERT INTO Calificaciones (inscripcion_id, calificacion, parcial1, parcial2, final) VALUES
(1, 85.0, 80.0, 90.0, 85.0),
(2, 92.0, 95.0, 88.0, 93.0),
(3, 78.5, 70.0, 80.0, 85.5),
(4, 88.0, 90.0, 85.0, 89.0),
(5, 95.0, 100.0, 90.0, 95.0),
(6, 81.0, 80.0, 82.0, 81.0),
(7, 74.0, 70.0, 78.0, 74.0),
(8, 89.0, 92.0, 86.0, 89.0),
(9, 67.0, 60.0, 70.0, 71.0),
(10, 93.0, 96.0, 90.0, 93.0),
(11, 80.0, 82.0, 78.0, 80.0),
(12, 88.0, 90.0, 85.0, 89.0),
(13, 76.0, 74.0, 78.0, 76.0),
(14, 91.0, 94.0, 88.0, 91.0),
(15, 69.0, 65.0, 70.0, 72.0),
(16, 84.0, 80.0, 86.0, 86.0);

-- 7. Insertar Asistencia
INSERT INTO Asistencia (inscripcion_id, fecha, presente) VALUES
(1, '2024-02-01', TRUE),
(2, '2024-02-01', TRUE),
(3, '2024-02-02', FALSE),
(4, '2024-02-02', TRUE),
(5, '2024-02-03', TRUE),
(6, '2024-02-03', FALSE),
(7, '2024-02-04', TRUE),
(8, '2024-02-04', TRUE),
(9, '2024-02-05', FALSE),
(10, '2024-02-05', TRUE),
(11, '2024-02-06', TRUE),
(12, '2024-02-06', FALSE),
(13, '2024-02-07', TRUE),
(14, '2024-02-07', TRUE),
(15, '2024-02-08', FALSE),
(16, '2024-02-08', TRUE);