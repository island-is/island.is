const audience = ['@island.is/auth/admin', '@admin.island.is']

const devConfig = {
  production: false,
  auth: {
    audience,
    issuer: 'https://identity-server.dev01.devland.is',
  },
  port: 6333,
  clientSecretEncryptionKey:
    process.env.CLIENT_SECRET_ENCRYPTION_KEY ?? 'secret',
  zendeskGeneralMandateWebhookSecret:
    process.env.ZENDESK_WEBHOOK_SECRET_GENERAL_MANDATE ??
    //The static test signing secret from Zendesk as described in their docs
    // https://developer.zendesk.com/documentation/webhooks/verifying/#signing-secrets-on-new-webhooks
    'dGhpc19zZWNyZXRfaXNfZm9yX3Rlc3Rpbmdfb25seQ==',
}

const prodConfig = {
  production: true,
  auth: {
    audience,
    issuer: JSON.parse(process.env.IDENTITY_SERVER_ISSUER_URL_LIST || '[]'),
  },
  port: 3333,
  clientSecretEncryptionKey: process.env.CLIENT_SECRET_ENCRYPTION_KEY,
  zendeskGeneralMandateWebhookSecret:
    process.env.ZENDESK_WEBHOOK_SECRET_GENERAL_MANDATE,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
