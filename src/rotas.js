const express = require('express');
const usuarios = require('./controladores/usuarios');
const produtos = require('./controladores/produtos');
const login = require('./controladores/login');
const verificaLogin = require('./filtros/validarUser');

const rotas = express();

// cadastro de usuario
rotas.post('/usuarios', usuarios.cadastrarUsuario);

// login
rotas.post('/login', login.loginUsuario);

// filtro para verificar usuario logado
rotas.use(verificaLogin);

//Usuarios
rotas.get('/usuario', usuarios.detalharUsuario);
rotas.put('/usuario', usuarios.atualizarUsuario);

//Produtos
rotas.get('/produtos', produtos.listarProdutosUsuario);
rotas.get('/produtos/:id', produtos.detalharProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.put('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);


module.exports = rotas;