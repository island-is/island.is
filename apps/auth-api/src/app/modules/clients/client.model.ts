/* eslint-disable @typescript-eslint/no-inferrable-types */
export enum TokenExpiration
{
    /// <summary>
    /// Sliding token expiration
    /// </summary>
    Sliding = 0,

    /// <summary>
    /// Absolute token expiration
    /// </summary>
    Absolute = 1
}

export enum TokenUsage
{
    /// <summary>
    /// Re-use the refresh token handle
    /// </summary>
    ReUse = 0,

    /// <summary>
    /// Issue a new refresh token handle every time
    /// </summary>
    OneTimeOnly = 1
}


/// <summary>
/// Access token types.
/// </summary>
export enum AccessTokenType
{
    /// <summary>
    /// Self-contained Json Web Token
    /// </summary>
    Jwt = 0,

    /// <summary>
    /// Reference token
    /// </summary>
    Reference = 1
}

export interface ClientClaim {
	Id: number;
	Type: string;
	Value: string;
	ClientId: number;
	Client: Client;
}

export class GrantType
{
    static Implicit: string = "implicit";
    static Hybrid: string = "hybrid";
    static AuthorizationCode: string = "authorization_code";
    static ClientCredentials: string = "client_credentials";
    static ResourceOwnerPassword: string = "password";
    static DeviceFlow: string = "urn:ietf:params:oauth:grant-type:device_code";
}

export class Secret {
  id: number;
  Description : string;
	Value : string;
	Expiration : Date;
	Type: string = "SharedSecret";
}

export class ClientSecret extends Secret
{
    ClientId: number;
    Client: Client;
}

export class Client {
  Enabled?: boolean = true;
  ClientId?: string;
  ProtocolType?: string = "oidc";
  ClientSecrets?: ClientSecret[] = [];
  RequireClientSecret?: boolean = true;
  ClientName?: string;
  Description?: string;
  ClientUri?: string;
  LogoUri?: string;
  RequireConsent?: boolean = false;
  AllowRememberConsent?: boolean = true;
  AllowedGrantTypes?: string[];
  RequirePkce?: boolean = true;
  AllowPlainTextPkce?: boolean = false;
  RequireRequestObject?: boolean = false;
  AllowAccessTokensViaBrowser?: boolean = false;
  RedirectUris?: string[] = [];
  PostLogoutRedirectUris?: string[] = [];
  FrontChannelLogoutUri?: string;
  FrontChannelLogoutSessionRequired?: boolean = true;
  BackChannelLogoutUri?: string;
  BackChannelLogoutSessionRequired?: boolean = true;
  AllowOfflineAccess?: boolean = false;
  AllowedScopes?: string[] = [];
  AlwaysIncludeUserClaimsInIdToken?: boolean = false;
  IdentityTokenLifetime?: number = 300;
  AllowedIdentityTokenSigningAlgorithms?: string[] = [];
  AccessTokenLifetime?: number = 3600;
  AuthorizationCodeLifetime?: number = 300;
  AbsoluteRefreshTokenLifetime?: number = 2592000;
  SlidingRefreshTokenLifetime?: number = 1296000;
  ConsentLifetime?: number = null;
  RefreshTokenUsage?: TokenUsage.OneTimeOnly;
  UpdateAccessTokenClaimsOnRefresh?: boolean = false;
  RefreshTokenExpiration?: TokenExpiration = TokenExpiration.Absolute;
  AccessTokenType?: AccessTokenType = AccessTokenType.Jwt;
  EnableLocalLogin?: boolean = true;
  IdentityProviderRestrictions?: string[] = [];
  IncludeJwtId?: boolean = true;
  Claims?: ClientClaim;
  AlwaysSendClientClaims?: boolean = false;
  ClientClaimsPrefix?: string = "client_";
  PairWiseSubjectSalt?: string;
  UserSsoLifetime?: number;
  UserCodeType?: string;
  DeviceCodeLifetime?: number = 300;
  AllowedCorsOrigins?: string[] = [];
  Properties?: unknown; // TODO: Dictionary
}




