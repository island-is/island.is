import { z } from 'zod'

import { ApiScope, AuthScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import { DelegationType } from './dto/delegation.dto'

const customScopeRuleSchema = z.array(
  z.object({
    // The name of the scope which should have special logic.
    scopeName: z.string(),
    // This property adds extra conditions to custom delegation grants. It is an array of
    // delegation types which can grant the scope to other users.
    //
    // * Self: Normal "person" users can grant this scope to other users on their behalf.
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
          ['Self', ...Object.values(DelegationType)].includes(val),
        ),
    ),
  }),
)

const schema = z.object({
  // Configures special rules affecting when specific scopes can be granted to other
  // users in custom delegations.
  customScopeRules: customScopeRuleSchema,
  userInfoUrl: z.string(),
})

export const DelegationConfig = defineConfig<z.infer<typeof schema>>({
  name: 'DelegationConfig',
  schema,
  load: (env) => ({
    customScopeRules: env.optionalJSON('DELEGATION_CUSTOM_SCOPE_RULES') ?? [
      {
        scopeName: AuthScope.delegations,
        onlyForDelegationType: ['ProcurationHolder'],
      },
      {
        scopeName: ApiScope.financeSalary,
        onlyForDelegationType: ['ProcurationHolder'],
      },
      {
        scopeName: ApiScope.company,
        onlyForDelegationType: ['ProcurationHolder'],
      },
    ],
    userInfoUrl:
      env.required(
        'IDENTITY_SERVER_ISSUER_URL',
        'https://identity-server.dev01.devland.is',
      ) + '/connect/userinfo',
  }),
})
