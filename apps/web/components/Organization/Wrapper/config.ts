import { Locale } from '@island.is/shared/types'

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
