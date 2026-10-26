import { QueryInterface } from 'sequelize'

import { safeBulkInsert } from './safeBulkInsert'

interface GrantTypeOptions {
  name: string
  description: string
}

export const createGrantType =
  (options: GrantTypeOptions) => async (queryInterface: QueryInterface) => {
    await safeBulkInsert(
      queryInterface,
      'grant_type',
      [{ name: options.name, description: options.description }],
      ({ name }) => `creating grant type "${name}"`,
    )
  }

export const CIBA_GRANT_TYPE = 'urn:openid:params:grant-type:ciba'

export const createCibaGrantType = createGrantType({
  name: CIBA_GRANT_TYPE,
  description:
    'OpenID Connect CIBA: a backend asks the identity server to authenticate a person on their own device.',
})
