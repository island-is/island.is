import { QueryInterface } from 'sequelize'
import { DbScope } from './types'
import { safeBulkInsert } from './safeBulkInsert'

interface ScopeOptions {
  /**
   * The internal name of the scope. Should be prefixed with the organisation domain, eg `@island.is`.
   */
  name: string

  /**
   * The public name of the scope, shown to users.
   */
  displayName: string

  /**
   * Description of what the scope gives access to, also shown to users.
   */
  description: string

  /**
   * Configures if the scope should be automatically granted to legal guardians and procuring holders, or if it should support custom delegations. Defaults to no delegation support.
   */
  delegation?: {
    custom?: boolean
    legalGuardians?: boolean
    procuringHolders?: boolean
  }

  /**
   * Makes this a special scope that normal users don't have access to. It is possible to give users access to this scope in the IDS admin. This is a simple tool to manage access to admin clients and resources.
   */
  accessControlled?: boolean

  /**
   * Specifies which resource this scope belongs to. Defaults to `@island.is`.
   */
  addToResource?: string

  /**
   * Adds this scope as `allowedScopes` for the specified clients.
   */
  addToClients?: Array<string>

  /**
   * Configures which claims the scope requires. Defaults to `nationalId`.
   */
  claims?: Array<string>
}

const getScopeFields = (options: ScopeOptions): DbScope => ({
  name: options.name,
  display_name: options.displayName,
  description: options.description,
  grant_to_legal_guardians: options.delegation?.legalGuardians === true,
  grant_to_procuring_holders: options.delegation?.procuringHolders === true,
  also_for_delegated_user: options.delegation?.custom === true,
  is_access_controlled: options.accessControlled ?? false,

  // The scope name should be prefixed with the organisation domain, eg `@island.is/some-scope:name`.
  domain_name: options.name.split('/')[0],

  // defaults
  enabled: true,
  show_in_discovery_document: true,
  required: false,
  emphasize: false,
  allow_explicit_delegation_grant: false,
  automatic_delegation_grant: false,
})

export const createScope =
  (options: ScopeOptions) => async (queryInterface: QueryInterface) => {
    const scope = getScopeFields(options)

    await safeBulkInsert(
      queryInterface,
      'api_scope',
      [scope],
      () => `creating scope ${scope.name}`,
    )

    const claims = options.claims ?? ['nationalId']
    await safeBulkInsert(
      queryInterface,
      'api_scope_user_claim',
      claims.map((claim) => ({
        api_scope_name: scope.name,
        claim_name: claim,
      })),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ({ claim_name }) => `linking scope ${scope.name} to claim ${claim_name}`,
    )

    await safeBulkInsert(
      queryInterface,
      'api_resource_scope',
      [
        {
          api_resource_name: options.addToResource ?? '@island.is',
          scope_name: scope.name,
        },
      ],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ({ api_resource_name }) =>
        `linking scope ${scope.name} to resource ${api_resource_name}`,
    )

    if (options.addToClients?.length) {
      await safeBulkInsert(
        queryInterface,
        'client_allowed_scope',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        options.addToClients.map((client_id) => ({
          client_id,
          scope_name: scope.name,
        })),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ({ client_id }) => `linking scope ${scope.name} to client ${client_id}`,
      )
    }
  }
