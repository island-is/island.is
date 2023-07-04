import { useBreakpoint } from '@island.is/island-ui/core'
import {
  SingleNavigationItemStatus,
  useSingleNavigationItem,
} from '@island.is/portals/core'

import { BOTTOM_NAVIGATION, TOP_NAVIGATION } from '../../lib/masterNavigation'
import { ModuleSwitcherDesktop } from './ModuleSwitcherDesktop'
import { ModuleSwitcherMobile } from './ModuleSwitcherMobile'

export const ModuleSwitcher = () => {
  const { status } = useSingleNavigationItem(TOP_NAVIGATION, BOTTOM_NAVIGATION)
  const { lg } = useBreakpoint()

  return status === SingleNavigationItemStatus.NO_ITEM ? null : (
    <>
      {lg && <ModuleSwitcherDesktop />}
      {!lg && <ModuleSwitcherMobile />}
    </>
  )
}
