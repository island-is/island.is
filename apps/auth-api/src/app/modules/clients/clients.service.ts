import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Client, GrantTypes, Secret } from './client.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Sequelize } from 'sequelize-typescript'

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

    return client;
  }

  buildDummyClients() {
    this.clients = [];
    // swagger client using code flow + pkce
    this.clients.push( {
      ClientId : "swagger",
      // ClientSecrets : [{ Value : new Secret("swagger_secret".Sha256()) } as Secret }],
      Enabled: true,
      AllowedGrantTypes: [ "Code" ],
      ClientUri: null,
      EnableLocalLogin: true,
      AllowAccessTokensViaBrowser: true,
      RequirePkce: true,
      RequireClientSecret: false,
      RedirectUris: [
          "https://localhost:5001/signin-adfs",
          "https://localhost:44378/oauth2-redirect.html",
          "https://localhost:5002/oauth2-redirect.html",
          "https://siidentityserverweb20200731081059.azurewebsites.net/signin-adfs"
      ],
      ClientSecrets: null,

      PostLogoutRedirectUris: ["https://localhost:44378/oauth2-redirect.html"],
      AllowOfflineAccess: true,
      AllowedScopes: [ "openid", "profile", "swagger_api.read" ],
      FrontChannelLogoutUri: null
    });

    // interactive client using code flow + pkce
    this.clients.push( {
      ClientId : "interactive",
     //  ClientSecrets : { new Secret("49C1A7E1-0C79-4A89-A3D6-A37998FB86B0".Sha256()) },
      Enabled: true,
      AllowedGrantTypes: [ "Code" ],
      ClientUri: null,
      EnableLocalLogin: true,
      AllowAccessTokensViaBrowser: true,
      RequirePkce: true,
      RequireClientSecret: false,
      RedirectUris: [
        "https://localhost:5001/signin-adfs",
        "https://localhost:5002/signin-oidc",
        "https://localhost:5001/signin-google",
        "https://localhost:5002/oauth2-redirect.html"
      ],
      FrontChannelLogoutUri: "https://localhost:5002/signout-oidc",
      ClientSecrets: null,

      PostLogoutRedirectUris: ["https://localhost:5002/signout-callback-oidc", "https://localhost:5001/signin-google", "https://localhost:5002/oauth2-redirect.html" ],
      AllowOfflineAccess: true,
      AllowedScopes: [ "openid", "profile" ],
    });


     // interactive client using code flow + pkce
    this.clients.push( {
      ClientId : "mvc.code",
     //  ClientSecrets = { new Secret("secret".Sha256()) },
      Enabled: true,
      AllowedGrantTypes: [ "Code" ],
      ClientUri: null,
      EnableLocalLogin: true,
      AllowAccessTokensViaBrowser: true,
      RequirePkce: true,
      RequireClientSecret: false,
      RedirectUris: [
        "https://localhost:5001/signin-adfs",
        "https://localhost:44302/signin-oidc",
      ],
      FrontChannelLogoutUri: "https://localhost:44302/signout-oidc",
      ClientSecrets: null,
      PostLogoutRedirectUris: ["https://localhost:44302/signout-callback-oidc" ],
      AllowOfflineAccess: true,
      AllowedScopes: [ "openid", "profile" ],
    });


     this.clients.push( {
      ClientId : "postman",
     //  ClientSecrets = { new Secret("secret".Sha256()) },
      Enabled: true,
      AllowedGrantTypes: [ "Code" ],
      ClientUri: null,
      EnableLocalLogin: true,
      AllowAccessTokensViaBrowser: true,
      RequirePkce: true,
      RequireClientSecret: false,
      RedirectUris: [
        "https://localhost:5001/signin-adfs", "https://postman", "https://oauth.pstmn.io/v1/callback"
      ],
      FrontChannelLogoutUri: null,
      ClientSecrets: null,
      PostLogoutRedirectUris: null,
      AllowOfflineAccess: false,
      AllowedScopes: ["openid", "profile", "email", "saml", "postman_resource.scope"  ],
    });

     // interactive client using clientCredentials
    this.clients.push( {
      ClientId : "postman.client.credentials",
     //  ClientSecrets = { new Secret("secret".Sha256()) },
      Enabled: true,
      AllowedGrantTypes: [ "ClientCredentials" ],
      ClientUri: null,
      EnableLocalLogin: true,
      AllowAccessTokensViaBrowser: true,
      RequirePkce: true,
      RequireClientSecret: false,
      RedirectUris: null,
      FrontChannelLogoutUri: null,
      ClientSecrets: null,
      PostLogoutRedirectUris: null,
      AllowOfflineAccess: false,
      AllowedScopes: ["api"],
    });

    this.clients.push( {
      ClientId : "www.certification.openid.net",
     // ClientSecrets = { new Secret("0F8A81999CA44816A42F7F9055462A3C".Sha256()) },
      Enabled: true,
      AllowedGrantTypes: [ "Code" ],
      ClientUri: null,
      EnableLocalLogin: true,
      AllowAccessTokensViaBrowser: true,
      RequirePkce: false,
      RequireClientSecret: false,
      RedirectUris: ["https://www.certification.openid.net/"],
      FrontChannelLogoutUri: null,
      ClientSecrets: null,
      PostLogoutRedirectUris: null,
      AllowOfflineAccess: true,
      AllowedScopes: [ "openid", "profile", "offline_access" ],
    });

    this.clients.push( {
      ClientId : "www.certification.openid.net-2",
     // ClientSecrets = { new Secret("833CAFE79B8441F3B08CB48BBA804D85".Sha256()) }
      Enabled: true,
      AllowedGrantTypes: [ "Code" ],
      ClientUri: null,
      EnableLocalLogin: true,
      AllowAccessTokensViaBrowser: true,
      RequirePkce: false,
      RequireClientSecret: false,
      RedirectUris: ["https://www.certification.openid.net/"],
      FrontChannelLogoutUri: null,
      ClientSecrets: null,
      PostLogoutRedirectUris: null,
      AllowOfflineAccess: true,
      AllowedScopes: [ "openid", "profile", "offline_access" ],
    });

    this.clients.push( {
      ClientId : "island-is-1",
     // ClientSecrets = { new Secret("833CAFE79B8441F3B08CB48BBA804D85".Sha256()) }
      Enabled: true,
      AllowedGrantTypes: [ "Code" ],
      ClientUri: null,
      EnableLocalLogin: true,
      AllowAccessTokensViaBrowser: true,
      RequirePkce: true,
      RequireClientSecret: false,
      RedirectUris: ["http://localhost:4200/signin-oidc", "https://localhost:4200/signin-oidc"],
      FrontChannelLogoutUri: null,
      ClientSecrets: null,
      PostLogoutRedirectUris: null,
      AllowOfflineAccess: true,
      AllowedScopes: [ "openid", "profile", "offline_access" ],
    });

    this.clients.push( {
      ClientId : "island-is-client-cred-1",
     // ClientSecrets = { new Secret("secret".Sha256()) },
      Enabled: true,
      AllowedGrantTypes: [ "ClientCredentials" ],
      ClientUri: null,
      EnableLocalLogin: true,
      AllowAccessTokensViaBrowser: true,
      RequirePkce: true,
      RequireClientSecret: false,
      RedirectUris: ["http://localhost:4200/signin-oidc", "https://localhost:4200/signin-oidc"],
      FrontChannelLogoutUri: null,
      ClientSecrets: null,
      PostLogoutRedirectUris: null,
      AllowOfflineAccess: true,
      AllowedScopes: [ "api" ],
    });


  }

}
