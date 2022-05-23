import {
  WatsonIntegration,
  WatsonServiceInstance,
  WatsonFont,
  WatsonNamespaceKey,
} from '@island.is/web/components'

export const watsonConfig = {
  // District Commissioners (Sýslumenn) - Organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/kENblMMMvZ3DlyXw1dwxQ
  kENblMMMvZ3DlyXw1dwxQ: {
    integrationID: WatsonIntegration.ASKUR_SYSLUMENN,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
  },

  // Digital Iceland (Stafrænt Ísland) - Organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1JHJe1NDwbBjEr7OVdjuFD
  '1JHJe1NDwbBjEr7OVdjuFD': {
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
