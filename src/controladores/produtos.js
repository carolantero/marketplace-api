const knex = require('../conexao');


function validarDados(campo) {
    if (!campo.nome) {
        return "O campo 'nome' é obrigatório";
    };

    if (!campo.quantidade) {
        return "O campo 'quantidade' é obrigatório";
    };

    if (!campo.preco) {
        return "O campo 'preco' é obrigatório";
    };

    if (!campo.descricao) {
        return "O campo 'descricao' é obrigatório";
    };
};



async function listarProdutosUsuario(req, res) {
    const { usuario } = req;
    const { categoria } = req.query;

    if (categoria) {
        try {
            const produtos = await knex('produtos')
                .where('usuario_id', usuario.id)
                .andWhere({ categoria });

            if (produtos.length === 0) {
                return res.status(404).json({
                    mensagem: "Produtos não encontrados"
                });
            };

            return res.status(200).json(produtos);
        } catch (error) {
            return res.status(401).json({
                mensagem: "Não foi possível acessar os produtos"
            });
        };

    };


    try {
        const produtos = await knex('produtos')
            .where('usuario_id', usuario.id);

        if (!produtos) {
            return res.status(404).json({
                mensagem: "Produtos não encontrados"
            });
        };

        return res.status(200).json(produtos);

    } catch (error) {
        return res.status(401).json({
            mensagem: `Não foi possível acessar os produtos para o usuário de id '${usuario.id}'`
        });
    };

};




//Detalhar produto
async function detalharProduto(req, res) {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const validarProduto = await knex('produtos')
            .where({ id });


        if (validarProduto.length === 0) {
            return res.status(401).json({
                mensagem: `Não existe produto com o id '${id}'`
            });
        };


        const produto = await knex('produtos')
            .where('usuario_id', usuario.id)
            .andWhere({ id })
            .first();


        if (!produto) {
            return res.status(401).json({
                mensagem: "O usuário logado não tem permissão para acessar este produto"
            });
        };

        return res.status(200).json(produto);

    } catch (error) {
        return res.status(400).json({
            mensagem: `Não foi possível acessar o produto de id '${id}'`
        });
    };

};


//Cadastrar produto
async function cadastrarProduto(req, res) {
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const { usuario } = req;
    const erro = validarDados(req.body);

    if (erro) {
        res.status(404);
        res.json({
            mensagem: erro
        });
        return;
    };


    if (!categoria) {
        return res.status(404).json({
            mensagem: "O campo 'categoria' é obrigatório"
        });
    };


    if (!imagem) {
        return res.status(404).json({
            mensagem: "O campo 'imagem' é obrigatório"
        });
    };

    if (quantidade <= 0) {
        return res.status(404).json({
            mensagem: "O campo 'quantidade' deve ser maior que 0"
        });
    };


    try {
        const produto = await knex('produtos')
            .insert({ nome, quantidade, preco, categoria, descricao, imagem, usuario_id: usuario.id })
            .returning('*');

        if (produto.length === 0) {
            return res.status(404).json({
                mensagem: "Não foi possível realizar o cadastro do produto"
            });
        };

        return res.status(200).json(produto);

    } catch (error) {
        return res.status(400).json({
            mensagem: "Não foi possível realizar o cadastro do produto"
        });
    };

};


//Atualizar produto:
async function atualizarProduto(req, res) {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const erro = validarDados(req.body);

    if (erro) {
        res.status(404);
        res.json({
            mensagem: erro
        });
        return;
    };



    try {
        const validarProduto = await knex('produtos').where({ id });

        if (validarProduto.length === 0) {
            return res.status(401).json({
                mensagem: `Não existe produto com o id '${id}'`
            });
        };


        const produto = await knex('produtos')
            .where('usuario_id', usuario.id)
            .andWhere({ id })
            .first();

        if (!produto) {
            return res.status(401).json({
                mensagem: "O usuário logado não tem permissão para atualizar este produto"
            });
        };



        const produtoAtualizado = await knex('produtos')
            .update({ nome, quantidade, preco, categoria, descricao, imagem })
            .where({ id })
            .andWhere('usuario_id', usuario.id);


        if (!produtoAtualizado) {
            return res.status(404).json({
                mensagem: `Não foi possível atualizar o produto de id '${id}'`
            });
        };

        return res.status(200).json("Produto atualizado com sucesso");

    } catch (error) {
        return res.status(401).json({
            mensagem: `Não foi possível atualizar o produto de id '${id}'`
        });
    };

};


//Excluir produto
async function excluirProduto(req, res) {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const validarProduto = await knex('produtos').where({ id });

        if (validarProduto.length === 0) {
            return res.status(401).json({
                mensagem: `Não existe produto com o id '${id}'`
            });
        };



        const produto = await knex('produtos')
            .where('usuario_id', usuario.id)
            .andWhere({ id })
            .first();

        if (!produto) {
            return res.status(404).json({
                mensagem: `Usuário não tem permissão para excluir o produto de id '${id}'`
            });
        };



        const excluirProduto = await knex('produtos')
            .delete()
            .where({ id })
            .andWhere('usuario_id', usuario.id);

        if (!excluirProduto) {
            return res.status(404).json({
                mensagem: `Não foi possível excluir o produto de id '${id}'`
            });
        };

        return res.status(200).json({
            mensagem: "Produto excluído com sucesso"
        });

    } catch (error) {
        return res.status(401).json({
            mensagem: `Não foi possível excluir o produto de id '${id}'`
        });
    };
};



module.exports = {
    listarProdutosUsuario,
    detalharProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
};

