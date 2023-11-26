const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

// Configuración de MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rewardhike',
});

// Conexión a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173',  // Reemplaza con la URL de tu aplicación React
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


// Ruta de registro
app.post('/register', (req, res) => {
  const { email, contraseña} = req.body;
  const rol = "usuario";

  // Verificar si el usuario ya existe
  const checkUserQuery = 'SELECT * FROM usuarios WHERE Email = ?';
  db.query(checkUserQuery, [email], (checkUserErr, checkUserResults) => {
    if (checkUserErr) {
      console.error('Error en el servidor:', checkUserErr);
      res.status(500).send('Error en el servidor');
    } else {
      if (checkUserResults.length > 0) {
        // El usuario ya existe
        res.status(409).send('El usuario ya existe');
      } else {
        // Registrar el nuevo usuario
        const registerQuery = 'INSERT INTO usuarios (Email, Contraseña, Rol) VALUES (?, ?, ?)';
        db.query(registerQuery, [email, contraseña, rol], (registerErr, registerResults) => {
          if (registerErr) {
            console.error('Error en el servidor:', registerErr);
            res.status(500).send('Error en el servidor');
          } else {
            res.status(201).send('Registro exitoso');
          }
        });
      }
    }
  });
});

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
  const { email, contraseña } = req.body;
  const query = 'SELECT * FROM usuarios WHERE Email = ? AND Contraseña = ?';

  db.query(query, [email, contraseña], (err, results) => {
    if (err) {
      console.error('Error en el servidor:', err);
      res.status(500).send('Error en el servidor');
    } else {
      if (results.length > 0) {
        const user = results[0];
        const token = jwt.sign({ email: user.Email, rol: user.Rol }, 'secretoJWT');

        res.cookie('jwt', token, { httpOnly: true });
        res.status(200).json({ token });
      } else {
        res.status(401).send('Credenciales incorrectas');
      }
    }
  });
});

// Ruta de cierre de sesión
app.post('/logout', (req, res) => {
  // Limpiar la cookie del JWT en el cliente
  res.clearCookie('jwt', { httpOnly: true });

  // Puedes realizar otras operaciones de cierre de sesión aquí si es necesario

  // Responder con éxito
  res.status(200).send('Sesión cerrada exitosamente');
});

app.listen(port, () => {
  console.log(`Servidor backend en http://localhost:${port}`);
});
