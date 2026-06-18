# Portfólio — Lucas Marcondes Assis

Repositório institucional com portfólio e projetos desenvolvidos no curso de Desenvolvimento de Software.

## 🌐 Portfólio online

Publicado via GitHub Pages em: `https://lucasmarcondesassis.github.io/portfolio/`

## 📁 Estrutura do repositório

```
portfolio/
├── docs/                               ← Portfólio web (GitHub Pages)
│   ├── index.html
│   ├── css/
│   └── js/
│
└── projetos/
    ├── conciliacao-financeira/         ← Automação Python com dados de exemplo
    ├── dashboard-performance/          ← Queries SQL para Power BI
    └── forecast-receita/               ← Modelo preditivo SARIMA
```

## 🚀 Projetos

### 1. Pipeline de Conciliação Financeira
Compara extrato bancário com lançamentos do ERP e gera relatório Excel de divergências.
→ [`/projetos/conciliacao-financeira`](./projetos/conciliacao-financeira)

```bash
cd projetos/conciliacao-financeira
pip install -r requirements.txt
python src/conciliacao.py
```

### 2. Dashboard de Performance Financeira
Queries SQL prontas para conectar ao Power BI: DRE, inadimplência e fluxo de caixa.
→ [`/projetos/dashboard-performance`](./projetos/dashboard-performance)

### 3. Modelagem de Forecast de Receita
Modelo SARIMA que projeta receita dos próximos 12 meses com IC 95%.
→ [`/projetos/forecast-receita`](./projetos/forecast-receita)

```bash
cd projetos/forecast-receita
pip install -r requirements.txt
python src/forecast.py
```

## 👤 Autor

**Lucas Marcondes Assis**
- LinkedIn: [lucasmarcondesassis](https://www.linkedin.com/in/lucasmarcondesassis)
- E-mail: lucas.assis01@aluno.cps.sp.gov.br
