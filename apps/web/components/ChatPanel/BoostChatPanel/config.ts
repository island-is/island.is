import { theme } from '@island.is/island-ui/theme'
import { BoostChatPanelConfig } from './types'

export const boostChatPanelEndpoints = {
  // Sýslumenn organization
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/kENblMMMvZ3DlyXw1dwxQ
  kENblMMMvZ3DlyXw1dwxQ: {
    id: 'syslumenn',
    conversationKey: 'syslumenn',
    url: 'https://syslumenn.boost.ai/chatPanel/chatPanel.js',
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
