import React from 'react'
import {
  InfoScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useNamespaces } from '@island.is/localization'

export const SettingsWIP: ServicePortalModuleComponent = () => {
  useNamespaces('sp.family')

  return (
    <InfoScreen
      title={defineMessage({
        id: 'sp.family:settings-title',
        defaultMessage: 'Stillingar',
      })}
      intro={defineMessage({
        id: 'sp.family:settings-intro',
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
            id: 'sp.family:settings-inc-1',
            defaultMessage:
              'Yfirlit og hægt verður að greiða öll opinber gjöld',
          }),
          defineMessage({
            id: 'sp.family:settings-inc-2',
            defaultMessage: 'Ganga frá skattskýrsla og sjá eldi skattskýrslur',
          }),
          defineMessage({
            id: 'sp.family:settings-inc-3',
            defaultMessage: 'Sjá yfirlit og ráðstafa séreignarsparnaði',
          }),
        ],
      }}
      externalHref="https://minarsidur.island.is/minar-sidur/minn-adgangur/stillingar/"
      externalLinkTitle={defineMessage({
        id: 'sp.family:settings-external-link-title',
        defaultMessage: 'Fara í stillingar',
      })}
      figure="/assets/images/working.jpg"
    />
  )
}

export default SettingsWIP
