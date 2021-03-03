/*
    Copyright 2019 Google LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

using Google.Apis.Auth.OAuth2;
using Google.Apis.MyBusinessAccountManagement.v1;
using Google.Apis.Services;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Threading;

public class ListAccounts
{
    public class WebCredentials
    {
        public class Web
        {
            public string client_id { set; get; }
            public string client_secret { set; get; }
        }
        public Web web { get; set; }

    }

    static void Main(string[] args)
    {
        string path = Path.Combine(Directory.GetCurrentDirectory(), "client_secrets.json");
        System.Diagnostics.Debug.WriteLine("Reading credentials from " + path);
        string contents = File.ReadAllText(path);
        var deserializedCredentials = JsonConvert.DeserializeObject<WebCredentials>(contents);

        var ClientId = deserializedCredentials.web.client_id;
        var ClientSecret = deserializedCredentials.web.client_secret;
        Console.WriteLine("Obtained client id " + ClientId + " and secret " + ClientSecret);
        string[] scopes = new string[] { "https://www.googleapis.com/auth/plus.business.manage" };

        var userCredential = GoogleWebAuthorizationBroker.AuthorizeAsync(
            new ClientSecrets
            {
                ClientId = ClientId,
                ClientSecret = ClientSecret,
            },
             scopes,
             "user",
             CancellationToken.None).Result;

        var service = new MyBusinessAccountManagementService(new BaseClientService.Initializer() { HttpClientInitializer = userCredential });

        var accountsListResponse = service.Accounts.List().Execute();
        Console.WriteLine(JsonConvert.SerializeObject(accountsListResponse));
        var name = Console.ReadLine();

    }

}

