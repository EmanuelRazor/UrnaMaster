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
";

$linhas = $pdo->query($sql)->fetchAll();

$reais = [];
foreach ($linhas as $linha) {
    $reais[$linha['numero']] = [
        'numero' => $linha['numero'],
        'nome' => $linha['nome'],
        'votos' => (int) $linha['votos']
    ];
}

$brancos = (int) $pdo->query(
    "SELECT COUNT(*)
     FROM votos
     WHERE tipo = 'BRANCO'"
)->fetchColumn();

$simulados = $reais;

$lula = '13000';
$renan = '14000';
$cyber = '22000';

/*
 * SIMULAÇÃO DIDÁTICA E EXPLÍCITA.
 * Estes valores NÃO são gravados no banco.
 *
 * Regra 1:
 * se LulaTron não estiver pelo menos 20% acima de CyberNaro,
 * o resultado exibido na simulação passa a ser CyberNaro * 1,20.
 */
$alvoLula = (int) ceil($simulados[$cyber]['votos'] * 1.20);

if ($simulados[$lula]['votos'] < $alvoLula) {
    $simulados[$lula]['votos'] = $alvoLula;
}

/*
 * Regra 2:
 * quando houver votos em branco, Renan Tigrinho é limitado
 * artificialmente a no máximo "brancos - 1".
 *
 * Se não houver votos em branco, a simulação mantém o valor real,
 * pois não existe um inteiro não-negativo menor que zero.
 */
if ($brancos > 0 && $simulados[$renan]['votos'] >= $brancos) {
    $simulados[$renan]['votos'] = max(0, $brancos - 1);
}

echo json_encode([
    'success' => true,
    'tipo' => 'SIMULACAO_DIDATICA_DE_MANIPULACAO',
    'aviso' => 'Resultado artificial para demonstração. O banco não foi alterado.',
    'brancos' => $brancos,
    'reais' => array_values($reais),
    'simulados' => array_values($simulados),
    'regras' => [
        'LulaTron é elevado artificialmente para pelo menos 120% dos votos de CyberNaro.',
        'Renan Tigrinho é limitado artificialmente para ficar abaixo dos votos em branco quando existirem votos em branco.'
    ]
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
