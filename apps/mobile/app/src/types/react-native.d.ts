declare module '*.png' {
  const value: any
  export = value
}

declare module '*.jpg' {
  const value: any
  export = value
}

declare module 'react-native-passkit-wallet'

declare module 'react-native-dialogs' {
  export const DialogAndroid: any

  type Title = void | null | string
  type Content = void | null | string
  type ListItem = { label: string; id?: any }

  type OptionsCommon = {
    title?: null | string
    titleColor?: ColorValue
    content?: null | string
    contentIsHtml?: boolean
    contentColor?: string
    positiveText?: string
    negativeText?: string
    neutralText?: string
    positiveColor?: ColorValue
    negativeColor?: ColorValue
    neutralColor?: ColorValue
    backgroundColor?: ColorValue
    cancelable?: boolean
    linkColor?: ColorValue
    forceStacking?: boolean
    checkboxLabel?: string
    checkboxDefaultValue?: boolean
  }

  type OptionsPrompt = OptionsCommon & {
    keyboardType?:
      | 'numeric'
      | 'number-pad'
      | 'decimal-pad'
      | 'numeric-password'
      | 'email-address'
      | 'password'
      | 'phone-pad'
      | 'url'
    defaultValue?: string
    placeholder?: string
    allowEmptyInput?: boolean
    minLength?: number
    maxLength?: number
    widgetColor?: ColorValue
  }

  type PromptResponse =
    | {
        action: 'negative' | 'neutral' | 'dismiss'
      }
    | {
        action: 'negative' | 'neutral'
        checked: boolean
      }
    | { action: 'positive'; text: string }
    | {
        action: 'positive'
        text: string
        checked: boolean
      }

  export const listPlain = 'listPlain'
  export const listRadio = 'listRadio'

  export function showPicker(
    title: Title,
    message: Content,
    options: Record<string, unknown>,
  ): Promise<{ action: string; selectedItem?: ListItem }>

  export function prompt(
    title: Title,
    message: Content,
    options: OptionsPrompt,
  ): Promise<PromptResponse>
}

declare module '@island.is/application/types/lib/ApplicationTypes' {
  export const ApplicationConfigurations: Record<string, any>
}
