import React from 'react'
import {
  InfoScreen,
  ServicePortalModuleComponent,
  m,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { withClientLocale } from '@island.is/localization'

export const HealthOverview: ServicePortalModuleComponent = () => {
  return (
    <InfoScreen
      title={defineMessage({
        id: 'sp.health:title',
        defaultMessage: 'Heilsa',
      })}
      intro={defineMessage({
        id: 'sp.health:intro',
        defaultMessage: `Hér eru upplýsingar um það sem kemur til með að koma inn undir
        heilsu á næstunni.`,
      })}
      list={{
        title: m.incoming,
        items: [
          defineMessage({
            id: 'sp.health:inc-1',
            defaultMessage: ' ',
          }),
          defineMessage({
            id: 'sp.health:inc-2',
            defaultMessage: ' ',
          }),
          defineMessage({
            id: 'sp.health:inc-3',
            defaultMessage: ' ',
          }),
        ],
      }}
      externalHref="https://www.heilsuvera.is/"
      externalLinkTitle={defineMessage({
        id: 'sp.health:goto-heilsuvera',
        defaultMessage: 'Fara á heilsuveru',
      })}
      institutionTitle={m.digitalIceland}
      institutionSubtitle={m.incoming}
      institutionDescription={m.visionSegment}
      institutionHref="https://island.is/stafraent-island"
      institutionLinkTitle={m.timelineLinkTitle}
      figure="/assets/images/bench.svg"
    />
  )
}

export default withClientLocale('sp.health')(HealthOverview)
