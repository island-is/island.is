import { theme } from '@island.is/island-ui/theme'
import { ChatPanelConfig } from './types'

export const defaultConfig = {
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
        composeLengthDisabledColor: theme.color.blue100,
        frameBackgroundColor: theme.color.blue100,
        hide: false,
        sendButtonColor: theme.color.blue100,
        sendButtonDisabledColor: theme.color.blue100,
        sendButtonFocusOutlineColor: theme.color.blue100,
        textareaBackgroundColor: theme.color.blue100,
        textareaBorderColor: theme.color.blue100,
        textareaFocusBorderColor: theme.color.blue100,
        textareaFocusOutlineColor: theme.color.blue100,
        textareaPlaceholderTextColor: theme.color.blue100,
        textareaTextColor: theme.color.blue100,
        topBorderColor: theme.color.blue100,
        topBorderFocusColor: theme.color.blue100,
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
        spacingBottom: 30,
        spacingRight: 30,
        zIndex: 1,
      },
      size: 'medium',
      panelScrollbarColor: theme.color.roseTinted400,
      fontFamily: 'IBM Plex Sans',
    },
  },
} as ChatPanelConfig
