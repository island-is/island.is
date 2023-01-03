import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { InformationPaths } from './paths'

export const informationNavigation: PortalNavigationItem = {
  name: m.userInfo,
  path: InformationPaths.MyInfoRoot,
  icon: {
    icon: 'person',
  },
  children: [
    {
      name: m.detailInfo,
      navHide: true,
      path: InformationPaths.UserInfo,
    },
    {
      name: m.familySpouse,
      navHide: true,
      path: InformationPaths.Spouse,
    },
    {
      name: m.familyChild,
      navHide: true,
      path: InformationPaths.Child,
    },

    {
      // Petitions
      name: m.endorsements,
      path: InformationPaths.Petitions,
    },
    {
      // Petitions Admin
      name: m.endorsementsAdmin,
      path: InformationPaths.PetitionsAdminView,
    },
  ],
  description: m.userInfoDescription,
}

export const companyNavigation: PortalNavigationItem = {
  name: m.companyTitle,
  path: InformationPaths.Company,
  icon: {
    icon: 'business',
  },
  description: m.companyDescription,
}
