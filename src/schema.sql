create database if not exists marketplace;


create table if not exists usuarios(
    id serial primary key,
    nome text not null,
    nome_loja text not null,
    email text not null unique,
    senha text not null
);

create table if not exists produtos(
    id serial primary key,
    usuario_id integer not null references usuarios(id),
    nome text not null,
    quantidade integer not null,
    categoria text not null,
    preco integer not null,
    descricao text not null,
    imagem text not null
);