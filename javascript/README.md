
# Configure the sample

Replace `YOUR_CLIENT_ID_HERE` and `YOUR_API_KEY_HERE` with a valid Client ID and API Key obtained from your [Google Cloud Platform](https://cloud.google.com/console) API project.

WARNING: This presents a significant security risk as the Client ID and API Key are shared with and visibile in the client's browser. This code should never be used in a production environment without first ensuring credentials are removed and properly secured through the use of a server side JS run-time environment or other means.

# Run the sample

Start the web server with the following command from your  directory:

Python 2.X

`python -m SimpleHTTPServer 8000`

Python 3.x
`python -m http.server 8000`

Load the following URL into your browser:

`http://localhost:8000/gmbdemo.html`

The first time you run the sample, it prompts you to authorize access:

Click the Authorize button to open the authorization window.

If you're not already signed in to your Google account, you're prompted to sign in. If you're logged into multiple Google Accounts, you're asked to select one account to use for the authorization.

Click the Accept button.

