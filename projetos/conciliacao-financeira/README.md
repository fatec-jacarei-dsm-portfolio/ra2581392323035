# Pipeline de Conciliação Financeira

Automação do processo de conciliação bancária utilizando Python, eliminando retrabalho manual e reduzindo o tempo de fechamento mensal.

## 📌 Sobre o projeto

Este projeto foi desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) do curso de Desenvolvimento de Software. O problema central era o processo manual de conciliação bancária, que consumia horas de trabalho repetitivo e estava sujeito a erros humanos.

A solução automatiza a leitura de extratos bancários (CSV/XLSX), compara com os lançamentos do ERP e gera um relatório de divergências pronto para revisão.

## 🚀 Funcionalidades

- Leitura automática de extratos bancários em `.csv` e `.xlsx`
- Comparação com lançamentos exportados do ERP
- Identificação e classificação de divergências
- Geração de relatório final em Excel com formatação

## 🛠️ Tecnologias utilizadas

- Python 3.11
- Pandas
- openpyxl
- os / pathlib

## 📁 Estrutura do projeto

```
conciliacao-financeira/
├── data/
│   ├── extrato_banco.csv        # Exemplo de extrato bancário
│   └── lancamentos_erp.xlsx     # Exemplo de exportação do ERP
├── output/
│   └── relatorio_divergencias.xlsx
├── src/
│   └── conciliacao.py           # Script principal
├── requirements.txt
└── README.md
```

## ▶️ Como executar

1. Clone o repositório:
```bash
git clone https://github.com/lucasmarcondesassis/conciliacao-financeira.git
cd conciliacao-financeira
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Coloque seus arquivos na pasta `data/` e execute:
```bash
python src/conciliacao.py
```

4. O relatório será gerado em `output/relatorio_divergencias.xlsx`.

## 👤 Autor

Lucas Marcondes Assis  
[LinkedIn](https://www.linkedin.com/in/lucasmarcondesassis)
