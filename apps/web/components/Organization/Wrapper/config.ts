import { Locale } from '@island.is/shared/types'

import { WatsonChatPanelProps } from '../../ChatPanel'

export const watsonConfig: Record<
  Locale,
  Record<string, WatsonChatPanelProps>
> = {
  en: {
    // Samgöngustofa - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6IZT17s7stKJAmtPutjpD7
    '6IZT17s7stKJAmtPutjpD7': {
      integrationID: 'ee1c15db-7151-4487-bc9a-9f32f1f8ae3b',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'samgongustofa',
    },
  },
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
    // Samgöngustofa - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6IZT17s7stKJAmtPutjpD7
    '6IZT17s7stKJAmtPutjpD7': {
      integrationID: 'b0b445a4-4c49-4c79-9731-8d03f49c8cac',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'samgongustofa',
    },
  },
}
