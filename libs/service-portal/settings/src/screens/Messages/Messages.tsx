import React from 'react'
import {
  InfoScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useNamespaces } from '@island.is/localization'

export const Messages: ServicePortalModuleComponent = () => {
  useNamespaces('sp.settings')

  return (
    <InfoScreen
      title={defineMessage({
        id: 'service.portal:messages',
        defaultMessage: 'Skilaboð',
      })}
      intro={defineMessage({
        id: 'sp.settings:messages-about',
        defaultMessage: `Hér eru upplýsingar um það sem kemur til með að koma inn undir skilaboð á næstunni`,
      })}
      list={{
        title: defineMessage({
          id: 'service.portal:incoming',
          defaultMessage: 'Á döfinni',
        }),
        items: [
          defineMessage({
            id: 'sp.settings:messages-inc-1',
            defaultMessage: ' ',
          }),
        ],
      }}
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
      institutionHref="https://island.is/um-island-is"
      institutionLinkTitle={defineMessage({
        id: 'service.portal:timeline-link-title',
        defaultMessage: 'Sjá tímalínu',
      })}
      figure="/assets/images/bus.jpg"
    />
  )
}

export default Messages
