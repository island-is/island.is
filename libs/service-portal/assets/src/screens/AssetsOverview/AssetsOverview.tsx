import React from 'react'
import {
  InfoScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useNamespaces } from '@island.is/localization'

export const AssetsOverview: ServicePortalModuleComponent = () => {
  useNamespaces(['service.portal', 'sp.assets'])

  return (
    <InfoScreen
      title={defineMessage({
        id: 'sp.assets:title',
        defaultMessage: 'Fasteignir',
      })}
      intro={defineMessage({
        id: 'sp.assets:intro',
        defaultMessage: `Hér eru upplýsingar um það sem kemur til með að koma inn undir
        fasteignir á næstunni.`,
      })}
      list={{
        title: defineMessage({
          id: 'service.portal:incoming',
          defaultMessage: 'Á döfinni',
        }),
        items: [
          defineMessage({
            id: 'sp.assets:inc-1',
            defaultMessage:
              'Yfirlit og hægt verður að greiða öll opinber gjöld',
          }),
          defineMessage({
            id: 'sp.assets:inc-2',
            defaultMessage: 'Ganga frá skattskýrsla og sjá eldi skattskýrslur',
          }),
          defineMessage({
            id: 'sp.assets:inc-3',
            defaultMessage: 'Sjá yfirlit og ráðstafa séreignarsparnaði',
          }),
        ],
      }}
      externalHref="https://minarsidur.island.is/minar-sidur/min-gogn/fasteignir"
      externalLinkTitle={defineMessage({
        id: 'sp.assets:external-link-title',
        defaultMessage: 'Skoða fasteignir',
      })}
      figure="./assets/images/bedroom.jpg"
    />
  )
}

export default AssetsOverview
