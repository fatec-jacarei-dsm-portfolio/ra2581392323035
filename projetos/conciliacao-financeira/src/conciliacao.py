"""
Pipeline de Conciliação Financeira
Autor: Lucas Marcondes Assis
Descrição: Automatiza a comparação entre extrato bancário e lançamentos do ERP,
           gerando um relatório de divergências em Excel.
"""

import pandas as pd
from pathlib import Path
from datetime import datetime

BASE_DIR   = Path(__file__).resolve().parent.parent
DATA_DIR   = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)


def carregar_extrato(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path, sep=";", decimal=",", encoding="utf-8")
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    df["data"]  = pd.to_datetime(df["data"], format="mixed", dayfirst=True)
    df["valor"] = pd.to_numeric(df["valor"], errors="coerce")
    return df


def carregar_erp(path: Path) -> pd.DataFrame:
    df = pd.read_excel(path)
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    df["data"]  = pd.to_datetime(df["data"], format="mixed", dayfirst=True)
    df["valor"] = pd.to_numeric(df["valor"], errors="coerce")
    return df


def conciliar(extrato: pd.DataFrame, erp: pd.DataFrame) -> dict:
    chave  = ["data", "valor"]
    merged = pd.merge(
        extrato.assign(fonte_banco=True),
        erp.assign(fonte_erp=True),
        on=chave, how="outer", indicator=True
    )
    return {
        "conciliados":  merged[merged["_merge"] == "both"].copy(),
        "so_no_banco":  merged[merged["_merge"] == "left_only"].copy(),
        "so_no_erp":    merged[merged["_merge"] == "right_only"].copy(),
    }


def gerar_relatorio(resultado: dict, output_path: Path) -> None:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    arquivo   = output_path / f"relatorio_divergencias_{timestamp}.xlsx"

    resumo = pd.DataFrame({
        "Categoria":     ["Conciliados", "Só no Banco", "Só no ERP"],
        "Qtd Registros": [len(resultado["conciliados"]),
                          len(resultado["so_no_banco"]),
                          len(resultado["so_no_erp"])],
        "Valor Total (R$)": [resultado["conciliados"]["valor"].sum(),
                              resultado["so_no_banco"]["valor"].sum(),
                              resultado["so_no_erp"]["valor"].sum()],
    })

    with pd.ExcelWriter(arquivo, engine="openpyxl") as writer:
        resumo.to_excel(writer,                              sheet_name="Resumo",      index=False)
        resultado["conciliados"].to_excel(writer,            sheet_name="Conciliados", index=False)
        resultado["so_no_banco"].to_excel(writer,            sheet_name="Só no Banco", index=False)
        resultado["so_no_erp"].to_excel(writer,              sheet_name="Só no ERP",   index=False)

    print(f"✅ Relatório gerado: {arquivo.name}")


if __name__ == "__main__":
    print("🔄 Iniciando conciliação financeira...")

    extrato = carregar_extrato(DATA_DIR / "extrato_banco.csv")
    erp     = carregar_erp(DATA_DIR / "lancamentos_erp.xlsx")

    print(f"   Extrato bancário : {len(extrato)} registros")
    print(f"   Lançamentos ERP  : {len(erp)} registros")

    resultado = conciliar(extrato, erp)

    print(f"   ✔ Conciliados    : {len(resultado['conciliados'])}")
    print(f"   ⚠ Só no banco   : {len(resultado['so_no_banco'])}")
    print(f"   ⚠ Só no ERP     : {len(resultado['so_no_erp'])}")

    gerar_relatorio(resultado, OUTPUT_DIR)
