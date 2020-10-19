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
