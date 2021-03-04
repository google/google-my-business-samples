<?php
/*
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

include_once __DIR__ . '/vendor/autoload.php';


$credentials = __DIR__ . '/client_secrets.json';

$client = new Google\Client();
$client->setAuthConfig($credentials);
$client->addScope("https://www.googleapis.com/auth/business.manage");
$redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
$client->setRedirectUri($redirect_uri);
$my_business_account = new Google_Service_MyBusinessAccountManagement($client);

if (isset($_GET['logout'])) { // logout: destroy token
    unset($_SESSION['token']);
  die('Logged out.');
}

if (isset($_GET['code'])) { // get auth code, get the token and store it in session
    $client->authenticate($_GET['code']);
    $_SESSION['token'] = $client->getAccessToken();
}


if (isset($_SESSION['token'])) { // get token and configure client
    $token = $_SESSION['token'];
    $client->setAccessToken($token);
}

if (!$client->getAccessToken()) { // auth call 
    $authUrl = $client->createAuthUrl();
    header("Location: ".$authUrl);
    die;
}



$list_accounts_response = $my_business_account->accounts->listAccounts();
Var_dump($list_accounts_response);

?>
