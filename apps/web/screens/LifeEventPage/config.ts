import { Locale } from 'locale'

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
      integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'ad_eldast',
          'b1a80e76-da12-4333-8872-936b08246eaa',
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
