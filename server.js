//import mysql from mysql
import { Response, Request } from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Dados de exemplo (substitua por um banco de dados real)
const usuarios = [
  {
    username: "usuario",
    password: "$2b$10$OCUqXeh5N370wQx1V86L6.5e9l52Kk4m/Yp5iY/F/8e9B/VlT03m", // Senha "senha" criptografada
    telefone: "+5511999999999", // Exemplo de telefone
  },
];

app.get("/", (response, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validação de dados com regex
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
  const passwordRegex = /^.{8,}$/;
  const telefoneRegex =
    /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i;

  if (!usernameRegex.test(username) || !passwordRegex.test(password)) {
    return res.send("Nome de usuário ou senha inválidos.");
  }

  // Validação do telefone (caso tiver um campo de telefone)
  const telefone = req.body.telefone; // Assumindo que o campo se chama telefone
  if (telefone && !telefoneRegex.test(telefone)) {
    return res.send("Telefone inválido.");
  }

  const usuario = usuarios.find((u) => u.username === username);

  if (usuario && (await bcrypt.compare(password, usuario.password))) {
    res.send("Login bem-sucedido!");
  } else {
    res.send("Nome de usuário ou senha incorretos.");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
