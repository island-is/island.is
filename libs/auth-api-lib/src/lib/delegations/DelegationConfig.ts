import { z } from 'zod'

import { AdminPortalScope, ApiScope, AuthScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import { DelegationType } from './types/delegationType'

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
          Object.values(DelegationType).includes(val as DelegationType),
        ),
    ),
  }),
)

const schema = z.object({
  // Configures special rules affecting when specific scopes can be granted to other
  // users in custom delegations.
  customScopeRules: customScopeRuleSchema,
  userInfoUrl: z.string(),
  defaultValidityPeriodInDays: z.number().min(1),
})

export const DelegationConfig = defineConfig<z.infer<typeof schema>>({
  name: 'DelegationConfig',
  schema,
  load: (env) => ({
    customScopeRules: env.optionalJSON('DELEGATION_CUSTOM_SCOPE_RULES') ?? [
      {
        scopeName: AuthScope.delegations,
        onlyForDelegationType: [DelegationType.ProcurationHolder],
      },
      {
        scopeName: AdminPortalScope.delegations,
        onlyForDelegationType: [DelegationType.ProcurationHolder],
      },
      {
        scopeName: ApiScope.samradsgatt,
        onlyForDelegationType: [
          DelegationType.ProcurationHolder,
          DelegationType.Custom,
        ],
      },
      {
        scopeName: ApiScope.financeSalary,
        onlyForDelegationType: [
          DelegationType.ProcurationHolder,
          DelegationType.Custom,
        ],
      },
      {
        scopeName: ApiScope.company,
        onlyForDelegationType: [
          DelegationType.ProcurationHolder,
          DelegationType.Custom,
        ],
      },
      {
        // This scope is not in use in our repo hence plain string instead of enum.
        scopeName: '@akureyri.is/service-portal',
        onlyForDelegationType: [
          DelegationType.ProcurationHolder,
          DelegationType.Custom,
        ],
      },
      {
        scopeName: '@64artic.is/delegations',
        onlyForDelegationType: [
          DelegationType.ProcurationHolder,
          DelegationType.Custom,
        ],
      }
    ],
    userInfoUrl:
      env.required(
        'IDENTITY_SERVER_ISSUER_URL',
        'https://identity-server.dev01.devland.is',
      ) + '/connect/userinfo',
    defaultValidityPeriodInDays:
      env.optionalJSON('DELEGATION_DEFAULT_VALID_PERIOD_IN_DAYS') ?? 365,
  }),
})
