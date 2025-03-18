import { Locale } from '@island.is/shared/types'
import { WatsonChatPanelProps } from '@island.is/web/components'
import { setupOneScreenWatsonChatBot } from '@island.is/web/utils/webChat'

export const defaultWatsonConfig: Record<Locale, WatsonChatPanelProps> = {
  is: {
    integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
  },
  en: {
    integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
  },
}

export const watsonConfig: Record<
  Locale,
  Record<string, WatsonChatPanelProps>
> = {
  is: {
    '5a7tc0c4rM4QL7nZH1v9J8': {
      integrationID: '580730f3-3d88-4c5a-92e6-30e79ea09f24',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      serviceDesk: {
        integrationType: 'genesyswebmessenger',
        genesysMessenger: {
          scriptURL:
            'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js',
          deploymentID: 'cbc43df8-d5de-4eeb-bd0c-6503cbffcf6d',
          environment: 'prod-euc1',
        },
        skipConnectAgentCard: true,
      },
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'adeldast',
          '580730f3-3d88-4c5a-92e6-30e79ea09f24',
        )
      },
    },
  },
  en: {
    '5a7tc0c4rM4QL7nZH1v9J8': {
      integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },
  },
}
