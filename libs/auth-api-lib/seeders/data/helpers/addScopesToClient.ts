import { QueryInterface } from 'sequelize'
import { safeBulkInsert } from './safeBulkInsert'

interface ClientAndScopeInformation {
  clientId: string
  scopeNames: string[]
}

export const addScopesToClient =
  ({ clientId, scopeNames }: ClientAndScopeInformation) =>
  async (queryInterface: QueryInterface) => {
    await safeBulkInsert(
      queryInterface,
      'client_allowed_scope',
      scopeNames.map((scope) => ({
        client_id: clientId,
        scope_name: scope,
      })),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ({ client_id, scope_name }) =>
        `linking scope ${scope_name} to client ${client_id}`,
    )
  }
