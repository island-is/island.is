import React from 'react'

import { useNamespaces } from '@island.is/localization'
import {
  NavigationScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'

import { m } from '../../lib/messages'

import { navScreenItems } from './navItems'

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
