import { defineMessages } from 'react-intl'

export const m = defineMessages({
  idsAdmin: {
    id: 'ap.ids-admin:ids-admin',
    defaultMessage: 'Innskraningarkerfi',
  },
  idsAdminDescription: {
    id: 'ap.ids-admin:ids-admin-description',
    defaultMessage: 'Veldu það domain sem þú villt skoða frekar',
  },
  tenants: {
    id: 'ap.ids-admin:tenants',
    defaultMessage: 'Tenants',
  },
  errorLoadingData: {
    id: 'ap.ids-admin:error-loading-data',
    defaultMessage: 'Villa kom upp, vinsamlegast reyndu aftur síðar',
  },
  clearFilter: {
    id: 'ap.ids-admin:clear-filter',
    defaultMessage: 'Hreinsa síu',
  },
  clearAllFilters: {
    id: 'ap.ids-admin:clear-all-filters',
    defaultMessage: 'Hreinsa allar síur',
  },
  openFilter: {
    id: 'ap.ids-admin:open-filter',
    defaultMessage: 'Opna síu',
  },
  closeFilter: {
    id: 'ap.ids-admin:close-filter',
    defaultMessage: 'Loka síu',
  },
  searchPlaceholder: {
    id: 'ap.ids-admin:search-placeholder',
    defaultMessage: 'Sláðu inn leitarorð',
  },
  clients: {
    id: 'ap.ids-admin:applications',
    defaultMessage: 'Forrit',
  },
  applicationCreate: {
    id: 'ap.ids-admin:application-create',
    defaultMessage: 'Stofna forrit',
  },
  apis: {
    id: 'ap.ids-admin:apis',
    defaultMessage: 'Vefþjónustur',
  },
  settings: {
    id: 'ap.ids-admin:settings',
    defaultMessage: 'Stillingar',
  },
  authentication: {
    id: 'ap.ids-admin:authentication',
    defaultMessage: 'Réttindi',
  },
  advancedSettings: {
    id: 'ap.ids-admin:advanced-settings',
    defaultMessage: 'Ítarlegar stillingar',
  },
  back: {
    id: 'ap.ids-admin:back',
    defaultMessage: 'Til baka',
  },
  clientsDescription: {
    id: 'ap.ids-admin:applications-description',
    defaultMessage: 'Forrit sem tengjast þessum tenant',
  },
  learnMore: {
    id: 'ap.ids-admin:learn-more',
    defaultMessage: 'Nánari upplýsingar',
  },
  noApplications: {
    id: 'ap.ids-admin:no-applications',
    defaultMessage: 'Engin forrit til staðar',
  },
  noClientsDescription: {
    id: 'ap.ids-admin:no-applications-description',
    defaultMessage:
      'Þú getur búið til forrit með því að smella á Búa til forrit',
  },
  cancel: {
    id: 'ap.ids-admin:cancel',
    defaultMessage: 'Hætta við',
  },
  create: {
    id: 'ap.ids-admin:create',
    defaultMessage: 'Skrá nýtt forrit',
  },
  displayName: {
    id: 'ap.ids-admin:display-name',
    defaultMessage: 'Nafn',
  },
  clientId: {
    id: 'ap.ids-admin:clientId',
    defaultMessage: 'Application ID',
  },
  chooseEnvironment: {
    id: 'ap.ids-admin:choose-environment',
    defaultMessage: 'Veldu umhverfi',
  },
  chooseClientType: {
    id: 'ap.ids-admin:choose-application-type',
    defaultMessage: 'Veldu tegund forrits',
  },
  errorDisplayName: {
    id: 'ap.ids-admin:error-display-name',
    defaultMessage: 'Nafn má ekki vera tómt',
  },
  errorClientId: {
    id: 'ap.ids-admin:error-application-id',
    defaultMessage: 'Application ID má ekki vera tómt',
  },
  errorClientIdRegex: {
    id: 'ap.ids-admin:error-application-id-regex',
    defaultMessage: 'Gildir stafir eru A-Z a-z 0-9 . _ - /',
  },
  errorEnvironment: {
    id: 'ap.ids-admin:error-environment',
    defaultMessage: 'Veldu a.m.k. eitt umhverfi',
  },
  errorClientType: {
    id: 'ap.ids-admin:error-application-type',
    defaultMessage: 'Veldu tegund forrits',
  },
  errorDefault: {
    id: 'ap.ids-admin:error-default',
    defaultMessage: 'Úps, óvænt villa kom upp!',
    description: 'An unknown error has occurred',
  },
  webClientsTitle: {
    id: 'ap.ids-admin:web-applications-title',
    defaultMessage: 'Vefforrit',
  },
  webClientsDescription: {
    id: 'ap.ids-admin:web-applications-description',
    defaultMessage:
      'Hefðbundin vefforrit sem nota tilvísanir. T.d. Node.js, Express, ASP.net, Java, PHP',
  },
  nativeClientsTitle: {
    id: 'ap.ids-admin:native-applications-title',
    defaultMessage: 'Smáforrið forrit',
  },
  nativeClientsDescription: {
    id: 'ap.ids-admin:native-applications-description',
    defaultMessage:
      'Farsíma-, skjáborðs-, CLI- og snjalltækjaforrit sem keyra innbyggt. T.d. iOS, Electron, Apple TV öppum',
  },
  machineClientsTitle: {
    id: 'ap.ids-admin:machine-applications-title',
    defaultMessage: 'Kerfi í kerfi',
  },
  machineClientsDescription: {
    id: 'ap.ids-admin:machine-applications-description',
    defaultMessage:
      'CLI, púkar eða þjónustur sem keyra á bakendanum þínum. T.d. Skeljahandrit',
  },
  createClient: {
    id: 'ap.ids-admin:create-application',
    defaultMessage: 'Stofna forrit',
  },
  change: {
    id: 'ap.ids-admin:change',
    defaultMessage: 'Breyta',
  },
  absoluteLifetime: {
    id: 'ap.ids-admin:absolute-lifetime',
    defaultMessage: 'Absolute lifetime (seconds)',
  },
  absoluteLifetimeDescription: {
    id: 'ap.ids-admin:absolute-lifetime-description',
    defaultMessage:
      'Sets the absolute lifetime of a refresh_token (in seconds).',
  },
  inactivityExpiration: {
    id: 'ap.ids-admin:inactivity-expiration',
    defaultMessage: 'Inactivity expiration',
  },
  inactivityExpirationDescription: {
    id: 'ap.ids-admin:inactivity-expiration-description',
    defaultMessage:
      'When enabled, a refresh_token will expire based on a specified inactivity lifetime, after which the token can no longer be used.',
  },
  inactivityLifetime: {
    id: 'ap.ids-admin:inactivity-lifetime',
    defaultMessage: 'Inactivity lifetime (seconds)',
  },
  inactivityLifetimeDescription: {
    id: 'ap.ids-admin:inactivity-lifetime-description',
    defaultMessage:
      'Sets the absolute lifetime of a refresh_token (in seconds).',
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
    defaultMessage: 'The Client Secret is not base64 encoded.',
  },
  otherEndpoints: {
    id: 'ap.ids-admin:other-endpoints',
    defaultMessage: 'Other endpoints',
  },
  idsUrl: {
    id: 'ap.ids-admin:ids-url',
    defaultMessage: 'IDS Url',
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
      'A set of URLs that are valid to redirect to after logout from Auth0. After a user logs out from Auth0 you can redirect them with the returnTo query parameter. The URL that you use in returnTo must be listed here. You can specify multiple valid URLs by comma-separating them. You can use the star symbol as a wildcard for subdomains (*.google.com). Query strings and hash information are not taken into account when validating these URLs',
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
      'Refresh tokens are useful if you use access tokens to authorise API calls.  Access tokens only last 5 minutes but you can use refresh tokens to request new access tokens. Here you can configure how long refresh tokens can be used to request new access tokens.',
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
})
