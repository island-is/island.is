A demo project created in ==.NetCore==
This project demonstrates how you can call another service using island.is IDS4 authentication 

This project has one function in the HomeController
In that function it creates a token using client credentials which allows you to call the demo services found in the folder demo-apis

The default settings for creating the client credentials token are
```json
"Token": {
    "BaseUrl": "https://localhost:6001/",
    "ConnectUrl": "connect/token",
    "ClientId": "island-is-client-cred-1  ",
    "ClientSecret": "secret",
    "Scope": "api api_resource.scope",
    "GrantType": "client_credentials"
  }
```