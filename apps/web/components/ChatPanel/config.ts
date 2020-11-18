import { theme } from '@island.is/island-ui/theme'
import { ChatPanelConfig } from './types'

export const ID = '246covid-island'
export const CONVERSATION_KEY = `${ID}-conversationId`
export const URL = 'https://246covid-island.boost.ai/chatPanel/chatPanel.js'

export const config = {
  chatPanel: {
    styling: {
      primaryColor: theme.color.blue400,
      fontFamily: 'IBM Plex Sans',
    },
  },
} as ChatPanelConfig
