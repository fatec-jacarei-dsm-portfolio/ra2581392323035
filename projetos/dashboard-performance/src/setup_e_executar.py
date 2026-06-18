"""
Dashboard de Performance Financeira — Setup PostgreSQL
Autor: Lucas Marcondes Assis
Descrição: Cria as tabelas, popula com dados fictícios e executa as queries
           de DRE, Inadimplência e Fluxo de Caixa, exportando resultados em Excel.
"""

import psycopg2
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import date, timedelta
import random

# ── Configuração da conexão ───────────────────────────────────────────────────
DB = {
    "host":     "localhost",
    "port":     5432,
    "dbname":   "postgres",
    "user":     "postgres",
    "password": "1234",
}

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)
QUERIES_DIR = Path(__file__).resolve().parent.parent / "queries"


# ── 1. Conexão ────────────────────────────────────────────────────────────────
def conectar():
    try:
        conn = psycopg2.connect(**DB)
        conn.autocommit = True
        print("✅ Conectado ao PostgreSQL")
        return conn
    except Exception as e:
        print(f"❌ Erro ao conectar: {e}")
        print("   Verifique host, porta, usuário e senha no topo deste arquivo.")
        raise


# ── 2. Criação das tabelas ────────────────────────────────────────────────────
SQL_CRIAR_TABELAS = """
DROP TABLE IF EXISTS lancamentos, categorias, titulos_receber, clientes, fluxo_caixa CASCADE;

CREATE TABLE categorias (
    id   SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    tipo VARCHAR(20)   -- RECEITA, DEDUCAO, CMV, DESPESA_OP
);

CREATE TABLE lancamentos (
    id              SERIAL PRIMARY KEY,
    data_lancamento DATE,
    id_categoria    INT REFERENCES categorias(id),
    valor           NUMERIC(12,2),
    cancelado       BOOLEAN DEFAULT FALSE
);

CREATE TABLE clientes (
    id   SERIAL PRIMARY KEY,
    nome VARCHAR(100)
);

CREATE TABLE titulos_receber (
    id_titulo       SERIAL PRIMARY KEY,
    numero_documento VARCHAR(20),
    id_cliente      INT REFERENCES clientes(id),
    data_vencimento DATE,
    valor_original  NUMERIC(12,2),
    valor_pago      NUMERIC(12,2),
    cancelado       BOOLEAN DEFAULT FALSE
);

CREATE TABLE fluxo_caixa (
    id             SERIAL PRIMARY KEY,
    data_referencia DATE,
    tipo           VARCHAR(10),   -- ENTRADA, SAIDA
    origem         VARCHAR(15),   -- REALIZADO, PROJETADO
    valor          NUMERIC(12,2)
);
"""


# ── 3. Dados fictícios ────────────────────────────────────────────────────────
def popular_banco(conn):
    cur = conn.cursor()

    # Categorias
    categorias = [
        ("Vendas de Produtos",  "RECEITA"),
        ("Prestação de Serviços","RECEITA"),
        ("Devoluções",          "DEDUCAO"),
        ("Impostos s/ Receita", "DEDUCAO"),
        ("Custo de Mercadoria", "CMV"),
        ("Salários",            "DESPESA_OP"),
        ("Aluguel",             "DESPESA_OP"),
        ("Marketing",           "DESPESA_OP"),
        ("TI",                  "DESPESA_OP"),
    ]
    cur.executemany("INSERT INTO categorias (nome, tipo) VALUES (%s, %s)", categorias)

    # Lançamentos — 18 meses
    np.random.seed(42)
    random.seed(42)
    inicio = date(2024, 7, 1)
    registros = []
    for m in range(18):
        mes = date(inicio.year + (inicio.month + m - 1) // 12,
                   (inicio.month + m - 1) % 12 + 1, 1)
        # Receitas
        registros += [(mes, 1, round(random.uniform(80000, 150000), 2), False)]
        registros += [(mes, 2, round(random.uniform(20000, 50000),  2), False)]
        # Deduções
        registros += [(mes, 3, round(random.uniform(2000, 8000),    2), False)]
        registros += [(mes, 4, round(random.uniform(5000, 15000),   2), False)]
        # CMV
        registros += [(mes, 5, round(random.uniform(30000, 60000),  2), False)]
        # Despesas
        registros += [(mes, 6, round(random.uniform(15000, 25000),  2), False)]
        registros += [(mes, 7, 5500.00, False)]
        registros += [(mes, 8, round(random.uniform(3000, 8000),    2), False)]
        registros += [(mes, 9, round(random.uniform(2000, 5000),    2), False)]

    cur.executemany(
        "INSERT INTO lancamentos (data_lancamento, id_categoria, valor, cancelado) VALUES (%s,%s,%s,%s)",
        registros
    )

    # Clientes
    nomes = ["Empresa Alpha","Empresa Beta","Empresa Gama","Empresa Delta","Empresa Épsilon"]
    cur.executemany("INSERT INTO clientes (nome) VALUES (%s)", [(n,) for n in nomes])

    # Títulos a receber (inadimplência)
    titulos = []
    hoje = date.today()
    for i in range(30):
        venc = hoje - timedelta(days=random.randint(1, 120))
        pago = round(random.uniform(0, 5000), 2) if random.random() > 0.5 else None
        titulos.append((
            f"NF-{1000+i}", random.randint(1, 5), venc,
            round(random.uniform(1000, 10000), 2), pago, False
        ))
    cur.executemany(
        "INSERT INTO titulos_receber (numero_documento,id_cliente,data_vencimento,valor_original,valor_pago,cancelado) VALUES (%s,%s,%s,%s,%s,%s)",
        titulos
    )

    # Fluxo de caixa
    fluxo = []
    for m in range(6):
        mes = date(2025, 1 + m, 1)
        for tipo, origem, base in [
            ("ENTRADA","REALIZADO", 120000),
            ("SAIDA",  "REALIZADO",  80000),
            ("ENTRADA","PROJETADO", 130000),
            ("SAIDA",  "PROJETADO",  75000),
        ]:
            fluxo.append((mes, tipo, origem, round(base * random.uniform(0.9, 1.1), 2)))
    cur.executemany(
        "INSERT INTO fluxo_caixa (data_referencia,tipo,origem,valor) VALUES (%s,%s,%s,%s)",
        fluxo
    )

    cur.close()
    print("✅ Banco populado com dados fictícios")


# ── 4. Execução das queries e exportação ──────────────────────────────────────
def executar_e_exportar(conn):
    queries = {
        "DRE":          (QUERIES_DIR / "dre.sql").read_text(encoding="utf-8"),
        "Inadimplência":(QUERIES_DIR / "inadimplencia.sql").read_text(encoding="utf-8"),
        "Fluxo de Caixa":(QUERIES_DIR / "fluxo_caixa.sql").read_text(encoding="utf-8"),
    }

    arquivo = OUTPUT_DIR / "dashboard_performance.xlsx"
    with pd.ExcelWriter(arquivo, engine="openpyxl") as writer:
        for nome, sql in queries.items():
            df = pd.read_sql_query(sql, conn)
            df.to_excel(writer, sheet_name=nome, index=False)
            print(f"   📊 {nome}: {len(df)} linhas exportadas")

    print(f"✅ Resultado exportado: {arquivo.name}")


# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("🔄 Iniciando Dashboard de Performance Financeira...")
    conn = conectar()

    print("   Criando tabelas...")
    with conn.cursor() as cur:
        cur.execute(SQL_CRIAR_TABELAS)

    print("   Populando dados fictícios...")
    popular_banco(conn)

    print("   Executando queries e exportando Excel...")
    executar_e_exportar(conn)

    conn.close()
    print("✅ Concluído! Abra output/dashboard_performance.xlsx para visualizar.")
