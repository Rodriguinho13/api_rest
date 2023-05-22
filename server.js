const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'admin_usuarios',
  password: 'postgres',
  port: 54321,
});

// Middleware para procesar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Endpoint para crear un usuario
app.post('/usuarios', (req, res) => {
  const { cedula_identidad, nombre, primer_apellido, segundo_apellido, fecha_nacimiento } = req.body;

  const query = 'INSERT INTO usuarios (cedula_identidad, nombre, primer_apellido, segundo_apellido, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [cedula_identidad, nombre, primer_apellido, segundo_apellido, fecha_nacimiento];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error al crear el usuario', error);
      res.status(500).send('Error al crear el usuario');
    } else {
      res.status(201).json(result.rows[0]);
    }
  });
});

// Endpoint para listar todos los usuarios
app.get('/usuarios', (req, res) => {
  pool.query('SELECT * FROM usuarios', (error, result) => {
    if (error) {
      console.error('Error al obtener los usuarios', error);
      res.status(500).send('Error al obtener los usuarios');
    } else {
      res.json(result.rows);
    }
  });
});

// Endpoint para listar un usuario en específico
app.get('/usuarios/:id_usuario', (req, res) => {
  const id_usuario = req.params.id_usuario;

  pool.query('SELECT * FROM usuarios WHERE id = $1', [id_usuario], (error, result) => {
    if (error) {
      console.error('Error al obtener el usuario', error);
      res.status(500).send('Error al obtener el usuario');
    } else if (result.rows.length === 0) {
      res.status(404).send('Usuario no encontrado');
    } else {
      res.json(result.rows[0]);
    }
  });
});

// Endpoint para actualizar los datos de un usuario
app.put('/usuarios/:id_usuario', (req, res) => {
  const id_usuario = req.params.id_usuario;
  const { cedula_identidad, nombre, primer_apellido, segundo_apellido, fecha_nacimiento } = req.body;

  const query = 'UPDATE usuarios SET cedula_identidad = $1, nombre = $2, primer_apellido = $3, segundo_apellido = $4, fecha_nacimiento = $5 WHERE id = $6';
  const values = [cedula_identidad, nombre, primer_apellido, segundo_apellido, fecha_nacimiento, id_usuario];

  pool.query(query, values, (error) => {
    if (error) {
      console.error('Error al actualizar el usuario', error);
      res.status(500).send('Error al actualizar el usuario');
    } else {
      res.sendStatus(200);
    }
  });
});

// Endpoint para eliminar a un usuario
app.delete('/usuarios/:id_usuario', (req, res) => {
  const id_usuario = req.params.id_usuario;

  pool.query('DELETE FROM usuarios WHERE id = $1', [id_usuario], (error) => {
    if (error) {
      console.error('Error al eliminar el usuario', error);
      res.status(500).send('Error al eliminar el usuario');
    } else {
      res.sendStatus(200);
    }
  });
});

// Endpoint para mostrar el promedio de edades de los usuarios
app.get('/usuarios/promedio-edad', (req, res) => {
  pool.query('SELECT AVG(EXTRACT(YEAR FROM age(fecha_nacimiento))) AS promedio_edad FROM usuarios', (error, result) => {
    if (error) {
      console.error('Error al obtener el promedio de edades', error);
      res.status(500).send('Error al obtener el promedio de edades');
    } else {
      const promedio_edad = result.rows[0].promedio_edad || 0;
      res.json({ promedioEdad: parseFloat(promedio_edad).toFixed(1) });
    }
  });
});

// Endpoint para mostrar la versión del API REST
app.get('/estado', (req, res) => {
  const estado = {
    nameSystem: 'api-users',
    version: '0.0.1',
    developer: 'Juan Carlos Condori Machicado',
    email: 'juanc.com@gmail.com',
  };

  res.json(estado);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});