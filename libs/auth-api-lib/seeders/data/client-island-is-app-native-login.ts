import { QueryInterface } from 'sequelize'

import {
  CIBA_GRANT_TYPE,
  compose,
  createCibaGrantType,
  createClient,
  createDeviceKeyGrantType,
  DEVICE_KEY_GRANT_TYPE,
} from './helpers'
import { safeBulkInsert } from './helpers/safeBulkInsert'

const CLIENT_ID = '@island.is/app'

/**
 * Native login for the Ísland.is app: CIBA authenticated by the install key,
 * and biometric unlock with the device-key grant.
 *
 * The client stays public with DPoP optional, so installed versions using the
 * browser login keep working. IdentityServer requires DPoP of every attested
 * install itself. Switching require_client_secret and require_dpop on is a
 * later migration, once every version in use logs in natively.
 */
/** The testing app's own client in production; configured where it exists. */
const TESTING_CLIENT_ID = '@island.is/island.dev-appid'

const configureNativeLogin = (clientId: string) => async (
  queryInterface: QueryInterface,
) => {
  const [
    clients,
  ] = await queryInterface.sequelize.query(
    'select 1 from client where client_id = :clientId',
    { replacements: { clientId } },
  )
  if (clients.length === 0) {
    console.log(`Skipping "${clientId}": the client does not exist here.`)
    return
  }

  await safeBulkInsert(
    queryInterface,
    'client_grant_type',
    [CIBA_GRANT_TYPE, DEVICE_KEY_GRANT_TYPE].map((grantType) => ({
      client_id: clientId,
      grant_type: grantType,
    })),
    ({ grant_type }) => `adding grant type "${grant_type}" to "${clientId}"`,
  )

  await queryInterface.sequelize.query(
    `
        update client
        set allowed_acr = array(
              select distinct unnest(allowed_acr || array['islandis-app-biometrics']::varchar[])
            ),
            allow_offline_access = true
        where client_id = :clientId
      `,
    { replacements: { clientId } },
  )
}

export const up = compose(
  createCibaGrantType,
  createDeviceKeyGrantType,
  // Only creates the client where it doesn't exist yet, i.e. locally.
  createClient({
    clientId: CLIENT_ID,
    clientType: 'native',
    displayName: 'Ísland.is appið',
    description: 'Ísland.is appið',
    grantTypes: ['authorization_code'],
    allowedScopes: ['openid', 'profile', 'offline_access'],
    redirectUris: {
      dev: ['is.island.app.dev://oauth', 'is.island.app.dev.auth://oauth'],
      staging: ['is.island.app.dev://oauth', 'is.island.app.dev.auth://oauth'],
      prod: ['is.island.app://oauth', 'is.island.app.auth://oauth'],
    },
  }),
  configureNativeLogin(CLIENT_ID),
  configureNativeLogin(TESTING_CLIENT_ID),
)
