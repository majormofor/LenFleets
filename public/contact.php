<?php
/**
 * Contact endpoint for static/PHP hosting (Hostinger shared hosting).
 *
 * This is a port of server/contact.mjs for hosts that run PHP but not Node.
 * It keeps the same protections and returns the same JSON shape, so the React
 * form in src/components/ContactForm.tsx works against either one unchanged:
 *   success -> 200 {"accepted":true,"message":...}
 *   invalid -> 422 {"accepted":false,"errors":{field:msg},"message":...}
 *
 * The Resend API key must NOT live in this file. Create contact-config.php
 * beside it (see contact-config.example.php) — that file is gitignored.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, ['accepted' => false, 'message' => 'Use POST to send an enquiry.']);
}

// ---- configuration -------------------------------------------------------
$config = ['RESEND_API_KEY' => '', 'CONTACT_FROM_EMAIL' => '', 'CONTACT_TO_EMAIL' => ''];
foreach (array_keys($config) as $key) {
    $value = getenv($key);
    if (is_string($value) && $value !== '') $config[$key] = $value;
}
foreach (['contact-config.php', '../contact-config.php'] as $candidate) {
    $path = __DIR__ . '/' . $candidate;
    if (is_readable($path)) {
        $loaded = require $path;
        if (is_array($loaded)) {
            foreach ($config as $key => $current) {
                if ($current === '' && !empty($loaded[$key])) $config[$key] = (string) $loaded[$key];
            }
        }
        break;
    }
}

// ---- only accept posts from this site ------------------------------------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if ($host !== '' && parse_url($origin, PHP_URL_HOST) !== $host) {
        reply(403, ['accepted' => false, 'message' => 'This origin is not authorised to submit enquiries.']);
    }
}

$contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
if (!str_starts_with($contentType, 'application/json')) {
    reply(415, ['accepted' => false, 'message' => 'Use JSON for enquiry details.']);
}

// ---- rate limit ----------------------------------------------------------
// Shared hosting sits behind a proxy, so prefer the forwarded client address.
$forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
$ip = $forwarded !== '' ? trim(explode(',', $forwarded)[0]) : ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$windowSeconds = 600;
$limit = 20;
$bucket = sys_get_temp_dir() . '/lensfleet-contact-' . hash('sha256', $ip) . '.json';
$now = time();
$entry = ['start' => $now, 'count' => 0];
if (is_readable($bucket)) {
    $stored = json_decode((string) @file_get_contents($bucket), true);
    if (is_array($stored) && isset($stored['start'], $stored['count']) && ($now - (int) $stored['start']) <= $windowSeconds) {
        $entry = ['start' => (int) $stored['start'], 'count' => (int) $stored['count']];
    }
}
$entry['count']++;
@file_put_contents($bucket, json_encode($entry), LOCK_EX);
if ($entry['count'] > $limit) {
    header('Retry-After: ' . $windowSeconds);
    reply(429, ['accepted' => false, 'message' => 'Too many attempts. Please try again later or email info@lensfleet.com.']);
}

// ---- read and validate ---------------------------------------------------
$raw = file_get_contents('php://input', false, null, 0, 16001);
if ($raw === false || strlen($raw) > 16000) {
    reply(413, ['accepted' => false, 'message' => 'Your enquiry is too large.']);
}
$input = json_decode($raw, true);
if (!is_array($input) || array_is_list($input)) {
    reply(400, ['accepted' => false, 'message' => 'The enquiry details could not be read.']);
}

// Keep these lists in step with src/content/site.ts and server/contact.mjs.
$interests  = ['Fleet and logistics','Security','Care services','Asset tracking','LensFleet Home','Content creators','General enquiry'];
$countries  = ['Nigeria','United Kingdom','Other'];
$fleetSizes = ['1-5','6-20','21-50','51-200','200+','Not a fleet'];
$timelines  = ['As soon as it launches','1-3 months','3-6 months','Just researching'];

$limits = ['name'=>120,'email'=>200,'company'=>160,'interest'=>80,'message'=>4000,'website'=>200,'phone'=>40,'country'=>40,'fleetSize'=>20,'timeline'=>40,'currency'=>8];
$errors = [];
$clean  = [];
foreach ($limits as $field => $max) {
    $value = $input[$field] ?? '';
    if (!is_string($value)) { $errors[$field] = 'Enter a text value.'; $clean[$field] = ''; continue; }
    $clean[$field] = trim($value);
    if (mb_strlen($clean[$field]) > $max) $errors[$field] = "Use no more than $max characters.";
}

$hasControlChars = static fn(string $v): bool => preg_match('/[\r\n\0]/', $v) === 1;
if (!isset($errors['name']) && (mb_strlen($clean['name']) < 2 || $hasControlChars($clean['name']))) {
    $errors['name'] = 'Enter your full name.';
}
if (!isset($errors['email']) && (!filter_var($clean['email'], FILTER_VALIDATE_EMAIL) || $hasControlChars($clean['email']))) {
    $errors['email'] = 'Enter a valid email address.';
}
if (!in_array($clean['interest'], $interests, true))  $errors['interest'] = 'Choose an area of interest.';
if (!in_array($clean['country'], $countries, true))   $errors['country']  = 'Choose your country.';
if ($clean['fleetSize'] !== '' && !in_array($clean['fleetSize'], $fleetSizes, true)) $errors['fleetSize'] = 'Choose a valid range.';
if ($clean['timeline']  !== '' && !in_array($clean['timeline'],  $timelines,  true)) $errors['timeline']  = 'Choose a valid timeline.';
if ($hasControlChars($clean['phone'])) $errors['phone'] = 'Enter a valid phone number.';
// The message stays optional, as it is in the Node version.

$elapsed = $input['elapsedMs'] ?? null;
if (!is_numeric($elapsed) || (float) $elapsed < 800) {
    $errors['form'] = 'Please take a moment to complete your enquiry.';
}

if ($errors) reply(422, ['accepted' => false, 'errors' => $errors, 'message' => 'Please check your enquiry details.']);
if ($clean['website'] !== '') {
    reply(422, ['accepted' => false, 'message' => 'This enquiry could not be accepted. Please contact us directly.']);
}

if ($config['RESEND_API_KEY'] === '' || $config['CONTACT_FROM_EMAIL'] === '' || $config['CONTACT_TO_EMAIL'] === '') {
    reply(503, ['accepted' => false, 'message' => 'Your enquiry has not been sent. The contact delivery service is not configured yet. Please email info@lensfleet.com.']);
}

$requestType = $input['requestType'] ?? 'enquiry';
if (!in_array($requestType, ['waitlist','demo','quote','enquiry'], true)) $requestType = 'enquiry';

$lines = [
    "LensFleet $requestType", '',
    'Name: '                  . $clean['name'],
    'Email: '                 . $clean['email'],
    'Phone: '                 . ($clean['phone']     ?: 'Not provided'),
    'Organisation: '          . ($clean['company']   ?: 'Not provided'),
    'Country: '               . $clean['country'],
    'Fleet or asset count: '  . ($clean['fleetSize'] ?: 'Not provided'),
    'Interest: '              . $clean['interest'],
    'Timeline: '              . ($clean['timeline']  ?: 'Not provided'),
];
if ($clean['currency'] !== '') $lines[] = 'Currency: ' . $clean['currency'];
$lines[] = '';
$lines[] = $clean['message'] !== '' ? $clean['message'] : '(No message provided.)';

$payload = [
    'from'     => $config['CONTACT_FROM_EMAIL'],
    'to'       => [$config['CONTACT_TO_EMAIL']],
    'reply_to' => $clean['email'],
    'subject'  => "LensFleet $requestType: " . $clean['interest'],
    'text'     => implode("\n", $lines),
];

$curl = curl_init('https://api.resend.com/emails');
curl_setopt_array($curl, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 12,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $config['RESEND_API_KEY'], 'Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode($payload),
]);
$response = curl_exec($curl);
$status   = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
curl_close($curl);

$result = is_string($response) ? json_decode($response, true) : null;
if ($status < 200 || $status >= 300 || !is_array($result) || !isset($result['id']) || !is_string($result['id'])) {
    reply(502, ['accepted' => false, 'message' => 'The delivery service did not accept your enquiry. Please try again or email info@lensfleet.com.']);
}

reply(200, ['accepted' => true, 'message' => 'Enquiry accepted for delivery.']);
