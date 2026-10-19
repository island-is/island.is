import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { useUserInfo } from '@island.is/react-spa/bff'

import type { AuthApiScope } from '@island.is/api/schema'

export type SensitiveScopesUnavailableReason =
  /** A card can't be used for the step-up. */
  'card_session' | 'not_available'

// Same rule as isCardSession in @island.is/auth/step-up, which can't be bundled here.
const CARD_IDPS = ['audkenni_card', 'audkenni_newcard', 'audkenni_oldcard']

export const useSensitiveScopesAvailability = (): {
  canGrant: boolean
  reason?: SensitiveScopesUnavailableReason
} => {
  const userInfo = useUserInfo()
  const profile = userInfo?.profile as
    | { idp?: string; acr?: string }
    | undefined
  const isCardSession =
    !!profile?.idp &&
    CARD_IDPS.includes(profile.idp) &&
    profile.acr !== 'islandis-passkey'
  const { value: available, loading } = useFeatureFlag(
    Features.isDelegationConfirmationEnabled,
    false,
  )

  if (isCardSession) {
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
