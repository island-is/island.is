import React from 'react'
import {
  InfoScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useNamespaces } from '@island.is/localization'

export const FinanceOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.finance')

  return (
    <InfoScreen
      title={defineMessage({
        id: 'sp.finance:title',
        defaultMessage: 'Fjármál',
      })}
      intro={defineMessage({
        id: 'sp.finance:intro',
        defaultMessage: `Hér eru upplýsingar um það sem kemur til með að koma inn undir
        fjármál á næstunni.`,
      })}
      list={{
        title: defineMessage({
          id: 'service.portal:incoming',
          defaultMessage: 'Á döfinni',
        }),
        items: [
          defineMessage({
            id: 'sp.finance:inc-1',
            defaultMessage:
              'Yfirlit og hægt verður að greiða öll opinber gjöld',
          }),
          defineMessage({
            id: 'sp.finance:inc-2',
            defaultMessage: 'Ganga frá skattskýrsla og sjá eldi skattskýrslur',
          }),
          defineMessage({
            id: 'sp.finance:inc-3',
            defaultMessage: 'Sjá yfirlit og ráðstafa séreignarsparnaði',
          }),
        ],
      }}
      externalHref="https://minarsidur.island.is/minar-sidur/fjarmal"
      externalLinkTitle={defineMessage({
        id: 'sp.finance:external-link-title',
        defaultMessage: 'Fara í fjármál á gömlu mínum síðum',
      })}
      institutionTitle={defineMessage({
        id: 'service.portal:digital-iceland',
        defaultMessage: 'Stafrænt Ísland',
      })}
      institutionSubtitle={defineMessage({
        id: 'service.portal:incoming',
        defaultMessage: 'Á döfinni',
      })}
      institutionDescription={defineMessage({
        id: 'service.portal:vision-segment',
        defaultMessage: `
          Markmið ríkisstjórnarinnar er að stafræn samskipti
          verði megin samskiptaleið fólks og fyrirtækja við hið opinbera.
          Þannig má einfalda líf þeirra sem búa og starfa á Íslandi.
          Stafrænt Ísland, sem heyrir undir fjármála- og efnahagsráðuneytið,
          vinnur að þessum markmiðum þvert á ráðuneyti og stofnanir.
        `,
      })}
      institutionHref="https://island.is/stafraent-island"
      institutionLinkTitle={defineMessage({
        id: 'service.portal:timeline-link-title',
        defaultMessage: 'Sjá tímalínu',
      })}
      figure="/assets/images/shopping.jpg"
    />
  )
}

export default FinanceOverview
