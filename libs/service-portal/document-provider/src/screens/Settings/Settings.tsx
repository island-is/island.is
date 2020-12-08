import React from 'react'
import {
  NavigationScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { navScreenItems } from './navItems'
import { useNamespaces } from '@island.is/localization'

const Settings: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.document-provider')

  return (
    <NavigationScreen
      title={defineMessage({
        id: 'service.portal:document-provider-settings',
        defaultMessage: 'Stillingar',
      })}
      items={navScreenItems}
      inProgress
    />
  )
}

export default Settings
