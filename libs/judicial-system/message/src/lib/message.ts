export enum MessageType {
  CASE_CONNECTED_TO_COURT_CASE = 'CASE_CONNECTED_TO_COURT_CASE',
  CASE_COMPLETED = 'CASE_COMPLETED',
  DELIVER_CASE_FILE_TO_COURT = 'DELIVER_CASE_FILE_TO_COURT',
  DELIVER_COURT_RECORD_TO_COURT = 'DELIVER_COURT_RECORD_TO_COURT',
  DELIVER_SIGNED_RULING_TO_COURT = 'DELIVER_SIGNED_RULING_TO_COURT',
  SEND_RULING_NOTIFICATION = 'SEND_RULING_NOTIFICATION',
}

export type Message = {
  type: MessageType
  caseId: string
  numberOfRetries?: number
  nextRetry?: number
}

export type CaseFileMessage = Message & { caseFileId: string }
