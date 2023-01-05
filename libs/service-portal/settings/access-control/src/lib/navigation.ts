import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { AccessControlPaths } from './paths'

export const accessControlNavigation: PortalNavigationItem = {
  name: m.accessControl,
  path: AccessControlPaths.SettingsAccessControl,
  icon: {
    icon: 'people',
  },
  children: [
    {
      name: m.accessControlGrant,
      path: AccessControlPaths.SettingsAccessControlGrant,
    },
    {
      name: m.accessControlAccess,
      path: AccessControlPaths.SettingsAccessControlAccess,
    },
  ],
}
