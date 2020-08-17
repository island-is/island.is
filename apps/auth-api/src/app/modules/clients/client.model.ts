export class Client {
  ClientId: string;
  ClientSecrets: Secret[];
  Enabled: boolean;
  AllowedGrantTypes: string;

  ClientUri: string;
  EnableLocalLogin: boolean;
  AllowAccessTokensViaBrowser: boolean;
  RequirePkce: boolean;
  RequireClientSecret: boolean;
  RedirectUris: string[];
  PostLogoutRedirectUris: string[];

  AllowOfflineAccess: boolean;
  AllowedScopes: string[];
}

export interface Secret {
  Description : string;
	Value : string;
	Expiration : Date;
	Type : string;
}
