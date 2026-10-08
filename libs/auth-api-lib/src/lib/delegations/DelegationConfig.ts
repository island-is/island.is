import { z } from 'zod'

import { AdminPortalScope, ApiScope, AuthScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import { AuthDelegationType } from '@island.is/shared/types'

const customScopeRuleSchema = z.array(
  z.object({
    // The name of the scope which should have special logic.
    scopeName: z.string(),
    // This property adds extra conditions to custom delegation grants. It is an array of
    // delegation types which can grant the scope to other users.
    //
    // * ProcurationHolder: "Company owners" can grant this scope to other users on behalf of their company.
    // * LegalGuardian: "Parents" can grant this scope to other users on behalf of their child.
    // * Custom: Custom delegatee can grant this scope to other users on behalf of the original delegator.
    //
    // In all cases, the active user still needs to have this scope and the
    // `delegation:write` scope in their access token.
    onlyForDelegationType: z.array(
      z
        .string()
        .refine((val) =>
          Object.values(AuthDelegationType).includes(val as AuthDelegationType),
        ),
    ),
  }),
)

const schema = z.object({
  // Configures special rules affecting when specific scopes can be granted to other
  // users in custom delegations.
  customScopeRules: customScopeRuleSchema,
  userInfoUrl: z.string(),
  // Identity provider that attests the confirming authentication, recorded on
  // the evidence record.
  identityServerIssuerUrl: z.string(),
  defaultValidityPeriodInDays: z.number().min(1),
  // The environment's switch for delegation confirmation. Off, sensitive scopes
  // are granted as before. On, the isDelegationConfirmationEnabled flag picks
  // who needs it, and failing to read the flag means they do.
  confirmationEnabled: z.boolean(),
  // How long a grantor has to complete the second, high-assurance confirmation
  // of a delegation containing sensitive scopes.
  confirmationLifetimeInMinutes: z.number().min(1),
  // The assurance level a confirming authentication must assert. Every Auðkenni
  // method asserts eidas-loa-high; passkey logins do not.
  confirmationRequiredAcr: z.string(),
  // How many wrong-person redemption attempts are tolerated before the
  // confirmation is burned.
  confirmationMaxAttempts: z.number().min(1),
  // Development only. Local fake login asserts acr "0", which the confirmation
  // guard correctly rejects, so the happy path is otherwise unreachable on a
  // developer machine. Ignored outside development — see the check in load().
  confirmationAllowAnyAcrInDev: z.boolean(),
  // The confirming authentication is a CIBA request to the identity server,
  // made by delegation-api as its own confidential client.
  // The identity server delegation-api asks for the confirming authentication.
  // The same identity server as identityServerIssuerUrl everywhere but local
  // development, where the step-up may run against a local identity server.
  confirmationCibaIssuerUrl: z.string(),
  confirmationCibaClientId: z.string(),
  confirmationCibaClientSecret: z.string(),
  // Must include openid (CIBA requires it) and a scope that puts nationalId on
  // the access token.
  confirmationCibaScope: z.string(),
  // How many times a step-up may be started for one confirmation, so a stolen
  // session can't flood the grantor's phone with requests.
  confirmationMaxAuthStarts: z.number().min(1),
})

export const DelegationConfig = defineConfig<z.infer<typeof schema>>({
  name: 'DelegationConfig',
  schema,
  load: (env) => ({
    customScopeRules: env.optionalJSON('DELEGATION_CUSTOM_SCOPE_RULES') ?? [
      {
        scopeName: AuthScope.delegations,
        onlyForDelegationType: [AuthDelegationType.ProcurationHolder],
      },
      {
        scopeName: AdminPortalScope.delegations,
        onlyForDelegationType: [AuthDelegationType.ProcurationHolder],
      },
      {
        scopeName: ApiScope.samradsgatt,
        onlyForDelegationType: [
          AuthDelegationType.ProcurationHolder,
          AuthDelegationType.Custom,
        ],
      },
      {
        scopeName: ApiScope.financeSalary,
        onlyForDelegationType: [
          AuthDelegationType.ProcurationHolder,
          AuthDelegationType.Custom,
        ],
      },
      {
        scopeName: ApiScope.company,
        onlyForDelegationType: [
          AuthDelegationType.ProcurationHolder,
          AuthDelegationType.Custom,
        ],
      },
      {
        // This scope is not in use in our repo hence plain string instead of enum.
        scopeName: '@akureyri.is/service-portal',
        onlyForDelegationType: [
          AuthDelegationType.ProcurationHolder,
          AuthDelegationType.Custom,
        ],
      },
      {
        // The branch auth-api/custom-delegation-scope-rule is changing this, but it is not merged yet and this is required for release.
        // Todo: add this to the scope migration of the branch
        scopeName: '@island.is/applications/orkusjodur',
        onlyForDelegationType: [
          AuthDelegationType.ProcurationHolder,
          AuthDelegationType.Custom,
        ],
      },
      {
        // This scope is not in use in our repo hence plain string instead of enum.
        scopeName: '@skagafjordur.is/ibuagatt',
        onlyForDelegationType: [
          AuthDelegationType.ProcurationHolder,
          AuthDelegationType.Custom,
        ],
      },
      {
        // This scope is not in use in our repo hence plain string instead of enum.
        scopeName: '@sass.is/urgangstorg-sveitarfelag',
        onlyForDelegationType: [
          AuthDelegationType.ProcurationHolder,
          AuthDelegationType.Custom,
        ],
      },
    ],
    userInfoUrl:
      env.required(
        'IDENTITY_SERVER_ISSUER_URL',
        'https://identity-server.dev01.devland.is',
      ) + '/connect/userinfo',
    identityServerIssuerUrl: env.required(
      'IDENTITY_SERVER_ISSUER_URL',
      'https://identity-server.dev01.devland.is',
    ),
    defaultValidityPeriodInDays:
      env.optionalJSON('DELEGATION_DEFAULT_VALID_PERIOD_IN_DAYS') ?? 365,
    confirmationEnabled:
      env.optionalJSON<boolean>('DELEGATION_CONFIRMATION_ENABLED') ?? false,
    confirmationLifetimeInMinutes:
      env.optionalJSON('DELEGATION_CONFIRMATION_LIFETIME_IN_MINUTES') ?? 15,
    confirmationRequiredAcr:
      env.optional('DELEGATION_CONFIRMATION_REQUIRED_ACR') ?? 'eidas-loa-high',
    confirmationMaxAttempts:
      env.optionalJSON('DELEGATION_CONFIRMATION_MAX_ATTEMPTS') ?? 5,
    // Deliberately gated on NODE_ENV rather than on the env var alone, so
    // setting the variable in a deployed environment does nothing.
    confirmationAllowAnyAcrInDev:
      process.env.NODE_ENV === 'development' &&
      (env.optionalJSON('DELEGATION_CONFIRMATION_ALLOW_ANY_ACR_IN_DEV') ??
        false) === true,
    confirmationCibaIssuerUrl:
      env.optional('DELEGATION_CONFIRMATION_CIBA_ISSUER_URL') ??
      env.required(
        'IDENTITY_SERVER_ISSUER_URL',
        'https://identity-server.dev01.devland.is',
      ),
    confirmationCibaClientId:
      env.optional('DELEGATION_CONFIRMATION_CIBA_CLIENT_ID') ??
      '@island.is/clients/delegation-confirmation',
    confirmationCibaClientSecret:
      env.optional('DELEGATION_CONFIRMATION_CIBA_CLIENT_SECRET') ?? '',
    confirmationCibaScope:
      env.optional('DELEGATION_CONFIRMATION_CIBA_SCOPE') ??
      'openid @island.is/auth/delegation-confirmation',
    confirmationMaxAuthStarts:
      env.optionalJSON('DELEGATION_CONFIRMATION_MAX_AUTH_STARTS') ?? 5,
  }),
})
