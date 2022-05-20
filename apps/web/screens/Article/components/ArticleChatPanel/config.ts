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

export const watsonConfig: Record<string, WatsonChatPanelProps> = {
  // Um hjónaband
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1ABPqOQMsYrqBu7zyP7itc
  '1ABPqOQMsYrqBu7zyP7itc': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    namespaceKey: 'default',
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'hjonaband') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'hjonaband')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_hjonaband = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
  // Skilnaður
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/73z3JiTrAuOQgPlsVfqD1V
  '73z3JiTrAuOQgPlsVfqD1V': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    namespaceKey: 'default',
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'skilnadur') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'skilnadur')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_skilnadur = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
  // Endurnýjun ökuskírteina
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1vYhvJKy4TqxkAtPDIhaPx
  '1vYhvJKy4TqxkAtPDIhaPx': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    namespaceKey: 'default',
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'endokuskirteini') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'endokuskirteini')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_endokuskirteini = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
  // Þinglýsing skjala
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2evftN0gIe78zSEYLMB0aX
  '2evftN0gIe78zSEYLMB0aX': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    namespaceKey: 'default',
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'thinglysing') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'thinglysing')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_thinglysing = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
  // Vegabréf, almennar upplýsingar
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7Egh4yMfC48dDgceeBrWSB
  '7Egh4yMfC48dDgceeBrWSB': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    namespaceKey: 'default',
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'vegabref') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'vegabref')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_vegabref = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
  // Sakavottorð til einstaklinga
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/gzKeBtRl57SzRmgUzHR3u
  gzKeBtRl57SzRmgUzHR3u: {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    namespaceKey: 'default',
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'sakavottord') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'sakavottord')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_sakavottord = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
  // Erfðamál, upplýsingar um réttindi og skyldur erfingja
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2YsIiF44ECgUUlPkr9SqOh
  '2YsIiF44ECgUUlPkr9SqOh': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    namespaceKey: 'default',
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'erfdamal') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'erfdamal')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_erfdamal = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },

  // Sýslumenn - Organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/kENblMMMvZ3DlyXw1dwxQ
  kENblMMMvZ3DlyXw1dwxQ: {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
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

export const defaultWatsonConfig: WatsonChatPanelProps = {
  integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
  region: 'eu-gb',
  serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
  showLauncher: false,
  carbonTheme: 'g10',
  cssVariables: {
    'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
  },
  namespaceKey: 'default',
}
