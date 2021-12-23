import { Locale } from '@island.is/shared/types'

export enum MessageTypes {
  NewDocumentMessage = 'newDocumentMessage',
}

export interface Notification {
  messageType: MessageTypes
  title: string
  body: string
  category: 'NEW_DOCUMENT'
  appURI?: string
}

// temporary mock until we can call user-profile service
export interface User {
  nationalId: string
  locale: Locale
  documentNotifications: boolean
}
