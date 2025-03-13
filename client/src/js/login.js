const link_api = "http://localhost:3000/api";

document
	.getElementById("formLogin")
	.addEventListener("submit", async function (event) {
		event.preventDefault();

		const user_login = {
			email: document.getElementById("email_input").value.trim(),
			senha: document.getElementById("password_input").value.trim(),
		};

		try {
			const response = await fetch(`${link_api}/cliente/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user_login),
			});

			const data = await response.json();

			if (response.ok) {
				alert("Login realizado com sucesso!");

				localStorage.setItem("token", data.token);
				localStorage.setItem("user", JSON.stringify(data.user));
				window.location.href = "/projeto";
			} else {
				alert("Erro: " + data.message);
			}
		} catch (err) {
			console.log("Erro ao enviar dados:", err);
		}
	});
