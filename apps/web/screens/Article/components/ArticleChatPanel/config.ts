import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
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

enum WatsonIntegration {
  ASKUR = 'b1a80e76-da12-4333-8872-936b08246eaa',
  ASKUR_SYSLUMENN = '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
}

enum WatsonServiceInstance {
  ASKUR = 'bc3d8312-d862-4750-b8bf-529db282050a',
}

enum Font {
  IBM_PLEX_SANS = '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
}

enum NamespaceKey {
  DEFAULT = 'default',
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'rafraenskilriki',
        'askurChatPanelCategory',
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: NamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'loftbru',
        'askurChatPanelCategory',
      ),
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: NamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'stafraentokuskirteini',
        'askurChatPanelCategory',
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: NamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'islykill',
        'askurChatPanelCategory',
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: NamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'faedingarorlof',
        'askurChatPanelCategory',
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: NamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'hjonaband',
        'syslumennChatPanelCategory',
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: NamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'skilnadur',
        'syslumennChatPanelCategory',
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: NamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'endokuskirteini',
        'syslumennChatPanelCategory',
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: NamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'thinglysing',
        'syslumennChatPanelCategory',
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: NamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'vegabref',
        'syslumennChatPanelCategory',
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: NamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'sakavottord',
        'syslumennChatPanelCategory',
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: NamespaceKey.DEFAULT,
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'erfdamal',
        'syslumennChatPanelCategory',
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
      'BASE-font-family': Font.IBM_PLEX_SANS,
    },
    namespaceKey: NamespaceKey.DEFAULT,
  },
}

export const defaultWatsonConfig: WatsonChatPanelProps = {
  integrationID: WatsonIntegration.ASKUR,
  region: 'eu-gb',
  serviceInstanceID: WatsonServiceInstance.ASKUR,
  showLauncher: false,
  carbonTheme: 'g10',
  cssVariables: {
    'BASE-font-family': Font.IBM_PLEX_SANS,
  },
  namespaceKey: NamespaceKey.DEFAULT,
}
