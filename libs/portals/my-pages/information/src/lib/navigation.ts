import { PortalNavigationItem } from '@island.is/portals/core'
import { m, searchTagsMessages } from '@island.is/portals/my-pages/core'
import { PetitionPaths } from '@island.is/portals/my-pages/petitions'
import { SignatureCollectionPaths } from '@island.is/portals/my-pages/signature-collection'
import { InformationPaths } from './paths'

export const informationNavigation: PortalNavigationItem = {
  name: m.userInfo,
  description: m.userInfoDescription,
  searchTags: [
    searchTagsMessages.informationMe,
    searchTagsMessages.informationWife,
    searchTagsMessages.informationHusband,
    searchTagsMessages.informationSpouse,
    searchTagsMessages.informationChild,
    searchTagsMessages.informationFamily,
  ],
  path: InformationPaths.MyInfoRoot,
  icon: {
    icon: 'person',
  },
  children: [
    {
      name: m.myInfo,
      description: m.userInfoIntro,
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
          searchHide: true,
          path: InformationPaths.Settings,
        },
        {
          name: m.mySettingsNotifications,
          searchHide: true,
          path: InformationPaths.SettingsNotifications,
        },
      ],
    },
    {
      name: m.lists,
      path: InformationPaths.Lists,
      children: [
        // Municipal
        {
          name: m.signatureCollectionMunicipalLists,
          path: SignatureCollectionPaths.SignatureCollectionMunicipalLists,
          children: [
            {
              name: m.viewSignatureList,
              navHide: true,
              path: SignatureCollectionPaths.ViewMunicipalList,
            },
          ],
        },
        // Parliamentary
        {
          name: m.signatureCollectionParliamentaryLists,
          path: SignatureCollectionPaths.SignatureCollectionParliamentaryLists,
          children: [
            {
              name: m.viewSignatureList,
              navHide: true,
              path: SignatureCollectionPaths.ViewParliamentaryList,
            },
            {
              name: m.signatureCollectionLists,
              navHide: true,
              path: SignatureCollectionPaths.CompanySignatureCollectionParliamentaryLists,
              children: [
                {
                  name: m.viewSignatureList,
                  navHide: true,
                  path: SignatureCollectionPaths.CompanyViewParliamentaryList,
                },
              ],
            },
          ],
        },
        // Presidential
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
        // General Petitions
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
      name: m.contracts,
      path: InformationPaths.MyContracts,
      children: [
        {
          name: m.contracts,
          navHide: true,
          searchHide: true,
          path: InformationPaths.MyContractsDetail,
        },
      ],
    },
    {
      name: m.notifications,
      path: InformationPaths.Notifications,
    },
  ],
}

export const companyNavigation: PortalNavigationItem = {
  name: m.companyTitle,
  searchHide: true,
  path: InformationPaths.Company,
  icon: {
    icon: 'business',
  },
  description: m.companyDescription,
}
