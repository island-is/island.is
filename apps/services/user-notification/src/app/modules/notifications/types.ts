export enum MessageTypes {
  NewDocumentMessage = 'newDocumentMessage',
  OneshotMessage = 'oneshotMessage',
}

export interface Notification {
  messageType: MessageTypes
  title: string
  body: string
  category: MessageTypes
  appURI?: string
}
