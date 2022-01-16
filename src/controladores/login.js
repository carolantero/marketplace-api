const knex = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');


//Login 
async function loginUsuario(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(404).json({
            mensagem: "O campo 'email' e o campo 'senha' são obrigatórios"
        });
    };


    try {
        const verificarEmail = await knex('usuarios').where({ email }).first();

        if (!verificarEmail) {
            return res.status(404).json({
                mensagem: "Email e/ou senha inválido(s)"
            });
        }

        const usuario = verificarEmail;

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

        if (!senhaVerificada) {
            return res.status(404).json({
                mensagem: "Email e/ou senha inválido(s)"
            });
        };


        const token = jwt.sign({ id: usuario.id }, senhaHash, { expiresIn: '1d' });

        return res.status(200).json({
            token: token
        });

    } catch (error) {
        return res.status(400).json({
            mensagem: "Login não autorizado"
        });
    };

};

module.exports = {
    loginUsuario
};