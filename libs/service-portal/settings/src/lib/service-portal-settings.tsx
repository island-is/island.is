import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {
  NavigationScreenItem,
  NavigationScreen,
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'

const navScreenItems: NavigationScreenItem[] = [
  {
    name: 'Breyta prófil',
    url: ServicePortalPath.UserProfileRoot,
    text:
      'Hér getur þú m.a breytt upplýsingum um símanúmer netfangi og prófíl myndinni þinni.',
    tags: ['Netfang', 'Símanúmer'],
  },
]

const SettingsNavScreen = () => <NavigationScreen items={navScreenItems} />

export const ServicePortalSettings: ServicePortalModuleComponent = () => {
  return (
    <Switch>
      <Route
        exact
        path={ServicePortalPath.StillingarRoot}
        component={SettingsNavScreen}
      />
    </Switch>
  )
}

export default ServicePortalSettings
