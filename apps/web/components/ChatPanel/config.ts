import { theme } from '@island.is/island-ui/theme'
import { ChatPanelConfig } from './types'

export const ID = '246covid-island-chat-panel'

export const URL = 'https://246covid-island.boost.ai/chatPanel/chatPanel.js'

export const config = {
  chatPanel: {
    header: {
      title: 'test',
    },
    styling: {
      buttons: {
        backgroundColor: theme.color.blue400,
      },
      primaryColor: theme.color.blue400,
      panelBackgroundColor: theme.color.blue100,
      avatarShape: 'rounded',
      composer: {
        composeLengthColor: theme.color.blue100,
        composeLengthDisabledColor: theme.color.blue200,
        frameBackgroundColor: theme.color.blue300,
        hide: false,
        sendButtonColor: theme.color.blue400,
        sendButtonDisabledColor: theme.color.blue600,
        sendButtonFocusOutlineColor: theme.color.purple100,
        textareaBackgroundColor: theme.color.purple200,
        textareaBorderColor: theme.color.purple300,
        textareaFocusBorderColor: theme.color.purple400,
        textareaFocusOutlineColor: theme.color.mint400,
        textareaPlaceholderTextColor: theme.color.red100,
        textareaTextColor: theme.color.red200,
        topBorderColor: theme.color.red300,
        topBorderFocusColor: theme.color.red400,
      },
      chatBubbles: {
        typingBackgroundColor: theme.color.blue100,
        userBackgroundColor: theme.color.purple100,
        typingDotColor: theme.color.purple100,
        userTextColor: theme.color.red400,
        vaBackgroundColor: theme.color.mint100,
        vaTextColor: theme.color.purple600,
      },
      disableVanStylingChange: false,
      contrastColor: theme.color.dark100,
      messageFeedback: {
        focusColor: theme.color.mint100,
        outlineColor: theme.color.mint300,
        selectedColor: theme.color.purple300,
      },
      pace: 'normal',
      panelShape: 'rounded',
      position: {
        spacingBottom: 0,
        spacingRight: theme.spacing[3],
        zIndex: 1,
      },
      size: 'medium',
      panelScrollbarColor: theme.color.roseTinted400,
      fontFamily: 'IBM Plex Sans',
    },
  },
} as ChatPanelConfig
