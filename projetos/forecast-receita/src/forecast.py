"""
Modelagem de Forecast de Receita — SARIMA
Autor: Lucas Marcondes Assis
Descrição: Treina modelo SARIMA sobre o histórico de receita e projeta
           os próximos 12 meses, exportando resultado em Excel e PNG.
"""

import warnings
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
from pathlib import Path
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error

warnings.filterwarnings("ignore")

BASE_DIR   = Path(__file__).resolve().parent.parent
DATA_DIR   = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

HORIZONTE  = 12
TEST_SIZE  = 6
ORDEM      = (1, 1, 1)
SAZONAL    = (1, 1, 1, 12)


def carregar_historico(path: Path) -> pd.Series:
    df = pd.read_excel(path, parse_dates=["data"])
    df = df.sort_values("data").set_index("data")
    return df["receita"].asfreq("MS")


def treinar_avaliar(serie: pd.Series):
    treino = serie.iloc[:-TEST_SIZE]
    teste  = serie.iloc[-TEST_SIZE:]

    modelo    = SARIMAX(treino, order=ORDEM, seasonal_order=SAZONAL,
                        enforce_stationarity=False, enforce_invertibility=False)
    resultado = modelo.fit(disp=False)
    pred      = resultado.forecast(steps=TEST_SIZE)

    mape = mean_absolute_percentage_error(teste, pred) * 100
    rmse = np.sqrt(mean_squared_error(teste, pred))
    print(f"   MAPE: {mape:.2f}%   |   RMSE: R$ {rmse:,.2f}")
    return resultado, mape, rmse


def gerar_forecast(serie: pd.Series):
    modelo    = SARIMAX(serie, order=ORDEM, seasonal_order=SAZONAL,
                        enforce_stationarity=False, enforce_invertibility=False)
    fit       = modelo.fit(disp=False)
    previsao  = fit.get_forecast(steps=HORIZONTE)
    df_prev   = previsao.summary_frame(alpha=0.05)
    df_prev.index.name = "data"
    return df_prev[["mean", "mean_ci_lower", "mean_ci_upper"]].rename(columns={
        "mean":          "receita_prevista",
        "mean_ci_lower": "limite_inferior",
        "mean_ci_upper": "limite_superior",
    })


def exportar_excel(serie: pd.Series, forecast: pd.DataFrame,
                   mape: float, rmse: float) -> None:
    path = OUTPUT_DIR / "forecast_receita.xlsx"
    with pd.ExcelWriter(path, engine="openpyxl") as w:
        forecast.reset_index().to_excel(w, sheet_name="Projeção",    index=False)
        pd.DataFrame({
            "Métrica": ["MAPE (%)", "RMSE (R$)", "Horizonte (meses)", "Modelo"],
            "Valor":   [f"{mape:.2f}%", f"R$ {rmse:,.2f}", HORIZONTE, "SARIMA"],
        }).to_excel(w, sheet_name="Avaliação",  index=False)
        pd.DataFrame({
            "Parâmetro": ["order (p,d,q)", "seasonal_order (P,D,Q,s)"],
            "Valor":     [str(ORDEM), str(SAZONAL)],
        }).to_excel(w, sheet_name="Parâmetros", index=False)
    print(f"✅ Excel exportado: forecast_receita.xlsx")


def exportar_grafico(serie: pd.Series, forecast: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(12, 5))
    ax.plot(serie.index, serie.values,
            label="Realizado", color="#0d1b2a", linewidth=2)
    ax.plot(forecast.index, forecast["receita_prevista"],
            label="Projeção", color="#c9a84c", linewidth=2, linestyle="--")
    ax.fill_between(forecast.index,
                    forecast["limite_inferior"], forecast["limite_superior"],
                    alpha=0.2, color="#c9a84c", label="IC 95%")
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%b/%Y"))
    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=3))
    plt.xticks(rotation=45)
    ax.set_title("Forecast de Receita — SARIMA", fontsize=14, fontweight="bold")
    ax.set_ylabel("Receita (R$)")
    ax.legend()
    ax.grid(axis="y", linestyle="--", alpha=0.4)
    plt.tight_layout()
    fig.savefig(OUTPUT_DIR / "grafico_forecast.png", dpi=150)
    plt.close()
    print("✅ Gráfico exportado: grafico_forecast.png")


if __name__ == "__main__":
    print("📈 Iniciando modelagem de forecast de receita...")
    serie = carregar_historico(DATA_DIR / "historico_receita.xlsx")
    print(f"   Histórico: {len(serie)} meses "
          f"({serie.index[0].strftime('%b/%Y')} → {serie.index[-1].strftime('%b/%Y')})")

    print("   Treinando e avaliando modelo SARIMA...")
    _, mape, rmse = treinar_avaliar(serie)

    print(f"   Gerando projeção para os próximos {HORIZONTE} meses...")
    forecast = gerar_forecast(serie)

    exportar_excel(serie, forecast, mape, rmse)
    exportar_grafico(serie, forecast)
    print("✅ Concluído!")
