import { PortalNavigationItem } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './paths'
import { m } from './messages'
import { LandAreas } from './utils'

export const signatureCollectionNavigation: PortalNavigationItem = {
  name: m.signatureListsTitle,
  icon: {
    icon: 'receipt',
  },
  description: m.signatureListsDescription,
  path: SignatureCollectionPaths.MunicipalAreaHofudborgarsvaedi,
  children: [
    {
      name: m.parliamentaryCollectionTitle,
      path: SignatureCollectionPaths.ParliamentaryRoot,
      activeIfExact: true,
    },
    {
      name: m.collectionTitle,
      path: SignatureCollectionPaths.PresidentialLists,
      activeIfExact: true,
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalAreaHofudborgarsvaedi,
      activeIfExact: true,
      children: [
        {
          name: LandAreas.Hofudborgarsvaedi,
          path: SignatureCollectionPaths.MunicipalAreaHofudborgarsvaedi,
          activeIfExact: true,
        },
        {
          name: LandAreas.Sudurnes,
          path: SignatureCollectionPaths.MunicipalAreaSudurnes,
          activeIfExact: true,
        },
        {
          name: LandAreas.Vesturland,
          path: SignatureCollectionPaths.MunicipalAreaVesturland,
          activeIfExact: true,
        },
        {
          name: LandAreas.Vestfirdir,
          path: SignatureCollectionPaths.MunicipalAreaVestfirdir,
          activeIfExact: true,
        },
        {
          name: LandAreas.NordurlandVestra,
          path: SignatureCollectionPaths.MunicipalAreaNordurlandVestra,
          activeIfExact: true,
        },
        {
          name: LandAreas.NordurlandEystra,
          path: SignatureCollectionPaths.MunicipalAreaNordurlandEystra,
          activeIfExact: true,
        },
        {
          name: LandAreas.Austurland,
          path: SignatureCollectionPaths.MunicipalAreaAusturland,
          activeIfExact: true,
        },
        {
          name: LandAreas.Sudurland,
          path: SignatureCollectionPaths.MunicipalAreaSudurland,
          activeIfExact: true,
        },
      ],
    },
  ],
}
