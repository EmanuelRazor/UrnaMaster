<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

$sql = "
    SELECT
        c.numero,
        c.nome,
        COUNT(v.id) AS votos
    FROM candidatos c
    LEFT JOIN votos v
        ON v.candidato_numero = c.numero
       AND v.tipo = 'CANDIDATO'
    GROUP BY c.numero, c.nome
    ORDER BY c.numero
";

$candidatos = $pdo->query($sql)->fetchAll();

$brancos = (int) $pdo->query(
    "SELECT COUNT(*)
     FROM votos
     WHERE tipo = 'BRANCO'"
)->fetchColumn();

$total = (int) $pdo->query(
    'SELECT COUNT(*) FROM votos'
)->fetchColumn();

foreach ($candidatos as &$candidato) {
    $candidato['votos'] = (int) $candidato['votos'];
}
unset($candidato);

echo json_encode([
    'success' => true,
    'tipo' => 'APURACAO_REAL',
    'total' => $total,
    'brancos' => $brancos,
    'candidatos' => $candidatos
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
