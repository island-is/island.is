import { Locale } from 'locale'
import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
} from '../../ChatPanel'

export const liveChatIncConfig: Record<
  Locale,
  Record<string, LiveChatIncChatPanelProps>
> = {
  is: {
    // HSN - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/EM4Y0gF4OoGhH9ZY0Dxl6
    EM4Y0gF4OoGhH9ZY0Dxl6: {
      license: 15092154,
      version: '2.0',
    },
    // HSU - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1UDhUhE8pzwnl0UxuzRUMk
    '1UDhUhE8pzwnl0UxuzRUMk': {
      license: 15092154,
      version: '2.0',
    },
    // HVE - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/Un4jJk0rPybt9fu8gk94m
    Un4jJk0rPybt9fu8gk94m: {
      license: 15092154,
      version: '2.0',
    },
    // Samgöngustofa - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6IZT17s7stKJAmtPutjpD7
    '6IZT17s7stKJAmtPutjpD7': {
      license: 13270509,
      version: '2.0',
    },
  },
  en: {
    // HSN - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/EM4Y0gF4OoGhH9ZY0Dxl6
    EM4Y0gF4OoGhH9ZY0Dxl6: {
      license: 15092154,
      version: '2.0',
    },
    // HSU - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1UDhUhE8pzwnl0UxuzRUMk
    '1UDhUhE8pzwnl0UxuzRUMk': {
      license: 15092154,
      version: '2.0',
    },
    // HVE - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/Un4jJk0rPybt9fu8gk94m
    Un4jJk0rPybt9fu8gk94m: {
      license: 15092154,
      version: '2.0',
    },
    // Samgöngustofa - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6IZT17s7stKJAmtPutjpD7
    '6IZT17s7stKJAmtPutjpD7': {
      license: 13270509,
      version: '2.0',
      group: 1,
    },
  },
}

export const watsonConfig: Record<
  Locale,
  Record<string, WatsonChatPanelProps>
> = {
  en: {
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
  },
  is: {
    // District Commissioners (Sýslumenn) - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/kENblMMMvZ3DlyXw1dwxQ
    kENblMMMvZ3DlyXw1dwxQ: {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: () => {
        if (sessionStorage.getItem('0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f')) {
          sessionStorage.clear()
        }
      },
    },

    // Digital Iceland (Stafrænt Ísland) - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1JHJe1NDwbBjEr7OVdjuFD
    '1JHJe1NDwbBjEr7OVdjuFD': {
      integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: () => {
        if (sessionStorage.getItem('b1a80e76-da12-4333-8872-936b08246eaa')) {
          sessionStorage.clear()
        }
      },
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
  },
}
