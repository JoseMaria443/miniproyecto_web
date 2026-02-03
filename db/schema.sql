--limpieza de las tablas--
DROP TABLE IF EXISTS Estudiantes CASCADE;
DROP TABLE IF EXISTS Maestros CASCADE;
DROP TABLE IF EXISTS Cursos CASCADE;
DROP TABLE IF EXISTS Grupos CASCADE;
DROP TABLE IF EXISTS Inscripciones CASCADE;
DROP TABLE IF EXISTS Calificaciones CASCADE;
DROP TABLE IF EXISTS Asistencia CASCADE;


--Estudiantes
CREATE TABLE Estudiantes {
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    programa VARCHAR(100) NOT NULL,
    anio_inscripcion INTEGER NOT NULL
}

--Maestros
CREATE TABLE Maestros {
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL
}

--Cursos
CREATE TABLE Cursos {
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    creditos TEXT
}

--Grupos
CREATE TABLE Grupos {
    id SERIAL PRIMARY KEY,
    curso_id INTEGER NOT NULL REFERENCES Cursos(id) ON DELETE CASCADE,
    maestro_id INTEGER NOT NULL REFERENCES Maestros(id) ON DELETE SET NULL,
    periodo VARCHAR(20) NOT NULL
}

--Inscripciones
CREATE TABLE Inscripciones {
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES Estudiantes(id) ON DELETE CASCADE,
    grupo_id INTEGER NOT NULL REFERENCES Grupos(id) ON DELETE CASCADE,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    UNIQUE(estudiante_id, grupo_id)
}

--Calificaciones
CREATE TABLE Calificaciones {
    id SERIAL PRIMARY KEY,
    inscripcion_id INTEGER NOT NULL REFERENCES Inscripciones(id) ON DELETE CASCADE,
    calificacion DECIMAL(5,2) NOT NULL,
    parcial1 NUMERIC(5,2), DEFAULT 0 CHECK (parcial1 BETWEEN 0 AND 100),
    parcial2 NUMERIC(5,2), DEFAULT 0 CHECK (parcial2 BETWEEN 0 AND 100),
    final NUMERIC(5,2), DEFAULT 0 CHECK (final BETWEEN 0 AND 100)
    puntiacion_media NUMERIC(5,2) GENERATED ALWAYS AS 
    ((parcial1 + parcial2 + final) / 3) STORED
}

--Asistencia
CREATE TABLE Asistencia {
    id SERIAL PRIMARY KEY,
    inscripcion_id INTEGER NOT NULL REFERENCES Inscripciones(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    presente BOOLEAN NOT NULL DEFAULT FALSE 
}

CREATE INDEX idx_perido_grupos ON Grupos(periodo);
CREATE INDEX idx_nomnbre_estudiantes ON Estudiantes(nombre);