import { Locale } from '@island.is/shared/types'

import { WatsonChatPanelProps } from '../../ChatPanel'

export const watsonConfig: Record<
  Locale,
  Record<string, WatsonChatPanelProps>
> = {
  en: {},
  is: {
    // Digital Iceland (Stafrænt Ísland) - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1JHJe1NDwbBjEr7OVdjuFD
    '1JHJe1NDwbBjEr7OVdjuFD': {
      integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: () => {
        if (sessionStorage.getItem('b1a80e76-da12-4333-8872-936b08246eaa')) {
          sessionStorage.clear()
        }
      },
    },
  },
}
