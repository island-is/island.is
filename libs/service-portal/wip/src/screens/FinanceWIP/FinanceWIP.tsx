import React from 'react'
import {
  InfoScreen,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useNamespaces } from '@island.is/localization'

export const SettingsWIP: ServicePortalModuleComponent = () => {
  useNamespaces('sp.wip')

  return (
    <InfoScreen
      title={defineMessage({
        id: 'sp.wip:finance-title',
        defaultMessage: 'Fjármál',
      })}
      intro={defineMessage({
        id: 'sp.wip:finance-intro',
        defaultMessage: `Hér eru upplýsingar um það sem kemur til með að koma inn undir
        fjármál á næstunni.`,
      })}
      externalHref="https://minarsidur.island.is/minar-sidur/fjarmal/fjarmal-stada-vid-rikissjod-og-stofnanir/"
      externalLinkTitle={defineMessage({
        id: 'sp.wip:external-link-title',
        defaultMessage: 'Fara á fjármál',
      })}
      figure="./assets/images/working.jpg"
    />
  )
}

export default SettingsWIP
