const bcrypt = require('bcrypt');
const knex = require('../conexao');

//VALIDAR DADOS:
function camposObrigatorios(campo) {
    if (!campo.nome) {
        return "O campo 'nome' é obrigatório";
    };

    if (!campo.nome_loja) {
        return "O campo 'nome_loja' é obrigatório";
    };

    if (!campo.email) {
        return "O campo 'email' é obrigatório";
    };

    if (!campo.senha) {
        return "O campo 'senha' é obrigatório";
    };
};



//CADASTRAR USUARIO:
async function cadastrarUsuario(req, res) {
    const { nome, email, senha, nome_loja } = req.body;

    const erro = camposObrigatorios(req.body);

    if (erro) {
        res.status(404);
        res.json({
            mensagem: erro
        });
        return;
    };


    try {
        const verificarEmail = await knex('usuarios')
            .where({ email })
            .first();

        if (verificarEmail) {
            return res.status(404).json({
                mensagem: "O email informado já existe"
            });
        };


        const senhaCriptografada = await bcrypt.hash(senha, 10);


        const usuario = await knex('usuarios')
            .insert({ nome, email, senha: senhaCriptografada, nome_loja })
            .returning('*');


        if (usuario.length === 0) {
            return res.status(404).json({
                mensagem: "Não foi possível realizar o cadastro"
            });
        };

        return res.status(200).json("Usuário cadastrado com sucesso");

    } catch (error) {
        return res.status(400).json({
            mensagem: "Não foi possível realizar o cadastro"
        });
    };

};


//DETALHAR USUÁRIO:
async function detalharUsuario(req, res) {
    const { usuario } = req;

    try {
        const detalharUsuario = await knex('usuarios')
            .where({ id: usuario.id }).first();

        if (detalharUsuario.length === 0) {
            return res.status(404).json({
                mensagem: `Não foi possível encontrar o usuário de id '${usuario.id}'`
            });
        };

        const { senha, ...usuarioEncontrado } = detalharUsuario;

        return res.status(200).json(usuarioEncontrado);

    } catch (error) {
        return res.status(400).json({
            mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado."
        });
    };

};


//ATUALIZAR USUARIO:
async function atualizarUsuario(req, res) {
    const { usuario } = req;
    const { nome, email, senha, nome_loja } = req.body;

    const erro = camposObrigatorios(req.body);

    if (erro) {
        res.status(404);
        res.json({
            mensagem: erro
        });
        return;
    };


    try {
        //Verificar se novo email já existe:
        const consultarEmail = await knex('usuarios')
            .where({ email: email });


        if (consultarEmail.length > 0) {
            if (consultarEmail.email !== usuario.email) {
                return res.status(404).json({
                    mensagem: "O email informado já existe"
                });
            };
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);


        //Atualizar o usuário:
        const usuarioAtualizado = await knex('usuarios')
            .update({ nome, email, nome_loja, senha: senhaCriptografada })
            .where({ id: usuario.id });

        if (usuarioAtualizado.length === 0) {
            return res.status(404).json({
                mensagem: `Não foi possível atualizar usuário de id '${usuario.id}'`
            });
        };

        return res.status(200).json("Usuário atualizado com sucesso");

    } catch (error) {
        return res.status(400).json({
            mensagem: `Não foi possível atualizar usuário de id '${usuario.id}'`
        });
    };
};



module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
}