const canvas = new fabric.Canvas("planta");
let modoDesenho = false;
let drawingObject = null; // Objeto que está sendo desenhado
let startPoint = null;
let gridAtivo = false;
let wallEspessura = parseInt(document.getElementById("espessura").value);
let wallCor = document.getElementById("corParede").value;
let clipboard = null;
let undoStack = [];
let redoStack = [];
let idUsuario = JSON.parse(localStorage.getItem("user")).id;
let TITULO = "";

// Obter o UUID da URL
const uuid = window.location.pathname.split("/").pop();

async function verificarUUID() {
    try {
        const response = await fetch(
            `http://localhost:3000/api/projeto/projetoexiste`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uuid: uuid, idUsuario: idUsuario }),
            }
        );

        if (response.status === 200) {
            const data = await response.json();

            TITULO = data.titulo;

            canvas.loadFromJSON(data.data, function () {
                canvas.renderAll();
                console.log("Projeto carregado com sucesso!");
                // updateThreeScene(); // Atualiza a cena 3D

            });
            alterarCorDeFundo('#f0f0f0'); // Define a cor de fundo como cinza claro
            saveState()
            return true; // Projeto existe
        }
    } catch (error) {
        console.error("Erro ao verificar UUID", error);
    }
    return false; // Projeto não existe
}
verificarUUID();



// Funções para desenhar e limpar a grade
function desenharGrade() {
    const gridSize = 50;
    for (let i = 0; i <= canvas.width / gridSize; i++) {
        canvas.add(
            new fabric.Line([i * gridSize, 0, i * gridSize, canvas.height], {
                stroke: "#ccc",
                selectable: false,
                evented: false,
            })
        );
    }
    for (let i = 0; i <= canvas.height / gridSize; i++) {
        canvas.add(
            new fabric.Line([0, i * gridSize, canvas.width, i * gridSize], {
                stroke: "#ccc",
                selectable: false,
                evented: false,
            })
        );
    }
    // Enviar as linhas para trás
    canvas.getObjects("line").forEach((line) => canvas.sendToBack(line));
}

function limparGrade() {
    const objetos = canvas.getObjects("line");
    objetos.forEach((obj) => {
        if (obj.stroke === "#ccc") {
            canvas.remove(obj);
        }
    });
}

// Alterna a grade
function toggleGrid() {
    gridAtivo = !gridAtivo;
    if (gridAtivo) {
        desenharGrade();
        console.log("Grade ativada");
    } else {
        limparGrade();
        console.log("Grade desativada");
    }
    canvas.renderAll();
}

// Alterna o modo de desenho, altera a cor do botão e desabilita a seleção no canvas
function toggleModoDesenho() {
    modoDesenho = !modoDesenho;
    // Desabilita a seleção de objetos enquanto estiver no modo de desenho
    canvas.selection = !modoDesenho;
    canvas.forEachObject((obj) => {
        obj.selectable = !modoDesenho;
        obj.evented = !modoDesenho;
    });
    // Atualiza o estilo do botão
    const btn = document.getElementById("btnModoDesenho");
    if (modoDesenho) {
        btn.style.backgroundColor = "#4CAF50"; // Verde enquanto ativo
        console.log(
            "Modo de desenho ativado. Clique, arraste e solte para desenhar uma parede."
        );
    } else {
        btn.style.backgroundColor = "";
        console.log("Modo de desenho desativado.");
    }
}

// Atualiza a espessura da parede
function updateEspessura(valor) {
    wallEspessura = parseInt(valor);
}

// Atualiza a cor da parede
function updateCor(valor) {
    wallCor = valor;
}

// Eventos para desenhar parede com clique, arraste e soltura
canvas.on("mouse:down", function (o) {
    if (modoDesenho) {
        startPoint = canvas.getPointer(o.e);
        drawingObject = new fabric.Line(
            [startPoint.x, startPoint.y, startPoint.x, startPoint.y],
            {
                stroke: wallCor,
                strokeWidth: wallEspessura,
                selectable: false,
            }
        );
        canvas.add(drawingObject);
    }
});

canvas.on("mouse:move", function (o) {
    if (!modoDesenho || !drawingObject) return;
    const pointer = canvas.getPointer(o.e);
    drawingObject.set({ x2: pointer.x, y2: pointer.y });
    canvas.renderAll();
});

canvas.on("mouse:up", function () {
    if (modoDesenho && drawingObject) {
        if (
            Math.abs(drawingObject.x2 - drawingObject.x1) < 5 &&
            Math.abs(drawingObject.y2 - drawingObject.y1) < 5
        ) {
            canvas.remove(drawingObject);
            console.log("Parede muito curta, desenhe novamente.", "red");
        } else {
            drawingObject.set({ selectable: true });
            
            // updateThreeScene(); // Atualiza a cena 3D
        }
        drawingObject = null;
        startPoint = null;
        saveState(); // Salva o estado após desenhar uma parede
    }
});

// Função para remover a parede selecionada
function removerParede() {
    const objetosSelecionados = canvas.getActiveObjects();
    if (objetosSelecionados.length > 0) {
        objetosSelecionados.forEach((obj) => {
            canvas.remove(obj);
        });
        canvas.discardActiveObject();
        saveState(); // Salva o estado após remover uma parede
        console.log("Paredes removidas.");
        // updateThreeScene(); // Atualiza a cena 3D
    } else {
        console.log("Selecione uma ou mais paredes para remover.", "red");
    }
}

// Função para criar um novo projeto (limpa o canvas)
function criarNovoProjeto() {
    if (
        confirm(
            "Deseja criar um novo projeto? Todos os dados atuais serão perdidos."
        )
    ) {
        canvas.clear();
        if (gridAtivo) toggleGrid(); // Reaplica a grade, se estiver ativa
        console.log("Novo projeto criado.");
        // updateThreeScene(); // Atualiza a cena 3D
    }
}

// Funções de Undo e Redo
function saveState() {
    const json = JSON.stringify(canvas.toJSON());
    console.log(json);
    if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== json) {
        undoStack.push(json);
        redoStack = []; // Limpa o stack de redo
    }
    console.log(json);
    console.log("aaa");
}

function undo() {
    if (undoStack.length > 1) { // Garante que o estado inicial não seja perdido
        const json = undoStack.pop(); // Remove o último estado do undoStack
        redoStack.push(JSON.stringify(canvas.toJSON())); // Salva o estado atual no redoStack
        canvas.loadFromJSON(json, function () {
            canvas.renderAll();
            console.log("Undo realizado.");
        });
    } else if (undoStack.length === 1) {
        canvas.loadFromJSON(undoStack[0], function () {
            canvas.renderAll();
            console.log("Undo realizado.");
        });
    } else {
        console.log("Nada para desfazer.", "red");
    }
}

function redo() {
    if (redoStack.length > 0) {
        const json = redoStack.pop(); // Remove o último estado do redoStack
        undoStack.push(JSON.stringify(canvas.toJSON())); // Salva o estado atual no undoStack
        canvas.loadFromJSON(json, function () {
            canvas.renderAll();
            console.log("Redo realizado.");
        });
    } else {
        console.log("Nada para refazer.", "red");
    }
}

// Eventos de teclado para Ctrl+Z e Ctrl+Y
document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "z") {
        undo();
    } else if (e.ctrlKey && e.key === "y") {
        redo();
    } else if (e.ctrlKey && e.key === "c") {
        copy();
    } else if (e.ctrlKey && e.key === "v") {
        paste();
    }
});

// Funções de copiar e colar
function copy() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        activeObject.clone(function (cloned) {
            clipboard = cloned;
            console.log("Objeto copiado.");
        });
    } else {
        console.log("Nenhum objeto selecionado para copiar.", "red");
    }
}

function paste() {
    if (clipboard) {
        clipboard.clone(function (clonedObj) {
            canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            if (clonedObj.type === "activeSelection") {
                clonedObj.canvas = canvas;
                clonedObj.forEachObject(function (obj) {
                    canvas.add(obj);
                });
                clonedObj.setCoords();
            } else {
                canvas.add(clonedObj);
            }
            clipboard.top += 10;
            clipboard.left += 10;
            canvas.setActiveObject(clonedObj);
            canvas.requestRenderAll();
            saveState(); // Salva o estado após colar um objeto
            // updateThreeScene(); // Atualiza a cena 3D
            console.log("Objeto colado.");
        });
    } else {
        console.log("Nenhum objeto copiado para colar.", "red");
    }
}

// Evento para salvar o estado antes de modificar um objeto
canvas.on("object:modified", function () {
    saveState();
    // updateThreeScene(); // Atualiza a cena 3D
});

// // Evento para salvar o estado antes de mover um objeto
// canvas.on("object:moved", function () {
//     saveState();
//     // updateThreeScene(); // Atualiza a cena 3D
// });

// seção de salvar projeto

function criarJson(titulo_projeto = TITULO) {
    const data = {
        idUsuario: idUsuario,
        data: JSON.stringify(canvas.toJSON()),
        titulo: titulo_projeto,
        uuid: uuid, // Adiciona o UUID ao JSON
    };
    return data;
}

// Função para salvar o projeto (tenta salvar no servidor, se falhar, usa localStorage)
async function salvarProjeto() {
    const projetoExiste = await verificarUUID();
    if (projetoExiste) {
        atualizarProjeto();
    } else {
        const titulo = window.prompt("Digite um título para o projeto");

        const response = await fetch("http://localhost:3000/api/projeto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(criarJson(titulo)),
        })
            .then((response) => response.json())
            .then(() => {
                console.log("Projeto salvo com sucesso!");
            })
            .catch((error) => {
                console.error(
                    "Erro ao salvar no servidor, salvando localmente.",
                    error
                );
                localStorage.setItem("projetoPlanta", json);
                console.log("Projeto salvo localmente.");
            });
    }
}

async function atualizarProjeto() {
    try {
        const response = await fetch(`http://localhost:3000/api/projeto`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(criarJson()),
        });
        if (response.status === 200) {
            console.log("Projeto atualizado com sucesso!");
        }
    } catch (err) {
        console.error("Erro ao atualizar projeto", err);
    }
}

function converter_para_3d() {
    limparGrade()
    
    const json = JSON.stringify(criarJson())
    localStorage.setItem("dados3D", json);
    window.location.href = "/3d";
}

// Altera a cor de fundo do canvas
function alterarCorDeFundo(cor) {
    canvas.setBackgroundColor(cor, canvas.renderAll.bind(canvas));
}

function voltarParaProjeto() {
    window.location.href = "/projeto";
}