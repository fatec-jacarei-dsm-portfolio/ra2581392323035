# Modelagem de Forecast de Receita

Modelo preditivo de receita com séries temporais, integrando dados históricos e variáveis macroeconômicas para suporte ao planejamento orçamentário anual.

## 📌 Sobre o projeto

O planejamento orçamentário anual depende de projeções de receita confiáveis. Este projeto utiliza séries temporais (modelo SARIMA) para prever a receita dos próximos 12 meses com base no histórico da empresa, ajustado por variáveis externas como IPCA e taxa Selic.

O resultado é exportado em Excel para uso direto no processo de FP&A.

## 📈 Metodologia

- **Modelo:** SARIMA (p,d,q)(P,D,Q,s) com sazonalidade mensal
- **Variáveis externas:** IPCA acumulado, taxa Selic e PIB trimestral
- **Avaliação:** MAPE (Mean Absolute Percentage Error) e RMSE
- **Horizonte:** Projeção de 12 meses à frente

## 🛠️ Tecnologias utilizadas

- Python 3.11
- pandas
- statsmodels (SARIMA)
- matplotlib
- openpyxl
- requests (coleta de dados do IBGE/BCB via API)

## 📁 Estrutura do projeto

```
forecast-receita/
├── data/
│   └── historico_receita.xlsx   # Série histórica de receita
├── output/
│   ├── forecast_receita.xlsx    # Resultado da projeção
│   └── grafico_forecast.png     # Gráfico realizado vs projetado
├── src/
│   ├── coleta_macroeconomicos.py  # Coleta IPCA e Selic via API
│   └── forecast.py                # Modelo SARIMA e exportação
├── requirements.txt
└── README.md
```

## ▶️ Como executar

1. Clone o repositório:
```bash
git clone https://github.com/lucasmarcondesassis/forecast-receita.git
cd forecast-receita
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Coloque o histórico de receita em `data/historico_receita.xlsx` e execute:
```bash
python src/forecast.py
```

4. Os resultados estarão em `output/`.

## 📊 Exemplo de saída

O modelo gera um arquivo Excel com três abas:
- **Projeção** — valores previstos mês a mês com intervalo de confiança
- **Avaliação** — MAPE e RMSE do modelo no período de teste
- **Parâmetros** — configuração final do modelo SARIMA utilizado

## 👤 Autor

Lucas Marcondes Assis  
[LinkedIn](https://www.linkedin.com/in/lucasmarcondesassis)
