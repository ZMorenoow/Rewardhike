const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const QRCode = require('qrcode');
const qrCode = require('qrcode');


const app = express();
const port = 5000;

// Configuración de MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rewardhike',
});

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser()); 

app.get('/usuarios', (req, res) => {
  const query = 'SELECT Email, Rol FROM usuarios';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en el servidor:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

app.put('/usuarios/:email', (req, res) => {
  const { email } = req.params;
  const { newRole } = req.body;

  const updateQuery = 'UPDATE usuarios SET Rol = ? WHERE Email = ?';

  db.query(updateQuery, [newRole, email], (err, result) => {
    if (err) {
      console.error('Error al actualizar el rol del usuario:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      if (result.affectedRows === 0) {
        res.status(404).send('Usuario no encontrado');
      } else {
        res.send('Rol actualizado correctamente');
      }
    }
  });
});


db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});


app.delete('/usuarios/:email', (req, res) => {
  const { email } = req.params;


  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send('No autorizado');
  }

  jwt.verify(token, 'secretoJWT', (err, decodedToken) => {
    if (err || decodedToken.rol !== 'admin') {
      return res.status(403).send('No tienes los permisos necesarios');
    }


    if (decodedToken.email === email) {
      return res.status(403).send('No puedes eliminarte a ti mismo');
    }


    const deleteQuery = 'DELETE FROM usuarios WHERE Email = ?';
    db.query(deleteQuery, [email], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error('Error al eliminar el usuario:', deleteErr);
        res.status(500).send('Error interno del servidor');
      } else {
        if (deleteResult.affectedRows === 0) {
          res.status(404).send('Usuario no encontrado');
        } else {
          res.send('Usuario eliminado correctamente');
        }
      }
    });
  });
});



app.post('/register', (req, res) => {
  const { email, contraseña} = req.body;
  const rol = "usuario";


  const checkUserQuery = 'SELECT * FROM usuarios WHERE Email = ?';
  db.query(checkUserQuery, [email], (checkUserErr, checkUserResults) => {
    if (checkUserErr) {
      console.error('Error en el servidor:', checkUserErr);
      res.status(500).send('Error en el servidor');
    } else {
      if (checkUserResults.length > 0) {

        res.status(409).send('El usuario ya existe');
      } else {

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



app.get('/obtener-localidades', (req, res) => {
  const query = 'SELECT * FROM mapviews';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en el servidor:', err);
      res.status(500).json({ success: false, message: 'Error en el servidor' });
    } else {
      res.json(results);
    }
  });
});

app.post('/guardar-cupon-en-localidad', async (req, res) => {
  const { lat, lng, nombre, duracion, detalle } = req.body;

  if (!lat || !lng || !nombre || !duracion || !detalle) {
    return res.status(400).send('Datos incompletos para guardar el cupón en la localidad');
  }

  try {
    // Genera el código QR como una imagen en base64
    const qrCodeDataUrl = await qrCode.toDataURL(`Latitud: ${lat}, Longitud: ${lng}, Nombre: ${nombre}, Detalle: ${detalle}`);
    
    const insertQuery = 'INSERT INTO CuponesEnL (Latitud, Longitud, Nombre, Duracion, Detalle, QrCode) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [lat, lng, nombre, duracion, detalle, qrCodeDataUrl], (err, result) => {
      if (err) {
        console.error('Error al guardar el cupón en la localidad en la base de datos:', err);
        return res.status(500).send('Error interno del servidor');
      }

      // La inserción fue exitosa
      res.json({ success: true, message: 'Cupón guardado exitosamente en la localidad' });
    });
  } catch (error) {
    console.error('Error al guardar el cupón en la localidad:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.delete('/borrar-localidad/:ID', (req, res) => {
  const { ID } = req.params;

  // Aquí deberías realizar la lógica para borrar la localidad en tu base de datos
  // Por ejemplo, podrías ejecutar una consulta DELETE en tu tabla "mapviews"
  const deleteQuery = 'DELETE FROM mapviews WHERE id = ?';
  db.query(deleteQuery, [ID], (err, result) => {
    if (err) {
      console.error('Error al borrar la localidad:', err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor', error: err });
    }

    if (result.affectedRows === 0) {
      // No se encontró ninguna fila con el ID proporcionado
      return res.status(404).json({ success: false, message: 'No se encontró la localidad con el ID proporcionado' });
    }

    // La eliminación fue exitosa
    res.json({ success: true, message: 'Localidad borrada exitosamente' });
  });
});

app.post('/guardar-cupon-en-localidad', async (req, res) => {
  const { lat, lng, nombre, duracion, detalle } = req.body;

  if (!lat || !lng || !nombre || !duracion || !detalle) {
    return res.status(400).send('Datos incompletos para guardar el cupón en la localidad');
  }

  try {
    // Genera el código QR como una imagen en base64
    const qrCodeDataUrl = await qrCode.toDataURL(`Latitud: ${lat}, Longitud: ${lng}, Nombre: ${nombre}, Detalle: ${detalle}`);
    
    const insertQuery = 'INSERT INTO CuponesEnL (Latitud, Longitud, Nombre, Duracion, Detalle, QrCode) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [lat, lng, nombre, duracion, detalle, qrCodeDataUrl], (err, result) => {
      if (err) {
        console.error('Error al guardar el cupón en la localidad en la base de datos:', err);
        return res.status(500).send('Error interno del servidor');
      }

      // La inserción fue exitosa
      res.json({ success: true, message: 'Cupón guardado exitosamente en la localidad' });
    });
  } catch (error) {
    console.error('Error al guardar el cupón en la localidad:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/obtener-cupones', (req, res) => {
  const query = 'SELECT * FROM cuponesenl';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en el servidor:', err);
      res.status(500).json({ success: false, message: 'Error en el servidor' });
    } else {
      res.json(results);
    }
  });
});

app.post('/enviar-cupon/:cuponID', (req, res) => {
  const { cuponID } = req.params;

  // Obtén los datos del cupón de "cuponesenl" usando el ID
  const selectCuponQuery = 'SELECT * FROM cuponesenl WHERE ID = ?';
  db.query(selectCuponQuery, [cuponID], (selectErr, selectResult) => {
    if (selectErr) {
      console.error('Error al obtener el cupón:', selectErr);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }

    // Verifica si se encontró el cupón
    if (selectResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Cupón no encontrado' });
    }

    // Mapea las propiedades al formato de "mapviews"
    const cuponData = selectResult[0];
    const insertQuery = 'INSERT INTO mapviews (Latitud, Longitud, Nombre, Duracion, Detalle, QRData) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [cuponData.Latitud, cuponData.Longitud, cuponData.Nombre, cuponData.Duracion, cuponData.Detalle, cuponData.QrCode], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('Error al insertar el cupón en "mapviews":', insertErr);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }

      // Elimina el cupón de "cuponesenl" después de insertarlo en "mapviews"
      const deleteQuery = 'DELETE FROM cuponesenl WHERE ID = ?';
      db.query(deleteQuery, [cuponID], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error('Error al eliminar el cupón de "cuponesenl":', deleteErr);
          return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }

        // Devuelve una respuesta indicando si la operación fue exitosa
        res.json({ success: true, message: 'Cupón enviado y eliminado correctamente' });
      });
    });
  });
});




app.post('/logout', (req, res) => {

  res.clearCookie('jwt', { httpOnly: true });



  res.status(200).send('Sesión cerrada exitosamente');
});

app.listen(port, () => {
  console.log(`Servidor backend en http://localhost:${port}`);
});
