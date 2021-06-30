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
