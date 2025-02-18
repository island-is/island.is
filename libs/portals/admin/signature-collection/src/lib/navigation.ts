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
  path: SignatureCollectionPaths.MunicipalRoot,
  children: [
    {
      name: m.parliamentaryCollectionTitle,
      path: SignatureCollectionPaths.ParliamentaryRoot,
    },
    {
      name: m.collectionTitle,
      path: SignatureCollectionPaths.PresidentialLists,
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalRoot,
      children: [
        {
          name: LandAreas.Hofudborgarsvaedi,
          path: SignatureCollectionPaths.LandAreaHofudborgarsvaedi,
          activeIfExact: false,
          children: [
            {
              name: 'Sveitarfélag',
              path: SignatureCollectionPaths.LandAreaSingleMunicipality,
            },
          ],
        },
        {
          name: LandAreas.Sudurnes,
          path: SignatureCollectionPaths.LandAreaSudurnes,
          activeIfExact: false,
          children: [
            {
              name: 'Sveitarfélag',
              path: SignatureCollectionPaths.LandAreaSingleMunicipality,
            },
          ],
        },
        {
          name: LandAreas.Vesturland,
          path: SignatureCollectionPaths.LandAreaVesturland,
          activeIfExact: false,
          children: [
            {
              name: 'Sveitarfélag',
              path: SignatureCollectionPaths.LandAreaSingleMunicipality,
            },
          ],
        },
        {
          name: LandAreas.Vestfirdir,
          path: SignatureCollectionPaths.LandAreaVestfirdir,
          activeIfExact: false,
          children: [
            {
              name: 'Sveitarfélag',
              path: SignatureCollectionPaths.LandAreaSingleMunicipality,
            },
          ],
        },
        {
          name: LandAreas.NordurlandVestra,
          path: SignatureCollectionPaths.LandAreaNordurlandVestra,
          activeIfExact: false,
          children: [
            {
              name: 'Sveitarfélag',
              path: SignatureCollectionPaths.LandAreaSingleMunicipality,
            },
          ],
        },
        {
          name: LandAreas.NordurlandEystra,
          path: SignatureCollectionPaths.LandAreaNordurlandEystra,
          activeIfExact: false,
          children: [
            {
              name: 'Sveitarfélag',
              path: SignatureCollectionPaths.LandAreaSingleMunicipality,
            },
          ],
        },
        {
          name: LandAreas.Austurland,
          path: SignatureCollectionPaths.LandAreaAusturland,
          activeIfExact: false,
          children: [
            {
              name: 'Sveitarfélag',
              path: SignatureCollectionPaths.LandAreaSingleMunicipality,
            },
          ],
        },
        {
          name: LandAreas.Sudurland,
          path: SignatureCollectionPaths.LandAreaSudurland,
          activeIfExact: false,
          children: [
            {
              name: 'Sveitarfélag',
              path: SignatureCollectionPaths.LandAreaSingleMunicipality,
            },
          ],
        },
      ],
    },
  ],
}
