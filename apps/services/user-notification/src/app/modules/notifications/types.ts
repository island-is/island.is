export enum MessageTypes {

  NewDocumentMessage = 'newDocumentMessage',
  TestMessage = 'testMessage',
}
export interface Notification {
  messageType: string // phase out messagetypes
  title: string
  body: string
  dataCopy?: string
  category?: string //'NEW_DOCUMENT'
  appURI?: string
}
