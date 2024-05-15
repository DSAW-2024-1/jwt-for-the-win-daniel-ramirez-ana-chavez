const express = require("express");
const app = express();
const PORT = 8080;
const jwt = require("jsonwebtoken");
const keys = require("./Settings/Keys");

app.set("key", keys.key);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("IT´S MEEEEEE");
});

app.post("/login", (req, res) => {
  if (req.body.email == "admin@admin.com" && req.body.password == "admin") {
    const payload = {
      check: true,
      //aqui va los datos cifrados en el token
    };
    const token = jwt.sign(payload, app.get("key"), {
      expiresIn: "1h",
    });
    res.json({
      message: "AUTENTICACION EXITOSA!!!",
      token: token,
    });
  } else {
    res.json({
      message: "EMAIL O PASSWORD INCORRECTOS",
    });
  }
});

const verificacion = express.Router();

verificacion.use((req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(401).send({
      error: "Es necesario un token de autenticación",
    });
  }

  if (token.startsWith("Bearer ")) {
    // No se reasigna token, se usa directamente el substring
    const tokenWithoutBearer = token.slice(7);
    jwt.verify(tokenWithoutBearer, app.get("key"), (error, decoded) => {
      if (error) {
        return res.json({
          message: "Token no válido",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    jwt.verify(token, app.get("key"), (error, decoded) => {
      if (error) {
        return res.json({
          message: "Token no válido",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
});

app.get("/profile", verificacion, (req, res) => {
  res.json({
    Name: "Armando",
    Apellido: "Casas",
    Correo: "armanditoC@gmail.com",
    Fecha: "01 de abril de 1900",
  });
});

app.post("/form", verificacion, (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "No hay texto!!" });
  }
  const text = req.body.text;
  res.json("text:" + text);
});

app.get("/contacts", verificacion, (req, res) => {
  res.json([
    {
      id: 1,
      nombre: "Bubba",
      apellido: "McSnuggles",
      correo: "bubbamcsnuggles@example.com",
      fecha_nacimiento: "1985-04-01",
    },
    {
      id: 2,
      nombre: "Felicity",
      apellido: "McFluffernutter",
      correo: "felicitysparkle@example.com",
      fecha_nacimiento: "1990-07-07",
    },
    {
      id: 3,
      nombre: "Haroldo",
      apellido: "Von Schnitzel",
      correo: "haroldopataki@example.com",
      fecha_nacimiento: "1977-12-12",
    },
    {
      id: 4,
      nombre: "Trixie",
      apellido: "Pumpernickel",
      correo: "trixiebubble@example.com",
      fecha_nacimiento: "1988-03-09",
    },
    {
      id: 5,
      nombre: "Buford T.",
      apellido: "McGiggles",
      correo: "bufordcornbread@example.com",
      fecha_nacimiento: "1982-05-15",
    },
  ]);
});

app.listen(PORT, () => console.log(`corriendo http://localhost:${PORT}`));
