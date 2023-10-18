import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
  WatsonIntegration,
} from '@island.is/web/components'
import { Locale } from 'locale'

export const liveChatIncConfig: Record<
  Locale,
  Record<string, LiveChatIncChatPanelProps>
> = {
  is: {
    '6IZT17s7stKJAmtPutjpD7': {
      license: 13270509,
      version: '2.0',
    },
  },
  en: {
    '6IZT17s7stKJAmtPutjpD7': {
      license: 13270509,
      version: '2.0',
      group: 2,
    },
  },
}

interface WatsonInstance {
  on: (_: {
    type: string
    handler: (event: WatsonPreSendEvent) => void
  }) => void
  updateHomeScreenConfig: (params: { is_on: boolean }) => void
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

export const defaultWatsonConfig: Record<Locale, WatsonChatPanelProps> = {
  is: {
    integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
  },
  en: {
    integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
  },
}

export const watsonConfig: Record<
  Locale,
  Record<string, WatsonChatPanelProps>
> = {
  en: {
    // Name giving
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/lGjmpafx2P4yiA6Re3Nxd
    lGjmpafx2P4yiA6Re3Nxd: {
      integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'namegiving',
          '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
        ),
    },
    // Ice Key
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3zrd5HMiS59A9UVEoCsAi7
    '3zrd5HMiS59A9UVEoCsAi7': {
      integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'icekey',
          '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
        ),
    },
    // Digital Drivers license
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/fZxwXvRXLTUgfeiQmoR3l
    fZxwXvRXLTUgfeiQmoR3l: {
      integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'digitaldriverslicense',
          '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
        ),
    },
    // Housing benefits
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6V0J72C464gk9SMjiCbfXy
    '6V0J72C464gk9SMjiCbfXy': {
      integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'housingbenefits',
          '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
        ),
    },
    // Electronic id
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4lkmXszsB5q5kJkXqhW5Ex
    '4lkmXszsB5q5kJkXqhW5Ex': {
      integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'electronicID',
          '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
        ),
    },

    // Útlendingastofnun - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/77rXck3sISbMsUv7BO1PG2
    '77rXck3sISbMsUv7BO1PG2': {
      integrationID: '89a03e83-5c73-4642-b5ba-cd3771ceca54',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Sjúkratryggingar - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3pZwAagW0UY26giHaxHthe
    '3pZwAagW0UY26giHaxHthe': {
      integrationID: 'cba41fa0-12fb-4cb5-bd98-66a57cee42e0',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // European health insurance card
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1AKWfq2dh9YnEyiG1yNeR8
    '1AKWfq2dh9YnEyiG1yNeR8': {
      integrationID: 'cba41fa0-12fb-4cb5-bd98-66a57cee42e0',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'eucard',
          'cba41fa0-12fb-4cb5-bd98-66a57cee42e0',
        ),
    },
  },
  is: {
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

    // Útlendingastofnun - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/77rXck3sISbMsUv7BO1PG2
    '77rXck3sISbMsUv7BO1PG2': {
      integrationID: '89a03e83-5c73-4642-b5ba-cd3771ceca54',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Sjúkratryggingar - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3pZwAagW0UY26giHaxHthe
    '3pZwAagW0UY26giHaxHthe': {
      integrationID: 'e625e707-c9ce-4048-802c-c12b905c28be',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Evrópska sjúkratryggingakortið
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1AKWfq2dh9YnEyiG1yNeR8
    '1AKWfq2dh9YnEyiG1yNeR8': {
      integrationID: 'e625e707-c9ce-4048-802c-c12b905c28be',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'eukort',
          'e625e707-c9ce-4048-802c-c12b905c28be',
        ),
    },

    // Tannlækningar
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/qS7y3WKsqEnWCbiISVU3Q
    qS7y3WKsqEnWCbiISVU3Q: {
      integrationID: 'e625e707-c9ce-4048-802c-c12b905c28be',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'tannlaekningar',
          'e625e707-c9ce-4048-802c-c12b905c28be',
        ),
    },

    // Sjúkradagpeningar
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7ela1JGeFHHxFgWPj6cGp7
    '7ela1JGeFHHxFgWPj6cGp7': {
      integrationID: 'e625e707-c9ce-4048-802c-c12b905c28be',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'sjukradagpeningar',
          'e625e707-c9ce-4048-802c-c12b905c28be',
        ),
    },

    // Greiðsluþáttökukerfi lyfja
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1P80AT2eqbQKT3eEpW79u7
    '1P80AT2eqbQKT3eEpW79u7': {
      integrationID: 'e625e707-c9ce-4048-802c-c12b905c28be',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'greidsluthatttakalyfja',
          'e625e707-c9ce-4048-802c-c12b905c28be',
        ),
    },
  },
}

// If these organizations are not connected to an article then we show the default watson config
export const excludedOrganizationWatsonConfig: string[] = [
  // Sjúkratryggingar Íslands
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3pZwAagW0UY26giHaxHthe
  '3pZwAagW0UY26giHaxHthe',

  // Heilbrigðisstofnun Norðurlands
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/EM4Y0gF4OoGhH9ZY0Dxl6
  'EM4Y0gF4OoGhH9ZY0Dxl6',

  // Fiskistofa
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6rXUdfbMD515Z7guowj08E
  '6rXUdfbMD515Z7guowj08E',

  // Landlæknir
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7qgJZc8vO7ZHWmfSrZp9Kn
  '7qgJZc8vO7ZHWmfSrZp9Kn',

  // Útlendingastofnun
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/77rXck3sISbMsUv7BO1PG2
  '77rXck3sISbMsUv7BO1PG2',
]
