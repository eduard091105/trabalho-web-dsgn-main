const formProduto = document.querySelector("#form-produto");
const listaProdutos = document.querySelector("#lista-produtos");
const nomeInput = document.querySelector("#nome");
const precoInput = document.querySelector("#preco");
const quantidadeInput = document.querySelector("#quantidade");
const botaoSubmit = document.querySelector("#botao-submit");
const mensagemErro = document.querySelector("#mensagem-erro");
const mensagemVazia = document.querySelector("#batata-vazia");
const contadorProdutos = document.querySelector("#batata-contador");

let proximoId = 0;
let itemEmEdicao = null;

const produtosIniciais = [
  { nome: "Caderno", preco: 12.5, quantidade: 30 },
  { nome: "Caneta", preco: 2.0, quantidade: 100 },
  { nome: "Mochila", preco: 89.9, quantidade: 8 },
  { nome: "Estojo", preco: 15.0, quantidade: 20 }
];

function formatarProduto(nome, preco, quantidade) {
  return `${nome} - R$ ${Number(preco).toFixed(2)} (${quantidade} un.)`;
}

function atualizarEstadoLista() {
  const totalProdutos = listaProdutos.querySelectorAll(".produto-item").length;
  contadorProdutos.textContent = `Produtos cadastrados: ${totalProdutos}`;
  mensagemVazia.hidden = totalProdutos > 0;
}

function mostrarErro(mensagem) {
  mensagemErro.textContent = mensagem;
  mensagemErro.classList.add("visivel");
}

function limparErro() {
  mensagemErro.textContent = "";
  mensagemErro.classList.remove("visivel");
}

function resetarFormulario() {
  formProduto.reset();
  botaoSubmit.textContent = "Adicionar produto";
  itemEmEdicao = null;
  limparErro();
}

function criarItemProduto(produto) {
  const item = document.createElement("li");
  item.className = "produto-item";
  item.dataset.id = String(produto.id ?? ++proximoId);
  item.dataset.nome = produto.nome;
  item.dataset.preco = String(produto.preco);
  item.dataset.quantidade = String(produto.quantidade);

  const infoProduto = document.createElement("span");
  infoProduto.className = "produto-info";
  infoProduto.textContent = formatarProduto(produto.nome, produto.preco, produto.quantidade);

  const areaBotoes = document.createElement("div");
  areaBotoes.className = "botoes-produto";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.textContent = "Editar";
  botaoEditar.className = "botao-editar";
  botaoEditar.addEventListener("click", () => prepararEdicao(item));

  const botaoRemover = document.createElement("button");
  botaoRemover.type = "button";
  botaoRemover.textContent = "Remover";
  botaoRemover.className = "botao-remover";
  botaoRemover.addEventListener("click", () => removerProduto(item));

  areaBotoes.append(botaoEditar, botaoRemover);
  item.append(infoProduto, areaBotoes);

  return item;
}

function adicionarProdutoNaLista(produto) {
  const item = criarItemProduto(produto);
  listaProdutos.appendChild(item);
  atualizarEstadoLista();
}

function prepararEdicao(item) {
  itemEmEdicao = item;
  nomeInput.value = item.dataset.nome;
  precoInput.value = Number(item.dataset.preco).toFixed(2);
  quantidadeInput.value = item.dataset.quantidade;
  botaoSubmit.textContent = "Salvar alterações";
  limparErro();
  nomeInput.focus();
}

function removerProduto(item) {
  item.remove();

  if (itemEmEdicao === item) {
    resetarFormulario();
  }

  atualizarEstadoLista();
}

formProduto.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nome = nomeInput.value.trim();
  const preco = Number(precoInput.value);
  const quantidade = Number(quantidadeInput.value);

  if (!nome) {
    mostrarErro("Digite o nome do produto.");
    nomeInput.focus();
    return;
  }

  if (!preco || preco < 0) {
    mostrarErro("Digite um preço válido.");
    precoInput.focus();
    return;
  }

  if (!quantidade || quantidade <= 0) {
    mostrarErro("A quantidade deve ser maior que zero.");
    quantidadeInput.focus();
    return;
  }

  limparErro();

  if (itemEmEdicao) {
    itemEmEdicao.dataset.nome = nome;
    itemEmEdicao.dataset.preco = String(preco);
    itemEmEdicao.dataset.quantidade = String(quantidade);
    itemEmEdicao.querySelector(".produto-info").textContent = formatarProduto(nome, preco, quantidade);
    resetarFormulario();
    return;
  }

  const novoProduto = {
    id: ++proximoId,
    nome,
    preco,
    quantidade
  };

  adicionarProdutoNaLista(novoProduto);
  resetarFormulario();
});

produtosIniciais.forEach((produto) => {
  produto.id = ++proximoId;
  adicionarProdutoNaLista(produto);
});

atualizarEstadoLista();
