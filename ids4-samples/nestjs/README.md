A demo project created in ==NestJsn==
This project demonstrates how you can call another service using island.is IDS4 authentication

This project has one function in the HomeController
In that function it creates a token using client credentials which allows you to call the demo services found in the folder demo-apis

To run this project correctly you need to have an .env file in the root of the project
An example of the env file

    NESTJSDEMOFUNCTION=http://localhost:5001/api/home
    NETCOREDEMOFUNCTION=https://localhost:5001/api/home
    
    GRANT_TYPE=client_credentials
    CLIENT_ID=island-is-client-cred-1
    CLIENT_SECRET=secret
    SCOPE=api api_resource.scope
    IDENTITYSERVERURL=https://localhost:6001/connect/token


To run the project 
1. Run the command **npm install** in the root of the project
2. Run the command **npm run start** in the root of the project