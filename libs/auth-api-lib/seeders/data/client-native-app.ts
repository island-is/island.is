import { QueryInterface, Transaction } from 'sequelize'

import {
  addScopesToClient,
  CIBA_GRANT_TYPE,
  compose,
  createCibaGrantType,
  createDeviceKeyGrantType,
  DEVICE_KEY_GRANT_TYPE,
} from './helpers'

/**
 * The Ísland.is app's native login moves to its own client,
 * `@island.is/native-app`, which only authenticates with a client attestation:
 * IdentityServer refuses any request from it without one. It starts as a copy
 * of `@island.is/app`, without its browser login (redirect URIs and the
 * authorization code grant) and secrets.
 *
 * `@island.is/app` keeps only the browser login, for the installed app
 * versions that use it, until it is retired. It keeps its native app settings:
 * those versions report attestation checks under it, and its leftover native
 * sessions still need an attestation and an app login to refresh.
 */
const SOURCE_CLIENT_ID = '@island.is/app'
const CLIENT_ID = '@island.is/native-app'
/** The testing app's own client in production; configured where it exists. */
const TESTING_CLIENT_ID = '@island.is/island.dev-appid'
const PASSKEYS_SCOPE = '@island.is/auth/passkeys'
const BIOMETRICS_ACR = 'islandis-app-biometrics'

const CHILD_TABLES = [
  'client_allowed_scope',
  'client_delegation_types',
  'client_claim',
  'client_allowed_cors_origin',
  'client_idp_restrictions',
]

const getColumns = async (
  queryInterface: QueryInterface,
  table: string,
  transaction: Transaction,
): Promise<string[]> => {
  const [rows] = await queryInterface.sequelize.query(
    `
      select column_name
      from information_schema.columns
      where table_schema = 'public'
        and table_name = :table
        and is_generated = 'NEVER'
        and coalesce(identity_generation, '') <> 'ALWAYS'
      order by ordinal_position
    `,
    { replacements: { table }, transaction },
  )
  return (rows as { column_name: string }[]).map((row) => row.column_name)
}

const exists = async (
  queryInterface: QueryInterface,
  sql: string,
  replacements: Record<string, unknown>,
  transaction: Transaction,
) => {
  const [rows] = await queryInterface.sequelize.query(sql, {
    replacements,
    transaction,
  })
  return rows.length > 0
}

const clientExists = (
  queryInterface: QueryInterface,
  clientId: string,
  transaction: Transaction,
) =>
  exists(
    queryInterface,
    'select 1 from client where client_id = :clientId',
    { clientId },
    transaction,
  )

const tableExists = (
  queryInterface: QueryInterface,
  table: string,
  transaction: Transaction,
) =>
  exists(
    queryInterface,
    `select 1 from information_schema.tables where table_schema = 'public' and table_name = :table`,
    { table },
    transaction,
  )

/**
 * Copies the rows matching `where` in `table`, with `overrides` (column → SQL
 * expression) in place of the source's values. Timestamps become now().
 */
const copyRows = async (
  queryInterface: QueryInterface,
  transaction: Transaction,
  table: string,
  where: string,
  overrides: Record<string, string>,
  replacements: Record<string, unknown>,
) => {
  const columns = await getColumns(queryInterface, table, transaction)
  if (columns.length === 0) {
    console.log(`Skipping "${table}": the table does not exist here.`)
    return
  }

  const values = columns.map((column) => {
    if (column in overrides) return overrides[column]
    if (column === 'created' || column === 'modified') return 'now()'
    return `"${column}"`
  })

  const [inserted] = await queryInterface.sequelize.query(
    `
      insert into "${table}" (${columns.map((c) => `"${c}"`).join(', ')})
      select ${values.join(', ')}
      from "${table}"
      where ${where}
      on conflict do nothing
      returning 1
    `,
    { replacements, transaction },
  )
  console.log(`Copied ${inserted.length} rows of "${table}" to "${CLIENT_ID}".`)
}

const copyClient = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    if (!(await clientExists(queryInterface, SOURCE_CLIENT_ID, transaction))) {
      console.log(`Skipping "${CLIENT_ID}": "${SOURCE_CLIENT_ID}" is missing.`)
      return
    }
    if (await clientExists(queryInterface, CLIENT_ID, transaction)) {
      console.log(`Skipping "${CLIENT_ID}": the client exists already.`)
      return
    }

    const replacements = { source: SOURCE_CLIENT_ID, target: CLIENT_ID }

    await copyRows(
      queryInterface,
      transaction,
      'client',
      'client_id = :source',
      {
        client_id: ':target',
        require_client_secret: 'true',
        require_dpop: 'true',
        require_pkce: 'false',
        allow_offline_access: 'true',
      },
      replacements,
    )

    for (const table of CHILD_TABLES) {
      await copyRows(
        queryInterface,
        transaction,
        table,
        'client_id = :source',
        { client_id: ':target' },
        replacements,
      )
    }

    await copyRows(
      queryInterface,
      transaction,
      'translation',
      `class_name = 'client' and key = :source`,
      { key: ':target' },
      replacements,
    )

    await queryInterface.sequelize.query(
      `
        insert into client_grant_type (client_id, grant_type)
        values (:target, :ciba), (:target, :deviceKey)
        on conflict do nothing
      `,
      {
        replacements: {
          ...replacements,
          ciba: CIBA_GRANT_TYPE,
          deviceKey: DEVICE_KEY_GRANT_TYPE,
        },
        transaction,
      },
    )
  })
}

const configureTestingClient = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    if (!(await clientExists(queryInterface, TESTING_CLIENT_ID, transaction))) {
      console.log(`Skipping "${TESTING_CLIENT_ID}": the client does not exist.`)
      return
    }

    const options = {
      replacements: { clientId: TESTING_CLIENT_ID },
      transaction,
    }
    await queryInterface.sequelize.query(
      `
        update client
        set require_client_secret = true, require_dpop = true
        where client_id = :clientId
      `,
      options,
    )
    await queryInterface.sequelize.query(
      `delete from client_grant_type where client_id = :clientId and grant_type = 'authorization_code'`,
      options,
    )
    await queryInterface.sequelize.query(
      'delete from client_redirect_uri where client_id = :clientId',
      options,
    )
    await queryInterface.sequelize.query(
      'delete from client_post_logout_redirect_uri where client_id = :clientId',
      options,
    )
  })
}

const stripSourceClient = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    if (!(await clientExists(queryInterface, SOURCE_CLIENT_ID, transaction))) {
      console.log(`Skipping "${SOURCE_CLIENT_ID}": the client does not exist.`)
      return
    }

    const replacements = { clientId: SOURCE_CLIENT_ID }
    await queryInterface.sequelize.query(
      `
        delete from client_grant_type
        where client_id = :clientId and grant_type in (:grantTypes)
      `,
      {
        replacements: {
          ...replacements,
          grantTypes: [CIBA_GRANT_TYPE, DEVICE_KEY_GRANT_TYPE],
        },
        transaction,
      },
    )
    await queryInterface.sequelize.query(
      `
        update client
        set allowed_acr = array_remove(allowed_acr, :acr)
        where client_id = :clientId
      `,
      { replacements: { ...replacements, acr: BIOMETRICS_ACR }, transaction },
    )

    if (await tableExists(queryInterface, 'device_registration', transaction)) {
      await queryInterface.sequelize.query(
        'delete from device_registration where client_id = :clientId',
        { replacements, transaction },
      )
    }
  })
}

// On a fresh database the passkeys scope is seeded later.
const addPasskeysScope = async (queryInterface: QueryInterface) => {
  const ready = await queryInterface.sequelize.transaction(
    async (transaction) =>
      (await clientExists(queryInterface, CLIENT_ID, transaction)) &&
      (await exists(
        queryInterface,
        'select 1 from api_scope where name = :scope',
        { scope: PASSKEYS_SCOPE },
        transaction,
      )),
  )
  if (!ready) {
    console.log(`Skipping "${PASSKEYS_SCOPE}" for "${CLIENT_ID}".`)
    return
  }
  await addScopesToClient({
    clientId: CLIENT_ID,
    scopeNames: [PASSKEYS_SCOPE],
  })(queryInterface)
}

export const up = compose(
  createCibaGrantType,
  createDeviceKeyGrantType,
  copyClient,
  configureTestingClient,
  stripSourceClient,
  addPasskeysScope,
)
