import { Hidden } from '@island.is/island-ui/core'
import {
  SingleNavigationItemStatus,
  useSingleNavigationItem,
} from '@island.is/portals/core'

import { BOTTOM_NAVIGATION, TOP_NAVIGATION } from '../../lib/masterNavigation'
import { ModuleSwitcherDesktop } from './ModuleSwitcherDesktop'
import { ModuleSwitcherMobile } from './ModuleSwitcherMobile'

export const ModuleSwitcher = () => {
  const { status } = useSingleNavigationItem(TOP_NAVIGATION, BOTTOM_NAVIGATION)

  return status === SingleNavigationItemStatus.NO_ITEM ? null : (
    <>
      <Hidden below="lg">
        <ModuleSwitcherDesktop />
      </Hidden>
      <Hidden above="md">
        <ModuleSwitcherMobile />
      </Hidden>
    </>
  )
}
