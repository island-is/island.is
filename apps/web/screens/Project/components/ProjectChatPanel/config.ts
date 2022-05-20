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
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    namespaceKey: 'default',
  },
}

export const liveChatIncConfig: Record<string, LiveChatIncChatPanelProps> = {
  // Information for Ukrainian citizens
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7GtuCCd7MEZhZKe0oXcHdb
  '7GtuCCd7MEZhZKe0oXcHdb': {
    license: 13822368,
    version: '2.0',
  },
}
