import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Configuração da cena
function configurarCena() {
	return new THREE.Scene();
}

// Configuração da câmera
function configurarCamera() {
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	return camera;
}

// Configuração do renderizador
function configurarRenderizador() {
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x87ceeb, 1);
	document.body.appendChild(renderer.domElement);
	return renderer;
}

// Adiciona luzes à cena
function adicionarLuzes(cena) {
	const ambientLight = new THREE.AmbientLight(0x404040);
	cena.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(100, 100, 100);
	cena.add(directionalLight);
}

// Calcula o ponto absoluto considerando left e top
function calcularPontoAbsoluto(obj, pontoRelativo) {
	return {
		x: obj.left + obj.width / 2 + pontoRelativo.x,
		y: obj.top + obj.height / 2 + pontoRelativo.y,
	};
}

// Cria uma parede 3D a partir dos pontos absolutos calculados
function criarParede3D(
	startPoint,
	endPoint,
	espessura,
	altura = 50,
	cor = 0x8b4513
) {
	const deltaX = endPoint.x - startPoint.x;
	const deltaY = endPoint.y - startPoint.y;
	const comprimento = Math.hypot(deltaX, deltaY); // Mais preciso e legível
	const angulo = Math.atan2(deltaY, deltaX);

	const geometry = new THREE.BoxGeometry(comprimento, altura, espessura);
	const material = new THREE.MeshStandardMaterial({ color: cor });
	const wall = new THREE.Mesh(geometry, material);

	// Define a posição no ponto médio
	const midX = (startPoint.x + endPoint.x) / 2;
	const midY = (startPoint.y + endPoint.y) / 2;
	wall.position.set(midX, altura / 2, midY); // Use midY como Z

	// Rotaciona para alinhar com a direção da linha
	wall.rotation.y = -angulo;


	return wall;
}

// Converte os objetos 2D do JSON em paredes 3D
function converterJsonParaThree(json, cena) {
	json.objects.forEach((obj) => {
		if (obj.type === "line") {
			// Calcula os pontos absolutos considerando left e top
			const startPoint = calcularPontoAbsoluto(obj, { x: obj.x1, y: obj.y1 });
			const endPoint = calcularPontoAbsoluto(obj, { x: obj.x2, y: obj.y2 });
			const strokeWidth = obj.strokeWidth || 1;
			const color = obj.stroke;

			const parede = criarParede3D(
				startPoint,
				endPoint,
				strokeWidth,
				50,
				color
			);
			cena.add(parede);
		} else {
			console.warn(`Tipo de objeto não suportado: ${obj.type}`);
		}
	});
}

// Calcula os limites dos objetos no JSON (em coordenadas absolutas)
function calcularLimites(json) {
	let minX = Infinity,
		maxX = -Infinity;
	let minY = Infinity,
		maxY = -Infinity;

	json.objects.forEach((obj) => {
		if (obj.type === "line") {
			const p1 = calcularPontoAbsoluto(obj, { x: obj.x1, y: obj.y1 });
			const p2 = calcularPontoAbsoluto(obj, { x: obj.x2, y: obj.y2 });
			[p1, p2].forEach((p) => {
				if (p.x < minX) minX = p.x;
				if (p.x > maxX) maxX = p.x;
				if (p.y < minY) minY = p.y;
				if (p.y > maxY) maxY = p.y;
			});
		}
	});

	return { minX, maxX, minY, maxY };
}

// Posiciona a câmera de modo a enquadrar os objetos com uma margem
function posicionarCamera(camera, limites) {
	const { minX, maxX, minY, maxY } = limites;

	// Calcula o centro dos limites
	const centerX = (minX + maxX) / 2;
	const centerY = (minY + maxY) / 2;

	// Calcula a extensão dos limites e adiciona margem
	const largura = maxX - minX;
	const altura = maxY - minY;
	const maiorEixo = Math.max(largura, altura);
	const margem = maiorEixo * 0.3; // 30% de margem

	// Posiciona a câmera: altura proporcional ao maior eixo e distância para enxergar a cena
	camera.position.set(400, maiorEixo, 0);

	// Faz a câmera mirar no centro da cena
	// camera.lookAt(centerX, 0, centerY);
}
// Função para criar um target no centro da cena
function criarTarget() {
	// Cria uma geometria para o target (exemplo: esfera)
	const geometry = new THREE.SphereGeometry(10, 32, 32); // Raio 10, 32 segmentos
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Vermelho
	const target = new THREE.Mesh(geometry, material); // Cria o mesh com a geometria e o material

	target.position.set(400, 50, 300); // Posiciona no centro (pode ser ajustado)
	target.name = "target"; // Nomeia o objeto para fácil identificação

	return target;
}

// Função principal para criar a cena 3D a partir dos dados JSON
function criarCena3D(jsonData) {
	const cena = configurarCena();
	const camera = configurarCamera();
	const renderer = configurarRenderizador();
	const controls = new OrbitControls(camera, renderer.domElement);

	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.enableZoom = true;
	controls.minDistance = 50;
	controls.maxDistance = 1000;
	controls.enablePan = true;
	controls.screenSpacePanning = false;
	controls.maxPolarAngle = Math.PI / 2;
	controls.minPolarAngle = 0;
	controls.target.set(400, 50, 300);

	adicionarLuzes(cena);

	const target = criarTarget();
	cena.add(target); // Adiciona o target à cena

	// Calcula os limites dos objetos e posiciona a câmera
	const limites = calcularLimites(jsonData);
	posicionarCamera(camera, limites);

	converterJsonParaThree(jsonData, cena);

	function animate() {
		requestAnimationFrame(animate);

		// Atualiza os controles da câmera
		controls.update();

		// Renderiza a cena
		renderer.render(cena, camera);

		// Log da posição da câmera
		// console.log(
		// 	`Posição da câmera: x=${camera.position.x}, y=${camera.position.y}, z=${camera.position.z}`
		// );
	}
	animate();

	window.addEventListener("resize", () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}

// Inicializa a cena carregando os dados do localStorage
function inicialize() {
	const jsonRaw = localStorage.getItem("dados3D");
	if (jsonRaw) {
		// Assume que o JSON salvo tem a estrutura: { idUsuario, data, ... } e data é uma string JSON
		try {
			const parsed = JSON.parse(jsonRaw);
			const jsonData = JSON.parse(parsed.data);
			criarCena3D(jsonData);
		} catch (error) {
			console.error("Erro ao processar os dados JSON:", error);
		}
	} else {
		console.warn("Nenhum dado encontrado no localStorage.");
	}
}

inicialize();
