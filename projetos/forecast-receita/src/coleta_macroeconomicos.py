"""
Coleta de Dados Macroeconômicos
Autor: Lucas Marcondes Assis
Descrição: Busca IPCA e taxa Selic via APIs públicas do IBGE e Banco Central.
"""

import requests
import pandas as pd
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "data"
OUTPUT_DIR.mkdir(exist_ok=True)


def coletar_ipca(meses: int = 24) -> pd.DataFrame:
    """Coleta IPCA mensal dos últimos N meses via API do IBGE (SIDRA)."""
    url = f"https://servicodados.ibge.gov.br/api/v3/agregados/1737/periodos/-{meses}/variaveis/2266?localidades=N1[all]"
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()

    data = resp.json()[0]["resultados"][0]["series"][0]["serie"]
    df = pd.DataFrame(list(data.items()), columns=["periodo", "ipca"])
    df["periodo"] = pd.to_datetime(df["periodo"], format="%Y%m")
    df["ipca"] = pd.to_numeric(df["ipca"], errors="coerce")
    return df.sort_values("periodo").reset_index(drop=True)


def coletar_selic(meses: int = 24) -> pd.DataFrame:
    """Coleta taxa Selic mensal via API do Banco Central (SGS série 4390)."""
    url = f"https://api.bcb.gov.br/dados/serie/bcdata.sgs.4390/dados/ultimos/{meses}?formato=json"
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()

    df = pd.DataFrame(resp.json())
    df.columns = ["data", "selic"]
    df["data"]  = pd.to_datetime(df["data"], format="%d/%m/%Y")
    df["selic"] = pd.to_numeric(df["selic"], errors="coerce")
    return df.sort_values("data").reset_index(drop=True)


if __name__ == "__main__":
    print("📡 Coletando dados macroeconômicos...")

    ipca  = coletar_ipca()
    selic = coletar_selic()

    print(f"   IPCA:  {len(ipca)} meses coletados")
    print(f"   Selic: {len(selic)} meses coletados")

    with pd.ExcelWriter(OUTPUT_DIR / "macroeconomicos.xlsx", engine="openpyxl") as writer:
        ipca.to_excel(writer,  sheet_name="IPCA",  index=False)
        selic.to_excel(writer, sheet_name="Selic", index=False)

    print("✅ Dados salvos em data/macroeconomicos.xlsx")
