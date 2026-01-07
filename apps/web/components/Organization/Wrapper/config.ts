import { Locale } from '@island.is/shared/types'

import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
} from '../../ChatPanel'

export const zendeskConfig: Record<
  Locale,
  Record<string, { snippetUrl: string }>
> = {
  is: {
    // Samgöngustofa - Organization
    '6IZT17s7stKJAmtPutjpD7': {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=6b9864d4-1892-4ea0-8d29-b609d7c53542',
    },
    // Sjúkratryggingar - Organization
    '3pZwAagW0UY26giHaxHthe': {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=9989d2fe-0b2e-40a8-bc4e-33e5e4c07359',
    },
    // Útlendingastofnun - Organization
    '77rXck3sISbMsUv7BO1PG2': {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=34869229-7aad-4b2f-90b2-f2984fdd14dc',
    },
    // Sýslumenn - Organization
    kENblMMMvZ3DlyXw1dwxQ: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=dc0c86b4-a02a-45e9-85d5-0aa570708ad9',
    },
    // Skatturinn - Organization
    '4yJlHgCMTqpgRSj4p6LuBQ': {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=f12bfedb-fc2c-477d-8f28-b31a036fba35',
    },
  },
  en: {
    // Samgöngustofa - Organization
    '6IZT17s7stKJAmtPutjpD7': {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=6b9864d4-1892-4ea0-8d29-b609d7c53542',
    },
    // Sjúkratryggingar - Organization
    '3pZwAagW0UY26giHaxHthe': {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=9989d2fe-0b2e-40a8-bc4e-33e5e4c07359',
    },
    // Útlendingastofnun - Organization
    '77rXck3sISbMsUv7BO1PG2': {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=34869229-7aad-4b2f-90b2-f2984fdd14dc',
    },
    // Sýslumenn - Organization
    kENblMMMvZ3DlyXw1dwxQ: {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=dc0c86b4-a02a-45e9-85d5-0aa570708ad9',
    },
    // Skatturinn - Organization
    '4yJlHgCMTqpgRSj4p6LuBQ': {
      snippetUrl:
        'https://static.zdassets.com/ekr/snippet.js?key=f12bfedb-fc2c-477d-8f28-b31a036fba35',
    },
  },
}

export const liveChatIncConfig: Record<
  Locale,
  Record<string, LiveChatIncChatPanelProps>
> = {
  is: {
    // HSN - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/EM4Y0gF4OoGhH9ZY0Dxl6
    EM4Y0gF4OoGhH9ZY0Dxl6: {
      license: '15092154',
      version: '2.0',
    },
    // HSU - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1UDhUhE8pzwnl0UxuzRUMk
    '1UDhUhE8pzwnl0UxuzRUMk': {
      license: '15092154',
      version: '2.0',
    },
    // HVE - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/Un4jJk0rPybt9fu8gk94m
    Un4jJk0rPybt9fu8gk94m: {
      license: '15092154',
      version: '2.0',
    },
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
    // HSN - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/EM4Y0gF4OoGhH9ZY0Dxl6
    EM4Y0gF4OoGhH9ZY0Dxl6: {
      license: '15092154',
      version: '2.0',
    },
    // HSU - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1UDhUhE8pzwnl0UxuzRUMk
    '1UDhUhE8pzwnl0UxuzRUMk': {
      license: '15092154',
      version: '2.0',
    },
    // HVE - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/Un4jJk0rPybt9fu8gk94m
    Un4jJk0rPybt9fu8gk94m: {
      license: '15092154',
      version: '2.0',
    },

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

export const watsonConfig: Record<
  Locale,
  Record<string, WatsonChatPanelProps>
> = {
  en: {},
  is: {
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
  },
}
