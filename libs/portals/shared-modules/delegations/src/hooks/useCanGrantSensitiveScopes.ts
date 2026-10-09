import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { useUserInfo } from '@island.is/react-spa/bff'

import type { AuthApiScope } from '@island.is/api/schema'

/** Why sensitive scopes can't be granted in this session, if they can't. */
export type SensitiveScopesUnavailableReason =
  /**
   * Logged in with an ID card: the confirmation is a step-up by the method the
   * person logged in with, and a card can't be used for it. Card logins carry
   * the amr value "sc".
   */
  | 'card_session'
  /**
   * Confirmation isn't available to this person right now (the feature is off
   * for them, or its flag can't be read), and a sensitive scope is never granted
   * without one.
   */
  | 'not_available'

/**
 * Whether scopes marked as sensitive may be chosen in this session, and if not,
 * why. The API applies the same rules; this only keeps the person from choosing
 * what would be refused.
 */
export const useSensitiveScopesAvailability = (): {
  canGrant: boolean
  /** Undefined while the answer is still loading, or when they can be granted. */
  reason?: SensitiveScopesUnavailableReason
} => {
  const userInfo = useUserInfo()
  const amr = (userInfo?.profile as { amr?: string | string[] } | undefined)
    ?.amr
  const values = Array.isArray(amr) ? amr : amr ? [amr] : []
  const { value: available, loading } = useFeatureFlag(
    Features.isDelegationConfirmationEnabled,
    false,
  )

  if (values.includes('sc')) {
    return { canGrant: false, reason: 'card_session' }
  }
  if (loading) {
    return { canGrant: false }
  }
  return available
    ? { canGrant: true }
    : { canGrant: false, reason: 'not_available' }
}

export const useCanGrantSensitiveScopes = () =>
  useSensitiveScopesAvailability().canGrant

/** Whether a scope may be added to a grant in this session. */
export const canSelectScope = (
  scope: Pick<AuthApiScope, 'requiresConfirmation'>,
  canGrantSensitiveScopes: boolean,
) => canGrantSensitiveScopes || !scope.requiresConfirmation
