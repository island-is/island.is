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
    name: 'Mínar upplýsingar',
    url: ServicePortalPath.StillingarUpplysingar,
    text: 'Hér getur þú breytt upplýsingum um þig eða þína fjölskyldu',
    tags: ['Nafn', 'Trúfélag', 'Símanúmer'],
  },
  {
    name: 'Umboð',
    url: ServicePortalPath.StillingarUmbod,
    text: 'Hér er hægt að sækja um breyta, gefa eða eyða umboðum. ',
    tags: ['Gefa umboð', 'Sækja um umboð', 'Breyta umboði'],
  },
]

const SettingsNavScreen = () => <NavigationScreen items={navScreenItems} />

const UmbodMock = () => <h1>Umbod</h1>

export const ServicePortalSettings: ServicePortalModuleComponent = () => {
  return (
    <Switch>
      <Route
        exact
        path={ServicePortalPath.StillingarRoot}
        component={SettingsNavScreen}
      />
      <Route
        exact
        path={ServicePortalPath.StillingarUmbod}
        render={() => <UmbodMock />}
      />
    </Switch>
  )
}

export default ServicePortalSettings
