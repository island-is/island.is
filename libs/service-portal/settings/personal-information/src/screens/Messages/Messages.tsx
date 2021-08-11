import React from 'react'
import {
  InfoScreen,
  ServicePortalModuleComponent,
  m,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useNamespaces } from '@island.is/localization'

export const Messages: ServicePortalModuleComponent = () => {
  useNamespaces('sp.settings')

  return (
    <InfoScreen
      title={m.messages}
      intro={defineMessage({
        id: 'sp.settings:messages-about',
        defaultMessage: `Hér eru upplýsingar um það sem kemur til með að koma inn undir skilaboð á næstunni`,
      })}
      list={{
        title: m.incoming,
        items: [
          defineMessage({
            id: 'sp.settings:messages-inc-1',
            defaultMessage: ' ',
          }),
        ],
      }}
      institutionTitle={m.digitalIceland}
      institutionSubtitle={m.incoming}
      institutionDescription={m.visionSegment}
      institutionHref="https://island.is/stafraent-island"
      institutionLinkTitle={m.timelineLinkTitle}
      figure="/assets/images/bus.svg"
    />
  )
}

export default Messages
