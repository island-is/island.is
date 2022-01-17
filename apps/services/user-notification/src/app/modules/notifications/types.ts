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
