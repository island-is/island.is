This folder has examples of how to implement services that require a token from the island.is Identity server to be able to called

==.NetCore version==
This service comes ready with a launch and task file for visual studio code
It uses swagger and the swagger Authorize function to allow you to generate tokens and be able to call the HomeController

The IdentityServer is equipped with the swagger client´s redirect uri for port number 5001
If you wish to try the swagger client from another port it has to be added to the database table 'client_redirect_uri'
You can use the following insert statement

~~~~sql
Insert into client_redirect_uri (
 client_id, redirect_uri
) values (
 'island-is-1', 'https://localhost:[YOUR_PORT_HERE]/oauth2-redirect.html'
)
~~~~

The default SwaggerClient settings are
```json
"SwaggerAuthorization": {
    "Authority": "https://localhost:6001",
    "ClientId": "island-is-1",
    "Scopes": "openid profile offline_access api_resource.scope",
    "AuthorizationPostfix": "/connect/authorize",
    "TokenPostfix": "/connect/token"
  }
```