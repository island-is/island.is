import { compose, createCibaGrantType, createClient } from './helpers'

/** CIBA only, so it can do nothing else. The secret is created in the IDS admin. */
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
