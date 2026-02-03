-- ==========================================
-- SEED DATA PARA SISTEMA ESCOLAR
-- ==========================================

-- 1. Insertar Estudiantes
INSERT INTO Estudiantes (nombre, correo, programa, anio_inscripcion) VALUES
('Carlos Rodríguez', 'carlos.rod@universidad.edu', 'Ingeniería de Software', 2023),
('Ana Martínez', 'ana.mtz@universidad.edu', 'Ciencias de Datos', 2023),
('Luis Gerardo Pérez', 'luis.perez@universidad.edu', 'Ingeniería de Software', 2022),
('María Fernanda López', 'mafer.lopez@universidad.edu', 'Diseño Digital', 2024),
('Sofía Castro', 'sofia.castro@universidad.edu', 'Ciencias de Datos', 2023);

-- 2. Insertar Maestros
INSERT INTO Maestros (nombre, correo) VALUES
('Dr. Roberto Gómez', 'roberto.gomez@profe.edu'),
('Mtra. Elena Jiménez', 'elena.jimenez@profe.edu'),
('Ing. Samuel García', 'samuel.garcia@profe.edu'),
('Dra. Beatriz Solís', 'beatriz.solis@profe.edu'),
('Mtro. Ricardo Luna', 'ricardo.luna@profe.edu');

-- 3. Insertar Cursos
INSERT INTO Cursos (codigo, nombre, creditos) VALUES
('MAT101', 'Cálculo Diferencial', '8 créditos'),
('PROG202', 'Programación Orientada a Objetos', '10 créditos'),
('BD303', 'Bases de Datos I', '9 créditos'),
('HIS404', 'Historia del Arte', '5 créditos'),
('EST505', 'Estadística Descriptiva', '8 créditos');

-- 4. Insertar Grupos
INSERT INTO Grupos (curso_id, maestro_id, periodo) VALUES
(1, 1, '2024-A'), 
(2, 3, '2024-A'), 
(3, 5, '2024-A'), 
(4, 4, '2024-B'), 
(5, 2, '2024-A'); 

-- 5. Insertar Inscripciones
-- Relacionamos a los estudiantes con los grupos creados arriba
INSERT INTO Inscripciones (estudiante_id, grupo_id) VALUES
(1, 1), 
(1, 2), 
(2, 2), 
(3, 3), 
(4, 4), 
(5, 5); 

-- 6. Insertar Calificaciones
-- Nota: 'puntiacion_media' se calcula automáticamente, no se incluye en el INSERT
INSERT INTO Calificaciones (inscripcion_id, calificacion, parcial1, parcial2, final) VALUES
(1, 85.0, 80.0, 90.0, 85.0),
(2, 92.0, 95.0, 88.0, 93.0),
(3, 78.5, 70.0, 80.0, 85.5),
(4, 88.0, 90.0, 85.0, 89.0),
(5, 95.0, 100.0, 90.0, 95.0),
(6, 81.0, 80.0, 82.0, 81.0);

-- 7. Insertar Asistencia
INSERT INTO Asistencia (inscripcion_id, fecha, presente) VALUES
(1, '2024-02-01', TRUE),
(2, '2024-02-01', TRUE),
(3, '2024-02-02', FALSE),
(4, '2024-02-02', TRUE),
(5, '2024-02-03', TRUE),
(6, '2024-02-03', FALSE);