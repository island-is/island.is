import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { useUserInfo } from '@island.is/react-spa/bff'

import type { AuthApiScope } from '@island.is/api/schema'

export type SensitiveScopesUnavailableReason =
  /** Card logins carry amr "sc", and a card can't be used for the step-up. */
  'card_session' | 'not_available'

export const useSensitiveScopesAvailability = (): {
  canGrant: boolean
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

export const canSelectScope = (
  scope: Pick<AuthApiScope, 'requiresConfirmation'>,
  canGrantSensitiveScopes: boolean,
) => canGrantSensitiveScopes || !scope.requiresConfirmation
