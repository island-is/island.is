import { Locale } from '@island.is/shared/types'
import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
} from '@island.is/web/components'
import { setupOneScreenWatsonChatBot } from '@island.is/web/utils/webChat'

export const liveChatIncConfig: Record<
  Locale,
  Record<string, LiveChatIncChatPanelProps>
> = {
  is: {
    // Vinnueftirlitið - Organization
    '39S5VumPfb1hXBJm3SnE02': {
      license: '13346703',
      version: '2.0',
      showLauncher: false,
    },
    // Landspítali - Organization
    '2rIt6lQNXZNORCgEWhNonO': {
      license: '9218745',
      version: '2.0',
      showLauncher: false,
    },
  },
  en: {
    // Vinnueftirlitið - Organization
    '39S5VumPfb1hXBJm3SnE02': {
      license: '13346703',
      version: '2.0',
      showLauncher: false,
    },
    // Landspítali - Organization
    '2rIt6lQNXZNORCgEWhNonO': {
      license: '9218745',
      version: '2.0',
      showLauncher: false,
    },
  },
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
    // Skrá eigendaskipti
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4rr5MJWXB9xRz6VwHAKw78
    '4rr5MJWXB9xRz6VwHAKw78': {
      integrationID: 'ee1c15db-7151-4487-bc9a-9f32f1f8ae3b',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'samgongustofa',
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'skra-eigendaskipti',
          'ee1c15db-7151-4487-bc9a-9f32f1f8ae3b',
        )
      },
    },
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
    // Tax on wages and pensions
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6e3SWIyt0ayXwSuqB4HiiE
    '6e3SWIyt0ayXwSuqB4HiiE': {
      integrationID: '98ba51da-1677-4881-a133-7ea019ae7b87',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
      },
    },
    // Child benefit
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/42poXejFLO31vxj67UW5J3
    '42poXejFLO31vxj67UW5J3': {
      integrationID: '98ba51da-1677-4881-a133-7ea019ae7b87',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
      },
    },

    // Taxes on goods and services
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4BECjoXzpyecbbp8rY1u7t
    '4BECjoXzpyecbbp8rY1u7t': {
      integrationID: '98ba51da-1677-4881-a133-7ea019ae7b87',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
      },
    },

    // Skatturinn - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4yJlHgCMTqpgRSj4p6LuBQ
    '4yJlHgCMTqpgRSj4p6LuBQ': {
      integrationID: '98ba51da-1677-4881-a133-7ea019ae7b87',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
      },
    },

    // Útlendingastofnun - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/77rXck3sISbMsUv7BO1PG2
    '77rXck3sISbMsUv7BO1PG2': {
      integrationID: '9e320784-ad44-4da9-9eb3-f305057a196a',
      region: 'eu-gb',
      serviceInstanceID: '2529638b-503c-4374-955c-0310139ec177',
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

    // Kílómetragjald
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4ydMzxTVny5W9nTn6abfZm
    '4ydMzxTVny5W9nTn6abfZm': {
      ...defaultWatsonConfig.en,
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'kilometragjald',
          defaultWatsonConfig.en.integrationID,
        )
      },
    },

    // Kaup ríkisins á íbúðarhúsnæði í Grindavík
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2r6181rqgbxScVvCOUb4k8
    '2r6181rqgbxScVvCOUb4k8': {
      ...defaultWatsonConfig.en,
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'kaupaibudarhusnaedum',
          defaultWatsonConfig.en.integrationID,
        )
      },
    },

    // Samgöngustofa - Organization
    '6IZT17s7stKJAmtPutjpD7': {
      integrationID: 'ee1c15db-7151-4487-bc9a-9f32f1f8ae3b',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'samgongustofa',
    },
  },
  is: {
    // Góð ráð fyrir eldra fólk
    '4CfFS8hwEd7kgDywM4dR6g': {
      integrationID: '580730f3-3d88-4c5a-92e6-30e79ea09f24',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      serviceDesk: {
        integrationType: 'genesyswebmessenger',
        genesysMessenger: {
          scriptURL:
            'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js',
          deploymentID: 'cbc43df8-d5de-4eeb-bd0c-6503cbffcf6d',
          environment: 'prod-euc1',
        },
        skipConnectAgentCard: true,
      },
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'adeldast',
          '580730f3-3d88-4c5a-92e6-30e79ea09f24',
        )
      },
    },
    // Félags- og þjónustumiðstöðvar
    '5IACQSPuDm0tOazEpVRgfY': {
      integrationID: '580730f3-3d88-4c5a-92e6-30e79ea09f24',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      serviceDesk: {
        integrationType: 'genesyswebmessenger',
        genesysMessenger: {
          scriptURL:
            'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js',
          deploymentID: 'cbc43df8-d5de-4eeb-bd0c-6503cbffcf6d',
          environment: 'prod-euc1',
        },
        skipConnectAgentCard: true,
      },
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'adeldast',
          '580730f3-3d88-4c5a-92e6-30e79ea09f24',
        )
      },
    },
    // Hreyfing í boði
    '2S0d5HmHvXhFE3tweHw1z1': {
      integrationID: '580730f3-3d88-4c5a-92e6-30e79ea09f24',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      serviceDesk: {
        integrationType: 'genesyswebmessenger',
        genesysMessenger: {
          scriptURL:
            'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js',
          deploymentID: 'cbc43df8-d5de-4eeb-bd0c-6503cbffcf6d',
          environment: 'prod-euc1',
        },
        skipConnectAgentCard: true,
      },
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'adeldast',
          '580730f3-3d88-4c5a-92e6-30e79ea09f24',
        )
      },
    },
    // Hjúkrunarheimili
    '15wf63DoLq4pvhhrzPCGhU': {
      integrationID: '580730f3-3d88-4c5a-92e6-30e79ea09f24',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      serviceDesk: {
        integrationType: 'genesyswebmessenger',
        genesysMessenger: {
          scriptURL:
            'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js',
          deploymentID: 'cbc43df8-d5de-4eeb-bd0c-6503cbffcf6d',
          environment: 'prod-euc1',
        },
        skipConnectAgentCard: true,
      },
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'adeldast',
          '580730f3-3d88-4c5a-92e6-30e79ea09f24',
        )
      },
    },
    // Íbúðir fyrir eldra fólk
    '1rufrpXBhf7unlyO0wZaAk': {
      integrationID: '580730f3-3d88-4c5a-92e6-30e79ea09f24',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      serviceDesk: {
        integrationType: 'genesyswebmessenger',
        genesysMessenger: {
          scriptURL:
            'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js',
          deploymentID: 'cbc43df8-d5de-4eeb-bd0c-6503cbffcf6d',
          environment: 'prod-euc1',
        },
        skipConnectAgentCard: true,
      },
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'adeldast',
          '580730f3-3d88-4c5a-92e6-30e79ea09f24',
        )
      },
    },
    // Að búa heima með stuðningi
    '6vGTPmxwGs1sPdZ0OdvzJw': {
      integrationID: '580730f3-3d88-4c5a-92e6-30e79ea09f24',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      serviceDesk: {
        integrationType: 'genesyswebmessenger',
        genesysMessenger: {
          scriptURL:
            'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js',
          deploymentID: 'cbc43df8-d5de-4eeb-bd0c-6503cbffcf6d',
          environment: 'prod-euc1',
        },
        skipConnectAgentCard: true,
      },
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'adeldast',
          '580730f3-3d88-4c5a-92e6-30e79ea09f24',
        )
      },
    },
    // Dagdvalir og dagþjálfun eldra fólks
    '2cS3oHZhftq2LsQaT0AqwF': {
      integrationID: '580730f3-3d88-4c5a-92e6-30e79ea09f24',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      serviceDesk: {
        integrationType: 'genesyswebmessenger',
        genesysMessenger: {
          scriptURL:
            'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js',
          deploymentID: 'cbc43df8-d5de-4eeb-bd0c-6503cbffcf6d',
          environment: 'prod-euc1',
        },
        skipConnectAgentCard: true,
      },
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'adeldast',
          '580730f3-3d88-4c5a-92e6-30e79ea09f24',
        )
      },
    },
    // Heilbrigðisþjónusta fyrir eldra fólks
    LHQTpUAQntQZtM59p2C9Q: {
      integrationID: '580730f3-3d88-4c5a-92e6-30e79ea09f24',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      serviceDesk: {
        integrationType: 'genesyswebmessenger',
        genesysMessenger: {
          scriptURL:
            'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js',
          deploymentID: 'cbc43df8-d5de-4eeb-bd0c-6503cbffcf6d',
          environment: 'prod-euc1',
        },
        skipConnectAgentCard: true,
      },
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'adeldast',
          '580730f3-3d88-4c5a-92e6-30e79ea09f24',
        )
      },
    },
    // Aðstandendur
    '3ZDTr5rAZ9G7wKRVNpMX0J': {
      integrationID: '580730f3-3d88-4c5a-92e6-30e79ea09f24',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      serviceDesk: {
        integrationType: 'genesyswebmessenger',
        genesysMessenger: {
          scriptURL:
            'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js',
          deploymentID: 'cbc43df8-d5de-4eeb-bd0c-6503cbffcf6d',
          environment: 'prod-euc1',
        },
        skipConnectAgentCard: true,
      },
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'adeldast',
          '580730f3-3d88-4c5a-92e6-30e79ea09f24',
        )
      },
    },
    // Breytingar á heilsufari eldra fólks
    '3ZD1FAUtrnGKbSg329YgP8RqqTr5rAZ9G7wKRVNpMX0J': {
      integrationID: '580730f3-3d88-4c5a-92e6-30e79ea09f24',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      serviceDesk: {
        integrationType: 'genesyswebmessenger',
        genesysMessenger: {
          scriptURL:
            'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js',
          deploymentID: 'cbc43df8-d5de-4eeb-bd0c-6503cbffcf6d',
          environment: 'prod-euc1',
        },
        skipConnectAgentCard: true,
      },
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'adeldast',
          '580730f3-3d88-4c5a-92e6-30e79ea09f24',
        )
      },
    },
    // Samgöngustofa - Organization
    '6IZT17s7stKJAmtPutjpD7': {
      integrationID: 'b0b445a4-4c49-4c79-9731-8d03f49c8cac',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'samgongustofa',
    },

    // Uppfletting í ökutækjaskrá
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/5tyHpCXpWGZnhCCbP6eTb0
    '5tyHpCXpWGZnhCCbP6eTb0': {
      integrationID: 'b0b445a4-4c49-4c79-9731-8d03f49c8cac',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'samgongustofa',
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'uppfletting-i-oekutaekjaskra',
          'b0b445a4-4c49-4c79-9731-8d03f49c8cac',
        )
      },
    },

    // Skrá eigendaskipti
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4rr5MJWXB9xRz6VwHAKw78
    '4rr5MJWXB9xRz6VwHAKw78': {
      integrationID: 'b0b445a4-4c49-4c79-9731-8d03f49c8cac',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'samgongustofa',
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'skra-eigendaskipti',
          'b0b445a4-4c49-4c79-9731-8d03f49c8cac',
        )
      },
    },

    // Skútan - skipaskráningar og lögskráningarkerfi
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3wmGcP61YJePBL92ITgY64
    '3wmGcP61YJePBL92ITgY64': {
      integrationID: 'b0b445a4-4c49-4c79-9731-8d03f49c8cac',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'samgongustofa',
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'skutan-skipaskra-og-logskraning',
          'b0b445a4-4c49-4c79-9731-8d03f49c8cac',
        )
      },
    },

    // Kílómetragjald
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4ydMzxTVny5W9nTn6abfZm
    '4ydMzxTVny5W9nTn6abfZm': {
      ...defaultWatsonConfig.is,
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'kilometragjald',
          defaultWatsonConfig.is.integrationID,
        )
      },
    },

    // Kaup ríkisins á íbúðarhúsnæði í Grindavík
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2r6181rqgbxScVvCOUb4k8
    '2r6181rqgbxScVvCOUb4k8': {
      ...defaultWatsonConfig.is,
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'kaupaibudarhusnaedum',
          defaultWatsonConfig.is.integrationID,
        )
      },
    },

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

    // Skattur af launum og lífeyri
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6e3SWIyt0ayXwSuqB4HiiE
    '6e3SWIyt0ayXwSuqB4HiiE': {
      integrationID: '84f62b21-aa50-4d49-b413-597b6a959910',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
        setupOneScreenWatsonChatBot(
          instance,
          'almenntskattar',
          '84f62b21-aa50-4d49-b413-597b6a959910',
        )
      },
    },

    // Barnabætur
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/42poXejFLO31vxj67UW5J3
    '42poXejFLO31vxj67UW5J3': {
      integrationID: '84f62b21-aa50-4d49-b413-597b6a959910',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
        setupOneScreenWatsonChatBot(
          instance,
          'barnabaetur',
          '84f62b21-aa50-4d49-b413-597b6a959910',
        )
      },
    },

    // Virðisaukaskattur og vörugjöld á vöru og þjónustu – almennar upplýsingar
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4BECjoXzpyecbbp8rY1u7t
    '4BECjoXzpyecbbp8rY1u7t': {
      integrationID: '84f62b21-aa50-4d49-b413-597b6a959910',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
        setupOneScreenWatsonChatBot(
          instance,
          'virdisaukaskattur',
          '84f62b21-aa50-4d49-b413-597b6a959910',
        )
      },
    },

    // Skatturinn - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4yJlHgCMTqpgRSj4p6LuBQ
    '4yJlHgCMTqpgRSj4p6LuBQ': {
      integrationID: '84f62b21-aa50-4d49-b413-597b6a959910',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
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
      namespaceKey: 'default',
    },

    // Sýslumaðurinn á Austurlandi
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/Xnes7x1ccvBvuZxInRXDm
    Xnes7x1ccvBvuZxInRXDm: {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Sýslumaðurinn á höfuðborgarsvæðinu
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6puIJvhGxFBzxExVHxi5sr
    '6puIJvhGxFBzxExVHxi5sr': {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Sýslumaðurinn á Norðurlandi eystra
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/12JLsyDmODBfZedYPOQXtX
    '12JLsyDmODBfZedYPOQXtX': {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Sýslumaðurinn á Vestfjörðum
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/5MDZoq1DGsJospUnQz4y98
    '5MDZoq1DGsJospUnQz4y98': {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Sýslumaðurinn í Vestmannaeyjum
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/145ctmpqLPrOM7rHZIpC6F
    '145ctmpqLPrOM7rHZIpC6F': {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Sýslumaðurinn á Suðurnesjum
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/cRCuTTXXSrpBj27nBiLbc?focusedField=title&focusedLocale=is-IS
    cRCuTTXXSrpBj27nBiLbc: {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Sýslumaðurinn á Suðurlandi
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2uyNnLcRooCNk7u6CMpsIv
    '2uyNnLcRooCNk7u6CMpsIv': {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Sýslumaðurinn á Norðurlandi vestra
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/ZefqpCw4y5oy9lREilQY3
    ZefqpCw4y5oy9lREilQY3: {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Sýslumaðurinn á Vesturlandi
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/43KqapFNoM9m4MNXXc8UPU
    '43KqapFNoM9m4MNXXc8UPU': {
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

  // Tryggingastofnun
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3dgsobJuiJXC1oOxhGpcUY
  '3dgsobJuiJXC1oOxhGpcUY',

  // HMS
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/53jrbgxPKpbNtordSfEZUK
  '53jrbgxPKpbNtordSfEZUK',

  // Sýslumenn - Organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/kENblMMMvZ3DlyXw1dwxQ
  'kENblMMMvZ3DlyXw1dwxQ',

  // Sýslumaðurinn á Austurlandi
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/Xnes7x1ccvBvuZxInRXDm
  'Xnes7x1ccvBvuZxInRXDm',

  // Sýslumaðurinn á höfuðborgarsvæðinu
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6puIJvhGxFBzxExVHxi5sr
  '6puIJvhGxFBzxExVHxi5sr',

  // Sýslumaðurinn á Norðurlandi eystra
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/12JLsyDmODBfZedYPOQXtX
  '12JLsyDmODBfZedYPOQXtX',

  // Sýslumaðurinn á Vestfjörðum
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/5MDZoq1DGsJospUnQz4y98
  '5MDZoq1DGsJospUnQz4y98',

  // Sýslumaðurinn í Vestmannaeyjum
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/145ctmpqLPrOM7rHZIpC6F
  '145ctmpqLPrOM7rHZIpC6F',

  // Sýslumaðurinn á Suðurnesjum
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/cRCuTTXXSrpBj27nBiLbc
  'cRCuTTXXSrpBj27nBiLbc',

  // Sýslumaðurinn á Suðurlandi
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2uyNnLcRooCNk7u6CMpsIv
  '2uyNnLcRooCNk7u6CMpsIv',

  // Sýslumaðurinn á Norðurlandi vestra
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/ZefqpCw4y5oy9lREilQY3
  'ZefqpCw4y5oy9lREilQY3',

  // Sýslumaðurinn á Vesturlandi
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/43KqapFNoM9m4MNXXc8UPU
  '43KqapFNoM9m4MNXXc8UPU',
]
