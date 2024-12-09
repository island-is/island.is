import { theme } from '@island.is/island-ui/theme'

import { BoostChatPanelConfig } from './types'

export const boostChatPanelEndpoints = {
  // Vinnumálastofnun organization
  //https://app.contentful.com/spaces/8k0h54kbe6bj/entries/co6SSvHZjUpEICpTlJT1B
  co6SSvHZjUpEICpTlJT1B: {
    id: '313vinnumalastofnun',
    conversationKey: '313vinnumalastofnun',
    url: 'https://313vinnumalastofnun.boost.ai/chatPanel/chatPanel.js',
  },
}

export const config = {
  chatPanel: {
    styling: {
      primaryColor: theme.color.blue400,
      fontFamily: 'IBM Plex Sans',
    },
  },
} as BoostChatPanelConfig
