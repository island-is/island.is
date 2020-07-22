import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {
  NavigationScreenItem,
  NavigationScreen,
} from '@island.is/service-portal/core'
import SubjectInfo from '../screens/subjectInfo/subjectInfo'

const navScreenItems: NavigationScreenItem[] = [
  {
    name: 'Mínar upplýsingar',
    url: '/stillingar/minar-upplysingar',
    text: 'Hér getur þú breytt upplýsingum um þig eða þína fjölskyldu',
    tags: ['Nafn', 'Trúfélag', 'Símanúmer'],
  },
  {
    name: 'Umboð',
    url: '/stillingar/umbod',
    text: 'Hér er hægt að sækja um breyta, gefa eða eyða umboðum. ',
    tags: ['Gefa umboð', 'Sækja um umboð', 'Breyta umboði'],
  },
]

const SettingsNavScreen = () => <NavigationScreen items={navScreenItems} />

export const ServicePortalSettings = () => {
  return (
    <Switch>
      <Route exact path="/stillingar" component={SettingsNavScreen} />
      <Route
        exact
        path="/stillingar/minar-upplysingar"
        component={SubjectInfo}
      />
    </Switch>
  )
}

export default ServicePortalSettings
