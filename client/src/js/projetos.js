const usuario = JSON.parse(localStorage.getItem("user"));

async function getProjetos() {
	const response = await fetch(
		`http://localhost:3000/api/projeto/${usuario.id}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	const projetos = await response.json();
	let container = document.getElementById("grid-container");

	projetos.forEach((projeto) => {
		const card = document.createElement("div")
        card.className = "card";
        card.addEventListener("click", function () {
		    window.location.href = `http://localhost:3000/criacao/${projeto.uuid}`;
		});
		
		// Cria o canvas de tamanho pequeno
		const canvas = document.createElement("canvas");
		const fixedWidth = 150; // Largura fixa para todos os canvases
		const fixedHeight = 100; // Altura fixa para todos os canvases
		canvas.width = fixedWidth;
		canvas.height = fixedHeight;
		card.appendChild(canvas);

		// Adiciona o card ao container
		container.appendChild(card);

		// Carrega o conteúdo do projeto no canvas
		const fabricCanvas = new fabric.Canvas(canvas);
		fabricCanvas.loadFromJSON(projeto.data, function () {
			// Dimensões originais do canvas
			const originalWidth = 800;
			const originalHeight = 600;

			// Calcula a escala para ajustar ao tamanho fixo
			const scaleX = fixedWidth / originalWidth;
			const scaleY = fixedHeight / originalHeight;
			const scale = Math.min(scaleX, scaleY);

			// Redimensiona todos os objetos no canvas
			fabricCanvas.setWidth(fixedWidth);
			fabricCanvas.setHeight(fixedHeight);
			fabricCanvas.getObjects().forEach((obj) => {
				obj.scaleX *= scale;
				obj.scaleY *= scale;
				obj.left *= scale;
				obj.top *= scale;
				obj.setCoords();
			});

			// Cria o título do projeto
			const titulo = document.createElement("h3");
			titulo.textContent = projeto.titulo;
			card.appendChild(titulo);

			fabricCanvas.renderAll();
		});
	});
}

document.getElementById("plus_a").addEventListener("click", function(event){
    event.preventDefault();

    // const uuid = uuidv4();

    window.location.href = `http://localhost:3000/criacao`;


    
    criarNovoProjeto();
});

// Chama a função para carregar os projetos
getProjetos();