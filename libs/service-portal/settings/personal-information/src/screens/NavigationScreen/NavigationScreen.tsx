import React from 'react'
import { defineMessage } from 'react-intl'

import { useNamespaces } from '@island.is/localization'
import {
  m,
  NavigationScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

import { navScreenItems } from './navItems'

const SettingsNavScreen: ServicePortalModuleComponent = () => {
  useNamespaces('sp.settings')

  return (
    <NavigationScreen title={m.settings} items={navScreenItems} inProgress />
  )
}

export default SettingsNavScreen
