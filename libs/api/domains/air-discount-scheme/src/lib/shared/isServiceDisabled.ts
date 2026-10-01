import type { User } from '@island.is/auth-nest-tools'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

export const isServiceDisabled = (
  featureFlagService: FeatureFlagService,
  user: User,
): Promise<boolean> =>
  featureFlagService.getValue(
    Features.isPortalAirDiscountPageDisabled,
    false,
    user,
  )
