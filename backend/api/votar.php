<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

if (!is_array($dados)) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'JSON inválido.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$branco = filter_var($dados['branco'] ?? false, FILTER_VALIDATE_BOOLEAN);
$numero = isset($dados['numero']) ? trim((string) $dados['numero']) : null;

if ($branco) {
    $stmt = $pdo->prepare(
        "INSERT INTO votos (candidato_numero, tipo)
         VALUES (NULL, 'BRANCO')"
    );

    $stmt->execute();

    echo json_encode([
        'success' => true,
        'message' => 'Voto em branco registrado.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

if ($numero === null || !preg_match('/^\d{5}$/', $numero)) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Informe um número de candidato válido com 5 dígitos.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$stmt = $pdo->prepare(
    'SELECT numero, nome
     FROM candidatos
     WHERE numero = ?'
);

$stmt->execute([$numero]);
$candidato = $stmt->fetch();

if (!$candidato) {
    http_response_code(404);

    echo json_encode([
        'success' => false,
        'message' => 'Candidato inexistente.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$stmt = $pdo->prepare(
    "INSERT INTO votos (candidato_numero, tipo)
     VALUES (?, 'CANDIDATO')"
);

$stmt->execute([$numero]);

echo json_encode([
    'success' => true,
    'message' => 'Voto registrado com sucesso.',
    'candidato' => $candidato
], JSON_UNESCAPED_UNICODE);
