import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { PetitionPaths } from '@island.is/service-portal/endorsements'
import { InformationPaths } from './paths'

export const informationNavigation: PortalNavigationItem = {
  name: m.userInfo,
  path: InformationPaths.MyInfoRoot,
  icon: {
    icon: 'person',
  },
  serviceProvider: 'i5go5A4ikV8muPfvr9o2v',
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
      path: PetitionPaths.Petitions,
    },
    {
      // Petitions Admin
      name: m.endorsementsAdmin,
      path: PetitionPaths.PetitionsAdminView,
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
