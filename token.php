<?
$data = 'client_id=' . 'e4a530296caca9a0979d' . '&' .
		'client_secret=' . 'd41352a87cd6f4eb8af1999269f1eee379538700' . '&' .
		'code=' . urlencode($_GET['code']);
$ch = curl_init('https://github.com/login/oauth/access_token');
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
preg_match('/access_token=([0-9a-f]+)/', $response, $out);
echo $out[1];
curl_close($ch);
?>
