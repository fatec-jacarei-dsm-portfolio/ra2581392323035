# Dashboard de Performance Financeira

Painel gerencial em Power BI com KPIs financeiros em tempo real, consumindo dados via SQL Server.

## 📌 Sobre o projeto

Projeto desenvolvido para consolidar indicadores financeiros dispersos em diferentes planilhas em um único painel gerencial, acessível pela diretoria em tempo real.

O dashboard conecta diretamente ao banco de dados SQL, elimina o retrabalho de consolidação manual e atualiza os indicadores automaticamente a cada abertura do arquivo.

## 📊 Indicadores presentes

- **DRE Dinâmica** — Receita, Custo, Margem Bruta e EBITDA por período
- **Inadimplência** — % de carteira em atraso por faixa de vencimento
- **Fluxo de Caixa** — Realizado vs. projetado mês a mês
- **KPIs de fechamento** — Ticket médio, volume de transações, crescimento MoM

## 🛠️ Tecnologias utilizadas

- Power BI Desktop
- SQL Server (queries de extração)
- DAX (medidas e colunas calculadas)
- Power Query (transformação e limpeza)

## 📁 Estrutura do projeto

```
dashboard-performance/
├── queries/
│   ├── dre.sql               # Query da DRE
│   ├── inadimplencia.sql     # Query de inadimplência
│   └── fluxo_caixa.sql       # Query de fluxo de caixa
├── prints/
│   └── preview_dashboard.png # Preview do painel
├── README.md
└── dashboard_performance.pbix
```

## ▶️ Como utilizar

1. Clone o repositório
2. Abra o arquivo `dashboard_performance.pbix` no Power BI Desktop
3. Em **Transformar Dados → Configurações da Fonte**, aponte para o seu servidor SQL
4. Atualize as credenciais de acesso
5. Clique em **Atualizar** para carregar os dados

> **Nota:** as queries SQL na pasta `queries/` podem ser executadas diretamente no SQL Server Management Studio para validação.

## 👤 Autor

Lucas Marcondes Assis  
[LinkedIn](https://www.linkedin.com/in/lucasmarcondesassis)
