import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {
  NavigationScreenItem,
  NavigationScreen,
} from '@island.is/service-portal/core'
import { Box } from '@island.is/island-ui/core'

const navScreenItems: NavigationScreenItem[] = [
  {
    name: 'Mínar upplýsingar',
    url: '/settings/minar-upplysingar',
    text: 'Hér getur þú breytt upplýsingum um þig eða þína fjölskyldu',
    tags: ['Nafn', 'Trúfélag', 'Símanúmer'],
  },
  {
    name: 'Umboð',
    url: '/settings/umbod',
    text: 'Hér er hægt að sækja um breyta, gefa eða eyða umboðum. ',
    tags: ['Gefa umboð', 'Sækja um umboð', 'Breyta umboði'],
  },
]

const SettingsNavScreen = () => <NavigationScreen items={navScreenItems} />

export const ServicePortalSettings = () => {
  return (
    <Box padding={4}>
      <Switch>
        <Route exact path="/stillingar" component={SettingsNavScreen} />
      </Switch>
    </Box>
  )
}

export default ServicePortalSettings
