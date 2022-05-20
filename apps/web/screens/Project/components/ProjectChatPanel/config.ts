import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
  WatsonFont,
  WatsonIntegration,
  WatsonNamespaceKey,
  WatsonServiceInstance,
} from '@island.is/web/components'

export const watsonConfig: Record<string, WatsonChatPanelProps> = {
  // Test page for Watson chat bot
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3NFDdRCIe5RVnlSEbHxoTT
  '3NFDdRCIe5RVnlSEbHxoTT': {
    integrationID: WatsonIntegration.ASKUR,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
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
