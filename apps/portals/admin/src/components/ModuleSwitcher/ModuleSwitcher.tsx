import React from 'react'

import { Hidden } from '@island.is/island-ui/core'

import { ModuleSwitcherDesktop } from './ModuleSwitcherDesktop'
import { ModuleSwitcherMobile } from './ModuleSwitcherMobile'

export const ModuleSwitcher = () => {
  return (
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
