document.addEventListener("DOMContentLoaded", () => {
    const eventosContainerHome = document.querySelector('#eventos .isotope-container');
    const MAX_EVENTOS_HOME = 3;

    function criarCardEvento(evento) {
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
          <h4>Sem evento</h4>
          <p></p>
        </div>
      </div>
    `;

        return item;
    }

    fetch(`/api/getEventos?page=1&page_size=${MAX_EVENTOS_HOME}&field_sort=id&sort=DESC`)
        .then(res => {
            if (!res.ok) throw new Error('Erro na API: ' + res.status);
            return res.json();
        })
        .then(data => {
            const eventos = data.data || [];
            eventosContainerHome.innerHTML = '';

            eventos.forEach(evento => {
                const card = criarCardEvento(evento);
                eventosContainerHome.appendChild(card);
            });

            const faltantes = MAX_EVENTOS_HOME - eventos.length;
            for (let i = 0; i < faltantes; i++) {
                eventosContainerHome.appendChild(criarPlaceholder());
            }
        })
        .catch(err => {
            console.error(err);
            eventosContainerHome.innerHTML = '';
            for (let i = 0; i < MAX_EVENTOS_HOME; i++) {
                eventosContainerHome.appendChild(criarPlaceholder());
            }
        });
});
