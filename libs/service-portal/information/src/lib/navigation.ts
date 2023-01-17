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
      name: m.myInfo,
      path: InformationPaths.MyInfoRoot,
      serviceProvider: 'i5go5A4ikV8muPfvr9o2v',
    },
    {
      name: m.detailInfo,
      navHide: true,
      path: InformationPaths.UserInfo,
      serviceProvider: 'i5go5A4ikV8muPfvr9o2v',
    },
    {
      name: m.familySpouse,
      navHide: true,
      path: InformationPaths.Spouse,
      serviceProvider: 'i5go5A4ikV8muPfvr9o2v',
    },
    {
      name: m.familyChild,
      navHide: true,
      path: InformationPaths.Child,
      serviceProvider: 'i5go5A4ikV8muPfvr9o2v',
    },
    {
      // Petitions
      name: m.endorsements,
      path: PetitionPaths.Petitions,
      serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
    },
    {
      // Petitions Admin
      name: m.endorsementsAdmin,
      path: PetitionPaths.PetitionsAdminView,
      serviceProvider: '1JHJe1NDwbBjEr7OVdjuFD',
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
