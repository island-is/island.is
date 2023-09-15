import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { PersonalInformationPaths } from './paths'

export const personalInformationNavigation: PortalNavigationItem = {
  name: m.settings,
  navHide: true,
  children: [
    // {
    //   name: m.accessControl,
    //   path: PersonalInformationPaths.SettingsAccessControl,
    //   children: [
    //     {
    //       name: m.accessControlGrant,
    //       path: PersonalInformationPaths.SettingsAccessControlGrant,
    //     },
    //     {
    //       name: m.accessControlAccess,
    //       path: PersonalInformationPaths.SettingsAccessControlAccess,
    //     },
    //   ],
    // },
    {
      name: m.mySettings,
      path: PersonalInformationPaths.SettingsPersonalInformation,
    },
    {
      name: m.email,
      path: PersonalInformationPaths.SettingsPersonalInformationEditEmail,
    },
    {
      name: m.phone,
      path: PersonalInformationPaths.SettingsPersonalInformationEditPhoneNumber,
    },
    {
      name: m.nudge,
      path: PersonalInformationPaths.SettingsPersonalInformationEditNudge,
    },
    {
      name: m.language,
      path: PersonalInformationPaths.SettingsPersonalInformationEditLanguage,
    },
  ],
}
