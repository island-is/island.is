export enum MessageTypes {
  NewDocumentMessage = 'newDocumentMessage',
}
export interface Notification {
  title: string
  body: string
  dataCopy?: string
  category?: string
  appURI?: string
}
