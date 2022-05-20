import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
  WatsonFont,
  WatsonIntegration,
  WatsonNamespaceKey,
  WatsonServiceInstance,
} from '@island.is/web/components'

export const liveChatIncConfig: Record<string, LiveChatIncChatPanelProps> = {
  // Útlendingastofnun - Organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/77rXck3sISbMsUv7BO1PG2
  '77rXck3sISbMsUv7BO1PG2': {
    license: 13822368,
    version: '2.0',
  },
}

const setupOneScreenWatsonChatBot = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: any,
  categoryTitle: string,
  categoryGroup: string,
) => {
  if (sessionStorage.getItem(categoryGroup) !== categoryTitle) {
    sessionStorage.clear()
  }
  sessionStorage.setItem(categoryGroup, categoryTitle)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const preSendhandler = (event: any) => {
    event.data.context.skills['main skill'].user_defined[
      `category_${categoryTitle}`
    ] = true
  }

  instance.on({ type: 'pre:send', handler: preSendhandler })

  instance.updateHomeScreenConfig({
    is_on: false,
  })
}

export const watsonConfig: Record<string, WatsonChatPanelProps> = {
  // Rafræn skilríki
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4lkmXszsB5q5kJkXqhW5Ex
  '4lkmXszsB5q5kJkXqhW5Ex': {
    integrationID: WatsonIntegration.ASKUR,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'rafraenskilriki',
        WatsonIntegration.ASKUR,
      ),
  },

  // Loftbrú
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/5xLPMSyKQNkP5sG4OelzKc
  '5xLPMSyKQNkP5sG4OelzKc': {
    integrationID: WatsonIntegration.ASKUR,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(instance, 'loftbru', WatsonIntegration.ASKUR),
  },

  // Ökuskírteini
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/fZxwXvRXLTUgfeiQmoR3l
  fZxwXvRXLTUgfeiQmoR3l: {
    integrationID: WatsonIntegration.ASKUR,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'stafraentokuskirteini',
        WatsonIntegration.ASKUR,
      ),
  },

  // Íslykill
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3zrd5HMiS59A9UVEoCsAi7
  '3zrd5HMiS59A9UVEoCsAi7': {
    integrationID: WatsonIntegration.ASKUR,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'islykill',
        WatsonIntegration.ASKUR,
      ),
  },

  // Fæðingarorlof
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/59HH2C3hOLYYhFVY4fiX0G
  '59HH2C3hOLYYhFVY4fiX0G': {
    integrationID: WatsonIntegration.ASKUR,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'faedingarorlof',
        WatsonIntegration.ASKUR,
      ),
  },

  // Um hjónaband
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1ABPqOQMsYrqBu7zyP7itc
  '1ABPqOQMsYrqBu7zyP7itc': {
    integrationID: WatsonIntegration.ASKUR_SYSLUMENN,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'hjonaband',
        WatsonIntegration.ASKUR_SYSLUMENN,
      ),
  },
  // Skilnaður
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/73z3JiTrAuOQgPlsVfqD1V
  '73z3JiTrAuOQgPlsVfqD1V': {
    integrationID: WatsonIntegration.ASKUR_SYSLUMENN,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'skilnadur',
        WatsonIntegration.ASKUR_SYSLUMENN,
      ),
  },
  // Endurnýjun ökuskírteina
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1vYhvJKy4TqxkAtPDIhaPx
  '1vYhvJKy4TqxkAtPDIhaPx': {
    integrationID: WatsonIntegration.ASKUR_SYSLUMENN,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'endokuskirteini',
        WatsonIntegration.ASKUR_SYSLUMENN,
      ),
  },
  // Þinglýsing skjala
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2evftN0gIe78zSEYLMB0aX
  '2evftN0gIe78zSEYLMB0aX': {
    integrationID: WatsonIntegration.ASKUR_SYSLUMENN,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'thinglysing',
        WatsonIntegration.ASKUR_SYSLUMENN,
      ),
  },
  // Vegabréf, almennar upplýsingar
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7Egh4yMfC48dDgceeBrWSB
  '7Egh4yMfC48dDgceeBrWSB': {
    integrationID: WatsonIntegration.ASKUR_SYSLUMENN,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'vegabref',
        WatsonIntegration.ASKUR_SYSLUMENN,
      ),
  },
  // Sakavottorð til einstaklinga
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/gzKeBtRl57SzRmgUzHR3u
  gzKeBtRl57SzRmgUzHR3u: {
    integrationID: WatsonIntegration.ASKUR_SYSLUMENN,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'sakavottord',
        WatsonIntegration.ASKUR_SYSLUMENN,
      ),
  },
  // Erfðamál, upplýsingar um réttindi og skyldur erfingja
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2YsIiF44ECgUUlPkr9SqOh
  '2YsIiF44ECgUUlPkr9SqOh': {
    integrationID: WatsonIntegration.ASKUR_SYSLUMENN,
    region: 'eu-gb',
    serviceInstanceID: WatsonServiceInstance.ASKUR,
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': WatsonFont.IBM_PLEX_SANS,
    },
    namespaceKey: WatsonNamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'erfdamal',
        WatsonIntegration.ASKUR_SYSLUMENN,
      ),
  },

  // Sýslumenn - Organization
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
}

export const defaultWatsonConfig: WatsonChatPanelProps = {
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
