export enum MessageType {
  CASE_CONNECTED_TO_COURT_CASE = 'CASE_CONNECTED_TO_COURT_CASE',
  CASE_COMPLETED = 'CASE_COMPLETED',
}

export type Message = {
  type: MessageType
  caseId: string
  numberOfRetries?: number
  nextRetry?: Date
}
