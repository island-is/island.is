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
  identityServerIssuerUrl: z.string(),
  defaultValidityPeriodInDays: z.number().min(1),
  confirmationLifetimeInMinutes: z.number().min(1),
  confirmationRequiredAcr: z.string(),
  // Fake login asserts acr "0", so local development needs this.
  confirmationAllowAnyAcrInDev: z.boolean(),
  confirmationCibaIssuerUrl: z.string(),
  confirmationCibaClientId: z.string(),
  confirmationCibaClientSecret: z.string(),
  // Must include openid (CIBA requires it) and a scope that puts nationalId on the token.
  confirmationCibaScope: z.string(),
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
    confirmationLifetimeInMinutes:
      env.optionalJSON('DELEGATION_CONFIRMATION_LIFETIME_IN_MINUTES') ?? 15,
    confirmationRequiredAcr:
      env.optional('DELEGATION_CONFIRMATION_REQUIRED_ACR') ?? 'eidas-loa-high',
    // Gated on NODE_ENV too, so setting the variable in a deployed environment does nothing.
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
  }),
})
