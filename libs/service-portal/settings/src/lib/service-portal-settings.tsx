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
    url: ServicePortalPath.MinarUpplysingar,
    text: 'Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður.',
    tags: ['Fæðingarorlof', 'Skilnaður', 'COVID-19'],
  },
  {
    name: 'Skilaboð',
    url: ServicePortalPath.SkilabodRoot,
    text: 'Leikskólar, grunnskólar, framhaldsskólar, háskólar, styrkir og lán.',
    tags: ['Gefa umboð', 'Sækja um umboð', 'Breyta umboði'],
  },
  {
    name: 'Umboð',
    url: ServicePortalPath.StillingarUmbod,
    text: 'Hér er hægt að sækja um breyta, gefa eða eyða umboðum.',
    tags: ['Gefa umboð', 'Sækja um umboð', 'Breyta umboði'],
  },
  {
    name: 'Greiðslur',
    url: ServicePortalPath.FjarmalGreidslur,
    text: 'Hér er hægt að bæta við, breyta og eyða upplýsingum um greiðslur.',
    tags: ['Gefa umboð', 'Sækja um umboð', 'Breyta umboði'],
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
