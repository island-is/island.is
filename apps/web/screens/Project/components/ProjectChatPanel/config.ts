import { Locale } from 'locale'

import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
} from '@island.is/web/components'

export const watsonConfig: Record<
  Locale,
  Record<string, WatsonChatPanelProps>
> = {
  is: {
    // Test page for Watson chat bot
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3NFDdRCIe5RVnlSEbHxoTT
    '3NFDdRCIe5RVnlSEbHxoTT': {
      integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Information for Ukrainian citizens
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7GtuCCd7MEZhZKe0oXcHdb
    '7GtuCCd7MEZhZKe0oXcHdb': {
      integrationID: '53c6e788-8178-448d-94c3-f5d71ec3b80e',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: true,
      carbonTheme: 'g10',
      namespaceKey: 'ukrainian-citizens',
    },

    // Fyrir Grindavík
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3wvjVmglZEaKaM5lSzouCB
    '3wvjVmglZEaKaM5lSzouCB': {
      integrationID: 'fd247025-59fc-4ccd-83eb-7ae960019e37',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },
  },
  en: {
    // Test page for Watson chat bot
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3NFDdRCIe5RVnlSEbHxoTT
    '3NFDdRCIe5RVnlSEbHxoTT': {
      integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Information for Ukrainian citizens
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7GtuCCd7MEZhZKe0oXcHdb
    '7GtuCCd7MEZhZKe0oXcHdb': {
      integrationID: '53c6e788-8178-448d-94c3-f5d71ec3b80e',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: true,
      carbonTheme: 'g10',
      namespaceKey: 'ukrainian-citizens',
    },

    // For Grindavík
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3wvjVmglZEaKaM5lSzouCB
    '3wvjVmglZEaKaM5lSzouCB': {
      integrationID: 'e72d26ef-92eb-4e66-bdae-1f13a72a887a',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },
  },
}

export const liveChatIncConfig: Record<
  Locale,
  Record<string, LiveChatIncChatPanelProps>
> = {
  is: {},
  en: {},
}
