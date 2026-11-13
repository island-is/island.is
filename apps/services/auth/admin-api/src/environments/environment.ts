// Zendesk's documented test secret is only used for local development and schema generation.
const testZendeskWebhookSecret =
  'dGhpc19zZWNyZXRfaXNfZm9yX3Rlc3Rpbmdfb25seQ=='
const schemaZendeskWebhookSecret =
  process.env.INIT_SCHEMA === 'true' ? testZendeskWebhookSecret : undefined

const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/auth-admin-api',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
  },
  port: 6333,
  clientSecretEncryptionKey:
    process.env.CLIENT_SECRET_ENCRYPTION_KEY ?? 'secret',
  zendeskGeneralMandateWebhookSecret:
    process.env.ZENDESK_WEBHOOK_SECRET_GENERAL_MANDATE ||
    testZendeskWebhookSecret,
  zendeskDeleteGeneralMandateWebhookSecret:
    process.env.ZENDESK_WEBHOOK_SECRET_DELETE_GENERAL_MANDATE ||
    testZendeskWebhookSecret,
  zendeskIdentityConfirmationSecret:
    process.env.ZENDESK_WEBHOOK_SECRET_IDENTITY_CONFIRMATION ||
    testZendeskWebhookSecret,
}

const prodConfig = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/auth-admin-api',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-auth-admin-api',
  },
  auth: {
    issuer: JSON.parse(process.env.IDENTITY_SERVER_ISSUER_URL_LIST || '[]'),
  },
  port: 3333,
  clientSecretEncryptionKey: process.env.CLIENT_SECRET_ENCRYPTION_KEY,
  zendeskGeneralMandateWebhookSecret:
    process.env.ZENDESK_WEBHOOK_SECRET_GENERAL_MANDATE ||
    schemaZendeskWebhookSecret,
  zendeskIdentityConfirmationSecret:
    process.env.ZENDESK_WEBHOOK_SECRET_IDENTITY_CONFIRMATION ||
    schemaZendeskWebhookSecret,
  zendeskDeleteGeneralMandateWebhookSecret:
    process.env.ZENDESK_WEBHOOK_SECRET_DELETE_GENERAL_MANDATE ||
    schemaZendeskWebhookSecret,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
