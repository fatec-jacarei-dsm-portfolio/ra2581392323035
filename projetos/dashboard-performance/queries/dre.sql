-- ============================================================
-- Query: DRE Dinâmica
-- Projeto: Dashboard de Performance Financeira
-- Autor: Lucas Marcondes Assis
-- Banco: PostgreSQL
-- ============================================================

SELECT
    EXTRACT(YEAR  FROM l.data_lancamento)::INT                        AS ano,
    EXTRACT(MONTH FROM l.data_lancamento)::INT                        AS mes,
    TO_CHAR(l.data_lancamento, 'Mon/YYYY')                            AS periodo,

    SUM(CASE WHEN c.tipo = 'RECEITA'    THEN l.valor ELSE 0 END)     AS receita_bruta,
    SUM(CASE WHEN c.tipo = 'DEDUCAO'    THEN l.valor ELSE 0 END)     AS deducoes,

    SUM(CASE WHEN c.tipo = 'RECEITA'    THEN l.valor ELSE 0 END)
    - SUM(CASE WHEN c.tipo = 'DEDUCAO'  THEN l.valor ELSE 0 END)     AS receita_liquida,

    SUM(CASE WHEN c.tipo = 'CMV'        THEN l.valor ELSE 0 END)     AS cmv,

    SUM(CASE WHEN c.tipo = 'RECEITA'    THEN l.valor ELSE 0 END)
    - SUM(CASE WHEN c.tipo = 'DEDUCAO'  THEN l.valor ELSE 0 END)
    - SUM(CASE WHEN c.tipo = 'CMV'      THEN l.valor ELSE 0 END)     AS margem_bruta,

    SUM(CASE WHEN c.tipo = 'DESPESA_OP' THEN l.valor ELSE 0 END)     AS despesas_operacionais,

    SUM(CASE WHEN c.tipo = 'RECEITA'    THEN l.valor ELSE 0 END)
    - SUM(CASE WHEN c.tipo = 'DEDUCAO'  THEN l.valor ELSE 0 END)
    - SUM(CASE WHEN c.tipo = 'CMV'      THEN l.valor ELSE 0 END)
    - SUM(CASE WHEN c.tipo = 'DESPESA_OP' THEN l.valor ELSE 0 END)   AS ebitda

FROM lancamentos l
INNER JOIN categorias c ON c.id = l.id_categoria
WHERE
    l.data_lancamento >= CURRENT_DATE - INTERVAL '12 months'
    AND l.cancelado = FALSE
GROUP BY
    EXTRACT(YEAR  FROM l.data_lancamento),
    EXTRACT(MONTH FROM l.data_lancamento),
    TO_CHAR(l.data_lancamento, 'Mon/YYYY')
ORDER BY ano, mes;
