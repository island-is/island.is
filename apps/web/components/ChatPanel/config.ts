import { theme } from '@island.is/island-ui/theme'
import { ChatPanelConfig } from './types'

export const ID = '246covid-island'
export const URL = 'https://246covid-island.boost.ai/chatPanel/chatPanel.js'

export const config = {
  chatPanel: {
    header: {
      title: 'test',
    },
    styling: {
      settings: {
        openTextLinksInNewTab: true,
      },
      primaryColor: theme.color.blue400,
      fontFamily: 'IBM Plex Sans',
    },
  },
} as ChatPanelConfig
