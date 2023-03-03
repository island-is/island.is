import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { PetitionPaths } from '@island.is/service-portal/petitions'
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
      name: m.petitions,
      path: PetitionPaths.Petitions,
      children: [
        {
          name: m.viewPetition,
          navHide: true,
          path: PetitionPaths.PetitionList,
        },
        {
          name: m.viewPetition,
          navHide: true,
          path: PetitionPaths.PetitionListOwned,
        },
      ],
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
