/* ==========================================================
   script.js — funcionalidades do portfólio

   PARTE 1: DADOS   → a lista de projetos (é aqui que você edita).
   PARTE 2: FUNÇÕES → criam os cards, o filtro, o menu e os efeitos.

   Os textos pessoais, habilidades, evolução e objetivos ficam
   direto no index.html. Só os PROJETOS ficam aqui, para você
   adicionar novos sem mexer no HTML.

   Tudo que estiver como [PREENCHER] aparece com fundo amarelo.
   ========================================================== */


/* ==========================================================
   PARTE 1 — DADOS (edite aqui)
   ========================================================== */

// Para adicionar um projeto: copie um bloco { ... }, cole depois dele
// (com vírgula entre os blocos) e troque os textos.
// Em "imagem", coloque o caminho do print, por exemplo: "img/meu-projeto.png".
// Deixe "" (vazio) enquanto não tiver a imagem.
const projetos = [
  {
    nome: "[PREENCHER: nome do repositório]",
    descricao: "[PREENCHER: descrição curta do projeto]",
    tecnologias: ["[PREENCHER: tecnologia]"],
    desenvolvido: "[PREENCHER: o que você desenvolveu]",
    aprendi: "[PREENCHER: o que você aprendeu]",
    github: "https://github.com/[PREENCHER: usuario]/[PREENCHER: repositorio]",
    imagem: ""
  }
  // Modelo para o próximo projeto (tire as barras // e preencha):
  // ,{
  //   nome: "",
  //   descricao: "",
  //   tecnologias: ["", ""],
  //   desenvolvido: "",
  //   aprendi: "",
  //   github: "",
  //   imagem: ""
  // }
];


/* ==========================================================
   PARTE 2 — FUNÇÕES (não precisa editar)
   ========================================================== */

// ----- Funções auxiliares -----

// Cria um elemento HTML, com classe e texto opcionais
function criar(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto) el.textContent = texto;
  return el;
}

// Escreve um texto no elemento e destaca se ainda tem [PREENCHER]
function escrever(el, valor) {
  el.textContent = valor;
  el.classList.toggle("pendente", valor.includes("[PREENCHER"));
}


// ----- Efeito de entrada ao rolar a página -----
// Os cards começam levemente escondidos e aparecem quando entram na tela.
const observadorDeEntrada = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      entrada.target.classList.remove("escondido");
      observadorDeEntrada.unobserve(entrada.target);
    }
  });
}, { threshold: 0.1 });

function revelarAoRolar(elementos) {
  elementos.forEach(function (el) {
    el.classList.add("escondido");
    observadorDeEntrada.observe(el);
  });
}


// ----- Símbolos flutuantes no fundo -----
function criarParticulas() {
  const area = document.getElementById("particulas");
  const simbolos = ["</>", "{ }", "01", ";", "( )", "SQL", "=>", "#"];
  const quantidade = window.innerWidth < 600 ? 8 : 14;

  for (let i = 0; i < quantidade; i++) {
    const p = criar("span", "particula", simbolos[i % simbolos.length]);
    p.style.left = Math.random() * 100 + "%";
    p.style.fontSize = 12 + Math.random() * 16 + "px";
    p.style.animationDuration = 18 + Math.random() * 18 + "s";
    p.style.animationDelay = "-" + Math.random() * 30 + "s";
    area.appendChild(p);
  }
}


// ----- Projetos -----
function criarCartaoProjeto(p) {
  const cartao = criar("article", "projeto");

  // Imagem (ou aviso se ainda não tiver)
  const imagem = criar("div", "projeto-imagem");
  if (p.imagem) {
    const img = criar("img");
    img.src = p.imagem;
    img.alt = "Print do projeto " + p.nome;
    img.loading = "lazy";
    imagem.appendChild(img);
  } else {
    imagem.textContent = "[PREENCHER: print do projeto]";
  }
  cartao.appendChild(imagem);

  const corpo = criar("div", "projeto-corpo");

  const titulo = criar("h3");
  escrever(titulo, p.nome);
  corpo.appendChild(titulo);

  const descricao = criar("p");
  escrever(descricao, p.descricao);
  corpo.appendChild(descricao);

  const tecnologias = criar("ul", "tecnologias");
  p.tecnologias.forEach(function (t) {
    const li = criar("li");
    escrever(li, t);
    tecnologias.appendChild(li);
  });
  corpo.appendChild(tecnologias);

  // Blocos "O que desenvolvi" e "O que aprendi"
  [["O que desenvolvi", p.desenvolvido], ["O que aprendi", p.aprendi]].forEach(function (par) {
    const bloco = criar("div");
    bloco.appendChild(criar("strong", "", par[0]));
    const texto = criar("p");
    escrever(texto, par[1]);
    bloco.appendChild(texto);
    corpo.appendChild(bloco);
  });

  const link = criar("a", "botao botao-secundario", "Ver repositório");
  link.href = p.github;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  corpo.appendChild(link);

  cartao.appendChild(corpo);
  return cartao;
}

// Mostra só os projetos que usam a tecnologia escolhida ("Todos" mostra tudo)
function mostrarProjetos(filtro) {
  const lista = document.getElementById("lista-projetos");
  lista.innerHTML = ""; // também remove o aviso "Carregando projetos..."

  const visiveis = projetos.filter(function (p) {
    return filtro === "Todos" || p.tecnologias.includes(filtro);
  });

  visiveis.forEach(function (p) {
    lista.appendChild(criarCartaoProjeto(p));
  });

  revelarAoRolar(lista.querySelectorAll(".projeto"));
  document.getElementById("projetos-vazio").hidden = visiveis.length > 0;
}

// Cria os botões de filtro a partir das tecnologias dos projetos
function montarFiltros() {
  const area = document.getElementById("filtros");
  const tecnologias = ["Todos"];

  projetos.forEach(function (p) {
    p.tecnologias.forEach(function (t) {
      // Ignora tecnologias ainda não preenchidas e repetidas
      if (!t.startsWith("[") && !tecnologias.includes(t)) tecnologias.push(t);
    });
  });

  // Só faz sentido ter filtros se houver pelo menos uma tecnologia real
  if (tecnologias.length === 1) return;

  tecnologias.forEach(function (t) {
    const botao = criar("button", "filtro", t);
    botao.type = "button";
    if (t === "Todos") botao.classList.add("ativo");

    botao.addEventListener("click", function () {
      area.querySelectorAll(".filtro").forEach(function (b) { b.classList.remove("ativo"); });
      botao.classList.add("ativo");
      mostrarProjetos(t);
    });
    area.appendChild(botao);
  });
}


// ----- Menu: abrir no celular e marcar a seção atual -----
function configurarMenu() {
  const botao = document.getElementById("menu-botao");
  const links = document.getElementById("menu-links");

  botao.addEventListener("click", function () {
    const aberto = links.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", aberto);
  });

  // Fecha o menu ao clicar em um link
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("aberto");
      botao.setAttribute("aria-expanded", "false");
    });
  });

  // Marca no menu a seção que está aparecendo na tela
  const secoes = document.querySelectorAll("main section[id]");
  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        links.querySelectorAll("a").forEach(function (a) {
          a.classList.toggle("ativo", a.getAttribute("href") === "#" + entrada.target.id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  secoes.forEach(function (s) { observador.observe(s); });
}


// ----- Iniciar tudo quando a página carregar -----
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("ano").textContent = new Date().getFullYear();

  criarParticulas();
  montarFiltros();
  mostrarProjetos("Todos");

  // Efeito de entrada nos cards que já estão no HTML
  revelarAoRolar(document.querySelectorAll(".cartao, .habilidades li"));

  configurarMenu();
});