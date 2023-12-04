declare module '*.png' {
  const value: any
  export = value
}

declare module '*.jpg' {
  const value: any
  export = value
}

declare module 'react-native-passkit-wallet'
declare module 'react-native-dialogs'
declare module '@island.is/application/types/lib/ApplicationTypes' {
  export const ApplicationConfigurations: Record<string, any>
}
