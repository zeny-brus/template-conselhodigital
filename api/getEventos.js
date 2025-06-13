const API_URL = 'https://api.sympla.com.br/public/v1.5.1/events';

export default async function handler(req, res) {
  const S_TOKEN = process.env.SYMPLA_TOKEN;

  if (!S_TOKEN) {
    return res.status(500).json({ error: 'SYMPLA_TOKEN não configurado.' });
  }

  // Pegando parâmetros da URL
  const { page = 1, page_size = 6, field_sort = 'start_date', sort = 'DESC' } = req.query;

  // Monta a URL com parâmetros
  const url = new URL(API_URL);
  url.searchParams.append('published', 'true');
  url.searchParams.append('page_size', page_size);
  url.searchParams.append('page', page);
  url.searchParams.append('field_sort', field_sort);
  url.searchParams.append('sort', sort);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        's_token': S_TOKEN
      }
    });

    if (response.status === 400) {
      return res.status(400).json({ error: 'Requisição mal formatada.' });
    }
    if (response.status === 401) {
      return res.status(401).json({ error: 'Não autorizado. Verifique seu TOKEN.' });
    }
    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao consultar Sympla: ' + error.message });
  }
}
