export default {
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '@island.is',
  },
  audit: {
    defaultNamespace: '@island.is/party-letter-registry',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'icelandic-names-registry-backend',
  },
}
