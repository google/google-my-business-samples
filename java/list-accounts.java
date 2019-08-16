/*
 *  Copyright 2019 Google LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.company;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;

import com.google.api.services.mybusiness.v4.MyBusiness;
import com.google.api.services.mybusiness.v4.model.ListAccountsResponse;

import java.io.InputStream;
import java.io.InputStreamReader;

import java.util.Collections;
import java.util.List;


public class Main {

    private static final String APPLICATION_NAME =
        "Google My Business API Java Quickstart";
    private static final java.io.File DATA_STORE_DIR =
        new java.io.File(System.getProperty("user.home"),
            ".store/mybusiness_sample");
    private static FileDataStoreFactory dataStoreFactory;
    private static HttpTransport httpTransport;
    private static final JsonFactory JSON_FACTORY =
        JacksonFactory.getDefaultInstance();
    private static MyBusiness mybusiness;

    /**
     * Demonstrates the authentication flow to use
     * with the Google My Business API Java client library.
     * @return AuthorizationCodeInstalledApp
     */
    private static Credential authorize() throws Exception {
        // Creates an InputStream to hold the client ID and secret.
        InputStream secrets = Main.class.getResourceAsStream("/client_secrets.json");

        // Prompts the user if no credential is found.
        if (secrets == null) {
            System.out.println(
                "Enter Client ID and Secret from Google API Console "
                    + "into google-my-business-api-sample/src/main/resources/client_secrets.json");
            System.exit(1);
        }

        // Uses the InputStream to create an instance of GoogleClientSecrets.
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY,
            new InputStreamReader(secrets));
        if (clientSecrets.getDetails().getClientId().startsWith("Enter")
            || clientSecrets.getDetails().getClientSecret().startsWith("Enter ")) {
            System.out.println(
                "Enter Client ID and Secret from Google API Console "
                    + "into google-my-business-api-sample/src/main/resources/client_secrets.json");
            System.exit(1);
        }

        // Sets up the authorization code flow.
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
            httpTransport, JSON_FACTORY, clientSecrets,
            Collections.singleton("https://www.googleapis.com/auth/business.manage"))
            .setDataStoreFactory(dataStoreFactory).build();
        // Returns the credential.
        return new AuthorizationCodeInstalledApp(flow, new LocalServerReceiver()).authorize("user");
    }

    public static void main(String[] args) throws Exception {
        httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        dataStoreFactory = new FileDataStoreFactory(DATA_STORE_DIR);

        // Calls the authorize() function to get a credential.
        Credential credential = authorize();

        // Calls MyBusiness.Builder to create a new instance named 'mybusiness'.
        mybusiness = new MyBusiness.Builder(httpTransport, JSON_FACTORY, credential)
            .setApplicationName(APPLICATION_NAME).build();

        // Uses the 'mybusiness' instance to send an API call.
        MyBusiness.Accounts.List accountsList = mybusiness.accounts().list();
        ListAccountsResponse response = accountsList.execute();
        List accounts = response.getAccounts();
    }
}
