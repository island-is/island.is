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

To run the project you can 
1. Run the command **dotnet run** in the root of the project
2. Open the project in visual studio code and use the **RUN** feature in the command list

==NestJs version==
To run this project correctly you need to have an .env file in the root of the project
An example of the env file

    JWKS_URI=http://localhost:6002/.well-known/openid-configuration/jwks
    AUDIENCE=api_resource
    ISSUER=https://localhost:6001

    SWAGGER_AUTH_URL=https://localhost:6001/connect/authorize
    SWAGGER_TOKEN_URL=https://localhost:6001/connect/token
    SWAGGER_SCOPES=openid profile offline_access api_resource.scope


**Swagger**
This service uses swagger as well to allow you to generate tokens and be able to call the HomeController.
The swagger implementation is found in the file main.ts
It uses variables from the file .env
```ts
    const options = new DocumentBuilder()
    .setTitle('NestJS example')
    .setDescription('')
    .setVersion('1.0')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: process.env.SWAGGER_AUTH_URL,
          tokenUrl: process.env.SWAGGER_TOKEN_URL,
          scopes: {
            'openid profile offline_access api_resource.scope':
              'Sækir OpenId, Profile og claimið sem þarf',
          },
        },
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);
```

The scopes option sets the list of scopes that will be added to the token. 
In order to talk to the service the token needs to have the **api_resource.scope** scope since that is the set audience on the service.

To the best of this samples creator's knowledge, the NestJs framework does not allow us to modify the Swagger's UI so we can't add PKCE method to the OAuth2 call. Hence the Swagger can only call clients that don't have the PKCE method implemented.

    Todo: Picture of Swagger window missing

The service is set to run on port 5001 but if you wish to change the port you need to add that redirect uri to the database
You can use the following insert statement

~~~~sql
Insert into client_redirect_uri (
 client_id, redirect_uri
) values (
 'island-is-1', 'http://localhost:[YOUR_PORT_HERE]/oauth2-redirect.html'
)
~~~~

**Controller implementation**
Let's display the HomeController and show you what two of the options do
```ts
@Controller('api/home')
@UseGuards(AuthGuard("jwt"))
@ApiOAuth2([])
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMessage(): ReturnObject {
    return {
      success: true,
      message: this.appService.getHello()
    }
  }
}
```

* **@UseGuards(AuthGuard("jwt"))** 
    Adds the JWT security implemented in jwt.strategy.ts to the controller
* **@ApiOAuth2([])**
    Executing a function found in this controller in Swagger, this adds the generated token using the Swagger OAuth2 Authorize method to the header of the call so you won't get an 401 error. 

To run the project 
1. Run the command **npm install** in the root of the project
2. Run the command **npm run start** in the root of the project
    
