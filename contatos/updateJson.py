import requests
import json
import os
from dotenv import load_dotenv
from typing import Dict, List, Any, Optional

# Carrega variáveis de ambiente
load_dotenv()

# Constantes
API_URL = "https://api.baserow.io/api/database/rows/table/{}/?user_field_names=true"
AUTH_TOKEN = os.getenv("BASEROW_TOKEN")
HEADERS = {"Authorization": f"Token {AUTH_TOKEN}"}
ID_TABELA_CIDADE = 524305
ID_TABELA_CONTATO = 524536


def get_json(id_tabela):
    """Obtém os dados de uma tabela do Baserow"""

    print(f"Buscando dados da tabela {id_tabela}...")
    try:
        response = requests.get(API_URL.format(id_tabela), headers=HEADERS)
        response.raise_for_status()
        data = response.json().get("results", [])
        print(f"{len(data)} registros encontrados na tabela {id_tabela}.")
        return data
    except requests.RequestException as ex:
        print(f"Erro ao acessar tabela {id_tabela}: {ex}")
        return None


def construir_mapa_cidades(tabela_cidade):
    """Cria dicionário de ID -> nome da cidade"""

    print("Construindo dicionário de cidades...")
    cidades = {
        cidade["cidade_id"]: cidade["cidade_nome"]
        for cidade in tabela_cidade
        if cidade.get("cidade_id") and cidade.get("cidade_nome")
    }
    print(f"{len(cidades)} cidades mapeadas.")
    return cidades


def agrupar_contatos_por_cidade(tabela_contato, cidades):
    """Agrupa os contatos por cidade"""

    print("Agrupando contatos por cidade...")
    resultado = {nome: [] for nome in cidades.values()}
    total_contatos = 0
    for contato in tabela_contato:
        for cidade in contato.get("cidades", []):
            cidade_id = cidade.get("value")
            if cidade_id is None:
                continue
            cidade_nome = cidades.get(int(cidade_id))
            if cidade_nome:
                resultado[cidade_nome].append(
                    {
                        "nome": contato.get("contato_nome", ""),
                        "telefone": contato.get("contato_telefone", ""),
                        "info": contato.get("contato_info", ""),
                        "endereco": contato.get("contato_endereco", ""),
                    }
                )
                total_contatos += 1
    print(f"Total de {total_contatos} contatos agrupados.")
    return resultado


def salvar_json(dados, nome_arquivo):
    """Salva um dicionário como JSON em arquivo"""

    print(f"Salvando dados no arquivo '{nome_arquivo}'...")
    with open(nome_arquivo, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)
    print(f"Arquivo '{nome_arquivo}' salvo com sucesso.")


def main():
    print("Iniciando script de extração de contatos...")
    tabela_cidade = get_json(ID_TABELA_CIDADE)
    tabela_contato = get_json(ID_TABELA_CONTATO)

    if not tabela_cidade or not tabela_contato:
        print("Falha ao obter dados. Encerrando execução.")
        return

    cidades = construir_mapa_cidades(tabela_cidade)
    resultado = agrupar_contatos_por_cidade(tabela_contato, cidades)
    salvar_json(resultado, "public/contatos_por_cidade.json")
    print("Execução finalizada.")


if __name__ == "__main__":
    main()
