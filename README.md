# API Rest - Marketplace

**API criada com a finalidade de simular um sistema de cadastro, listagem, atualização e exclusão de usuarios e produtos de um marketplace.**

##
#####Características das aplicações dessa API

- Usuário
  -   Fazer Login
  -   Cadastrar Usuário
  -   Detalhar Usuário
  -   Editar Usuário

- Produto
  -   Listar produtos
  -   Detalhar produtos
  -   Cadastrar produtos
  -   Editar produtos
  -   Remover produtos
  -   Filtrar produtos por categoria

- Outras aplicações
  - Cada usuário só pode ver e manipular seus próprios dados e seus próprios produtos.
  - A senha de usuário será **criptografada** em todas as aplicações que cadastram ou atualizam um usuário.
  - Um **token** de acesso será gerado quando o login do usuario for realizado.
  - Terá um arquivo chamado `senhaHash.js` na raiz do projeto, onde uma senha de 'autenticação de senha' deve ser implementado.



## **Banco de dados**
Neste projeto possui um arquivo chamado `schema.sql` que deverá obrigatoriamente ser usado na criação do Banco de Dados, para persistir e manipular os dados de usuários e produtos utilizados pela aplicação. No arquivo `schema.sql` você encontrará um script contendo as seguintes tabelas e colunas:  

-   usuarios
    -   id
    -   nome
    -   nome_loja (o nome da loja deste vendedor)
    -   email (campo único)
    -   senha

-   produtos
    -   id
    -   usuario_id
    -   nome
    -   quantidade
    -   categoria
    -   preco
    -   descricao
    -   imagem (campo texto para URL da imagem na web)

 

 **Observação** 
    Qualquer valor monetário será representado em centavos (Ex.: R$ 10,00 reais = 1000).


## Status Codes
Abaixo, está listado os possíveis ***status codes*** esperados como resposta da API:

- 200 (OK) = requisição bem sucedida
- 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
- 401 (Unauthorized) = o usuário não está autenticado (logado)
- 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
- 404 (Not Found) = o servidor não pode encontrar o recurso solicitado



## **Endpoints**

### **Cadastrar usuário**

#### `POST` `/usuario`

Essa rota será utilizada para cadastrar um novo usuario no sistema.

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):
    -   nome
    -   email
    -   senha
    -   nome_loja

  **Resposta**  
    Em caso de **sucesso**, no corpo (body) da resposta aparecerá a mensagem: ``"Usuário cadastrado com sucesso"``.  
    
 Em caso de **falha na validação**, a resposta possuirá ***status code*** e no corpo (body) uma **mensagem** explicando o motivo da falha. 
     

  **Observações:**  
  A senha será criptografada antes de persistir no banco de dados.

#### **Exemplo de requisição**
```javascript
{
    "nome": "Boris",
    "email": "boris@email.com.br",
    "senha": "boris123",
    "nome_loja": "Loja do Gato"
}
```

##

### **Login do usuário**

#### `POST` `/login`

Essa rota permite que o usuario cadastrado realize o login no sistema.

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):  
    -   email
    -   senha

   **Resposta**  
    Em caso de **sucesso**, no corpo (body) da resposta possuirá um objeto com apenas uma propriedade ``token`` que possuirá como valor o token de autenticação gerado.
  
Em caso de **falha na validação**, a resposta possuirá ***status code*** e no corpo (body) uma **mensagem** explicando o motivo da falha.  


#### **Exemplo de requisição**
```javascript
{
    "email": "boris@email.com.br",
    "senha": "boris123"
}
```
##

---

##**OBSERVAÇÃO**
Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, irão exigir o **token de autenticação** do usuário logado, recebendo no header com o formato **Bearer Token**.



### **Sobre as validações do token**

-   A aplicação irá validar se o token foi enviado no header da requisição (Bearer Token).
-   A aplicação irá verificar se o token é válido.
-   A aplicação irá consultar o usuário no banco de dados pelo *id* contido no **token** informado.
---
##
### **Detalhar usuário**

#### `GET` `/usuario`

Essa rota será chamada quando o usuario quiser obter os dados do seu próprio perfil.  
O usuário será identificado através do ID presente no token de autenticação.

-   **Requisição**  
    - Sem parâmetros de rota ou de query.  
    - Não deverá possuir conteúdo no corpo da requisição.  

 **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta possuirá um objeto que representa o ``usuário`` encontrado, com todas as suas propriedades (exceto a senha).  
Em caso de **falha na validação**, a resposta possuirá ***status code*** e no corpo (body) uma **mensagem** explicando o motivo da falha.

#### **Exemplo de requisição**
```javascript
//http://localhost:3000/usuario
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**
```javascript
{
    "id": 1,
    "nome": "Boris",
    "email": "boris@email.com.br",
    "nome_loja": "Loja do Gato"
}
```
##

### **Atualizar usuário**
#### `PUT` `/usuario`

Essa rota será chamada quando o usuário quiser realizar alterações no seu próprio usuário.  
O usuário será identificado através do ID presente no token de autenticação.

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):  
    -   nome
    -   email
    -   senha
    -   nome_loja

**Resposta**  
    Em caso de **sucesso**, aparecerá a mensagem: ``"Usuário atualizado com sucesso"``.  
Em caso de **falha na validação**, a resposta possuirá ***status code*** e no corpo (body) uma **mensagem** explicando o motivo da falha.

  **Observações:**
    -A aplicação irá validar se o novo *e-mail* já existe no banco de dados para outro usuário.
    -Caso já exista o novo e-mail fornecido para outro usuário no banco de dados, a alteração não será permitida (o campo de email é sempre único no banco de dados).
    -A senha será **criptografada** antes de ser salva no banco de dados.
    -Será permitida a atualização de apenas um ou de todos os campos do usuário, menos do campo **id**.

#### **Exemplo de requisição**
```javascript
{
    "nome": "Boris",
    "email": "boris@email.com",
    "senha": "boris321",
    "nome_loja": "Loja do Gato Fofinho"
}
```
##

### **Listar produtos do usuário logado**

#### `GET` `/produtos`

Essa rota será chamada quando o usuario logado quiser listar todos os seus produtos cadastrados.  
Serão retornados **apenas** produtos associados ao usuário logado, que será identificado através do ID presente no token de validação.  

-   **Requisição**  
    - Sem parâmetros de rota ou de query.  
    - Não deverá possuir conteúdo no corpo (body) da requisição.  

  **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta possuirá um array dos objetos (produtos) encontrados.  
Em caso de **falha na validação**, a resposta possuirá ***status code*** e no corpo (body) uma **mensagem** explicando o motivo da falha. 
Caso não haja produtos cadastrados para o usuário logado, aparecerá a mensagem: ``"Produtos não encontrados"``.

**Observaçôes:**
O usuário será identificado através do ID presente no token de validação.



#### **Exemplo de requisição**
```javascript
//http://localhost:3000/produtos
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
[
    {
        "id": 1,
        "usuario_id": 1,
        "nome": "Arranhador",
        "quantidade": 12,
        "categoria": "Brinquedos",
        "preco": 3990,
        "descricao": "Arranhador de corda.",
        "imagem": "https://www.petlove.com.br/gatos",
    },
    {
        "id": 2,
        "usuario_id": 1,
        "nome": "Bebedouro",
        "quantidade": 28,
        "categoria": "Utencilios",
        "preco": 4990,
        "descricao": "Bebedouro automatico.",
        "imagem": "https://www.petlove.com.br/gatos",
    },
]
```

##

#### **Filtrar produtos por categoria**
Neste mesmo endpoint **`GET` `/produtos`** você poderá incluir um parâmetro do tipo query **categoria** para consultar apenas produtos de uma categoria específica.  
Serão retornados **apenas** produtos associados ao usuário logado, que será identificado através do ID presente no token de validação.  

-   **Requisição**  
    - Parâmetro opcional do tipo query **categoria**.  
    - Não deverá possuir conteúdo no corpo (body) da requisição.  

**Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta possuirá um array dos objetos (produtos) encontrados.  
    Em caso de **falha na validação**, a resposta possuirá ***status code*** e no corpo (body) uma **mensagem** explicando o motivo da falha.

**Observações:**
Caso não exista nenhum produto associado ao usuário, aparecerá no corpo(body) da requisição a seguinte mensagem: ``"Produtos não encontrados"``.

#### **Exemplo de requisição**
```javascript
// http://localhost:3000/produtos?categoria=Brinquedos
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
[
    {
        "id": 1,
        "usuario_id": 1,
        "nome": "Arranhador",
        "quantidade": 12,
        "categoria": "Brinquedos",
        "preco": 3990,
        "descricao": "Arranhador de corda.",
        "imagem": "https://www.petlove.com.br/gatos",
    }
]
```


##

### **Detalhar um produto do usuário logado**

#### `GET` `/produtos/:id`

Essa rota será chamada quando o usuario logado quiser obter um dos seus produtos cadastrados.  
Será retornado **apenas** um produto associado ao usuário logado, que será identificado através do ID presente no token de validação.

-   **Requisição**  
    - Deverá ser enviado o ID do produto no parâmetro de rota do endpoint.  
    - O corpo (body) da requisição não deverá possuir nenhum conteúdo.  

 **Resposta**  
    Em caso de **sucesso**, o corpo (body) da resposta possuirá um objeto que representa o produto encontrado, com todas as suas propriedades. 
Em caso de **falha na validação**, a resposta possuirá ***status code*** e no corpo (body) uma **mensagem** explicando o motivo da falha.

 

#### **Exemplo de requisição**
```javascript
//http://localhost:3000/produtos/1
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
{
        "id": 1,
        "usuario_id": 1,
        "nome": "Arranhador",
        "quantidade": 12,
        "categoria": "Brinquedos",
        "preco": 3990,
        "descricao": "Arranhador de corda.",
        "imagem": "https://www.petlove.com.br/gatos",
    }
```

##

### **Cadastrar produto para o usuário logado**

#### `POST` `/produtos`

Essa rota será utilizada para cadastrar um produto associado ao usuário logado.  
Será possível cadastrar **apenas** produtos associados ao próprio usuário logado, que será identificado através do ID presente no token de validação.

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):  
    -   nome
    -   quantidade
    -   categoria
    -   preco
    -   descricao
    -   imagem

**Resposta**  
    Em caso de **sucesso**, no corpo (body) da resposta aparecerá o produto cadastrado com todas as suas características.  
    Em caso de **falha na validação**, a resposta possuirá ***status code*** e no corpo (body) uma **mensagem** explicando o motivo da falha.   

**Observações:**
-Esta aplicação irá validar se a ``quantidade`` do produto é maior que zero. Se não for maior que zero, não será possível cadastrar o produto.   
-O cadastro do produtos será associado ao usuário logado.  

#### **Exemplo de requisição**
```javascript
{
    "nome": "Bolinha",
    "quantidade": 18,
    "categoria": "Brinquedos",
    "preco": 1090,
    "descricao": "Bolinha de brinquedo para gatos",
    "imagem": "https://www.petlove.com.br/gatos"
}
```

##
### **Atualizar produto do usuário logado**

#### `PUT` `/produtos/:id`

Essa rota será chamada quando o usuario logado quiser atualizar um dos seus produtos cadastrados.  
Será possível atualizar **apenas** produtos associados ao próprio usuário logado, que será identificado através do ID presente no token de validação.

-   **Requisição**  
    Deverá ser enviado o ID do produto no parâmetro de rota do endpoint.  
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):  
    -   nome
    -   quantidade
    -   categoria
    -   preco
    -   descricao
    -   imagem

**Resposta**  
    Em caso de **sucesso**, aparecerá no conteúdo do corpo (body) a seguinte mensagem: ``"Produto atualizado com sucesso"``.  
  Em caso de **falha na validação**, a resposta possuirá ***status code*** e no corpo (body) uma **mensagem** explicando o motivo da falha.  

**Observações:**
    O produto só será atualizado se o **id** enviado como parâmetro na rota pertencer à algum produto do usuário logado. 


#### **Exemplo de requisição**
```javascript
// http://localhost:3000/produtos/3
```

```javascript
//Conteúdo no corpo (body) da requisição:
{
    "nome": "Bolinha",
    "quantidade": 18,
    "categoria": "Brinquedos",
    "preco": 1090,
    "descricao": "Bolinha com sino para gatos",
    "imagem": "https://www.petlove.com.br/gatos"
}
```


##
### **Excluir produto do usuário logado**

#### `DELETE` `/produtos/:id`

Essa rota será chamada quando o usuario logado quiser excluir um dos seus produtos cadastrados.  
Será possível excluir **apenas** produtos associados ao próprio usuário logado, que será identificado através do ID presente no token de validação.  

-   **Requisição**  
    - Deverá ser enviado o ID do produto no parâmetro de rota do endpoint.  
    - O corpo (body) da requisição não deverá possuir nenhum conteúdo.  

**Resposta**  
    Em caso de **sucesso**, aparecerá no conteúdo do corpo (body) da resposta a seguinte mensagem: ``"Produto excluído com sucesso"``.  
    Em caso de **falha na validação**, a resposta possuirá ***status code*** e no corpo (body) uma **mensagem** explicando o motivo da falha.  

**Observações:**
Essa aplicação irá validar se existe produto para o **id** enviado como parâmetro na rota e se este produto pertence ao usuário logado. 

#### **Exemplo de requisição**
```javascript
// http://localhost:3000/produtos/3
// Sem conteúdo no corpo (body) da requisição
```

---
##Bibliotecas usadas:

- [express](https://developer.mozilla.org/pt-BR/docs/Learn/Server-side/Express_Nodejs/Introduction)
- [node-postgres](https://node-postgres.com/)
- [knex](https://knexjs.org/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [cors](https://developer.mozilla.org/pt-BR/docs/Glossary/CORS)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [nodemon](https://nodemon.io/)


---

###### tags: `back-end` `nodeJS` `PostgreSQL` `API REST` `marketplace` `javascript`
