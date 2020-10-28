import React from 'react'
import {
  NavigationScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { navScreenItems } from './navItems'
import { useNamespaces } from '@island.is/localization'

const SettingsNavScreen: ServicePortalModuleComponent = () => {
  useNamespaces('sp.settings')

  return (
    <NavigationScreen
      title={defineMessage({
        id: 'service.portal:settings',
        defaultMessage: 'Stillingar',
      })}
      items={navScreenItems}
      inProgress
    />
  )
}

export default SettingsNavScreen
