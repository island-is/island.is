import * as z from 'zod'

import { AuthScope } from '@island.is/auth/scopes'
import { defineConfig } from '@island.is/nest/config'
import { DelegationType } from '../entities/dto/delegation.dto'

const schema = z.object({
  // Configures special rules affecting when specific scopes can be granted to other
  // users in custom delegations.
  customScopeRules: z.array(
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
  ),
})

export const DelegationConfig = defineConfig({
  name: 'DelegationConfig',
  schema,
  load: (env) => ({
    customScopeRules: env.optionalJSON('DELEGATION_CUSTOM_SCOPE_RULES') ?? [
      {
        scopeName: AuthScope.writeDelegations,
        onlyForDelegationType: ['ProcurationHolder'],
      },
    ],
  }),
})
