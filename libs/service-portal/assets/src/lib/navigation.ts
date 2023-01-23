import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { AssetsPaths } from './paths'

export const assetsNavigation: PortalNavigationItem = {
  name: m.realEstate,
  path: AssetsPaths.AssetsRoot,
  icon: {
    icon: 'home',
  },
  children: [
    {
      name: 'id',
      navHide: true,
      path: AssetsPaths.AssetsRealEstateDetail,
    },
  ],
  description: m.realEstateDescription,
}
