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

  export const listPlain = 'listPlain'
  export const listRadio = 'listRadio'

  export function showPicker(
    title: Title,
    message: Content,
    options: Record<string, unknown>,
  ): Promise<{ action: string; selectedItem?: ListItem }>
}

declare module '@island.is/application/types/lib/ApplicationTypes' {
  export const ApplicationConfigurations: Record<string, any>
}
