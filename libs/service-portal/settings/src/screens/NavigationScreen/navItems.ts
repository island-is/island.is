import {
  NavigationScreenItem,
  ServicePortalPath,
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
  {
    name: 'Skilaboð - í vinnslu',
    url: ServicePortalPath.UserProfileRoot,
    text:
      'Hér verður hægt að stilla skilaboðin þín og ákveða hvernig við sendum þau til þín.',
    tags: [
      defineMessage({
        id: 'service.portal:email',
        defaultMessage: 'Netfang',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
    ],
    disabled: true,
  },
  {
    name: 'Skilaboð - í vinnslu',
    url: ServicePortalPath.UserProfileRoot,
    text:
      'Hér verður hægt að stilla skilaboðin þín og ákveða hvernig við sendum þau til þín.',
    tags: [
      defineMessage({
        id: 'service.portal:email',
        defaultMessage: 'Netfang',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
    ],
    disabled: true,
  },
  {
    name: 'Skilaboð - í vinnslu',
    url: ServicePortalPath.UserProfileRoot,
    text:
      'Hér verður hægt að stilla skilaboðin þín og ákveða hvernig við sendum þau til þín.',
    tags: [
      defineMessage({
        id: 'service.portal:email',
        defaultMessage: 'Netfang',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
    ],
    disabled: true,
  },
  {
    name: 'Skilaboð - í vinnslu',
    url: ServicePortalPath.UserProfileRoot,
    text:
      'Hér verður hægt að stilla skilaboðin þín og ákveða hvernig við sendum þau til þín.',
    tags: [
      defineMessage({
        id: 'service.portal:email',
        defaultMessage: 'Netfang',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
    ],
    disabled: true,
  },
  {
    name: 'Skilaboð - í vinnslu',
    url: ServicePortalPath.UserProfileRoot,
    text:
      'Hér verður hægt að stilla skilaboðin þín og ákveða hvernig við sendum þau til þín.',
    tags: [
      defineMessage({
        id: 'service.portal:email',
        defaultMessage: 'Netfang',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
      defineMessage({
        id: 'service.portal:tel',
        defaultMessage: 'Símanúmer',
      }),
    ],
    disabled: true,
  },
]
