export enum MessageTypes {
  NewDocumentMessage = 'newDocumentMessage',
  OneshotMessage = 'oneshotMessage',
  Invalid = 'invalid',
}

export interface Notification {
  messageType: MessageTypes
  title: string
  body: string
  category: MessageTypes
  appURI?: string
}
