import React from 'react'

import { Hidden } from '@island.is/island-ui/core'

import { ModuleSwitcherDesktop } from './ModuleSwitcherDesktop'
import { ModuleSwitcherMobile } from './ModuleSwitcherMobile'
import {
  SingleNavigationItemStatus,
  useSingleNavigationItem,
} from '@island.is/portals/core'
import { BOTTOM_NAVIGATION, TOP_NAVIGATION } from '../../lib/masterNavigation'

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
