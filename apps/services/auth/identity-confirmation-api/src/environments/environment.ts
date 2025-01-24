const audience = ['@island.is', '@admin.island.is']

const devConfig = {
  audit: {
    defaultNamespace: '@island.is/auth/identity-confirmation',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience,
  },
  port: 5331,
  zendeskIdentityConfirmationSecret:
    process.env.ZENDESK_IDENTITY_CONFIRMATION_SECRET ??
    //The static test signing secret from Zendesk as described in their docs
    // https://developer.zendesk.com/documentation/webhooks/verifying/#signing-secrets-on-new-webhooks
    'dGhpc19zZWNyZXRfaXNfZm9yX3Rlc3Rpbmdfb25seQ==',
}

const prodConfig = {
  audit: {
    defaultNamespace: '@island.is/auth/identity-confirmation-api',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-auth-identity-confirmation',
  },
  auth: {
    audience,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL!,
  },
  port: 3331,
  zendeskIdentityConfirmationSecret:
    process.env.ZENDESK_IDENTITY_CONFIRMATION_SECRET,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
