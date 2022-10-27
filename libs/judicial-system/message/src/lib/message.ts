export enum MessageType {
  CASE_CONNECTED_TO_COURT_CASE = 'CASE_CONNECTED_TO_COURT_CASE',
  CASE_COMPLETED = 'CASE_COMPLETED',
  SEND_RULING_NOTIFICAGTION = 'SEND_RULING_NOTIFICAGTION',
}

export type Message = {
  type: MessageType
  caseId: string
  numberOfRetries?: number
  nextRetry?: Date
}
