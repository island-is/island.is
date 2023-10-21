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
  children: [
    {
      name: m.myInfo,
      path: InformationPaths.MyInfoRootOverview,
    },
    {
      name: m.mySettings,
      path: InformationPaths.Settings,
    },
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
