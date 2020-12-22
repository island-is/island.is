export interface DocumentProviderConfig {
  prod: DocumentProviderClientConfig
  test: DocumentProviderClientConfig
}

export interface DocumentProviderClientConfig {
  basePath: string
  clientId: string
  clientSecret: string
  tokenUrl: string
}

export const DOCUMENT_PROVIDER_CLIENT_CONFIG_TEST =
  'DOCUMENT_PROVIDER_CLIENT_CONFIG_TEST'
export const DOCUMENT_PROVIDER_CLIENT_CONFIG_PROD =
  'DOCUMENT_PROVIDER_CLIENT_CONFIG_PROD'
