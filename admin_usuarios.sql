CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  cedula_identidad VARCHAR(20) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  primer_apellido VARCHAR(50) NOT NULL,
  segundo_apellido VARCHAR(50) NOT NULL,
  fecha_nacimiento DATE NOT NULL
);

INSERT INTO usuarios (cedula_identidad, nombre, primer_apellido, segundo_apellido, fecha_nacimiento)
VALUES ('123456789', 'Juan', 'Pérez', 'Gómez', '1990-01-01'),
('123456788', 'Rodrigo', 'Montaño', 'Rodriguez', '1986-03-13'),
('123456787', 'Jose', 'Montaño', 'Loza', '2001-05-27'),
('123456786', 'Claudia', 'Lizarazu', 'Ojeda', '1983-05-29');
