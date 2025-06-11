import { QueryInterface } from 'sequelize'

import { DbScope } from './types'
import { safeBulkInsert } from './safeBulkInsert'

interface TranslatedText {
  en: string
  is: string
}

interface ScopeOptions {
  /**
   * The internal name of the scope. Should be prefixed with the organisation domain, eg `@island.is`.
   */
  name: string

  /**
   * The public name of the scope, shown to users.
   * Can be a string (for Icelandic only) or an object with 'en' and 'is' properties for translations.
   */
  displayName: string | TranslatedText

  /**
   * Description of what the scope gives access to, also shown to users.
   * Can be a string (for Icelandic only) or an object with 'en' and 'is' properties for translations.
   */
  description: string | TranslatedText

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

  /**
   * Should this scope be added to the actor claim object in the access token. Defaults to false.
   */
  alsoForDelegatedUser?: boolean
}

const getScopeFields = (options: ScopeOptions): DbScope => ({
  name: options.name,
  display_name:
    typeof options.displayName === 'string'
      ? options.displayName
      : options.displayName.is,
  description:
    typeof options.description === 'string'
      ? options.description
      : options.description.is,
  grant_to_legal_guardians: options.delegation?.legalGuardians === true,
  grant_to_procuring_holders: options.delegation?.procuringHolders === true,
  also_for_delegated_user: options.alsoForDelegatedUser ?? false,
  is_access_controlled: options.accessControlled ?? false,

  // The scope name should be prefixed with the organisation domain, eg `@island.is/some-scope:name`.
  domain_name: options.name.split('/')[0],

  // defaults
  enabled: true,
  show_in_discovery_document: true,
  required: false,
  emphasize: false,
  allow_explicit_delegation_grant: options.delegation?.custom === true,
  automatic_delegation_grant: false,
})

export const getDelegationTypes = (delegations?: {
  custom?: boolean
  legalGuardians?: boolean
  procuringHolders?: boolean
}): Array<string> => {
  const types = []

  if (!delegations) {
    return types
  }

  if (delegations.custom) {
    types.push('Custom')
  }

  if (delegations.legalGuardians) {
    types.push('LegalGuardian')
  }

  if (delegations.procuringHolders) {
    types.push('ProcurationHolder')
  }

  return types
}

export const createScope =
  (options: ScopeOptions) => async (queryInterface: QueryInterface) => {
    const scope = getScopeFields(options)

    await safeBulkInsert(
      queryInterface,
      'api_scope',
      [scope],
      () => `creating scope ${scope.name}`,
    )

    // Store translations if TranslatedText objects are provided
    const translations = []

    if (typeof options.displayName !== 'string') {
      // Add English translation for display_name
      translations.push({
        language: 'en',
        class_name: 'apiscope',
        key: scope.name,
        property: 'displayName',
        value: options.displayName.en,
      })

      // Add Icelandic translation for display_name
      translations.push({
        language: 'is',
        class_name: 'apiscope',
        key: scope.name,
        property: 'displayName',
        value: options.displayName.is,
      })
    }

    if (typeof options.description !== 'string') {
      // Add English translation for description
      translations.push({
        language: 'en',
        class_name: 'apiscope',
        key: scope.name,
        property: 'description',
        value: options.description.en,
      })

      // Add Icelandic translation for description
      translations.push({
        language: 'is',
        class_name: 'apiscope',
        key: scope.name,
        property: 'description',
        value: options.description.is,
      })
    }

    if (translations.length > 0) {
      await safeBulkInsert(
        queryInterface,
        'translation',
        translations,
        ({ language, property }) =>
          `creating ${language} translation for ${scope.name}.${property}`,
      )
    }

    const delegationTypes = getDelegationTypes(options.delegation)
    if (delegationTypes.length) {
      await safeBulkInsert(
        queryInterface,
        'api_scope_delegation_types',
        delegationTypes.map((type) => ({
          api_scope_name: scope.name,
          delegation_type: type,
        })),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ({ delegation_type }) =>
          `linking scope ${scope.name} to delegation type ${delegation_type}`,
      )
    }

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
