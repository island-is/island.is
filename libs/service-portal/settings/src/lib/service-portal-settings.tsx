import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {
  NavigationScreenItem,
  NavigationScreen,
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'

const navScreenItems: NavigationScreenItem[] = [
  {
    name: defineMessage({
      id: 'sp.settings:change-profile',
      defaultMessage: 'Breyta prófíl',
    }),
    url: ServicePortalPath.UserProfileRoot,
    text: defineMessage({
      id: 'sp.settings:change-profile-description',
      defaultMessage:
        'Hér getur þú m.a breytt upplýsingum um símanúmer, netfangi og prófíl myndinni þinni.',
    }),
    tags: [
      defineMessage({
        id: 'service.portal:email',
        defaultMessage: 'Netfang',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
    ],
  },
]

const SettingsNavScreen = () => (
  <NavigationScreen
    title={defineMessage({
      id: 'service.portal:settings',
      defaultMessage: 'Stillingar',
    })}
    items={navScreenItems}
  />
)

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
