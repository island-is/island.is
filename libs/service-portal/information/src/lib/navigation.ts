import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { PetitionPaths } from '@island.is/service-portal/petitions'
import { SignatureCollectionPaths } from '@island.is/service-portal/signature-collection'
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
          path: InformationPaths.BioChild,
        },
        {
          name: m.familyChild,
          navHide: true,
          path: InformationPaths.ChildCustody,
        },
      ],
    },
    {
      name: m.mySettings,
      path: InformationPaths.Settings,
      children: [
        {
          name: m.mySettingsInformation,
          path: InformationPaths.Settings,
        },
        {
          name: m.mySettingsNotifications,
          path: InformationPaths.SettingsNotifications,
        },
      ],
    },
    {
      name: m.lists,
      path: InformationPaths.Lists,
      children: [
        {
          name: m.signatureCollectionParliamentaryLists,
          path: SignatureCollectionPaths.SignatureCollectionParliamentaryLists,
          children: [
            {
              name: m.viewSignatureList,
              navHide: true,
              path: SignatureCollectionPaths.ViewParliamentaryList,
            },
          ],
        },
        {
          name: m.signatureCollectionPresidentialLists,
          path: SignatureCollectionPaths.SignatureCollectionLists,
          children: [
            {
              name: m.viewSignatureList,
              navHide: true,
              path: SignatureCollectionPaths.ViewList,
            },
          ],
        },
        {
          name: m.generalPetitions,
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
    },
    {
      name: m.notifications,
      path: InformationPaths.Notifications,
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

export const SignatureCollectionNavigation: PortalNavigationItem = {
  name: m.signatureCollectionLists,
  path: InformationPaths.SignatureCollection,
  icon: {
    icon: 'receipt',
  },
  description: m.signatureCollectionParliamentaryLists,
}
