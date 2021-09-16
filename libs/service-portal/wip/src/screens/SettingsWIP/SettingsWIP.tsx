import React from 'react'
import {
  InfoScreen,
  ServicePortalModuleComponent,
  m,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useNamespaces } from '@island.is/localization'

export const SettingsWIP: ServicePortalModuleComponent = () => {
  useNamespaces('sp.wip')

  return (
    <InfoScreen
      title={defineMessage({
        id: 'sp.wip:settings-title',
        defaultMessage: 'Stillingar',
      })}
      intro={defineMessage({
        id: 'sp.wip:settings-intro',
        defaultMessage: `Hér eru upplýsingar um það sem kemur til með að koma inn undir
        stillingar á næstunni.`,
      })}
      list={{
        title: m.incoming,
        items: [
          defineMessage({
            id: 'sp.wip:settings-inc-1',
            defaultMessage: 'Umboðs og aðgangsstýringarkerfi',
          }),
          defineMessage({
            id: 'sp.wip:settings-inc-2',
            defaultMessage: 'Stillingar fyrir tilkynningar',
          }),
          defineMessage({
            id: 'sp.wip:settings-inc-3',
            defaultMessage: 'Bankaupplýsingar',
          }),
        ],
      }}
      externalHref="https://minarsidur.island.is/minar-sidur/minn-adgangur/stillingar/"
      externalLinkTitle={defineMessage({
        id: 'sp.wip:settings-external-link-title',
        defaultMessage: 'Fara í stillingar',
      })}
      figure="./assets/images/working.jpg"
    />
  )
}

export default SettingsWIP
