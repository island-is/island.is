import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
  WatsonIntegration,
} from '@island.is/web/components'

export const liveChatIncConfig: Record<string, LiveChatIncChatPanelProps> = {
  // Útlendingastofnun - Organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/77rXck3sISbMsUv7BO1PG2
  '77rXck3sISbMsUv7BO1PG2': {
    license: 13822368,
    version: '2.0',
  },
}

interface WatsonInstance {
  on: (_: {
    type: string
    handler: (event: WatsonPreSendEvent) => void
  }) => void
  updateHomeScreenConfig: ({ is_on: boolean }) => void
}

interface WatsonPreSendEvent {
  data: {
    context: {
      skills: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['main skill']: { user_defined: Record<string, any> }
      }
    }
  }
}

const setupOneScreenWatsonChatBot = (
  instance: WatsonInstance,
  categoryTitle: string,
  categoryGroup: WatsonIntegration,
) => {
  if (sessionStorage.getItem(categoryGroup) !== categoryTitle) {
    sessionStorage.clear()
  }
  sessionStorage.setItem(categoryGroup, categoryTitle)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const preSendhandler = (event: WatsonPreSendEvent) => {
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
    integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'rafraenskilriki',
        'b1a80e76-da12-4333-8872-936b08246eaa',
      ),
  },

  // Loftbrú
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/5xLPMSyKQNkP5sG4OelzKc
  '5xLPMSyKQNkP5sG4OelzKc': {
    integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'loftbru',
        'b1a80e76-da12-4333-8872-936b08246eaa',
      ),
  },

  // Ökuskírteini
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/fZxwXvRXLTUgfeiQmoR3l
  fZxwXvRXLTUgfeiQmoR3l: {
    integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'stafraentokuskirteini',
        'b1a80e76-da12-4333-8872-936b08246eaa',
      ),
  },

  // Íslykill
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3zrd5HMiS59A9UVEoCsAi7
  '3zrd5HMiS59A9UVEoCsAi7': {
    integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'islykill',
        'b1a80e76-da12-4333-8872-936b08246eaa',
      ),
  },

  // Fæðingarorlof
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/59HH2C3hOLYYhFVY4fiX0G
  '59HH2C3hOLYYhFVY4fiX0G': {
    integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'faedingarorlof',
        'b1a80e76-da12-4333-8872-936b08246eaa',
      ),
  },

  // Um hjónaband
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1ABPqOQMsYrqBu7zyP7itc
  '1ABPqOQMsYrqBu7zyP7itc': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'hjonaband',
        '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      ),
  },
  // Skilnaður
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/73z3JiTrAuOQgPlsVfqD1V
  '73z3JiTrAuOQgPlsVfqD1V': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'skilnadur',
        '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      ),
  },
  // Endurnýjun ökuskírteina
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1vYhvJKy4TqxkAtPDIhaPx
  '1vYhvJKy4TqxkAtPDIhaPx': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'endokuskirteini',
        '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      ),
  },
  // Þinglýsing skjala
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2evftN0gIe78zSEYLMB0aX
  '2evftN0gIe78zSEYLMB0aX': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'thinglysing',
        '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      ),
  },
  // Vegabréf, almennar upplýsingar
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7Egh4yMfC48dDgceeBrWSB
  '7Egh4yMfC48dDgceeBrWSB': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'vegabref',
        '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      ),
  },
  // Sakavottorð til einstaklinga
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/gzKeBtRl57SzRmgUzHR3u
  gzKeBtRl57SzRmgUzHR3u: {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'sakavottord',
        '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      ),
  },
  // Erfðamál, upplýsingar um réttindi og skyldur erfingja
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2YsIiF44ECgUUlPkr9SqOh
  '2YsIiF44ECgUUlPkr9SqOh': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
    onLoad: (instance) =>
      setupOneScreenWatsonChatBot(
        instance,
        'erfdamal',
        '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      ),
  },

  // Sýslumenn - Organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/kENblMMMvZ3DlyXw1dwxQ
  kENblMMMvZ3DlyXw1dwxQ: {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
  },
}

export const defaultWatsonConfig: WatsonChatPanelProps = {
  integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
  region: 'eu-gb',
  serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
  showLauncher: false,
  carbonTheme: 'g10',
  namespaceKey: 'default',
}
