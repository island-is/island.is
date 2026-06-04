import { defineMessages } from 'react-intl'

export const m = defineMessages({
  idsAdmin: {
    id: 'ap.ids-admin:ids-admin',
    defaultMessage: 'Innskráningarkerfi',
  },
  idsAdminDescription: {
    id: 'ap.ids-admin:ids-admin-description',
    defaultMessage: 'Choose the domain you want to manage.',
  },
  tenants: {
    id: 'ap.ids-admin:tenants',
    defaultMessage: 'Tenants',
  },
  tenant: {
    id: 'ap.ids-admin:tenant',
    defaultMessage: 'Tenant',
  },
  errorLoadingData: {
    id: 'ap.ids-admin:error-loading-data',
    defaultMessage: 'Error loading data. Please try again later.',
  },
  clearFilter: {
    id: 'ap.ids-admin:clear-filter',
    defaultMessage: 'Clear filter',
  },
  noResultsForSearch: {
    id: 'ap.ids-admin:no-results-for-search',
    defaultMessage: 'No results found for your search',
  },
  clearAllFilters: {
    id: 'ap.ids-admin:clear-all-filters',
    defaultMessage: 'Clear all filters',
  },
  openFilter: {
    id: 'ap.ids-admin:open-filter',
    defaultMessage: 'Open filter',
  },
  closeFilter: {
    id: 'ap.ids-admin:close-filter',
    defaultMessage: 'Close filter',
  },
  searchPlaceholder: {
    id: 'ap.ids-admin:search-placeholder',
    defaultMessage: 'Search',
  },
  client: {
    id: 'ap.ids-admin:client',
    defaultMessage: 'Client',
  },
  clients: {
    id: 'ap.ids-admin:clients',
    defaultMessage: 'Clients',
  },
  applicationCreate: {
    id: 'ap.ids-admin:client-create',
    defaultMessage: 'Create client',
  },
  apis: {
    id: 'ap.ids-admin:apis',
    defaultMessage: 'APIs',
  },
  settings: {
    id: 'ap.ids-admin:settings',
    defaultMessage: 'Settings',
  },
  advancedSettings: {
    id: 'ap.ids-admin:advanced-settings',
    defaultMessage: 'Advanced settings',
  },
  modified: {
    id: 'ap.ids-admin:modified',
    defaultMessage: 'Last modified: {date}',
  },
  back: {
    id: 'ap.ids-admin:back',
    defaultMessage: 'Back',
  },
  clientsDescription: {
    id: 'ap.ids-admin:clients-description',
    defaultMessage: 'Here you can view and create clients.',
  },
  needHelpTitle: {
    id: 'ap.ids-admin:need-help-title',
    defaultMessage: 'Do you need help?',
  },
  needHelpDescription: {
    id: 'ap.ids-admin:need-help-description',
    defaultMessage: 'Check out the documentation.',
  },
  learnMore: {
    id: 'ap.ids-admin:learn-more',
    defaultMessage: 'Learn more',
  },
  noMatchingClients: {
    id: 'ap.ids-admin:no-matching-clients',
    defaultMessage: 'No clients match the current filter.',
  },
  noClients: {
    id: 'ap.ids-admin:no-clients',
    defaultMessage: 'No clients',
  },
  noClientsDescription: {
    id: 'ap.ids-admin:no-clients-description',
    defaultMessage: 'You can create a client by clicking on Create client',
  },
  cancel: {
    id: 'ap.ids-admin:cancel',
    defaultMessage: 'Cancel',
  },
  close: {
    id: 'ap.ids-admin:close',
    defaultMessage: 'Close',
  },
  add: {
    id: 'ap.ids-admin:add',
    defaultMessage: 'Add',
  },
  create: {
    id: 'ap.ids-admin:create',
    defaultMessage: 'Create',
  },
  save: {
    id: 'ap.ids-admin:save',
    defaultMessage: 'Save',
  },
  edit: {
    id: 'ap.ids-admin:edit',
    defaultMessage: 'Edit',
  },
  environments: {
    id: 'ap.ids-admin:environments',
    defaultMessage: 'Environments',
  },
  displayName: {
    id: 'ap.ids-admin:display-name',
    defaultMessage: 'Name',
  },
  displayNameDescription: {
    id: 'ap.ids-admin:display-name-description',
    defaultMessage: 'Users see this when they sign in, and manage consents.',
  },
  description: {
    id: 'ap.ids-admin:description',
    defaultMessage: 'Description',
  },
  descriptionInfo: {
    id: 'ap.ids-admin:description-info',
    defaultMessage:
      'Users see this when they sign in, and manage consents. This should explain in concise and clear terms which resources or actions this API scope gives access to.',
  },
  descriptionChangeWarningTitle: {
    id: 'ap.ids-admin:description-change-warning-title',
    defaultMessage: 'Are you sure you want to change the description?',
  },
  descriptionChangeWarningMessage: {
    id: 'ap.ids-admin:description-change-warning-message',
    defaultMessage:
      'Users may have already granted active delegations based on the current description. Changing it now retroactively alters what those delegations appear to authorize, which can mislead the people who granted them. Only proceed if you are sure the new wording still accurately reflects what the permission allows.',
  },
  clientId: {
    id: 'ap.ids-admin:clientId',
    defaultMessage: 'Client ID',
  },
  chooseEnvironment: {
    id: 'ap.ids-admin:choose-environment',
    defaultMessage: 'Choose environment',
  },
  chooseClientType: {
    id: 'ap.ids-admin:choose-client-type',
    defaultMessage: 'Choose client type',
  },
  errorDisplayName: {
    id: 'ap.ids-admin:error-display-name',
    defaultMessage: 'Name is required.',
  },
  errorDescription: {
    id: 'ap.ids-admin:error-description',
    defaultMessage: 'Description is required.',
  },
  errorClientId: {
    id: 'ap.ids-admin:error-client-id',
    defaultMessage: 'Client ID is required.',
  },
  errorClientIdRegex: {
    id: 'ap.ids-admin:error-client-id-regex',
    defaultMessage: 'Allowed characters are A-Z a-z 0-9 . _ - /',
  },
  errorScopeId: {
    id: 'ap.ids-admin:error-scope-id',
    defaultMessage: 'Scope ID is required.',
  },
  errorScopeIdRegex: {
    id: 'ap.ids-admin:error-scope-id-regex',
    defaultMessage: 'Allowed characters are A-Z a-z 0-9 . _ - / :',
  },
  errorEnvironment: {
    id: 'ap.ids-admin:error-environment',
    defaultMessage: 'Choose at least one environment.',
  },
  errorClientType: {
    id: 'ap.ids-admin:error-client-type',
    defaultMessage: 'Client type is required.',
  },
  errorDefault: {
    id: 'ap.ids-admin:error-default',
    defaultMessage: 'Oops, an unknown error has occurred.',
  },
  webClientsTitle: {
    id: 'ap.ids-admin:web-clients-title',
    defaultMessage: 'Web client',
  },
  webClientsDescription: {
    id: 'ap.ids-admin:web-clients-description',
    defaultMessage:
      'Traditional web apps using redirects. E.g. Node.js, Express, ASP.net, Java, PHP.',
  },
  nativeClientsTitle: {
    id: 'ap.ids-admin:native-clients-title',
    defaultMessage: 'Native client',
  },
  nativeClientsDescription: {
    id: 'ap.ids-admin:native-clients-description',
    defaultMessage:
      'Mobile, desktop, CLI and smart device app running natively. E.g. iOS, Electron, Apple TV app.',
  },
  machineClientsTitle: {
    id: 'ap.ids-admin:machine-clients-title',
    defaultMessage: 'Machine to machine client',
  },
  machineClientsDescription: {
    id: 'ap.ids-admin:machine-clients-description',
    defaultMessage:
      'CLIs, daemons, or services running on your backend. E.g. APIs, CRON jobs or shell script.',
  },
  spaClientsTitle: {
    id: 'ap.ids-admin:spa-clients-title',
    defaultMessage: 'Single page application client',
  },
  createClient: {
    id: 'ap.ids-admin:create-client',
    defaultMessage: 'Create client',
  },
  change: {
    id: 'ap.ids-admin:change',
    defaultMessage: 'Change',
  },
  restore: {
    id: 'ap.ids-admin:restore',
    defaultMessage: 'Restore',
  },
  restoreClient: {
    id: 'ap.ids-admin:restore-client',
    defaultMessage: 'Restore client',
  },
  restoreClientDescription: {
    id: 'ap.ids-admin:restore-client-description',
    defaultMessage: 'Restore this archived client across all environments.',
  },
  restoreClientAlertMessage: {
    id: 'ap.ids-admin:restore-client-alert-message',
    defaultMessage:
      'Restoring this client may re-enable access to systems. Please verify the client settings after restoring.',
  },
  successRestoringClient: {
    id: 'ap.ids-admin:success-restoring-client',
    defaultMessage: 'Successfully restored client',
  },
  archived: {
    id: 'ap.ids-admin:archived',
    defaultMessage: 'Archived',
  },
  clientStatus: {
    id: 'ap.ids-admin:client-status',
    defaultMessage: 'Status',
  },
  activeClients: {
    id: 'ap.ids-admin:active-clients',
    defaultMessage: 'Active',
  },
  archivedClients: {
    id: 'ap.ids-admin:archived-clients',
    defaultMessage: 'Archived',
  },
  allClients: {
    id: 'ap.ids-admin:all-clients',
    defaultMessage: 'All',
  },
  absoluteLifetime: {
    id: 'ap.ids-admin:absolute-lifetime',
    defaultMessage: 'Absolute lifetime (seconds)',
  },
  absoluteLifetimeDescription: {
    id: 'ap.ids-admin:absolute-lifetime-description',
    defaultMessage:
      'Sets the absolute lifetime of a refresh token (in seconds).',
  },
  readableSeconds: {
    id: 'ap.ids-admin:readable-seconds',
    defaultMessage:
      '{sec} seconds is {isExact, select, true {equal to} other {more than}} {value} {unit, select, years {{value, plural, =1 {year} other {years}}} months {{value, plural, =1 {month} other {months}}} days {{value, plural, =1 {day} other {days}}} hours {{value, plural, =1 {hour} other {hours}}} minutes {{value, plural, =1 {minute} other {minutes}}} other {{value, plural, =1 {second} other {seconds}}}}.',
    description:
      'For transforming seconds to more human readable format. The end of the string displays the unit in singular or plural form.',
  },
  inactivityExpiration: {
    id: 'ap.ids-admin:inactivity-expiration',
    defaultMessage: 'Inactivity expiration',
  },
  inactivityExpirationDescription: {
    id: 'ap.ids-admin:inactivity-expiration-description',
    defaultMessage:
      'When enabled, refresh tokens will expire after a specified inactivity lifetime. This can be used to end inactive sessions while allowing longer active sessions.',
  },
  inactivityLifetime: {
    id: 'ap.ids-admin:inactivity-lifetime',
    defaultMessage: 'Inactivity lifetime (seconds)',
  },
  inactivityLifetimeDescription: {
    id: 'ap.ids-admin:inactivity-lifetime-description',
    defaultMessage:
      'Sets the inactivity lifetime of a refresh token (in seconds).',
  },
  saveSettings: {
    id: 'ap.ids-admin:save-settings',
    defaultMessage: 'Save settings',
  },
  saveForAllEnvironments: {
    id: 'ap.ids-admin:save-for-all-environments',
    defaultMessage: 'Save in all environments',
  },
  clientSecret: {
    id: 'ap.ids-admin:client-secret',
    defaultMessage: 'Client Secret',
  },
  clientSecretLegacy: {
    id: 'ap.ids-admin:client-secret-legacy',
    defaultMessage: 'Client Secret (Legacy)',
  },
  clientSecretDescription: {
    id: 'ap.ids-admin:client-secret-description',
    defaultMessage: 'The client secret is not base64 encoded.',
  },
  clientSecretDescriptionLegacy: {
    id: 'ap.ids-admin:client-secret-description-legacy',
    defaultMessage: 'This is a legacy secret which cannot be viewed.',
  },
  otherEndpoints: {
    id: 'ap.ids-admin:other-endpoints',
    defaultMessage: 'Other endpoints',
  },
  otherEndpointsDescription: {
    id: 'ap.ids-admin:other-endpoints-description',
    defaultMessage:
      'Some frameworks infer these using the Issuer above and its OpenID configuration. For other frameworks you may need to manually copy these.',
  },
  idsUrl: {
    id: 'ap.ids-admin:ids-url',
    defaultMessage: 'Issuer',
  },
  callbackUrl: {
    id: 'ap.ids-admin:callback-url',
    defaultMessage: 'Callback URL',
  },
  callBackUrlPlaceholder: {
    id: 'ap.ids-admin:callback-url-placeholder',
    defaultMessage: 'List callback URLs',
  },
  callBackUrlDescription: {
    id: 'ap.ids-admin:callback-url-description',
    defaultMessage:
      'After the user authenticates we will only call back to one of these URLs, which should receive and handle the authentication. You can specify multiple valid URLs in different lines. The URLs should include the protocol, i.e. "https://" for websites. You can use the star symbol as a wildcard for subdomains (*.island.is) on development and staging.',
  },
  customClaimsDescription: {
    id: 'ap.ids-admin:custom-claims-description',
    defaultMessage:
      'Configure custom claims (hard-coded) in access tokens created for this client. Each line should have the form claimName=value. Claim names automatically prefixed with "client_" to avoid collisions. Claim values are always stored as strings.',
  },
  ssoDescription: {
    id: 'ap.ids-admin:sso-description',
  },
  logoutUrl: {
    id: 'ap.ids-admin:logout-url',
    defaultMessage: 'Logout URL',
  },
  logoutUrlPlaceholder: {
    id: 'ap.ids-admin:logout-url-placeholder',
    defaultMessage: 'List logout URLs',
  },
  logoutUrlDescription: {
    id: 'ap.ids-admin:logout-url-description',
    defaultMessage:
      'A set of URLs that are valid to redirect to after logging out. Specify one of these using the "post_logout_redirect_uri" query parameter and the user will be redirected to it. you can specify multiple URLs in different lines.',
  },
  cors: {
    id: 'ap.ids-admin:cors',
    defaultMessage: 'CORS',
  },
  allowedCorsOrigins: {
    id: 'ap.ids-admin:allowed-cors-origins',
    defaultMessage: 'Allowed CORS origins',
  },
  corsPlaceholder: {
    id: 'ap.ids-admin:cors-placeholder',
    defaultMessage: 'http://localhost:4200',
  },
  corsDescription: {
    id: 'ap.ids-admin:cors-description',
    defaultMessage:
      'List additional origins allowed to make cross-origin resource sharing (CORS) requests. Allowed callback URLs are already included in this list. Use wildcards (*) at the subdomain level (e.g. https://*.contoso.com). Query strings and hash information are ignored Organization URL placeholders are supported',
  },
  translations: {
    id: 'ap.ids-admin:translations',
    defaultMessage: 'Content',
  },
  environment: {
    id: 'ap.ids-admin:environment',
    defaultMessage: 'Environment',
  },
  basicInfo: {
    id: 'ap.ids-admin:basic-info',
    defaultMessage: 'Basic information',
  },
  clientUris: {
    id: 'ap.ids-admin:clients-urls',
    defaultMessage: 'Client URLs',
  },
  lifetime: {
    id: 'ap.ids-admin:life-time',
    defaultMessage: 'Session lifecycle',
  },
  lifeTimeDescription: {
    id: 'ap.ids-admin:life-time-description',
    defaultMessage:
      'Refresh tokens are useful if you use access tokens to authorise API calls. Access tokens only last 5 minutes but you can use refresh tokens to request new access tokens. Here you can configure how long refresh tokens can be used to request new access tokens.',
  },
  oAuthAuthorizationUrl: {
    id: 'ap.ids-admin:oAuthAuthorizationUrl',
    defaultMessage: 'Authorization Endpoint',
  },
  oAuthTokenUrl: {
    id: 'ap.ids-admin:oAuthTokenUrl',
    defaultMessage: 'Token Endpoint',
  },
  oAuthUserInfoUrl: {
    id: 'ap.ids-admin:oAuthUserInfoUrl',
    defaultMessage: 'User Info Endpoint',
  },
  endSessionUrl: {
    id: 'ap.ids-admin:deviceAuthorizationUrl',
    defaultMessage: 'End Session Endpoint',
  },
  openIdConfiguration: {
    id: 'ap.ids-admin:openIdConfiguration',
    defaultMessage: 'OpenID Configuration',
  },
  jsonWebKeySet: {
    id: 'ap.ids-admin:jsonWebKeySet',
    defaultMessage: 'JSON Web Key Set',
  },
  errorInvalidUrls: {
    id: 'ap.ids-admin:error-invalid-urls',
    defaultMessage: 'List of URLs, comma separated',
  },
  errorInvalidUrl: {
    id: 'ap.ids-admin:error-invalid-url',
    defaultMessage: 'Invalid URL',
  },
  errorCorsOriginAlreadyExists: {
    id: 'ap.ids-admin:error-cors-origin-already-exists',
    defaultMessage: 'Origin already added',
  },
  errorCorsOriginNotAdded: {
    id: 'ap.ids-admin:error-cors-origin-not-added',
    defaultMessage:
      'Press Enter or click the plus button to include this origin',
  },
  errorPositiveNumber: {
    id: 'ap.ids-admin:error-positive-number',
    defaultMessage: 'Must be a positive number',
  },
  addCorsOrigin: {
    id: 'ap.ids-admin:add-cors-origin',
    defaultMessage: 'Add origin',
  },
  delegations: {
    id: 'ap.ids-admin:delegations',
    defaultMessage: 'Delegations',
  },
  delegationsDescription: {
    id: 'ap.ids-admin:delegations-description',
    defaultMessage:
      'Configure which delegations the user can choose when authenticating to the client.',
  },
  supportCustomDelegation: {
    id: 'ap.ids-admin:support-custom-delegation',
    defaultMessage: 'Support custom delegations',
  },
  supportCustomDelegationDescription: {
    id: 'ap.ids-admin:support-custom-delegation-description',
    defaultMessage:
      'Allow users to sign into this client with custom delegations which were manually granted to them on Mínar síður Ísland.is.\n' +
      'The client must request API scopes which support custom delegations. The user must have a valid custom delegation with one of these API scopes.\n',
  },
  supportLegalGuardianDelegation: {
    id: 'ap.ids-admin:support-legal-guardian-delegation',
    defaultMessage: 'Support legal guardian delegations',
  },
  supportLegalGuardianDelegationDescription: {
    id: 'ap.ids-admin:support-legal-guardian-delegation-description',
    defaultMessage:
      'Allow users to sign into this client as children which they are legal guardians of according to the Registers Iceland.',
  },
  supportPersonalRepresentativeDelegation: {
    id: 'ap.ids-admin:support-personal-representative-delegation',
    defaultMessage: 'Support personal representative delegations',
  },
  supportPersonalRepresentativeDelegationDescription: {
    id: 'ap.ids-admin:support-personal-representative-delegation-description',
    defaultMessage:
      'Allow users to sign into this client on behalf of disabled individuals with an active personal representation contract at the Ministry of Social Affairs and Labour.',
  },
  supportProcuringHolderDelegation: {
    id: 'ap.ids-admin:support-procuring-holder-delegation',
    defaultMessage: 'Support procuring holder delegations',
  },
  supportProcuringHolderDelegationDescription: {
    id: 'ap.ids-admin:support-procuring-holder-delegation-description',
    defaultMessage:
      'Allow users to sign into this client as legal entities which they are procuring holders of according to the company registry of Iceland.',
  },
  alwaysPromptDelegations: {
    id: 'ap.ids-admin:always-prompt-delegations',
    defaultMessage: 'Always prompt delegations',
  },
  alwaysPromptDelegationsDescription: {
    id: 'ap.ids-admin:always-prompt-delegations-description',
    defaultMessage:
      'With this setting, the user always sees the delegation screen when authenticating with your client. For most clients we recommend keeping this off and to provide an explicit action to authenticate with delegation using the prompt=select_account argument.',
  },
  requirePermissions: {
    id: 'ap.ids-admin:require-permissions',
    defaultMessage: 'Require API scopes',
  },
  requirePermissionsDescription: {
    id: 'ap.ids-admin:require-permissions-description',
    defaultMessage:
      'Only allow delegations which have access to one or more requested API scopes. Can be combined with API scope settings to block access to the client for certain individuals or delegations.',
  },
  requirePkce: {
    id: 'ap.ids-admin:require-pkce',
    defaultMessage: 'Require PKCE',
  },
  requirePkceDescription: {
    id: 'ap.ids-admin:require-pkce-description',
    defaultMessage:
      'Proof Key for Code Exchange (PKCE) is a security extension for the Authorization Code Flow. PKCE is heavily recommended but some frameworks do not support it.',
  },
  allowOfflineAccess: {
    id: 'ap.ids-admin:allow-offline-access',
    defaultMessage: 'Allow offline access',
  },
  allowOfflineAccessDescription: {
    id: 'ap.ids-admin:allow-offline-access-description',
    defaultMessage:
      'Allows the client to request the offline_access scope. This results in refresh tokens which can be used to get access tokens according to the refresh token lifecycle settings',
  },
  supportsTokenExchange: {
    id: 'ap.ids-admin:supports-token-exchange',
    defaultMessage: 'Supports token exchange grant',
  },
  allowSSO: {
    id: 'ap.ids-admin:allow-sso',
    defaultMessage: 'Allow single sign-on (SSO)',
  },
  allowSSODescription: {
    id: 'ap.ids-admin:allow-sso-description',
    defaultMessage:
      'Allow users to sign in with the same session on other clients using the island.is authentication service.',
  },
  singleSession: {
    id: 'ap.ids-admin:single-session',
    defaultMessage: 'Single session client',
  },
  singleSessionDescription: {
    id: 'ap.ids-admin:single-session-description',
    defaultMessage:
      'Only allow users to have one active session in this client at a time. When a user signs in, previously created refresh tokens for that user and client will be disabled.',
  },
  supportsTokenExchangeDescription: {
    id: 'ap.ids-admin:supports-token-exchange-description',
    defaultMessage:
      'Allows the client to exchange an existing access token with a new access token with specified scope.',
  },
  accessTokenExpiration: {
    id: 'ap.ids-admin:access-token-expiration',
    defaultMessage: 'Access token expiration (seconds)',
  },
  accessTokenExpirationDescription: {
    id: 'ap.ids-admin:access-token-expiration-description',
    defaultMessage: 'Sets the lifetime of access tokens (in seconds).',
  },
  customClaims: {
    id: 'ap.ids-admin:custom-claims',
    defaultMessage: 'Custom claims',
  },
  requireConsent: {
    id: 'ap.ids-admin:require-consent',
    defaultMessage: 'Require consent',
  },
  requireConsentDescription: {
    id: 'ap.ids-admin:require-consent-description',
    defaultMessage:
      'When true, the client requires user consent for third party API scopes as well as standard scopes like email and phone.',
  },
  errorInvalidClaims: {
    id: 'ap.ids-admin:error-invalid-claims',
    defaultMessage: 'Invalid claim format',
  },
  hidePassword: {
    id: 'ap.ids-admin:hide-password',
    defaultMessage: 'Hide password',
  },
  showPassword: {
    id: 'ap.ids-admin:show-password',
    defaultMessage: 'Show password',
  },
  copy: {
    id: 'ap.ids-admin:copy',
    defaultMessage: 'Copy value',
  },
  copySuccess: {
    id: 'ap.ids-admin:copy-success',
    defaultMessage: 'Copied to clipboard',
  },
  copyFailure: {
    id: 'ap.ids-admin:copy-failure',
    defaultMessage: 'Could not copy to clipboard',
  },
  rowActionsAriaLabel: {
    id: 'ap.ids-admin:row-actions-aria-label',
    defaultMessage: 'Row actions',
  },
  permissions: {
    id: 'ap.ids-admin:permissions',
    defaultMessage: 'API scopes',
  },
  permissionsDescription: {
    id: 'ap.ids-admin:permissions-description',
    defaultMessage:
      'List of API scopes the client can request during authentication. Clients can always request standard scopes like oidc, profile, email, phone and address.{br}{br}Here you can add API scopes from the current tenant. For third party API scopes, the owner must grant access to your client.',
  },
  documentation: {
    id: 'ap.ids-admin:documentation',
    defaultMessage: 'Documentation',
  },
  documentationDescription: {
    id: 'ap.ids-admin:documentation-description',
    defaultMessage: 'Link to external documentation for IDS admin.',
  },
  permissionsAdd: {
    id: 'ap.ids-admin:permissions-add',
    defaultMessage: 'Add API scopes',
  },
  permissionsTableLabelName: {
    id: 'ap.ids-admin:permissions-table-label-name',
    defaultMessage: 'Name',
  },
  permissionsTableLabelDescription: {
    id: 'ap.ids-admin:permissions-table-label-description',
    defaultMessage: 'Description',
  },
  permissionsTableLabelAPI: {
    id: 'ap.ids-admin:permissions-table-label-api',
    defaultMessage: 'API',
  },
  permissionsButtonLabelRemove: {
    id: 'ap.ids-admin:permissions-button-label-remove',
    defaultMessage: 'Remove',
  },
  permissionsModalNoScopes: {
    id: 'ap.ids-admin:permission-modal-no-scopes',
    defaultMessage: 'No scopes available',
  },
  permissionsOtherTenantGroup: {
    id: 'ap.ids-admin:permissions-other-tenant-group',
    defaultMessage: 'Other',
  },
  permissionApplicationsDescription: {
    id: 'ap.ids-admin:permission-applications-description',
    defaultMessage: 'Clients that are currently using this API scope.',
  },
  permissionApplicationsEmpty: {
    id: 'ap.ids-admin:permission-applications-empty',
    defaultMessage: 'No clients are using this API scope.',
  },
  permissionApplicationsName: {
    id: 'ap.ids-admin:permission-applications-name',
    defaultMessage: 'Client',
  },
  permissionApplicationsType: {
    id: 'ap.ids-admin:permission-applications-type',
    defaultMessage: 'Type',
  },
  successfullySaved: {
    id: 'ap.ids-admin:successfully-saved',
    defaultMessage: 'Successfully saved',
  },
  partiallySaved: {
    id: 'ap.ids-admin:partially-saved',
    defaultMessage: 'Saved in some environments. Operation failed on: {envs}',
  },
  globalErrorMessage: {
    id: 'ap.ids-admin:global-error-message',
    defaultMessage: 'An error occurred',
  },
  syncSettings: {
    id: 'ap.ids-admin:sync-settings',
    defaultMessage: 'Sync settings (from this environment)',
  },
  syncedAcrossAllEnvironments: {
    id: 'ap.ids-admin:synced-across-all-environments',
    defaultMessage: 'Settings are the same in all environments.',
  },
  notInSyncAcrossAllEnvironments: {
    id: 'ap.ids-admin:not-in-sync-across-all-environments',
    defaultMessage: 'Settings are different in some environments',
  },
  synced: {
    id: 'ap.ids-admin:synced',
    defaultMessage: 'Synced',
  },
  outOfSync: {
    id: 'ap.ids-admin:out-of-sync',
    defaultMessage: 'Out of sync',
  },
  syncStatus: {
    id: 'ap.ids-admin:sync-status',
    defaultMessage: 'Sync status',
  },
  publishEnvironment: {
    id: 'ap.ids-admin:publish-environment',
    defaultMessage: 'Publish to {environment}',
  },
  publishClientEnvDesc: {
    id: 'ap.ids-admin:publish-client-env-description',
    defaultMessage:
      'The client will inherit settings from the selected environment excluding URLs and client secrets.',
  },
  publishPermissionEnvDesc: {
    id: 'ap.ids-admin:publish-permission-env-description',
    defaultMessage:
      'The API scope will inherit settings from the selected environment.',
  },
  chooseEnvironmentToCopyFrom: {
    id: 'ap.ids-admin:choose-environment-to-copy-from',
    defaultMessage: 'Choose environment to copy settings from',
  },
  publish: {
    id: 'ap.ids-admin:publish',
    defaultMessage: 'Publish',
  },
  errorPublishingEnvironment: {
    id: 'ap.ids-admin:error-publishing-environment',
    defaultMessage: 'Error publishing environment',
  },
  closeModal: {
    id: 'ap.ids-admin:close-modal',
    defaultMessage: 'Close dialog',
  },
  listOfPermissions: {
    id: 'ap.ids-admin:list-of-permissions',
    defaultMessage: 'List of API scopes',
  },
  permissionsManagement: {
    id: 'ap.ids-admin:permissions-management',
    defaultMessage: 'Management',
  },
  createPermission: {
    id: 'ap.ids-admin:create-permission',
    defaultMessage: 'Create API scope',
  },
  permissionId: {
    id: 'ap.ids-admin:permission-id',
    defaultMessage: 'API scope ID',
  },
  permissionDescription: {
    id: 'ap.ids-admin:permission-description',
    defaultMessage: 'Description',
  },
  permissionAlreadyExists: {
    id: 'ap.ids-admin:permission-already-exists',
    defaultMessage: 'API scope ID already exists',
  },
  permissionDescriptionInfo: {
    id: 'ap.ids-admin:permission-description-info',
    defaultMessage: 'Users see this when they sign in, and manage consents.',
  },
  permissionDisplayNameInfo: {
    id: 'ap.ids-admin:permission-display-name-info',
    defaultMessage: 'Displayed on the login screen of your app',
  },
  permissionEmptyHeading: {
    id: 'ap.ids-admin:permission-empty-heading',
    defaultMessage: 'No API scope created',
  },
  permissionEmptyDescription: {
    id: 'ap.ids-admin:permission-empty-description',
    defaultMessage:
      'You can create an API scope by clicking on Create API scope.',
  },
  permissionListDescription: {
    id: 'ap.ids-admin:permission-list-description',
    defaultMessage: 'Here you can view and create API scopes.',
  },
  permissionsSearchPlaceholder: {
    id: 'ap.ids-admin:permissions-search-placeholder',
    defaultMessage: 'Search by name or ID',
  },
  dangerZone: {
    id: 'ap.ids-admin:danger-zone',
    defaultMessage: 'Danger zone',
  },
  rotateSecret: {
    id: 'ap.ids-admin:rotate-secret',
    defaultMessage: 'Rotate secret',
  },
  rotateSecretActionCardLabel: {
    id: 'ap.ids-admin:rotate-secret-action-card-label',
    defaultMessage:
      'All authorized apps will need to be updated with the new client secret.',
  },
  rotateSecretDescription: {
    id: 'ap.ids-admin:rotate-secret-description',
    defaultMessage: `This will generate a new secret for your client. You should revoke existing secret(s) after you have deployed your client with the new secret.{br}{br}If your existing secret(s) have been compromised it is recommended to revoke them immediately.`,
  },
  rotateSecretInfoAlert: {
    id: 'ap.ids-admin:rotate-secret-alert',
    defaultMessage:
      'Authentications will stop working for your client until you have deployed the new secret.',
  },
  rotate: {
    id: 'ap.ids-admin:rotate',
    defaultMessage: 'Rotate',
  },
  generate: {
    id: 'ap.ids-admin:generate',
    defaultMessage: 'Generate',
  },
  revoke: {
    id: 'ap.ids-admin:revoke',
    defaultMessage: 'Revoke',
  },
  revokeExistingSecrets: {
    id: 'ap.ids-admin:revoke-existing-secrets',
    defaultMessage: 'Revoke existing secret(s) immediately.',
  },
  newSecret: {
    id: 'ap.ids-admin:new-secret',
    defaultMessage: 'New secret',
  },
  rotatedSecretDescription: {
    id: 'ap.ids-admin:rotated-secret-description',
    defaultMessage:
      'Please update the client configuration with the following secret.',
  },
  revokeSecrets: {
    id: 'ap.ids-admin:revoke-secrets',
    defaultMessage: 'Revoke old secret(s)',
  },
  revokeSecretsDescription: {
    id: 'ap.ids-admin:revoke-secrets-description',
    defaultMessage:
      'This will revoke all secrets except the current active secret. Please make sure that they are not in use anymore.',
  },
  successRevokingSecrets: {
    id: 'ap.ids-admin:success-revoking-secrets',
    defaultMessage: 'Successfully revoked old secret(s)',
  },
  multipleSecrets: {
    id: 'ap.ids-admin:multiple-secrets',
    defaultMessage: 'Multiple secrets',
  },
  multipleSecretsDescription: {
    id: 'ap.ids-admin:multiple-secrets-description',
    defaultMessage: 'There are one or more old secrets which are still active.',
  },
  content: {
    id: 'ap.ids-admin:content',
    defaultMessage: 'Content',
  },
  securityAndCapabilities: {
    id: 'ap.ids-admin:security-and-capabilities',
    defaultMessage: 'Security & Capabilities',
  },
  allowsWrite: {
    id: 'ap.ids-admin:allows-write',
    defaultMessage: 'Read/Write Access',
  },
  allowsWriteDescription: {
    id: 'ap.ids-admin:allows-write-description',
    defaultMessage:
      'When enabled, this API scope grants both read and write access. When disabled, only read access is granted.',
  },
  requiresConfirmation: {
    id: 'ap.ids-admin:requires-confirmation',
    defaultMessage: 'Step-up Authentication Required',
  },
  requiresConfirmationDescription: {
    id: 'ap.ids-admin:requires-confirmation-description',
    defaultMessage:
      'When enabled, users must provide additional authentication (tvöfalt samþykki) to access sensitive information with this API scope.',
  },
  accessControl: {
    id: 'ap.ids-admin:access-control',
    defaultMessage: 'Access control',
  },
  categoriesAndTags: {
    id: 'ap.ids-admin:categories-and-tags',
    defaultMessage: 'Categories and Tags',
  },
  categories: {
    id: 'ap.ids-admin:categories',
    defaultMessage: 'Service categories',
  },
  categoriesDescription: {
    id: 'ap.ids-admin:categories-description',
    defaultMessage:
      'Select which service categories this API scope belongs to. These help users find relevant API scopes when creating delegations.',
  },
  tags: {
    id: 'ap.ids-admin:tags',
    defaultMessage: 'Tags',
  },
  tagsDescription: {
    id: 'ap.ids-admin:tags-description',
    defaultMessage:
      'Select which tags this API scope is relevant for. This helps users understand when they might need this API scope.',
  },
  categoryRequired: {
    id: 'ap.ids-admin:category-required',
    defaultMessage: 'At least one category must be selected',
  },
  noCategories: {
    id: 'ap.ids-admin:no-categories',
    defaultMessage: 'No categories available',
  },
  selectCategoriesPlaceholder: {
    id: 'ap.ids-admin:select-categories-placeholder',
    defaultMessage: 'Select categories',
  },
  thirdPartyLoginUrl: {
    id: 'ap.ids-admin:third-party-login-url',
    defaultMessage: 'Third party login URL',
  },
  thirdPartyLoginUrlDescription: {
    id: 'ap.ids-admin:third-party-login-url-description',
    defaultMessage:
      'URL that can be used to login to the client using third party delegation.',
  },
  originUrl: {
    id: 'ap.ids-admin:origin-url',
    defaultMessage: 'URL origin',
  },
  targetLinkUri: {
    id: 'ap.ids-admin:target-link-uri',
    defaultMessage: 'Target link URI',
  },
  linkPreview: {
    id: 'ap.ids-admin:link-preview',
    defaultMessage: 'Link Preview',
  },
  linkPreviewPlaceholder: {
    id: 'ap.ids-admin:link-preview-placeholder',
    defaultMessage: 'Fill in the above fields to see a preview of the link',
  },
  originUrlRequired: {
    id: 'ap.ids-admin:origin-url-required',
    defaultMessage: 'URL origin is required when target link URI is provided',
  },
  targetLinkUriRequired: {
    id: 'ap.ids-admin:target-link-uri-required',
    defaultMessage: 'Target link URI is required when URL origin is provided',
  },
  noTags: {
    id: 'ap.ids-admin:no-tags',
    defaultMessage: 'No tags available',
  },
  selectTagsPlaceholder: {
    id: 'ap.ids-admin:select-tags-placeholder',
    defaultMessage: 'Select tags',
  },
  loading: {
    id: 'ap.ids-admin:loading',
    defaultMessage: 'Loading...',
  },
  icelandic: {
    id: 'ap.ids-admin:icelandic',
    defaultMessage: 'Icelandic',
  },
  english: {
    id: 'ap.ids-admin:english',
    defaultMessage: 'English',
  },
  isAccessControlled: {
    id: 'ap.ids-admin:is-access-controlled',
    defaultMessage: 'Specific national ids',
  },
  isAccessControlledDescription: {
    id: 'ap.ids-admin:is-access-controlled-description',
    defaultMessage:
      'Authorize a list of national ids for this API scope. Request support from island.is to manage the list.',
  },
  scopeUsersLabel: {
    id: 'ap.ids-admin:scope-users-label',
    defaultMessage: 'Users with access',
  },
  scopeUsersPlaceholder: {
    id: 'ap.ids-admin:scope-users-placeholder',
    defaultMessage: 'Choose from the list or create a new user',
  },
  scopeUsersLoading: {
    id: 'ap.ids-admin:scope-users-loading',
    defaultMessage: 'Loading users...',
  },
  addScopeUser: {
    id: 'ap.ids-admin:add-scope-user',
    defaultMessage: 'Create new user',
  },
  createScopeUserTitle: {
    id: 'ap.ids-admin:create-scope-user-title',
    defaultMessage: 'Create user',
  },
  createScopeUserSuccess: {
    id: 'ap.ids-admin:create-scope-user-success',
    defaultMessage: 'User created successfully',
  },
  createScopeUserError: {
    id: 'ap.ids-admin:create-scope-user-error',
    defaultMessage: 'Failed to create user',
  },
  grantToAuthenticatedUser: {
    id: 'ap.ids-admin:grant-to-authenticated-user',
    defaultMessage: 'Authenticated user',
  },
  grantToAuthenticatedUserDescription: {
    id: 'ap.ids-admin:grant-to-authenticated-user-description',
    defaultMessage:
      'Should the authenticated individual get this scope (uncheck if only delegated users should be allowed).',
  },
  automaticDelegationGrant: {
    id: 'ap.ids-admin:automatic-delegation-grant',
    defaultMessage: 'Automatic delegation grant',
  },
  automaticDelegationGrantDescription: {
    id: 'ap.ids-admin:automatic-delegation-grant-description',
    defaultMessage:
      'Should users automatically get this API scope when they authenticate with this client',
  },
  grantToProcuringHolders: {
    id: 'ap.ids-admin:grant-to-procuring-holders',
    defaultMessage: 'Companies',
  },
  grantToProcuringHoldersDescription: {
    id: 'ap.ids-admin:grant-to-procuring-holders-description',
    defaultMessage:
      'Should procuring holders automatically get this scope for their organisations',
  },
  grantToLegalGuardians: {
    id: 'ap.ids-admin:grant-to-legal-guardians',
    defaultMessage: 'Legal guardians',
  },
  grantToLegalGuardiansDescription: {
    id: 'ap.ids-admin:grant-to-legal-guardians-description',
    defaultMessage:
      'Should legal guardians automatically get this API scope for their wards',
  },
  allowExplicitDelegationGrant: {
    id: 'ap.ids-admin:allow-explicit-delegation-grant',
    defaultMessage: 'Custom delegations',
  },
  allowExplicitDelegationGrantDescription: {
    id: 'ap.ids-admin:allow-explicit-delegation-grant-description',
    defaultMessage:
      'Should users be able to grant other users custom delegation for this API scope.',
  },
  grantToPersonalRepresentatives: {
    id: 'ap.ids-admin:grant-to-personal-representatives',
    defaultMessage: 'Personal representatives',
  },
  grantToPersonalRepresentativesDescription: {
    id: 'ap.ids-admin:grant-to-personal-representatives-description',
    defaultMessage:
      'Should personal representatives automatically get this scope for their clients',
  },
  domains: {
    id: 'ap.ids-admin:domains',
    defaultMessage: 'Domains',
  },
  adminControls: {
    id: 'ap.ids-admin:admin-controls',
    defaultMessage: 'Admin Controls',
  },
  apiScopeUsers: {
    id: 'ap.ids-admin:api-scope-users',
    defaultMessage: 'API Scope Users',
  },
  authorizedUsers: {
    id: 'ap.ids-admin:authorized-users',
    defaultMessage: 'Authorized users',
  },
  apiScopeUsersDescription: {
    id: 'ap.ids-admin:api-scope-users-description',
    defaultMessage: 'Manage users who have access to API scopes.',
  },
  apiScopeUsersSearchPlaceholder: {
    id: 'ap.ids-admin:api-scope-users-search-placeholder',
    defaultMessage: 'Search by name, national ID or email',
  },
  apiScopeUsersName: {
    id: 'ap.ids-admin:api-scope-users-name',
    defaultMessage: 'Name',
  },
  apiScopeUsersNationalId: {
    id: 'ap.ids-admin:api-scope-users-national-id',
    defaultMessage: 'National ID',
  },
  apiScopeUsersEmail: {
    id: 'ap.ids-admin:api-scope-users-email',
    defaultMessage: 'Email',
  },
  apiScopeUsersActions: {
    id: 'ap.ids-admin:api-scope-users-actions',
    defaultMessage: 'Actions',
  },
  apiScopeUsersCreateNew: {
    id: 'ap.ids-admin:api-scope-users-create-new',
    defaultMessage: 'Create user',
  },
  apiScopeUsersCreateTitle: {
    id: 'ap.ids-admin:api-scope-users-create-title',
    defaultMessage: 'Create API scope user',
  },
  apiScopeUsersEditTitle: {
    id: 'ap.ids-admin:api-scope-users-edit-title',
    defaultMessage: 'Edit API scope user',
  },
  apiScopeUsersDeleteConfirmTitle: {
    id: 'ap.ids-admin:api-scope-users-delete-confirm-title',
    defaultMessage: 'Delete API scope user',
  },
  apiScopeUsersDeleteConfirmMessage: {
    id: 'ap.ids-admin:api-scope-users-delete-confirm-message',
    defaultMessage: 'Are you sure you want to delete this API scope user?',
  },
  /** @deprecated Use m.edit instead */
  apiScopeUserEditButton: {
    id: 'ap.ids-admin:api-scope-user-edit',
    defaultMessage: 'Edit',
  },
  /** @deprecated Use m.create instead */
  apiScopeUsersCreateButton: {
    id: 'ap.ids-admin:create',
    defaultMessage: 'Create',
  },
  /** @deprecated Use m.cancel instead */
  apiScopeUsersCancelButton: {
    id: 'ap.ids-admin:cancel',
    defaultMessage: 'Cancel',
  },
  apiScopeUsersCreateSuccess: {
    id: 'ap.ids-admin:api-scope-users-create-success',
    defaultMessage: 'API scope user created successfully',
  },
  apiScopeUsersUpdateSuccess: {
    id: 'ap.ids-admin:api-scope-users-update-success',
    defaultMessage: 'API scope user updated successfully',
  },
  apiScopeUsersDeleteSuccess: {
    id: 'ap.ids-admin:api-scope-users-delete-success',
    defaultMessage: 'API scope user deleted successfully',
  },
  apiScopeUsersError: {
    id: 'ap.ids-admin:api-scope-users-error',
    defaultMessage: 'An error occurred',
  },
  apiScopeUsersNoResults: {
    id: 'ap.ids-admin:api-scope-users-no-results',
    defaultMessage: 'No API scope users found',
  },
  apiScopeUsersScopes: {
    id: 'ap.ids-admin:api-scope-users-scopes',
    defaultMessage: 'Scopes',
  },
  apiScopeUsersScopesLoading: {
    id: 'ap.ids-admin:api-scope-users-scopes-loading',
    defaultMessage: 'Loading scopes...',
  },
  apiScopeUsersPublishSuccess: {
    id: 'ap.ids-admin:api-scope-users-publish-success',
    defaultMessage: 'User published to {environment} successfully',
  },
  apiScopeUsersErrorNameMinLength: {
    id: 'ap.ids-admin:api-scope-users-error-name-min-length',
    defaultMessage: 'Name must be at least 2 characters',
  },
  apiScopeUsersErrorNationalId: {
    id: 'ap.ids-admin:api-scope-users-error-national-id',
    defaultMessage: 'National ID must be exactly 10 digits',
  },
  apiScopeUsersErrorEmailRequired: {
    id: 'ap.ids-admin:api-scope-users-error-email-required',
    defaultMessage: 'Email is required',
  },
  apiScopeUsersErrorEmailFormat: {
    id: 'ap.ids-admin:api-scope-users-error-email-format',
    defaultMessage: 'Email must be a valid email address',
  },
  apiScopeUsersErrorNationalIdExists: {
    id: 'ap.ids-admin:api-scope-users-error-national-id-exists',
    defaultMessage: 'A user with this national ID already exists',
  },
  apiScopeUsersErrorNationalIdCheckFailed: {
    id: 'ap.ids-admin:api-scope-users-error-national-id-check-failed',
    defaultMessage: 'Unable to verify national ID. Please try again.',
  },
  /** @deprecated Use m.errorEnvironment instead */
  apiScopeUsersErrorEnvironmentRequired: {
    id: 'ap.ids-admin:error-environment',
    defaultMessage: 'Choose at least one environment.',
  },
  apiScopeUsersDeleteSelectEnvironments: {
    id: 'ap.ids-admin:api-scope-users-delete-select-environments',
    defaultMessage: 'Select environments to delete from',
  },
  apiScopeUsersDeleteEnvironmentRequired: {
    id: 'ap.ids-admin:api-scope-users-delete-environment-required',
    defaultMessage: 'Select at least one environment to delete from',
  },
  apiScopeUsersPartialFailure: {
    id: 'ap.ids-admin:api-scope-users-partial-failure',
    defaultMessage: 'Operation failed on: {environments}',
  },
  grantTypes: {
    id: 'ap.ids-admin:grant-types',
    defaultMessage: 'Grant Types',
  },
  grantTypesIntro: {
    id: 'ap.ids-admin:grant-types-intro',
    defaultMessage: 'Manage grant types',
  },
  grantTypesSearchPlaceholder: {
    id: 'ap.ids-admin:grant-types-search-placeholder',
    defaultMessage: 'Search by name or description',
  },
  grantTypesCreateNew: {
    id: 'ap.ids-admin:grant-types-create-new',
    defaultMessage: 'Create Grant Type',
  },
  grantTypesCreateTitle: {
    id: 'ap.ids-admin:grant-types-create-title',
    defaultMessage: 'Create Grant Type',
  },
  grantTypesEditTitle: {
    id: 'ap.ids-admin:grant-types-edit-title',
    defaultMessage: 'Edit Grant Type',
  },
  grantTypesName: {
    id: 'ap.ids-admin:grant-types-name',
    defaultMessage: 'Name',
  },
  grantTypesDescription: {
    id: 'ap.ids-admin:grant-types-description',
    defaultMessage: 'Description',
  },
  grantTypesDeleteConfirmTitle: {
    id: 'ap.ids-admin:grant-types-delete-confirm-title',
    defaultMessage: 'Archive Grant Type',
  },
  grantTypesDeleteConfirmMessage: {
    id: 'ap.ids-admin:grant-types-delete-confirm-message',
    defaultMessage: 'Are you sure you want to archive this grant type?',
  },
  grantTypesCreateSuccess: {
    id: 'ap.ids-admin:grant-types-create-success',
    defaultMessage: 'Grant type created successfully',
  },
  grantTypesUpdateSuccess: {
    id: 'ap.ids-admin:grant-types-update-success',
    defaultMessage: 'Grant type updated successfully',
  },
  grantTypesDeleteSuccess: {
    id: 'ap.ids-admin:grant-types-delete-success',
    defaultMessage: 'Grant type archived successfully',
  },
  grantTypesPublishSuccess: {
    id: 'ap.ids-admin:grant-types-publish-success',
    defaultMessage: 'Grant type published to {environment}',
  },
  grantTypesError: {
    id: 'ap.ids-admin:grant-types-error',
    defaultMessage: 'An error occurred',
  },
  grantTypesNoResults: {
    id: 'ap.ids-admin:grant-types-no-results',
    defaultMessage: 'No grant types found',
  },
  grantTypesErrorNameRequired: {
    id: 'ap.ids-admin:grant-types-error-name-required',
    defaultMessage: 'Name is required',
  },
  grantTypesErrorNamePattern: {
    id: 'ap.ids-admin:grant-types-error-name-pattern',
    defaultMessage:
      'Name must start and end with a lowercase letter and contain only lowercase letters, underscores, colons, dots, and hyphens',
  },
  grantTypesErrorNameExists: {
    id: 'ap.ids-admin:grant-types-error-name-exists',
    defaultMessage: 'A grant type with this name already exists',
  },
  grantTypesErrorNameCheckFailed: {
    id: 'ap.ids-admin:grant-types-error-name-check-failed',
    defaultMessage: 'Could not verify grant type name',
  },
  grantTypesErrorDescriptionRequired: {
    id: 'ap.ids-admin:grant-types-error-description-required',
    defaultMessage: 'Description is required',
  },
  grantTypesErrorDescriptionChars: {
    id: 'ap.ids-admin:grant-types-error-description-chars',
    defaultMessage: 'Description must not contain < > % $ characters',
  },
  grantTypesErrorEnvironmentRequired: {
    id: 'ap.ids-admin:grant-types-error-environment-required',
    defaultMessage: 'Select at least one environment',
  },
  grantTypesDeleteSelectEnvironments: {
    id: 'ap.ids-admin:grant-types-delete-select-environments',
    defaultMessage: 'Select environments to archive from',
  },
  grantTypesDeleteEnvironmentRequired: {
    id: 'ap.ids-admin:grant-types-delete-environment-required',
    defaultMessage: 'Select at least one environment to archive from',
  },
  grantTypesRestoreConfirmTitle: {
    id: 'ap.ids-admin:grant-types-restore-confirm-title',
    defaultMessage: 'Restore Grant Type',
  },
  grantTypesRestoreConfirmMessage: {
    id: 'ap.ids-admin:grant-types-restore-confirm-message',
    defaultMessage: 'Are you sure you want to restore this grant type?',
  },
  grantTypesRestoreSuccess: {
    id: 'ap.ids-admin:grant-types-restore-success',
    defaultMessage: 'Grant type restored successfully',
  },
  grantTypesRestoreSelectEnvironments: {
    id: 'ap.ids-admin:grant-types-restore-select-environments',
    defaultMessage: 'Select environments to restore to',
  },
  grantTypesRestoreEnvironmentRequired: {
    id: 'ap.ids-admin:grant-types-restore-environment-required',
    defaultMessage: 'Select at least one environment to restore to',
  },
  grantTypesPartialFailure: {
    id: 'ap.ids-admin:grant-types-partial-failure',
    defaultMessage: 'Operation failed on: {environments}',
  },
  grantTypesAlreadyArchivedTag: {
    id: 'ap.ids-admin:grant-types-already-archived-tag',
    defaultMessage: 'Archived',
  },
  grantTypesAlreadyActiveTag: {
    id: 'ap.ids-admin:grant-types-already-active-tag',
    defaultMessage: 'Active',
  },
  grantTypesEditArchivedEnvBannerTitle: {
    id: 'ap.ids-admin:grant-types-edit-archived-env-banner-title',
    defaultMessage: 'Archived environment',
  },
  grantTypesEditArchivedEnvBannerMessage: {
    id: 'ap.ids-admin:grant-types-edit-archived-env-banner-message',
    defaultMessage:
      'You are viewing an archived environment. Edits will apply to the archived record.',
  },
  idpProviders: {
    id: 'ap.ids-admin:idp-providers',
    defaultMessage: 'IDP Providers',
  },
  idpProvidersIntro: {
    id: 'ap.ids-admin:idp-providers-intro',
    defaultMessage: 'Manage identity providers',
  },
  idpProvidersSearchPlaceholder: {
    id: 'ap.ids-admin:idp-providers-search-placeholder',
    defaultMessage: 'Search by name or description',
  },
  idpProvidersCreateNew: {
    id: 'ap.ids-admin:idp-providers-create-new',
    defaultMessage: 'Create IDP Provider',
  },
  idpProvidersCreateTitle: {
    id: 'ap.ids-admin:idp-providers-create-title',
    defaultMessage: 'Create IDP Provider',
  },
  idpProvidersEditTitle: {
    id: 'ap.ids-admin:idp-providers-edit-title',
    defaultMessage: 'Edit IDP Provider',
  },
  idpProvidersName: {
    id: 'ap.ids-admin:idp-providers-name',
    defaultMessage: 'Name',
  },
  idpProvidersDescription: {
    id: 'ap.ids-admin:idp-providers-description',
    defaultMessage: 'Description',
  },
  idpProvidersHelptext: {
    id: 'ap.ids-admin:idp-providers-helptext',
    defaultMessage: 'Help text',
  },
  idpProvidersLevel: {
    id: 'ap.ids-admin:idp-providers-level',
    defaultMessage: 'Level',
  },
  idpProvidersDeleteConfirmTitle: {
    id: 'ap.ids-admin:idp-providers-delete-confirm-title',
    defaultMessage: 'Delete IDP Provider',
  },
  idpProvidersDeleteConfirmMessage: {
    id: 'ap.ids-admin:idp-providers-delete-confirm-message',
    defaultMessage: 'Are you sure you want to delete this IDP provider?',
  },
  idpProvidersCreateSuccess: {
    id: 'ap.ids-admin:idp-providers-create-success',
    defaultMessage: 'IDP provider created successfully',
  },
  idpProvidersUpdateSuccess: {
    id: 'ap.ids-admin:idp-providers-update-success',
    defaultMessage: 'IDP provider updated successfully',
  },
  idpProvidersDeleteSuccess: {
    id: 'ap.ids-admin:idp-providers-delete-success',
    defaultMessage: 'IDP provider deleted successfully',
  },
  idpProvidersPublishSuccess: {
    id: 'ap.ids-admin:idp-providers-publish-success',
    defaultMessage: 'IDP provider published to {environment}',
  },
  idpProvidersError: {
    id: 'ap.ids-admin:idp-providers-error',
    defaultMessage: 'An error occurred',
  },
  idpProvidersNoResults: {
    id: 'ap.ids-admin:idp-providers-no-results',
    defaultMessage: 'No IDP providers found',
  },
  idpProvidersErrorNameRequired: {
    id: 'ap.ids-admin:idp-providers-error-name-required',
    defaultMessage: 'Name is required',
  },
  idpProvidersErrorNamePattern: {
    id: 'ap.ids-admin:idp-providers-error-name-pattern',
    defaultMessage:
      'Name must start with a letter and contain only letters, numbers, underscores, dots, and hyphens',
  },
  idpProvidersErrorNameExists: {
    id: 'ap.ids-admin:idp-providers-error-name-exists',
    defaultMessage: 'An IDP provider with this name already exists',
  },
  idpProvidersErrorNameCheckFailed: {
    id: 'ap.ids-admin:idp-providers-error-name-check-failed',
    defaultMessage: 'Could not verify IDP provider name',
  },
  idpProvidersErrorDescriptionRequired: {
    id: 'ap.ids-admin:idp-providers-error-description-required',
    defaultMessage: 'Description is required',
  },
  idpProvidersErrorDescriptionChars: {
    id: 'ap.ids-admin:idp-providers-error-description-chars',
    defaultMessage: 'Description must not contain < > % $ characters',
  },
  idpProvidersErrorHelptextRequired: {
    id: 'ap.ids-admin:idp-providers-error-helptext-required',
    defaultMessage: 'Help text is required',
  },
  idpProvidersErrorLevelRequired: {
    id: 'ap.ids-admin:idp-providers-error-level-required',
    defaultMessage: 'Level is required',
  },
  idpProvidersErrorLevelRange: {
    id: 'ap.ids-admin:idp-providers-error-level-range',
    defaultMessage: 'Level must be between 1 and 4',
  },
  idpProvidersErrorEnvironmentRequired: {
    id: 'ap.ids-admin:idp-providers-error-environment-required',
    defaultMessage: 'Select at least one environment',
  },
  idpProvidersDeleteSelectEnvironments: {
    id: 'ap.ids-admin:idp-providers-delete-select-environments',
    defaultMessage: 'Select environments to delete from',
  },
  idpProvidersDeleteEnvironmentRequired: {
    id: 'ap.ids-admin:idp-providers-delete-environment-required',
    defaultMessage: 'Select at least one environment to delete from',
  },
  idpProvidersPartialFailure: {
    id: 'ap.ids-admin:idp-providers-partial-failure',
    defaultMessage: 'Operation failed on: {environments}',
  },
  clientIdAlreadyExists: {
    id: 'ap.ids-admin:client-id-already-exists',
    defaultMessage: 'Client ID already exists',
  },
  successDeletingClient: {
    id: 'ap.ids-admin:success-deleting-client',
    defaultMessage: 'Successfully archived client',
  },
  delete: {
    id: 'ap.ids-admin:delete',
    defaultMessage: 'Delete',
  },
  archive: {
    id: 'ap.ids-admin:archive',
    defaultMessage: 'Archive',
  },
  closeDeleteModal: {
    id: 'ap.ids-admin:close-delete-modal',
    defaultMessage: 'Close',
  },
  deleteClientDescription: {
    id: 'ap.ids-admin:delete-client-action-card-label',
    defaultMessage: 'Authentications will stop working for your client.',
  },
  deleteClient: {
    id: 'ap.ids-admin:delete-client-all-env',
    defaultMessage: 'Archive client',
  },
  deleteClientAlertMessage: {
    id: 'ap.ids-admin:delete-client-alert-message',
    defaultMessage:
      'The client ID will be archived from all available environments and cannot be reused. Authentications will stop working immediately for your client.',
  },
  partiallyCreatedClient: {
    id: 'ap.ids-admin:partially-created-client',
    defaultMessage: 'Client creation failed on one or more environments',
  },
  typeNotFound: {
    id: 'ap.ids-admin:type-not-found',
    defaultMessage: '{type} not found',
  },
  typeNotFoundMessage: {
    id: 'ap.ids-admin:type-not-found-message',
    defaultMessage: 'It may have been removed or moved',
  },
  additionalSettingsLabel: {
    id: 'ap.ids-admin:additional-settings-label',
    defaultMessage: 'Additional settings',
  },
  clientDelegationProviderDelegationdbName: {
    id: 'ap.ids-admin:client-delegation-provider-custom-name',
    defaultMessage: 'Island.is',
  },
  clientDelegationProviderDelegationdbDescription: {
    id: 'ap.ids-admin:client-delegation-provider-custom-description',
    defaultMessage:
      'Allow users to sign into this client with custom delegations managed on Mínar síður Ísland.is.',
  },
  clientDelegationTypeCustomName: {
    id: 'ap.ids-admin:client-delegation-type-custom-name',
    defaultMessage: 'Custom delegations',
  },
  clientDelegationTypeCustomDescription: {
    id: 'ap.ids-admin:client-delegation-type-custom-description',
    defaultMessage:
      'The client must request API scopes which support custom delegations. The user must have a valid custom delegation with one of these API scopes.',
  },
  clientDelegationProviderFyrirtaekjaskraName: {
    id: 'ap.ids-admin:client-delegation-provider-procuration-holder-name',
    defaultMessage: 'Company registry',
  },
  clientDelegationProviderFyrirtaekjaskraDescription: {
    id: 'ap.ids-admin:client-delegation-provider-procuration-holder-description',
    defaultMessage:
      'Allow users to sign into this client as legal entities according to roles managed by the company registry of Iceland.',
  },
  clientDelegationTypeProcurationHolderName: {
    id: 'ap.ids-admin:client-delegation-type-procuration-holder-name',
    defaultMessage: 'Procuration holder',
  },
  clientDelegationProviderThjodskraName: {
    id: 'ap.ids-admin:client-delegation-provider-tjodskra-name',
    defaultMessage: 'National registry',
  },
  clientDelegationProviderThjodskraDescription: {
    id: 'ap.ids-admin:client-delegation-provider-tjodskra-description',
    defaultMessage:
      'Allow users to sign into this client as children which they are legal guardians of according to the Registers Iceland.',
  },
  clientDelegationTypeLegalGuardianMinorName: {
    id: 'ap.ids-admin:client-delegation-type-legal-guardian-minor-name',
    defaultMessage: 'Legal guardian minor',
  },
  clientDelegationTypeLegalGuardianMinorDescription: {
    id: 'ap.ids-admin:client-delegation-type-legal-guardian-minor-description',
    defaultMessage: 'Legal guardian of children 16 years and younger.',
  },
  clientDelegationTypeLegalGuardianName: {
    id: 'ap.ids-admin:client-delegation-type-legal-guardian-name',
    defaultMessage: 'Legal guardian',
  },
  clientDelegationTypeLegalGuardianDescription: {
    id: 'ap.ids-admin:client-delegation-type-legal-guardian-description',
    defaultMessage: 'Legal guardian of children 18 years and younger.',
  },
  clientDelegationProviderTalsmannagrunnurName: {
    id: 'ap.ids-admin:client-delegation-provider-talsmannagrunnur-name',
    defaultMessage: 'Personal representatives',
  },
  clientDelegationProviderTalsmannagrunnurDescription: {
    id: 'ap.ids-admin:client-delegation-provider-talsmannagrunnur-description',
    defaultMessage:
      'Allow users to sign into this client on behalf of disabled individuals according to API scopes on an active personal representation contract at the Ministry of Social Affairs and Labour.',
  },
  clientDelegationTypePersonalRepresentativepostholfName: {
    id: 'ap.ids-admin:client-delegation-type-personal-representative-postholf-name',
    defaultMessage: 'Documents (ísl. pósthólf)',
  },
  clientDelegationProviderSyslumennName: {
    id: 'ap.ids-admin:client-delegation-provider-syslumenn-name',
    defaultMessage: 'District Commissioner',
  },
  clientDelegationProviderSyslumennDescription: {
    id: 'ap.ids-admin:client-delegation-provider-syslumenn-description',
    defaultMessage:
      'Allow users to sign into this client using delegation types managed by the District Commissioner.',
  },
  clientDelegationTypeLegalRepresentativeName: {
    id: 'ap.ids-admin:client-delegation-type-legal-representative-name',
    defaultMessage: 'Legal representative',
  },
  apiScopeDelegationProviderDelegationdbName: {
    id: 'ap.ids-admin:api-scope-delegation-provider-custom-name',
    defaultMessage: 'Island.is',
  },
  apiScopeDelegationTypeCustomName: {
    id: 'ap.ids-admin:api-scope-delegation-type-custom-name',
    defaultMessage: 'Custom delegations',
  },
  apiScopeDelegationTypeCustomDescription: {
    id: 'ap.ids-admin:api-scope-delegation-type-custom-description',
    defaultMessage:
      'Should users be able to grant other users custom delegation for this API scope.',
  },
  apiScopeDelegationProviderFyrirtaekjaskraName: {
    id: 'ap.ids-admin:api-scope-delegation-provider-procuration-holder-name',
    defaultMessage: 'Company registry',
  },
  apiScopeDelegationTypeProcurationHolderName: {
    id: 'ap.ids-admin:api-scope-delegation-type-procuration-holder-name',
    defaultMessage: 'Procuration holder',
  },
  apiScopeDelegationTypeProcurationHolderDescription: {
    id: 'ap.ids-admin:api-scope-delegation-type-procuration-holder-description',
    defaultMessage:
      'Should procuring holders automatically get this API scope for their organisations',
  },
  apiScopeDelegationProviderThjodskraName: {
    id: 'ap.ids-admin:api-scope-delegation-provider-tjodskra-name',
    defaultMessage: 'National registry',
  },
  apiScopeDelegationTypeLegalGuardianMinorName: {
    id: 'ap.ids-admin:api-scope-delegation-type-legal-guardian-minor-name',
    defaultMessage: 'Legal guardian minor',
  },
  apiScopeDelegationTypeLegalGuardianMinorDescription: {
    id: 'ap.ids-admin:api-scope-delegation-type-legal-guardian-minor-description',
    defaultMessage:
      'Should legal guardians automatically get this API scope for their wards, 16 and younger.',
  },
  apiScopeDelegationTypeLegalGuardianName: {
    id: 'ap.ids-admin:api-scope-delegation-type-legal-guardian-name',
    defaultMessage: 'Legal guardian',
  },
  apiScopeDelegationTypeLegalGuardianDescription: {
    id: 'ap.ids-admin:api-scope-delegation-type-legal-guardian-description',
    defaultMessage:
      'Should legal guardians automatically get this API scope for their wards, 18 and younger.',
  },
  apiScopeDelegationProviderTalsmannagrunnurName: {
    id: 'ap.ids-admin:api-scope-delegation-provider-talsmannagrunnur-name',
    defaultMessage: 'Personal representatives',
  },
  apiScopeDelegationTypePersonalRepresentativepostholfName: {
    id: 'ap.ids-admin:api-scope-delegation-type-personal-representative-postholf-name',
    defaultMessage: 'Documents (ísl. pósthólf)',
  },
  apiScopeDelegationTypePersonalRepresentativepostholfDescription: {
    id: 'ap.ids-admin:api-scope-delegation-type-personal-representative-postholf-description',
    defaultMessage:
      'Should personal representatives automatically get this API scope for their clients.',
  },
  apiScopeDelegationProviderSyslumennName: {
    id: 'ap.ids-admin:api-scope-delegation-provider-syslumenn-name',
    defaultMessage: 'District Commissioner',
  },
  apiScopeDelegationTypeLegalRepresentativeName: {
    id: 'ap.ids-admin:api-scope-delegation-type-legal-representative-name',
    defaultMessage: 'Legal representative',
  },
  apiScopeDelegationTypeLegalRepresentativeDescription: {
    id: 'ap.ids-admin:api-scope-delegation-type-legal-representative-description',
    defaultMessage:
      'Should legal representatives automatically get this API scope for their clients.',
  },
  createTenant: {
    id: 'ap.ids-admin:create-tenant',
    defaultMessage: 'Create domain',
  },
  tenantSearchPlaceholder: {
    id: 'ap.ids-admin:tenant-search-placeholder',
    defaultMessage: 'Search by name, domain identifier or national id',
  },
  editTenant: {
    id: 'ap.ids-admin:edit-tenant',
    defaultMessage: 'Edit domain',
  },
  deleteTenant: {
    id: 'ap.ids-admin:delete-tenant',
    defaultMessage: 'Delete domain',
  },
  deleteTenantConfirm: {
    id: 'ap.ids-admin:delete-tenant-confirm',
    defaultMessage:
      'Are you sure you want to delete the domain "{name}"? This action cannot be undone.',
  },
  deleteTenantDescription: {
    id: 'ap.ids-admin:delete-tenant-description',
    defaultMessage:
      'Permanently delete this domain. Not possible while clients, scopes, or scope groups still reference it.',
  },
  deleteTenantSuccess: {
    id: 'ap.ids-admin:delete-tenant-success',
    defaultMessage: 'Domain deleted',
  },
  deleteTenantError: {
    id: 'ap.ids-admin:delete-tenant-error',
    defaultMessage: 'Failed to delete domain',
  },
  createTenantSuccess: {
    id: 'ap.ids-admin:create-tenant-success',
    defaultMessage: 'Domain created',
  },
  createTenantError: {
    id: 'ap.ids-admin:create-tenant-error',
    defaultMessage: 'Failed to create domain',
  },
  updateTenantSuccess: {
    id: 'ap.ids-admin:update-tenant-success',
    defaultMessage: 'Domain updated',
  },
  updateTenantError: {
    id: 'ap.ids-admin:update-tenant-error',
    defaultMessage: 'Failed to update domain',
  },
  tenantName: {
    id: 'ap.ids-admin:tenant-name',
    defaultMessage: 'Name',
  },
  tenantNamePlaceholder: {
    id: 'ap.ids-admin:tenant-name-placeholder',
    defaultMessage: '@mitt.lén',
  },
  tenantNameHelper: {
    id: 'ap.ids-admin:tenant-name-helper',
    defaultMessage:
      'Must start with @ and contain only lowercase letters, digits, dots, hyphens or underscores.',
  },
  tenantNameTooltip: {
    id: 'ap.ids-admin:tenant-name-tooltip',
    defaultMessage: 'The identifier of this domain',
  },
  tenantNationalIdTooltip: {
    id: 'ap.ids-admin:tenant-national-id-tooltip',
    defaultMessage: 'National ID associated with this domain',
  },
  tenantDisplayNameTooltip: {
    id: 'ap.ids-admin:tenant-display-name-tooltip',
    defaultMessage: 'The display name for this domain',
  },
  tenantDescriptionTooltip: {
    id: 'ap.ids-admin:tenant-description-tooltip',
    defaultMessage: 'The description of this domain',
  },
  tenantContactEmailTooltip: {
    id: 'ap.ids-admin:tenant-contact-email-tooltip',
    defaultMessage: 'The contact email for this domain',
  },
  tenantNationalId: {
    id: 'ap.ids-admin:tenant-national-id',
    defaultMessage: 'National id',
  },
  tenantDisplayName: {
    id: 'ap.ids-admin:tenant-display-name',
    defaultMessage: 'Display name',
  },
  tenantDescription: {
    id: 'ap.ids-admin:tenant-description',
    defaultMessage: 'Description',
  },
  tenantContactEmail: {
    id: 'ap.ids-admin:tenant-contact-email',
    defaultMessage: 'Contact email',
  },
  errorTenantName: {
    id: 'ap.ids-admin:error-tenant-name',
    defaultMessage:
      'Name must start with @ and contain only lowercase letters, digits, dots, hyphens or underscores',
  },
  errorNationalId: {
    id: 'ap.ids-admin:error-national-id',
    defaultMessage: 'National id must be a valid 10 digit kennitala',
  },
  errorRequired: {
    id: 'ap.ids-admin:error-required',
    defaultMessage: 'This field is required',
  },
  errorUnsafeChars: {
    id: 'ap.ids-admin:error-unsafe-chars',
    defaultMessage: 'Contains invalid characters',
  },
  errorEmail: {
    id: 'ap.ids-admin:error-email',
    defaultMessage: 'Must be a valid email address',
  },
  tenantHasReferences: {
    id: 'ap.ids-admin:tenant-has-references',
    defaultMessage:
      'This domain cannot be deleted because it still has clients, API scopes, or API scope groups. Please delete them first and try again.',
  },
  publishTenantEnvDesc: {
    id: 'ap.ids-admin:publish-tenant-env-desc',
    defaultMessage:
      'This domain does not exist in the selected environment yet. Choose an environment to copy from and the domain will be published.',
  },
  partiallyCreatedTenant: {
    id: 'ap.ids-admin:partially-created-tenant',
    defaultMessage:
      'Domain was only created in some of the selected environments. You can use the edit page to publish it to the remaining environments.',
  },
  deletedCategory: {
    id: 'ap.ids-admin:deleted-category',
    defaultMessage: 'Þessum flokki hefur verið eytt ({id})',
  },
  deletedCategoryDescription: {
    id: 'ap.ids-admin:deleted-category-description',
    defaultMessage: 'Þessi flokkur er ekki lengur til í Contentful',
  },
  deletedTag: {
    id: 'ap.ids-admin:deleted-tag',
    defaultMessage: 'Þessu merki hefur verið eytt ({id})',
  },
  deletedTagDescription: {
    id: 'ap.ids-admin:deleted-tag-description',
    defaultMessage: 'Þetta merki er ekki lengur til í Contentful',
  },
  userIdentities: {
    id: 'ap.ids-admin:user-identities',
    defaultMessage: 'User Management',
  },
  userIdentitiesIntro: {
    id: 'ap.ids-admin:user-identities-intro',
    defaultMessage:
      'Look up a user identity by national ID or subject ID, view its claims, and manage its active status per environment.',
  },
  userIdentitiesSearchPlaceholder: {
    id: 'ap.ids-admin:user-identities-search-placeholder',
    defaultMessage: 'Search by national ID or subject ID',
  },
  userIdentitiesEmptyState: {
    id: 'ap.ids-admin:user-identities-empty-state',
    defaultMessage:
      'Enter a national ID or a subject ID to search for a user identity.',
  },
  userIdentitiesNotFound: {
    id: 'ap.ids-admin:user-identities-not-found',
    defaultMessage: 'No user identities matched your search.',
  },
  userIdentitiesSubjectId: {
    id: 'ap.ids-admin:user-identities-subject-id',
    defaultMessage: 'Subject ID',
  },
  userIdentitiesName: {
    id: 'ap.ids-admin:user-identities-name',
    defaultMessage: 'Name',
  },
  userIdentitiesProviderName: {
    id: 'ap.ids-admin:user-identities-provider-name',
    defaultMessage: 'Provider name',
  },
  userIdentitiesProviderSubjectId: {
    id: 'ap.ids-admin:user-identities-provider-subject-id',
    defaultMessage: 'Provider subject ID',
  },
  userIdentitiesEnvironments: {
    id: 'ap.ids-admin:user-identities-environments',
    defaultMessage: 'Environments',
  },
  userIdentitiesClaims: {
    id: 'ap.ids-admin:user-identities-claims',
    defaultMessage: 'Claims',
  },
  userIdentitiesViewClaims: {
    id: 'ap.ids-admin:user-identities-view-claims',
    defaultMessage: 'Claims',
  },
  userIdentitiesClaimsTitle: {
    id: 'ap.ids-admin:user-identities-claims-title',
    defaultMessage: 'Claims',
  },
  userIdentitiesClaimsType: {
    id: 'ap.ids-admin:user-identities-claims-type',
    defaultMessage: 'Type',
  },
  userIdentitiesClaimsValue: {
    id: 'ap.ids-admin:user-identities-claims-value',
    defaultMessage: 'Value',
  },
  userIdentitiesClaimsEmpty: {
    id: 'ap.ids-admin:user-identities-claims-empty',
    defaultMessage: 'No claims found for this user identity.',
  },
  userIdentitiesDeactivate: {
    id: 'ap.ids-admin:user-identities-deactivate',
    defaultMessage: 'Deactivate',
  },
  userIdentitiesReactivate: {
    id: 'ap.ids-admin:user-identities-reactivate',
    defaultMessage: 'Reactivate',
  },
  userIdentitiesActiveTag: {
    id: 'ap.ids-admin:user-identities-active-tag',
    defaultMessage: 'Deactivated',
  },
  userIdentitiesDeactivateConfirmTitle: {
    id: 'ap.ids-admin:user-identities-deactivate-confirm-title',
    defaultMessage: 'Deactivate user identity',
  },
  userIdentitiesDeactivateConfirmMessage: {
    id: 'ap.ids-admin:user-identities-deactivate-confirm-message',
    defaultMessage:
      'Are you sure you want to deactivate this user identity in the selected environments?',
  },
  userIdentitiesDeactivateSelectEnvironments: {
    id: 'ap.ids-admin:user-identities-deactivate-select-environments',
    defaultMessage: 'Select environments to deactivate in',
  },
  userIdentitiesDeactivateEnvironmentRequired: {
    id: 'ap.ids-admin:user-identities-deactivate-environment-required',
    defaultMessage: 'Select at least one environment to deactivate in',
  },
  userIdentitiesReactivateConfirmTitle: {
    id: 'ap.ids-admin:user-identities-reactivate-confirm-title',
    defaultMessage: 'Reactivate user identity',
  },
  userIdentitiesReactivateConfirmMessage: {
    id: 'ap.ids-admin:user-identities-reactivate-confirm-message',
    defaultMessage:
      'Are you sure you want to reactivate this user identity in the selected environments?',
  },
  userIdentitiesReactivateSelectEnvironments: {
    id: 'ap.ids-admin:user-identities-reactivate-select-environments',
    defaultMessage: 'Select environments to reactivate in',
  },
  userIdentitiesReactivateEnvironmentRequired: {
    id: 'ap.ids-admin:user-identities-reactivate-environment-required',
    defaultMessage: 'Select at least one environment to reactivate in',
  },
  userIdentitiesDeactivateSuccess: {
    id: 'ap.ids-admin:user-identities-deactivate-success',
    defaultMessage: 'User identity deactivated successfully',
  },
  userIdentitiesReactivateSuccess: {
    id: 'ap.ids-admin:user-identities-reactivate-success',
    defaultMessage: 'User identity reactivated successfully',
  },
  userIdentitiesError: {
    id: 'ap.ids-admin:user-identities-error',
    defaultMessage: 'An error occurred',
  },
  userIdentitiesPartialFailure: {
    id: 'ap.ids-admin:user-identities-partial-failure',
    defaultMessage: 'Operation failed on: {environments}',
  },
  userIdentitiesAlreadyDeactivatedTag: {
    id: 'ap.ids-admin:user-identities-already-deactivated-tag',
    defaultMessage: 'Deactivated',
  },
  userIdentitiesAlreadyActiveTag: {
    id: 'ap.ids-admin:user-identities-already-active-tag',
    defaultMessage: 'Active',
  },
})
