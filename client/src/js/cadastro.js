const link_api = "http://localhost:3000/api";

document
  .getElementById("formCadastro")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const user = {
      user_name: document.getElementsByName("inputNome")[0].value.trim(),
      email: document.getElementsByName("inputEmail")[0].value.trim(),
      senha: document.getElementsByName("inputPassword")[0].value.trim(),
    };

    try {
      const response = await fetch(`${link_api}/cliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
      } else {
        alert("Erro: " + data.message);
      }
    } catch (err) {
      console.log("Erro ao enviar dados:", err);
    }
  });
