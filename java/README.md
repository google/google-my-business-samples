

# Client library downloads

Visit the [Google My Business Developer Site](https://developers.google.com/my-business) to get the latest client libraries.

# Add the library to an Eclipse project

1. Open your project in Eclipse.
1. In Package Explorer, right-click a project and select **Build Path**, then
click **Configure Build Path**.
1. Click **Add External JARs** and navigate to the folder containing the JAR
file to add.
1. Select the JAR file and click **Open**.
1. Click **OK** to add the file to the project's build path.

# Get your client secrets

**Note**: You will need to have created a Client ID in your [Google Cloud Platform](https://cloud.google.com/console) before proceeding.

<ol>
<li>Click the name of a Client ID to view that ID.</li>
<li>Click <b>Download JSON</b>.</li>
<li>Create a new file called <code>client_secrets.json</code> in the directory <code>src/main/resources/</code>, and add
the contents of the JSON file you downloaded in the previous step.</li>
</ol>

# Implement the OAuth 2.0 authorization flow

This example demonstrates using the `AuthorizationCodeFlow` class to allow the application to access Google My Business account data. Additional may be found in [Using OAuth 2.0 for Installed Applications](https://developers.google.com/identity/protocols/OAuth2InstalledApp).

In the following code example:

1. The `main()` function calls `authorize()` to get a credential.
1. The `authorize()` function creates an `InputStream` to hold the client ID and
secret, creates an instance of `GoogleClientSecrets`, and returns a new
`AuthorizationCodeInstalledApp` instance (the credential).
1. The `main()` function uses the credential to create a new instance of
`MyBusiness.Builder` named `mybusiness`. Now the app is ready to make API calls
using `mybusiness`.

