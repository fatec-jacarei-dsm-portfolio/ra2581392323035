-- ============================================================
-- Query: Inadimplência por Faixa de Vencimento
-- Projeto: Dashboard de Performance Financeira
-- Autor: Lucas Marcondes Assis
-- Banco: PostgreSQL
-- ============================================================

SELECT
    t.id_titulo,
    t.numero_documento,
    c.nome                                                        AS cliente,
    t.data_vencimento,
    (CURRENT_DATE - t.data_vencimento)::INT                       AS dias_atraso,

    CASE
        WHEN (CURRENT_DATE - t.data_vencimento) BETWEEN 1  AND 30  THEN '01 - 30 dias'
        WHEN (CURRENT_DATE - t.data_vencimento) BETWEEN 31 AND 60  THEN '31 - 60 dias'
        WHEN (CURRENT_DATE - t.data_vencimento) BETWEEN 61 AND 90  THEN '61 - 90 dias'
        WHEN (CURRENT_DATE - t.data_vencimento) > 90               THEN 'Acima de 90 dias'
        ELSE 'No prazo'
    END                                                           AS faixa_atraso,

    t.valor_original,
    COALESCE(t.valor_pago, 0)                                     AS valor_pago,
    (t.valor_original - COALESCE(t.valor_pago, 0))               AS saldo_devedor

FROM titulos_receber t
INNER JOIN clientes c ON c.id = t.id_cliente
WHERE
    t.data_vencimento < CURRENT_DATE
    AND (t.valor_pago IS NULL OR t.valor_pago < t.valor_original)
    AND t.cancelado = FALSE
ORDER BY dias_atraso DESC;
