export enum MessageTypes {
  NewDocumentMessage = 'newDocumentMessage',
}
export interface Notification {
  title: string
  externalBody: string
  internalBody?: string
  appURI?: string
}
