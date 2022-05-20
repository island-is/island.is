import {
  WatsonChatPanelProps,
  WatsonFont,
  WatsonIntegration,
  WatsonNamespaceKey,
  WatsonServiceInstance,
} from '@island.is/web/components'

export const watsonConfig: WatsonChatPanelProps = {
  integrationID: WatsonIntegration.ASKUR,
  region: 'eu-gb',
  serviceInstanceID: WatsonServiceInstance.ASKUR,
  showLauncher: false,
  carbonTheme: 'g10',
  cssVariables: {
    'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
  },
  namespaceKey: WatsonNamespaceKey.DEFAULT,
}
