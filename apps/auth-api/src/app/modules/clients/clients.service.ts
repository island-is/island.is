import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Client, GrantType } from './client.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'

@Injectable()
export class ClientsService {
  private clients: Client[];

  applicationsRegistered = new Counter({
    name: 'apps_registered4',
    labelNames: ['res1'],
    help: 'Number of applications',
  }) // TODO: How does this work?

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    this.buildDummyClients();
  }

  async findClientById(clientId: string): Promise<Client> {
    this.logger.debug(`Finding client for clientId - "${clientId}"`)
    const client = this.clients.find( f => f.ClientId === clientId);

    if ( !client )
    {
      throw new NotFoundException("This client doesn't exist")
    }

    this.logger.debug(client);

    return client;
  }

  buildDummyClients() {
    this.clients = [];

    const swagger = new Client();
    swagger.ClientId = "swagger";
    swagger.AllowedGrantTypes = [ GrantType.AuthorizationCode ];
    swagger.AllowAccessTokensViaBrowser = true;
    swagger.RedirectUris = [
      "https://localhost:5001/signin-adfs",
      "https://localhost:44378/oauth2-redirect.html",
      "https://localhost:5002/oauth2-redirect.html",
      "https://siidentityserverweb20200731081059.azurewebsites.net/signin-adfs",
      "http://localhost:3333/oauth2-redirect.html",
    ];
    // ClientSecrets : [{ Value : new Secret("swagger_secret".Sha256()) } as Secret }],
    swagger.AllowedScopes = [ "openid", "profile", "swagger_api.read", '@identityserver.api/read' ],
    swagger.PostLogoutRedirectUris = ["https://localhost:44378/oauth2-redirect.html"],
    swagger.AllowOfflineAccess = true;
    swagger.RequirePkce = false;
    swagger.RequireClientSecret = false;
    this.clients.push(swagger);

    const interactive = new Client();
    interactive.ClientId = "interactive",
    interactive.AllowedGrantTypes = [ GrantType.AuthorizationCode ],
    interactive.ClientUri = null,
    interactive.EnableLocalLogin = true,
    interactive.AllowAccessTokensViaBrowser = true,
    interactive.RequirePkce = true,
    interactive.RequireClientSecret = false,
    interactive.RedirectUris = [
      "https://localhost:5001/signin-adfs",
      "https://localhost:5002/signin-oidc",
      "https://localhost:5001/signin-google",
      "https://localhost:5002/oauth2-redirect.html"
    ],
    interactive.FrontChannelLogoutUri = "https://localhost:5002/signout-oidc",
    interactive.ClientSecrets = null,
    interactive.PostLogoutRedirectUris = ["https://localhost:5002/signout-callback-oidc", "https://localhost:5001/signin-google", "https://localhost:5002/oauth2-redirect.html" ],
    interactive.AllowOfflineAccess = true,
    interactive.AllowedScopes = [ "openid", "profile"],
    this.clients.push(interactive);

    const postman = new Client();
    postman.ClientId = "postman",
    postman.RequireClientSecret = false,
    postman.AllowedGrantTypes = [ GrantType.AuthorizationCode ],
    postman.RequirePkce = false,
    postman.RedirectUris = [
      "https://localhost:5001/signin-adfs", "https://postman", "https://oauth.pstmn.io/v1/callback"
    ],
    postman.AllowedScopes = ["openid", "profile", "email", "saml", "postman_resource.scope"  ]
    this.clients.push(postman);

    const islandis1 = new Client();
    islandis1.ClientId = "island-is-1",
     // ClientSecrets = { new Secret("833CAFE79B8441F3B08CB48BBA804D85".Sha256()) }
    islandis1.Enabled = true,
    islandis1.AllowedGrantTypes = [ GrantType.AuthorizationCode ],
    islandis1.ClientUri = null,
    islandis1.EnableLocalLogin = true,
    islandis1.AllowAccessTokensViaBrowser = true,
    islandis1.RequirePkce = true,
    islandis1.RequireClientSecret = false,
    islandis1.RedirectUris = ["http://localhost:4200/signin-oidc", "https://localhost:4200/signin-oidc"],
    islandis1.FrontChannelLogoutUri = null,
    islandis1.ClientSecrets = null,
    islandis1.PostLogoutRedirectUris = null,
    islandis1.AllowOfflineAccess = true,
    islandis1.AllowedScopes = [ "openid", "profile", "offline_access" ],
    this.clients.push(islandis1);

    const islandisclientcred1 = new Client();

    islandisclientcred1.ClientId = "island-is-client-cred-1";
     // ClientSecrets = { new Secret("secret".Sha256()) },
    islandisclientcred1.Enabled = true;
    islandisclientcred1.AllowedGrantTypes = [ GrantType.ClientCredentials];
    islandisclientcred1.ClientUri = null;
    islandisclientcred1.EnableLocalLogin = true;
    islandisclientcred1.AllowAccessTokensViaBrowser = true;
    islandisclientcred1.RequirePkce = true;
    islandisclientcred1.RequireClientSecret = false;
    islandisclientcred1.RedirectUris = ["http://localhost:4200/signin-oidc", "https://localhost:4200/signin-oidc"];
    islandisclientcred1.FrontChannelLogoutUri = null;
    islandisclientcred1.ClientSecrets = null;
    islandisclientcred1.PostLogoutRedirectUris = null;
    islandisclientcred1.AllowOfflineAccess = true;
    islandisclientcred1.AllowedScopes = [ "api" ];
    this.clients.push(islandisclientcred1);

         // interactive client using code flow + pkce
    // this.clients.push( {
    //   ClientId : "mvc.code",
    //  //  ClientSecrets = { new Secret("secret".Sha256()) },
    //   Enabled: true,
    //   AllowedGrantTypes: [ GrantType.AuthorizationCode ],
    //   ClientUri: null,
    //   EnableLocalLogin: true,
    //   AllowAccessTokensViaBrowser: true,
    //   RequirePkce: true,
    //   RequireClientSecret: false,
    //   RedirectUris: [
    //     "https://localhost:5001/signin-adfs",
    //     "https://localhost:44302/signin-oidc",
    //   ],
    //   FrontChannelLogoutUri: "https://localhost:44302/signout-oidc",
    //   ClientSecrets: null,
    //   PostLogoutRedirectUris: ["https://localhost:44302/signout-callback-oidc" ],
    //   AllowOfflineAccess: true,
    //   AllowedScopes: [ "openid", "profile" ],
    // } as Client );

    // this.clients.push( {
    //   ClientId : "postman.client.credentials",
    //  //  ClientSecrets = { new Secret("secret".Sha256()) },
    //   Enabled: true,
    //   AllowedGrantTypes: [ GrantType.ClientCredentials ],
    //   ClientUri: null,
    //   EnableLocalLogin: true,
    //   AllowAccessTokensViaBrowser: true,
    //   RequirePkce: true,
    //   RequireClientSecret: false,
    //   RedirectUris: null,
    //   FrontChannelLogoutUri: null,
    //   ClientSecrets: null,
    //   PostLogoutRedirectUris: null,
    //   AllowOfflineAccess: false,
    //   AllowedScopes: ["api"],
    // } as Client );

    // this.clients.push( {
    //   ClientId : "www.certification.openid.net",
    //  // ClientSecrets = { new Secret("0F8A81999CA44816A42F7F9055462A3C".Sha256()) },
    //   Enabled: true,
    //   AllowedGrantTypes: [ GrantType.AuthorizationCode ],
    //   ClientUri: null,
    //   EnableLocalLogin: true,
    //   AllowAccessTokensViaBrowser: true,
    //   RequirePkce: false,
    //   RequireClientSecret: false,
    //   RedirectUris: ["https://www.certification.openid.net/"],
    //   FrontChannelLogoutUri: null,
    //   ClientSecrets: null,
    //   PostLogoutRedirectUris: null,
    //   AllowOfflineAccess: true,
    //   AllowedScopes: [ "openid", "profile", "offline_access" ],
    // } as Client );

    // this.clients.push( {
    //   ClientId : "www.certification.openid.net-2",
    //  // ClientSecrets = { new Secret("833CAFE79B8441F3B08CB48BBA804D85".Sha256()) }
    //   Enabled: true,
    //   AllowedGrantTypes: [ GrantType.AuthorizationCode ],
    //   ClientUri: null,
    //   EnableLocalLogin: true,
    //   AllowAccessTokensViaBrowser: true,
    //   RequirePkce: false,
    //   RequireClientSecret: false,
    //   RedirectUris: ["https://www.certification.openid.net/"],
    //   FrontChannelLogoutUri: null,
    //   ClientSecrets: null,
    //   PostLogoutRedirectUris: null,
    //   AllowOfflineAccess: true,
    //   AllowedScopes: [ "openid", "profile", "offline_access" ],
    // } as Client );

  }

}
