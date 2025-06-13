// cidades.js
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Carrega o JSON externo
        const response = await fetch('../../contatos_por_cidade.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contatos = await response.json();

        // Adiciona opções ao select
        const cidadeSelect = document.getElementById('cidadeSelect');
        cidadeSelect.innerHTML = '<option value="" selected disabled>Escolha a cidade</option>';

        Object.keys(contatos).forEach(cidade => {
            const option = document.createElement('option');
            option.value = cidade;
            option.textContent = cidade;
            cidadeSelect.appendChild(option);
        });

        // Gerenciar evento de change
        cidadeSelect.addEventListener('change', function () {
            const cidade = this.value;
            const container = document.getElementById('contatosContainer');
            container.innerHTML = '';

            contatos[cidade]?.forEach(contato => {
                const card = document.createElement('a');
                card.className = 'list-group-item list-group-item-action border-1 py-3';
                card.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-1">${contato.nome}: ${contato.telefone}</h5>
                <p>${contato.info}<br>${contato.endereco}</p>
              </div>
            </div>
          `;
                container.appendChild(card);
            });
        });

    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
});