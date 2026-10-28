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

$pdo->exec('DELETE FROM votos');
$pdo->exec('ALTER TABLE votos AUTO_INCREMENT = 1');

echo json_encode([
    'success' => true,
    'message' => 'Votação reiniciada.'
], JSON_UNESCAPED_UNICODE);
