document.addEventListener("DOMContentLoaded", () => {
  const eventosContainer = document.getElementById('eventos-container');
  const paginacaoContainer = document.getElementById('paginacao');
  const MAX_EVENTOS = 6;
  const urlParams = new URLSearchParams(window.location.search);
  const paginaAtual = parseInt(urlParams.get('page')) || 1;

  function criarEvento(evento) {
    const dataInicio = new Date(evento.start_date);
    const dataFim = new Date(evento.end_date);

    const options = {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };

    const dataInicioFormatada = new Intl.DateTimeFormat('pt-BR', options).format(dataInicio);
    const dataFimFormatada = new Intl.DateTimeFormat('pt-BR', options).format(dataFim);

    const imagem = evento.image || 'assets/img/placeholder.png';

    const item = document.createElement('div');
    item.className = 'col-lg-4 col-md-6 portfolio-item isotope-item';

    item.innerHTML = `
      <div class="portfolio-content h-100">
        <img src="${imagem}" class="img-fluid" alt="${evento.name}">
        <div class="portfolio-info">
          <p class="post-category">${evento.category_prim?.name || 'Evento'}</p>
          <h4>${evento.name}</h4>
          <p><strong>Início:</strong> ${dataInicioFormatada}<br><strong>Fim:</strong> ${dataFimFormatada}</p>
          <a href="${evento.url}" target="_blank" title="Saiba mais">Saiba mais</a>
        </div>
      </div>
    `;

    return item;
  }

  function criarPlaceholder() {
    const item = document.createElement('div');
    item.className = 'col-lg-4 col-md-6 portfolio-item isotope-item';

    item.innerHTML = `
      <div class="portfolio-content h-100">
        <img src="assets/img/catching-up.png" class="img-fluid" alt="">
        <div class="portfolio-info">
          <p class="post-category"></p>
          <h4><a href="#">Sem evento</a></h4>
          <p></p>
        </div>
      </div>
    `;

    return item;
  }

  function renderPaginacao(pagination) {
    paginacaoContainer.innerHTML = '';

    // Botão Anterior
    const btnAnterior = document.createElement('a');
    btnAnterior.href = pagination.has_prev ? `?page=${pagination.page - 1}` : '#';
    btnAnterior.innerText = 'Anterior';
    btnAnterior.className = 'btn btn-secondary';

    if (!pagination.has_prev) {
      btnAnterior.classList.add('disabled');
      btnAnterior.style.pointerEvents = 'none';
    }

    paginacaoContainer.appendChild(btnAnterior);

    // Página Atual
    const pagina = document.createElement('span');
    pagina.innerText = `Página ${pagination.page}`;
    pagina.className = 'align-self-center';
    paginacaoContainer.appendChild(pagina);

    // Botão Próximo
    const btnProximo = document.createElement('a');
    btnProximo.href = pagination.has_next ? `?page=${pagination.page + 1}` : '#';
    btnProximo.innerText = 'Próximo';
    btnProximo.className = 'btn btn-secondary';

    if (!pagination.has_next) {
      btnProximo.classList.add('disabled');
      btnProximo.style.pointerEvents = 'none';
    }

    paginacaoContainer.appendChild(btnProximo);
  }

  fetch(`/api/getEventos?page=${paginaAtual}&page_size=${MAX_EVENTOS}&field_sort=id&sort=DESC`)
    .then(res => {
      if (!res.ok) throw new Error('Erro na API: ' + res.status);
      return res.json();
    })
    .then(data => {
      const eventos = data.data || [];
      const pagination = data.pagination || {
        page: paginaAtual,
        has_prev: paginaAtual > 1,
        has_next: eventos.length === MAX_EVENTOS
      };
      eventosContainer.innerHTML = '';

      // Cria os cards para os eventos retornados (até MAX_EVENTOS)
      eventos.slice(0, MAX_EVENTOS).forEach(evento => {
        const card = criarEvento(evento);
        eventosContainer.appendChild(card);
      });

      // Se precisar, adiciona placeholders para completar 6 itens
      const faltantes = MAX_EVENTOS - eventos.length;
      for (let i = 0; i < faltantes; i++) {
        eventosContainer.appendChild(criarPlaceholder());
      }

      // Renderiza paginação
      renderPaginacao(pagination);
    })
    .catch(err => {
      console.error(err);
      eventosContainer.innerHTML = '';

      // Em caso de erro, já mostra 6 placeholders
      for (let i = 0; i < MAX_EVENTOS; i++) {
        eventosContainer.appendChild(criarPlaceholder());
      }
    });
});
