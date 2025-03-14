<?php
// Token embebido (sustituye 'tu_token_personal_aqui' por tu token real)
$token = 'Tu_Token_de_aisos_REE';

// Obtener parámetros enviados por GET desde el JavaScript
$startDate = $_GET['start_date'] ?? '';
$endDate = $_GET['end_date'] ?? '';

// Validar que los parámetros estén presentes
if (empty($startDate) || empty($endDate)) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan parámetros: start_date y end_date']);
    exit;
}

// URL de la API con las fechas proporcionadas
$indicator = $_GET['indicator'] ?? '1001';
$url = "https://api.esios.ree.es/indicators/{$indicator}?start_date={$startDate}&end_date={$endDate}";

// Configurar cURL para la solicitud
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'x-api-key: ' . $token
]);

// Ejecutar y obtener la respuesta
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Enviar la respuesta al cliente
if ($httpCode >= 400) {
    http_response_code($httpCode);
    echo json_encode(['error' => 'Error en la API de ESIOS: ' . $httpCode]);
} else {
    echo $response;
}
?>
