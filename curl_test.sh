$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://v3.football.api-sports.io/teams?league=39&season=2021',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'x-rapidapi-key: d04c7b9fd21abb95ba0c4feef6702dc2'
  ),
));
$response = curl_exec($curl);
curl_close($curl);
echo $response;
