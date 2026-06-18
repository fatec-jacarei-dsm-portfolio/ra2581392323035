-- ============================================================
-- Query: Fluxo de Caixa Realizado vs. Projetado
-- Projeto: Dashboard de Performance Financeira
-- Autor: Lucas Marcondes Assis
-- Banco: PostgreSQL
-- ============================================================

SELECT
    TO_CHAR(data_referencia, 'Mon/YYYY')                                        AS periodo,
    EXTRACT(YEAR  FROM data_referencia)::INT                                    AS ano,
    EXTRACT(MONTH FROM data_referencia)::INT                                    AS mes,

    SUM(CASE WHEN tipo='ENTRADA' AND origem='REALIZADO' THEN valor ELSE 0 END)  AS entradas_realizadas,
    SUM(CASE WHEN tipo='SAIDA'   AND origem='REALIZADO' THEN valor ELSE 0 END)  AS saidas_realizadas,
    SUM(CASE WHEN tipo='ENTRADA' AND origem='PROJETADO' THEN valor ELSE 0 END)  AS entradas_projetadas,
    SUM(CASE WHEN tipo='SAIDA'   AND origem='PROJETADO' THEN valor ELSE 0 END)  AS saidas_projetadas,

    SUM(CASE WHEN tipo='ENTRADA' AND origem='REALIZADO' THEN valor ELSE 0 END)
    - SUM(CASE WHEN tipo='SAIDA' AND origem='REALIZADO' THEN valor ELSE 0 END)  AS saldo_realizado,

    SUM(CASE WHEN tipo='ENTRADA' AND origem='PROJETADO' THEN valor ELSE 0 END)
    - SUM(CASE WHEN tipo='SAIDA' AND origem='PROJETADO' THEN valor ELSE 0 END)  AS saldo_projetado,

    (
        SUM(CASE WHEN tipo='ENTRADA' AND origem='REALIZADO' THEN valor ELSE 0 END)
        - SUM(CASE WHEN tipo='SAIDA' AND origem='REALIZADO' THEN valor ELSE 0 END)
    ) - (
        SUM(CASE WHEN tipo='ENTRADA' AND origem='PROJETADO' THEN valor ELSE 0 END)
        - SUM(CASE WHEN tipo='SAIDA' AND origem='PROJETADO' THEN valor ELSE 0 END)
    )                                                                            AS variacao

FROM fluxo_caixa
WHERE data_referencia >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY TO_CHAR(data_referencia, 'Mon/YYYY'), EXTRACT(YEAR FROM data_referencia), EXTRACT(MONTH FROM data_referencia)
ORDER BY ano, mes;
