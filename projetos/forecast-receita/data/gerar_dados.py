"""Gera histórico de receita fictício com sazonalidade para o modelo SARIMA."""
import pandas as pd
import numpy as np
from pathlib import Path

np.random.seed(42)
DATA_DIR = Path(__file__).parent

# 36 meses de histórico com tendência + sazonalidade
periodos = pd.date_range("2021-01-01", periods=36, freq="MS")
tendencia = np.linspace(80000, 130000, 36)
sazonalidade = 15000 * np.sin(2 * np.pi * np.arange(36) / 12)
ruido = np.random.normal(0, 4000, 36)
receita = np.round(tendencia + sazonalidade + ruido, 2)

df = pd.DataFrame({"data": periodos, "receita": receita})
df.to_excel(DATA_DIR / "historico_receita.xlsx", index=False)
print(f"✅ Gerado: historico_receita.xlsx ({len(df)} meses)")
