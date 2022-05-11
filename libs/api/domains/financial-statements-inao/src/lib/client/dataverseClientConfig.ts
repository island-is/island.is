export interface DataverseClientConfig {
  basePath: string
  issuer: string
  clientId: string
  clientSecret: string
  scope: string
  tokenEndpoint: string
}

export const DATAVERSE_CLIENT_CONFIG = 'DATAVERSE_CLIENT_CONFIG'
