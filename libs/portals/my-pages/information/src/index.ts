import { lazy } from 'react'

export * from './module'
export * from './lib/navigation'
export * from './lib/paths'
export * from './components/FamilyMemberCard/FamilyMemberCard'
export * from './screens/Notifications/Notifications.generated'
export * from './utils/notificationLinkResolver'
export * from './utils/parseDelegationTypeFeatureFlagValue'

/**
 * This is a special use case.
 * This is a global modal that is used on every screen in app/portals/my-pages.
 */

export const UserOnboarding = lazy(() =>
  import('./components/PersonalInformation/UserOnboarding/UserOnboarding'),
)
