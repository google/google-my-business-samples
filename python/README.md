
# Client Library Installation

Install the Google API Client Library

`$ pip install --upgrade google-api-python-client`

and the OAuth2 client library

`$ pip install oauth2client`

# Install OAuth2 Credentials

Create a file named `client_secrets.json`, with the credentials downloaded as
JSON from your Google Cloud Project API Console.

# Download the discovery document

Go to the [Samples page](https://developers.google.com/my-business/samples/#discovery_document), right click **Download discovery document**, and select **Save Link As**. Then, save the file as `myBusiness_discovery.json` in the same directory as your Python file.

# Run the sample

Use the built in `sample_tools` utility of the Google APIs Python client to build an API service from the discovery document that you downloaded, and authenticate the user with OAuth. You should now be able to list accounts and locations.

