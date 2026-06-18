"""Gera dados fictícios para o projeto de conciliação financeira."""
import pandas as pd
import numpy as np
from pathlib import Path

np.random.seed(42)
DATA_DIR = Path(__file__).parent

# 50 lançamentos base compartilhados
datas  = pd.date_range("2024-01-01", periods=50, freq="D")
valores = np.round(np.random.uniform(100, 10000, 50), 2)
desc   = np.random.choice(["Fornecedor A","Cliente B","Salários","Aluguel","TI","Marketing"], 50)

# Extrato bancário: todos os 50 + 5 extras (só no banco)
extrato = pd.DataFrame({
    "data":      list(datas) + list(pd.date_range("2024-02-20", periods=5, freq="D")),
    "descricao": list(desc)  + ["Taxa Bancária"]*5,
    "valor":     list(valores) + [29.90, 29.90, 29.90, 29.90, 29.90],
})
extrato.to_csv(DATA_DIR / "extrato_banco.csv", sep=";", decimal=",",
               index=False, encoding="utf-8")

# ERP: 50 lançamentos + 3 extras (só no ERP)
erp = pd.DataFrame({
    "data":      list(datas) + list(pd.date_range("2024-02-25", periods=3, freq="D")),
    "descricao": list(desc)  + ["Nota Fiscal Pendente"]*3,
    "valor":     list(valores) + [5000.00, 3200.00, 1800.00],
})
erp.to_excel(DATA_DIR / "lancamentos_erp.xlsx", index=False)

print("✅ Dados gerados: extrato_banco.csv e lancamentos_erp.xlsx")
