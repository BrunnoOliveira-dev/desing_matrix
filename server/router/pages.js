const express = require("express");
const path = require("path");
const uuid = require("uuid");

const router = express.Router();

const path_views = path.join(__dirname, "../../client/views");

router.get("/", (req, res) => {
	res.sendFile(path.join(path_views, "Home.html"));
});

router.get("/login", (req, res) => {
	res.sendFile(path.join(path_views, "Login.html"));
});

router.get("/cadastro", (req, res) => {
	res.sendFile(path.join(path_views, "Cadastro.html"));
});

router.get("/perfil", (req, res) => {
	res.sendFile(path.join(path_views, "Perfil.html"));
});

router.get("/projeto", (req, res) => {
	res.sendFile(path.join(path_views, "Projetos.html"));
});


router.get("/criacao", (req, res) => {
  const newUuid = uuid.v4();
  console.log(newUuid); // 123e4567-e89b-12d3-a456-426614174000
  res.redirect(`/criacao/${newUuid}`);
});

router.get("/criacao/:uuid", (req, res) => {
	const uuidBody = req.params.uuid;
	console.log(uuidBody); // 123e4567-e89b-12d3-a456-426614174000
	res.sendFile(path.join(path_views, "Criacao.html"));
});

router.post("/cadastro", async (req, res) => {
	const { userName, email, senha } = req.body;

	try {
		// Verificar se todos os campos foram preenchidos
		if (!userName || !email || !senha) {
			return res
				.status(400)
				.json({ message: "Todos os campos são obrigatórios" });
		}

		// Criar novo usuário no banco de dados
		const novoUsuario = await usuarioController.createUsuario({
			userName,
			email,
			senha,
		});

		// Retornar sucesso
		res.status(201).json({
			message: "Usuário cadastrado com sucesso!",
			usuario: novoUsuario,
		});
	} catch (error) {
		// Retornar erro
		res.status(500).json({
			message: "Erro ao cadastrar usuário",
			error: error.message,
		});
	}
});

module.exports = router;
