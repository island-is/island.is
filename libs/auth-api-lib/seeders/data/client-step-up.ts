import { compose, createCibaGrantType, createClient } from './helpers'

/**
 * The GraphQL API's own client for unlocking locked screens in the app. It asks
 * the identity server, over CIBA, to authenticate the person behind the app
 * session on their phone, and collects the result. It can do nothing else: no
 * client credentials, no offline access, no other scopes.
 *
 * The secret is created in the IDS admin and stored in
 * /k8s/api/STEP_UP_CIBA_CLIENT_SECRET.
 */
export const up = compose(
  createCibaGrantType,
  createClient({
    clientId: '@island.is/clients/step-up',
    clientType: 'machine',
    displayName: 'Opnun læstra skjáa',
    description:
      'GraphQL API: staðfestir með rafrænum skilríkjum að eigandi appsins sé við tækið áður en læstir skjáir opnast (CIBA).',
    grantTypes: ['urn:openid:params:grant-type:ciba'],
    allowedScopes: ['openid'],
  }),
)
