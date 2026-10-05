import { compose, createCibaGrantType, createClient } from './helpers'

/**
 * delegation-api's own client for confirming sensitive delegations (tvöfalt
 * samþykki). It asks the identity server, over CIBA, to authenticate the
 * grantor on their phone, and collects the result. It can do nothing else: no
 * client credentials, no offline access, no other scopes.
 *
 * The secret is created in the IDS admin and stored in
 * /k8s/services-auth/DELEGATION_CONFIRMATION_CIBA_CLIENT_SECRET.
 */
export const up = compose(
  createCibaGrantType,
  createClient({
    clientId: '@island.is/clients/delegation-confirmation',
    clientType: 'machine',
    displayName: 'Staðfesting umboða',
    description:
      'delegation-api: staðfestir viðkvæm umboð með rafrænum skilríkjum veitanda (CIBA).',
    grantTypes: ['urn:openid:params:grant-type:ciba'],
    allowedScopes: ['openid'],
  }),
)
