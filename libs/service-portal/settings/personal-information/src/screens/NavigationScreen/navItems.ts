import {
  NavigationScreenItem,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'

export const navScreenItems: NavigationScreenItem[] = [
  {
    name: defineMessage({
      id: 'sp.settings:change-profile',
      defaultMessage: 'Minn aðgangur',
    }),
    url: ServicePortalPath.UserProfileRoot,
    text: defineMessage({
      id: 'sp.settings:change-profile-description',
      defaultMessage:
        'Hér getur þú m.a. breytt símanúmeri, netfangi og tungumáli.',
    }),
    tags: [m.email, m.telNumber],
  },
  {
    name: 'Skilaboð - í vinnslu',
    url: ServicePortalPath.UserProfileRoot,
    text: 'Hér verður hægt að stilla skilaboðin þín og ákveða hvernig við sendum þau til þín.',
    tags: [m.email, m.telNumber, m.telNumber],
    disabled: true,
  },
  {
    name: 'Skilaboð - í vinnslu',
    url: ServicePortalPath.UserProfileRoot,
    text: 'Hér verður hægt að stilla skilaboðin þín og ákveða hvernig við sendum þau til þín.',
    tags: [m.email, m.telNumber, m.telNumber],
    disabled: true,
  },
  {
    name: 'Skilaboð - í vinnslu',
    url: ServicePortalPath.UserProfileRoot,
    text: 'Hér verður hægt að stilla skilaboðin þín og ákveða hvernig við sendum þau til þín.',
    tags: [m.email, m.telNumber, m.telNumber],
    disabled: true,
  },
  {
    name: 'Skilaboð - í vinnslu',
    url: ServicePortalPath.UserProfileRoot,
    text: 'Hér verður hægt að stilla skilaboðin þín og ákveða hvernig við sendum þau til þín.',
    tags: [m.email, m.telNumber, m.telNumber],
    disabled: true,
  },
  {
    name: 'Skilaboð - í vinnslu',
    url: ServicePortalPath.UserProfileRoot,
    text: 'Hér verður hægt að stilla skilaboðin þín og ákveða hvernig við sendum þau til þín.',
    tags: [m.email, m.telNumber, m.telNumber],
    disabled: true,
  },
]
