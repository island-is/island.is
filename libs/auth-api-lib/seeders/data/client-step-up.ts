import { compose, createCibaGrantType, createClient } from './helpers'

/** The secret is created in the IDS admin. */
export const up = compose(
  createCibaGrantType,
  createClient({
    clientId: '@island.is/clients/step-up',
    clientType: 'machine',
    displayName: 'Auðkenning fyrir viðkvæmar aðgerðir',
    description:
      'GraphQL API: staðfestir viðkvæmar aðgerðir, t.d. veitingu lyfjaumboðs, með rafrænum skilríkjum notanda (CIBA).',
    grantTypes: ['urn:openid:params:grant-type:ciba'],
    allowedScopes: ['openid'],
  }),
)
