<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

$stmt = $pdo->query(
    'SELECT numero, nome, slogan
     FROM candidatos
     ORDER BY numero'
);

echo json_encode([
    'success' => true,
    'candidatos' => $stmt->fetchAll()
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
