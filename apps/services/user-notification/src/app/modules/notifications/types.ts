export enum MessageTypes {
  NewDocumentMessage = 'newDocumentMessage',
  TestMessage = 'testMessage',
}

export interface Notification {
  messageType: MessageTypes
  title: string
  body: string
  category?: string //'NEW_DOCUMENT'
  appURI?: string
}
