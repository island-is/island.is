import { QueryInterface } from 'sequelize'
import { getCurrentEnvValue, ValueOrEnved } from './env'
import { DbClient } from './types'
import { safeBulkInsert } from './safeBulkInsert'
import { getDelegationTypes } from './createScope'

interface TranslatedText {
  en: string
  is: string
}

type GrantType =
  | 'authorization_code'
  | 'client_credentials'
  | 'urn:ietf:params:oauth:grant-type:token-exchange'

interface ClientOptions {
  /**
   * Internal id of the client. Should be prefixed with the organisation domain, eg `@island.is`.
   */
  clientId: string

  /**
   * Public name of the client. Will be shown to the user when they are authenticating.
   * Can be a string (for Icelandic only) or an object with 'en' and 'is' properties for translations.
   */
  displayName: string | TranslatedText

  /**
   * Describes the purpose of the client. Not shown to the user.
   * Can be a string (for Icelandic only) or an object with 'en' and 'is' properties for translations.
   */
  description: string | TranslatedText

  /**
   * Should be `spa` for front-end web apps, `web` for websites that have a cookie based  authentication through a backend, `native` for mobile apps and `machine` for backend clients.
   */
  clientType: 'spa' | 'native' | 'web' | 'machine'

  /**
   * Specifies which token grant flows the client can use. Defaults to `['client_credentials']` for `machine` and `web` clients, `['authorization_code']` for `spa` and `native` clients.
   */
  grantTypes?: Array<GrantType>
  supportDelegations?: boolean

  /**
   * The scopes this client can request. Should include `openid` and any identity and api scopes that the client needs access to.
   */
  allowedScopes?: Array<string>

  /**
   * Should specify the list of allowed redirect uris for each environment.
   */
  redirectUris?: ValueOrEnved<Array<string>>

  /**
   * Where the user should be redirected to after logging out.
   */
  postLogoutRedirectUri?: ValueOrEnved<string>

  /**
   * Defaults to Digital Iceland's national id.
   */
  contactNationalId?: string

  /**
   * Defaults to Digital Iceland's technical contact.
   */
  contactEmail?: string
}

const getClientFields = (options: ClientOptions): DbClient => ({
  client_id: options.clientId,
  client_name:
    typeof options.displayName === 'string'
      ? options.displayName
      : options.displayName.is,
  description:
    typeof options.description === 'string'
      ? options.description
      : options.description.is,
  client_type: options.clientType,
  require_client_secret:
    options.clientType === 'web' || options.clientType === 'machine',
  require_pkce: options.clientType === 'spa' || options.clientType === 'native',
  supports_custom_delegation: options.supportDelegations ?? false,
  supports_legal_guardians: options.supportDelegations ?? false,
  supports_procuring_holders: options.supportDelegations ?? false,
  supports_personal_representatives: options.supportDelegations ?? false,

  // eslint-disable-next-line local-rules/disallow-kennitalas
  national_id: options.contactNationalId ?? '5501692829',
  contact_email: options.contactEmail ?? 'island@island.is',

  //defaults
  allow_offline_access: false,
  identity_token_lifetime: 300, // 5 minutes
  access_token_lifetime: 300, // 5 minutes
  authorization_code_lifetime: 300, // 5 minutes
  absolute_refresh_token_lifetime: 2592000, // 30 days
  sliding_refresh_token_lifetime: 1296000, // 15 days
  consent_lifetime: 3600, // 1 hour
  refresh_token_usage: 1,
  update_access_token_claims_on_refresh: true,
  refresh_token_expiration: 1,
  access_token_type: 0,
  enable_local_login: true,
  include_jwt_id: true,
  always_send_client_claims: false,
  pair_wise_subject_salt: undefined,
  user_sso_lifetime: undefined,
  user_code_type: undefined,
  device_code_lifetime: 300,
  always_include_user_claims_in_id_token: true,
  back_channel_logout_session_required: true,
  enabled: true,
  logo_uri: undefined,
  require_consent: false,
  allow_plain_text_pkce: false,
  require_request_object: false,
  allow_access_token_via_browser: false,
  front_channel_logout_uri: undefined,
  front_channel_logout_session_required: true,
  back_channel_logout_uri: undefined,
  allow_remember_consent: true,
  client_claims_prefix: 'client_',
  protocol_type: 'oidc',
  prompt_delegations: false,
})

export const createClient =
  (options: ClientOptions) => async (queryInterface: QueryInterface) => {
    const client = getClientFields(options)
    const grantTypes: GrantType[] =
      options.grantTypes ??
      (['spa', 'native', 'web'].includes(options.clientType)
        ? ['authorization_code']
        : ['client_credentials'])

    await safeBulkInsert(
      queryInterface,
      'client',
      [client],
      () => `creating client "${client.client_id}"`,
    )

    // Store translations if TranslatedText objects are provided
    const translations = []

    if (typeof options.displayName !== 'string') {
      // Add English translation for client_name
      translations.push({
        language: 'en',
        class_name: 'client',
        key: client.client_id,
        property: 'clientName',
        value: options.displayName.en,
      })

      // Add Icelandic translation for client_name
      translations.push({
        language: 'is',
        class_name: 'client',
        key: client.client_id,
        property: 'clientName',
        value: options.displayName.is,
      })
    }

    if (typeof options.description !== 'string') {
      // Add English translation for description
      translations.push({
        language: 'en',
        class_name: 'client',
        key: client.client_id,
        property: 'description',
        value: options.description.en,
      })

      // Add Icelandic translation for description
      translations.push({
        language: 'is',
        class_name: 'client',
        key: client.client_id,
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
          `creating ${language} translation for ${client.client_id}.${property}`,
      )
    }

    const delegationTypes = getDelegationTypes({
      legalGuardians: options.supportDelegations,
      procuringHolders: options.supportDelegations,
      custom: options.supportDelegations,
    })

    if (delegationTypes.length) {
      // fetch all personal representative delegation types
      const personalRepresentativeDelegationTypes = await queryInterface
        .sequelize.query(`
        SELECT * FROM delegation_type
        WHERE id LIKE 'PersonalRepresentative:%'`)

      delegationTypes.push(
        ...(personalRepresentativeDelegationTypes[0]?.map(
          (type: { id: string }) => type.id,
        ) ?? []),
      )

      await safeBulkInsert(
        queryInterface,
        'client_delegation_types',
        delegationTypes.map((type) => ({
          client_id: client.client_id,
          delegation_type: type,
        })),
        ({ delegation_type }) =>
          `linking delegation type "${delegation_type}" to "${client.client_id}"`,
      )
    }

    if (grantTypes.length) {
      await safeBulkInsert(
        queryInterface,
        'client_grant_type',
        grantTypes.map((grant_type) => ({
          client_id: client.client_id,
          grant_type,
        })),
        ({ grant_type }) =>
          `linking grant type "${grant_type}" to "${client.client_id}"`,
      )
    }

    if (options.allowedScopes?.length) {
      await safeBulkInsert(
        queryInterface,
        'client_allowed_scope',
        options.allowedScopes.map((scope) => ({
          client_id: client.client_id,
          scope_name: scope,
        })),
        ({ scope_name }) =>
          `linking scope "${scope_name}" to "${client.client_id}"`,
      )
    }

    const redirectUris = getCurrentEnvValue(options.redirectUris || {})
    if (redirectUris?.length) {
      await safeBulkInsert(
        queryInterface,
        'client_redirect_uri',
        redirectUris.map((uri) => ({
          client_id: client.client_id,
          redirect_uri: uri,
        })),
        ({ redirect_uri }) =>
          `linking redirect uri "${redirect_uri}" to "${client.client_id}"`,
      )
    }

    const postLogoutRedirectUri = getCurrentEnvValue(
      options.postLogoutRedirectUri || {},
    )
    if (postLogoutRedirectUri) {
      await safeBulkInsert(
        queryInterface,
        'client_post_logout_redirect_uri',
        [{ client_id: client.client_id, redirect_uri: postLogoutRedirectUri }],
        ({ redirect_uri }) =>
          `linking post logout redirect uri "${redirect_uri}" to "${client.client_id}"`,
      )
    }
  }
