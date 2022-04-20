export type BoostChatPanelConfig = {
  chatPanel?: {
    header?: {
      filters?: {
        filterValues?: string | string[]
        options?: {
          id: number
          title: string
          values: string[]
        }[]
        showMinimizeButton?: 'always' | 'never' | 'mobile'
        title?: string
      }
    }
    styling?: {
      avatarShape?: 'rounded' | 'squared'
      avatarUrl?: string
      fontFamily?: string
      panelShape?: 'rounded' | 'squared'
      panelBackgroundColor?: HexColor
      panelScrollbarColor?: HexColor
      contrastColor?: HexColor
      primaryColor?: HexColor
      disableVanStylingChange?: boolean
      size?: 'small' | 'medium' | 'large'
      pace?:
        | 'glacial'
        | 'slower'
        | 'slow'
        | 'normal'
        | 'fast'
        | 'faster'
        | 'supersconic'
        | number
      position?: {
        spacingBottom?: number | string
        spacingRight?: number | string
        zIndex?: number | string
      }
      chatBubbles?: {
        userBackgroundColor?: HexColor
        userTextColor?: HexColor
        typingDotColor?: HexColor
        typingBackgroundColor?: HexColor
        vaBackgroundColor?: HexColor
        vaTextColor?: HexColor
      }
      messageFeedback?: {
        focusColor?: HexColor
        selectedColor?: HexColor
        outlineColor?: HexColor
      }
      composer?: {
        hide?: boolean
        composeLengthColor?: HexColor
        composeLengthDisabledColor?: HexColor
        frameBackgroundColor?: HexColor
        sendButtonColor?: HexColor
        sendButtonDisabledColor?: HexColor
        sendButtonFocusOutlineColor?: HexColor
        textareaFocusBorderColor?: HexColor
        textareaFocusOutlineColor?: HexColor
        textareaBorderColor?: HexColor
        textareaBackgroundColor?: HexColor
        textareaTextColor?: HexColor
        textareaPlaceholderTextColor?: HexColor
        topBorderColor?: HexColor
        topBorderFocusColor?: HexColor
      }
      buttons?: {
        backgroundColor?: HexColor
        textColor?: HexColor
        variant?: ButtonType
        focusBackgroundColor?: HexColor
        focusOutlineColor?: HexColor
        focusTextColor?: HexColor
        hoverBackgroundColor?: HexColor
        hoverTextColor?: HexColor
      }
      settings?: {
        authStartTriggerActionId?: string | number
        contextTopicIntentId?: string | number
        conversationId?: string
        fieUploadServiceEndpointUrl?: string
        messageFeedbackOnFirstAction?: boolean
        openTextLinksInNewTab?: boolean
        pageUrl?: string
        requestFeedback?: boolean
        showLinkClickAsChatBubble?: boolean
        skill?: string
        startLanguage?: string
        startNewConversationOnResumeFailure?: boolean
        startTriggerActionId?: string | number
        userToken?: string | undefined | (() => string | undefined | null)
      }
    }
  }
}
