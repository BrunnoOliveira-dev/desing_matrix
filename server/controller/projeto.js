const Projeto = require('../models/Projeto');

// Endpoint para salvar um projeto
saveProjeto = async (req, res) => {
    try {
        const { idUsuario, data, titulo } = req.body;
        if (!idUsuario || !data) return res.status(400).json({ message: "Dados inválidos" });

        const projeto = await Projeto.create({ idUsuario, data, titulo }); // Use Projeto.create para criar uma nova instância

        res.status(201).json(projeto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Endpoint para carregar um projeto
getProjetoById = async (req, res) => {
    try {
        const projeto = await Projeto.findByPk(req.params.id);
        if (!projeto) return res.status(404).json({ message: "Projeto não encontrado" });
        res.status(200).json(projeto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

getProjetoByIdUser = async (req, res) => {
    try {
        const projeto = await Projeto.findAll({where: {idUsuario: req.params.id}});
        if (!projeto) return res.status(404).json({ message: "Projeto não encontrado" });

        res.status(200).json(projeto);   
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

getAllProjeto = async (req, res) => {
    try {
        const projetos = await Projeto.findAll();
        res.status(200).json(projetos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

projetoExiste = async (req, res) => {
    try {
        const { idUsuario, uuid } = req.body;
        const projeto = await Projeto.findOne({ where: { idUsuario, uuid } });
        res.status(200).json({data: projeto.data, titulo: projeto.titulo});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

updateProjeto = async (req, res) => {
    try {
        const { uuid, idUsuario, data, titulo } = req.body;
        const [updated] = await Projeto.update(
            { data, titulo },
            { where: { uuid, idUsuario } }
        );

        if (!updated) return res.status(404).json({ message: "Projeto não encontrado" });

        const updatedProjeto = await Projeto.findOne({ where: { uuid, idUsuario } });
        res.status(200).json(updatedProjeto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    saveProjeto,
    getProjetoById,
    getAllProjeto,
    getProjetoByIdUser,
    projetoExiste,
    updateProjeto
}