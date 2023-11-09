import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
} from '@island.is/web/components'

export const watsonConfig: Record<string, WatsonChatPanelProps> = {
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
}

export const liveChatIncConfig: Record<string, LiveChatIncChatPanelProps> = {}
