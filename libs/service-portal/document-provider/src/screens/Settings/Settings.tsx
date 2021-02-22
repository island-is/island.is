import React from 'react'
import {
  NavigationScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { navScreenItems } from './navItems'
import { useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'

const Settings: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.document-provider')

  return (
    <NavigationScreen
      title={m.SettingsTitle}
      items={navScreenItems}
      inProgress
    />
  )
}

export default Settings
