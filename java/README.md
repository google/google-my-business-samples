
# Client libraries

- [Account Management API](https://github.com/googleapis/google-api-java-client-services/tree/master/clients/google-api-services-mybusinessaccountmanagement/v1)

# Get your client secrets

**Note**: You will need to have created a Client ID in your [Google Cloud Platform](https://cloud.google.com/console) before proceeding.

- Click the name of a Client ID to view that ID and download JSON</li>
- Create a new file called `client_secrets.json` in the same directory as source files.

# Build and Run

The following steps were testedin Eclipse.

- Create a gradle project and add contents in the library link above to build.gradle. Also add `compile 'com.google.oauth-client:google-oauth-client-jetty:1.31.0'` to dependencies.
- You might need to set java home in gradle properties under Window > preferences. On linux you could get the location by running `$(dirname $(dirname $(readlink -f $(which javac))))` in the terminal.
- Add/create the java file to src/main/java and delete any files that were initially created.
- Double click build under Gradle Tasks.
- Right click the java file > Run As > Java Application

