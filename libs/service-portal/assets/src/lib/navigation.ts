import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { AssetsPaths } from './paths'

export const assetsNavigation: PortalNavigationItem = {
  name: m.realEstate,
  path: AssetsPaths.AssetsRoot,
  icon: {
    icon: 'home',
  },
  serviceProvider: '53jrbgxPKpbNtordSfEZUK',
  children: [
    {
      name: m.myRealEstate,
      path: AssetsPaths.AssetsRoot,
      serviceProvider: '53jrbgxPKpbNtordSfEZUK',
    },
    {
      name: 'id',
      navHide: true,
      path: AssetsPaths.AssetsRealEstateDetail,
      serviceProvider: '53jrbgxPKpbNtordSfEZUK',
    },
  ],
  description: m.realEstateDescription,
}
