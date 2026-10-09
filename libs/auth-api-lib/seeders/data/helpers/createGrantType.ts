import { QueryInterface } from 'sequelize'

import { safeBulkInsert } from './safeBulkInsert'

interface GrantTypeOptions {
  /** The grant type as it is sent to the token endpoint. */
  name: string
  description: string
}

/**
 * Registers a grant type so clients can be linked to it. Safe to run when it
 * already exists, so every seed migration that needs one can declare it.
 */
export const createGrantType =
  (options: GrantTypeOptions) => async (queryInterface: QueryInterface) => {
    await safeBulkInsert(
      queryInterface,
      'grant_type',
      [{ name: options.name, description: options.description }],
      ({ name }) => `creating grant type "${name}"`,
    )
  }

/** OpenID Connect Client-Initiated Backchannel Authentication. */
export const CIBA_GRANT_TYPE = 'urn:openid:params:grant-type:ciba'

export const createCibaGrantType = createGrantType({
  name: CIBA_GRANT_TYPE,
  description:
    'OpenID Connect CIBA: a backend asks the identity server to authenticate a person on their own device.',
})
