using Google.Apis.Auth.OAuth2;
using Google.Apis.MyBusiness.v4;
using Google.Apis.Services;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Threading;
using System.Net.Http;


public class LocationsAdminsCreate
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
        var path = Path.Combine(Directory.GetCurrentDirectory(), "\\client_secrets.json");
        Console.WriteLine("Reading credentials from " + path);
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

        var service = new MyBusinessService(new BaseClientService.Initializer() { HttpClientInitializer = userCredential });
        service.HttpClient.DefaultRequestHeaders.Add("X-GOOG-API-FORMAT-VERSION", "2");
        var accountsListResponse = service.Accounts.List().Execute();
        Console.WriteLine("\nChoosing account: " + JsonConvert.SerializeObject(accountsListResponse.Accounts[9]));

        var account = accountsListResponse.Accounts[9];
        var locationListResponse = service.Accounts.Locations.List(account.Name).Execute();
        Console.WriteLine("\nChoosing location: " + locationListResponse.Locations[0].Name);

        var location = locationListResponse.Locations[0];
        var admin = new Google.Apis.MyBusiness.v4.Data.Admin
        {
            AdminName = "xyzhh@gml.com",
            Role = "MANAGER"
        };
        Console.WriteLine("\nCreated Admin Object " + JsonConvert.SerializeObject(admin));
        var locationsAdminsCreateRequest = service.Accounts.Locations.Admins.Create(admin, location.Name);
        var locationsAdminsCreateResponse = locationsAdminsCreateRequest.Execute();
        Console.WriteLine("\nResponse: " + JsonConvert.SerializeObject(locationsAdminsCreateResponse));
    }

}
