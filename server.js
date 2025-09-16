const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// Conexión PostgreSQL
const pool = new Pool({
  user: "squiroz",
  host: "6.tcp.ngrok.io:19721",
  database: "empleadosdb",
  password: "Atinale1",
  port: 5432,
});

// Crear tabla si no existe
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS empleados (
      id SERIAL PRIMARY KEY,
      numero_empleado INT UNIQUE NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      fecha_ingreso DATE NOT NULL,
      estatus VARCHAR(20) NOT NULL,
      fotografia TEXT
    );
  `);
})();

// Endpoint para registrar empleado
app.post("/api/empleados", async (req, res) => {
  try {
    const { numero_empleado, nombre, fecha_ingreso, estatus, fotografia } = req.body;
    await pool.query(
      "INSERT INTO empleados (numero_empleado, nombre, fecha_ingreso, estatus, fotografia) VALUES ($1, $2, $3, $4, $5)",
      [numero_empleado, nombre, fecha_ingreso, estatus, fotografia]
    );
    res.json({ message: "Empleado registrado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar empleado" });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

