const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');

async function validarLogin(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            mensagem: "Token não informado"
        });
    };

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, senhaHash);

        const loginVerificado = await knex('usuarios').where({ id }).returning('*');

        if (!loginVerificado) {
            return res.status(404).json("Usuario não encontrado");
        }

        const { senha, ...usuario } = loginVerificado[0];

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(403).json({
            mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado."
        });
    };
};

module.exports = validarLogin;