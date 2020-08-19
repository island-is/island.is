import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {
  NavigationScreenItem,
  NavigationScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { ServicePortalPath } from '@island.is/service-portal/constants'
import SubjectInfo from '../screens/subjectInfo/subjectInfo'

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

export const ServicePortalSettings: ServicePortalModuleComponent = (props) => {
  return (
    <Switch>
      <Route
        exact
        path={ServicePortalPath.StillingarRoot}
        component={SettingsNavScreen}
      />
      <Route
        exact
        path={ServicePortalPath.StillingarUpplysingar}
        render={() => <SubjectInfo {...props} />}
      />
    </Switch>
  )
}

export default ServicePortalSettings
