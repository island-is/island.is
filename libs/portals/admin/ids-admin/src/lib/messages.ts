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
  errorLoadingData: {
    id: 'ap.ids-admin:error-loading-data',
    defaultMessage: 'Error loading data. Please try again later.',
  },
  clearFilter: {
    id: 'ap.ids-admin:clear-filter',
    defaultMessage: 'Clear filter',
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
  clients: {
    id: 'ap.ids-admin:applications',
    defaultMessage: 'Application',
  },
  applicationCreate: {
    id: 'ap.ids-admin:application-create',
    defaultMessage: 'Create application',
  },
  apis: {
    id: 'ap.ids-admin:apis',
    defaultMessage: 'APIs',
  },
  settings: {
    id: 'ap.ids-admin:settings',
    defaultMessage: 'Settings',
  },
  authentication: {
    id: 'ap.ids-admin:authentication',
    defaultMessage: 'Permissions',
  },
  advancedSettings: {
    id: 'ap.ids-admin:advanced-settings',
    defaultMessage: 'Avanced settings',
  },
  back: {
    id: 'ap.ids-admin:back',
    defaultMessage: 'Back',
  },
  clientsDescription: {
    id: 'ap.ids-admin:applications-description',
    defaultMessage: 'Here you can view and create applications.',
  },
  learnMore: {
    id: 'ap.ids-admin:learn-more',
    defaultMessage: 'Learn more',
  },
  noApplications: {
    id: 'ap.ids-admin:no-applications',
    defaultMessage: 'No applications',
  },
  noClientsDescription: {
    id: 'ap.ids-admin:no-applications-description',
    defaultMessage:
      'You can create an application by clicking on Create application',
  },
  cancel: {
    id: 'ap.ids-admin:cancel',
    defaultMessage: 'Cancel',
  },
  create: {
    id: 'ap.ids-admin:create',
    defaultMessage: 'Create',
  },
  displayName: {
    id: 'ap.ids-admin:display-name',
    defaultMessage: 'Name',
  },
  clientId: {
    id: 'ap.ids-admin:clientId',
    defaultMessage: 'Application ID',
  },
  chooseEnvironment: {
    id: 'ap.ids-admin:choose-environment',
    defaultMessage: 'Choose environment',
  },
  chooseClientType: {
    id: 'ap.ids-admin:choose-application-type',
    defaultMessage: 'Choose application type',
  },
  errorDisplayName: {
    id: 'ap.ids-admin:error-display-name',
    defaultMessage: 'Name is required.',
  },
  errorClientId: {
    id: 'ap.ids-admin:error-application-id',
    defaultMessage: 'Application ID is required.',
  },
  errorClientIdRegex: {
    id: 'ap.ids-admin:error-application-id-regex',
    defaultMessage: 'Allowed characters are A-Z a-z 0-9 . _ - /',
  },
  errorEnvironment: {
    id: 'ap.ids-admin:error-environment',
    defaultMessage: 'Choose at least one environment.',
  },
  errorClientType: {
    id: 'ap.ids-admin:error-application-type',
    defaultMessage: 'Application type is required.',
  },
  errorDefault: {
    id: 'ap.ids-admin:error-default',
    defaultMessage: 'Oops, an unknown error has occurred.',
  },
  webClientsTitle: {
    id: 'ap.ids-admin:web-applications-title',
    defaultMessage: 'Web application',
  },
  webClientsDescription: {
    id: 'ap.ids-admin:web-applications-description',
    defaultMessage:
      'Traditional web apps using redirects. E.g. Node.js, Express, ASP.net, Java, PHP.',
  },
  nativeClientsTitle: {
    id: 'ap.ids-admin:native-applications-title',
    defaultMessage: 'Native application',
  },
  nativeClientsDescription: {
    id: 'ap.ids-admin:native-applications-description',
    defaultMessage:
      'Mobile, desktop, CLI and smart device app running natively. E.g. iOS, Electron, Apple TV app.',
  },
  machineClientsTitle: {
    id: 'ap.ids-admin:machine-applications-title',
    defaultMessage: 'Machine to machine application',
  },
  machineClientsDescription: {
    id: 'ap.ids-admin:machine-applications-description',
    defaultMessage:
      'CLIs, daemons, or services running on your backend. E.g. APIs, CRON jobs or shell script.',
  },
  createClient: {
    id: 'ap.ids-admin:create-application',
    defaultMessage: 'Create application',
  },
  change: {
    id: 'ap.ids-admin:change',
    defaultMessage: 'Change',
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
      'When enabled, a refresh token will expire based on a specified inactivity lifetime, after which the token can no longer be used.',
  },
  inactivityLifetime: {
    id: 'ap.ids-admin:inactivity-lifetime',
    defaultMessage: 'Inactivity lifetime (seconds)',
  },
  inactivityLifetimeDescription: {
    id: 'ap.ids-admin:inactivity-lifetime-description',
    defaultMessage:
      'Sets the absolute lifetime of a refresh token (in seconds).',
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
    id: 'ap.ids-admin:application-secret',
    defaultMessage: 'Application secret',
  },
  clientSecretDescription: {
    id: 'ap.ids-admin:application-secret-description',
    defaultMessage: 'The application Secret is not base64 encoded.',
  },
  otherEndpoints: {
    id: 'ap.ids-admin:other-endpoints',
    defaultMessage: 'Other endpoints',
  },
  idsUrl: {
    id: 'ap.ids-admin:ids-url',
    defaultMessage: 'Issuer Url',
  },
  callbackUrl: {
    id: 'ap.ids-admin:callback-url',
    defaultMessage: 'Callback Url',
  },
  callBackUrlPlaceholder: {
    id: 'ap.ids-admin:callback-url-placeholder',
    defaultMessage: 'List callback URLs, comma seperated',
  },
  callBackUrlDescription: {
    id: 'ap.ids-admin:callback-url-description',
    defaultMessage:
      'After the user authenticates we will only call back to any of these URLs. You can specify multiple valid URLs by comma-separating them (typically to handle different environments like QA or testing). Make sure to specify the protocol (https://) otherwise the callback may fail in some cases. With the exception of custom URI schemes for native clients, all callbacks should use protocol https://. You can use Organization URL parameters in these URLs.',
  },
  logoutUrl: {
    id: 'ap.ids-admin:logout-url',
    defaultMessage: 'Logout Url',
  },
  logoutUrlPlaceholder: {
    id: 'ap.ids-admin:logout-url-placeholder',
    defaultMessage: 'List logout URLs, comma seperated',
  },
  logoutUrlDescription: {
    id: 'ap.ids-admin:logout-url-description',
    defaultMessage:
      'A set of URLs that are valid to redirect to after logout from ísland.is authentication service. After a user logs out from ísland.is you can redirect them with the post_logout_redirect_uri query parameter. The URL that you use in post_logout_redirect_uri must be listed here. You can specify multiple valid URLs by comma-separating them.',
  },
  cors: {
    id: 'ap.ids-admin:cors',
    defaultMessage: 'CORS',
  },
  corsPlaceholder: {
    id: 'ap.ids-admin:cors-placeholder',
    defaultMessage: 'List CORS urls, comma seperated',
  },
  corsDescription: {
    id: 'ap.ids-admin:cors-description',
    defaultMessage:
      'List additional origins allowed to make cross-origin resource sharing (CORS) requests. Allowed callback URLs are already included in this list. URLs can be comma-separated or added line-by-line Use wildcards (*) at the subdomain level (e.g. https://*.contoso.com) Query strings and hash information are ignored Organization URL placeholders are supported',
  },
  translations: {
    id: 'ap.ids-admin:translations',
    defaultMessage: 'Translations',
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
    id: 'ap.ids-admin:applications-urls',
    defaultMessage: 'Application URLs',
  },
  lifetime: {
    id: 'ap.ids-admin:life-time',
    defaultMessage: 'Refresh token life cycle',
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
  errorPositiveNumber: {
    id: 'ap.ids-admin:error-positive-number',
    defaultMessage: 'Must be a positive number',
  },
  delegations: {
    id: 'ap.ids-admin:delegations',
    defaultMessage: 'Delegations',
  },
  delegationsDescription: {
    id: 'ap.ids-admin:delegations-description',
    defaultMessage:
      'Configure which delegations the user can choose when authenticating to the application.',
  },
  supportCustomDelegation: {
    id: 'ap.ids-admin:support-custom-delegation',
    defaultMessage: 'Support custom delegations',
  },
  supportCustomDelegationDescription: {
    id: 'ap.ids-admin:support-custom-delegation-description',
    defaultMessage:
      'Allow users to sign into this application with custom delegations which were manually granted to them on Mínar síður Ísland.is.\n' +
      'The application must request permissions which support custom delegations. The user must have a valid custom delegation with one of these permissions.\n',
  },
  supportLegalGuardianDelegation: {
    id: 'ap.ids-admin:support-legal-guardian-delegation',
    defaultMessage: 'Support legal guardian delegations',
  },
  supportLegalGuardianDelegationDescription: {
    id: 'ap.ids-admin:support-legal-guardian-delegation-description',
    defaultMessage:
      'Allow users to sign into this application as children which they are legal guardians of according to the Registers Iceland.',
  },
  supportPersonalRepresentativeDelegation: {
    id: 'ap.ids-admin:support-personal-representative-delegation',
    defaultMessage: 'Support personal representative delegations',
  },
  supportPersonalRepresentativeDelegationDescription: {
    id: 'ap.ids-admin:support-personal-representative-delegation-description',
    defaultMessage:
      'Allow users to sign into this application on behalf of disabled individuals with an active personal representation contract at the Ministry of Social Affairs and Labour.',
  },
  supportProcuringHolderDelegation: {
    id: 'ap.ids-admin:support-procuring-holder-delegation',
    defaultMessage: 'Support procuring holder delegations',
  },
  supportProcuringHolderDelegationDescription: {
    id: 'ap.ids-admin:support-procuring-holder-delegation-description',
    defaultMessage:
      'Allow users to sign into this application as legal entities which they are procuring holders of according to the company registry of Iceland.',
  },
  alwaysPromptDelegations: {
    id: 'ap.ids-admin:always-prompt-delegations',
    defaultMessage: 'Always prompt delegations',
  },
  alwaysPromptDelegationsDescription: {
    id: 'ap.ids-admin:always-prompt-delegations-description',
    defaultMessage:
      'With this setting, the user always sees the delegation screen when authenticating with your application. For most applications we recommend keeping this off and to provide an explicit action to authenticate with delegation using the prompt=select_account argument.',
  },
  requirePermissions: {
    id: 'ap.ids-admin:require-permissions',
    defaultMessage: 'Require permissions',
  },
  requirePermissionsDescription: {
    id: 'ap.ids-admin:require-permissions-description',
    defaultMessage:
      'Only allow delegations which have access to one or more requested permissions. Can be combined with permission settings to block access to the application for certain individuals or delegations.',
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
      'Allows the application to request the offline_access scope. This results in refresh tokens which can used to get access tokens according to the refresh token lifecycle settings',
  },
  supportsTokenExchange: {
    id: 'ap.ids-admin:supports-token-exchange',
    defaultMessage: 'Supports token exchange grant',
  },
  supportsTokenExchangeDescription: {
    id: 'ap.ids-admin:supports-token-exchange-description',
    defaultMessage:
      'Allows the application to exchange an existing access token with a new access token with specified scope.',
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
      'When true, the application requires user consent for third party permissions as well as standard scopes like email and phone.',
  },
  customClaimsDescription: {
    id: 'ap.ids-admin:custom-claims-description',
    defaultMessage:
      'Configure custom claims (hard-coded) in access tokens created for this application. Each line should have the form claimName=value. Claim names are automatically prefixed with "client_" to avoid collisions. Claim values are always stored as strings.',
  },
  errorInvalidClaims: {
    id: 'ap.ids-admin:error-invalid-claims',
    defaultMessage: 'Invalid claim format',
  },
  copySuccess: {
    id: 'ap.ids-admin:copy-success',
    defaultMessage: 'Copied to clipboard',
  },
  successfullySaved: {
    id: 'ap.ids-admin:successfully-saved',
    defaultMessage: 'Successfully saved',
  },
  globalErrorMessage: {
    id: 'ap.ids-admin:global-error-message',
    defaultMessage: 'An error occurred',
  },
  syncSettings: {
    id: 'ap.ids-admin:sync-settings',
    defaultMessage: 'Sync settings (from this environment)',
  },
  inSyncAcrossAllEnvironments: {
    id: 'ap.ids-admin:in-sync-across-all-environments',
    defaultMessage: 'Settings are the same in all environments.',
  },
  notInSyncAcrossAllEnvironments: {
    id: 'ap.ids-admin:not-in-sync-across-all-environments',
    defaultMessage: 'SyncSettings are different in some environments',
  },
  inSync: {
    id: 'ap.ids-admin:in-sync',
    defaultMessage: 'In sync',
  },
  outOfSync: {
    id: 'ap.ids-admin:out-of-sync',
    defaultMessage: 'Out of sync',
  },
})
