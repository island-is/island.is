export enum MessageTypes {
  NewDocumentMessage = 'newDocumentMessage',
}

export interface Notification {
  messageType: MessageTypes
  title: string
  body: string
  category: string //'NEW_DOCUMENT'
  appURI?: string
}
