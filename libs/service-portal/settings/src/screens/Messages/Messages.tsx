import React from 'react'
import {
  InfoScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'

export const Messages: ServicePortalModuleComponent = () => {
  return (
    <InfoScreen
      title={defineMessage({
        id: 'service.portal:messages',
        defaultMessage: 'Skilaboð',
      })}
      intro={defineMessage({
        id: 'sp.settings:delegation-about',
        defaultMessage: `Hér eru upplýsingar um það sem kemur til með að koma inn undir umboð á næstunni`,
      })}
      list={{
        title: defineMessage({
          id: 'service.portal:incoming',
          defaultMessage: 'Á döfinni',
        }),
        items: [
          defineMessage({
            id: 'sp.settings:delegation-inc-1',
            defaultMessage:
              'Yfirlit og hægt verður að deila umboði á milli einstaklinga og fyrirtækja',
          }),
        ],
      }}
      institutionTitle={defineMessage({
        id: 'service.portal:digital-iceland',
        defaultMessage: 'Ísland.is',
      })}
      institutionDescription={defineMessage({
        id: 'sp.settings:delegation-institution-description',
        defaultMessage: `
          Markmið ríkisstjórnarinnar er að stafræn samskipti verði megin samskiptaleið
          fólks og fyrirtækja við hið opinbera. Þannig má einfalda líf þeirra sem búa
          og starfa á Íslandi. Stafrænt Ísland, sem heyrir undir fjármála- og
          efnahagsráðuneytið, vinnur að þessum markmiðum þvert á ráðuneyti og stofnanir.
        `,
      })}
      institutionHref="https://innskraning.island.is/addonbehalf.aspx"
      institutionLinkTitle={defineMessage({
        id: 'sp.settings:institution:link-title',
        defaultMessage:
          'Núverandi umboðskerfi Ísland.is - www.innskraning.island.is',
      })}
      figure="/assets/images/school.jpg"
    />
  )
}

export default Messages
