
# Client libraries

Execute the following to install the client. The repository is available [here](https://github.com/googleapis/google-api-python-client).

```
pip install virtualenv
virtualenv myenv
source myenv/bin/activate
myenv/bin/pip install google-api-python-client oauth2client
```

- [Account Management API](https://github.com/googleapis/google-api-java-client-services/tree/master/clients/google-api-services-mybusinessaccountmanagement/v1) and [library reference](https://googleapis.dev/java/google-api-services-mybusinessaccountmanagement/latest/index.html)

# Prerequisites
## Get your client secrets

**Note**: You will need to have created a Client ID in your [Google Cloud Platform](https://cloud.google.com/console) before proceeding.

- Click the name of a Client ID to view that ID and download JSON</li>
- Create a new file called `client_secrets.json` in the same directory as source files.

# Run

The samples in this directory uses the built in `sample_tools` utility of the Google APIs Python client to build an API service from the discovery document that you downloaded, and authenticate the user with OAuth. 

Execute the list accounts sample in your virtualenv

`$ python accounts_list.py`

You should now be able to list accounts and locations.

