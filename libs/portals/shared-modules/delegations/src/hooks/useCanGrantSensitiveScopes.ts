import { useUserInfo } from '@island.is/react-spa/bff'

import type { AuthApiScope } from '@island.is/api/schema'

/**
 * A session logged in with an ID card can't confirm a grant with electronic ID
 * (the step-up only uses the method the person logged in with), so sensitive
 * scopes can't be granted from it. Card logins carry the amr value "sc".
 */
export const useCanGrantSensitiveScopes = () => {
  const userInfo = useUserInfo()
  const amr = (userInfo?.profile as { amr?: string | string[] } | undefined)
    ?.amr
  const values = Array.isArray(amr) ? amr : amr ? [amr] : []

  return !values.includes('sc')
}

/** Whether a scope may be added to a grant in this session. */
export const canSelectScope = (
  scope: Pick<AuthApiScope, 'requiresConfirmation'>,
  canGrantSensitiveScopes: boolean,
) => canGrantSensitiveScopes || !scope.requiresConfirmation
