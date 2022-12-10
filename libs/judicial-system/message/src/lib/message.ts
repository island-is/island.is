export enum MessageType {
  CASE_COMPLETED = 'CASE_COMPLETED',
  DELIVER_DEFENDANT_TO_COURT = 'DELIVER_DEFENDANT_TO_COURT',
  DELIVER_CASE_FILE_TO_COURT = 'DELIVER_CASE_FILE_TO_COURT',
  DELIVER_CASE_FILES_RECORD_TO_COURT = 'DELIVER_CASE_FILES_RECORD_TO_COURT',
  DELIVER_REQUEST_TO_COURT = 'DELIVER_REQUEST_TO_COURT',
  DELIVER_COURT_RECORD_TO_COURT = 'DELIVER_COURT_RECORD_TO_COURT',
  DELIVER_SIGNED_RULING_TO_COURT = 'DELIVER_SIGNED_RULING_TO_COURT',
  SEND_RULING_NOTIFICATION = 'SEND_RULING_NOTIFICATION',
}

export type CaseMessage = {
  type: MessageType
  caseId: string
  numberOfRetries?: number
  nextRetry?: number
}

export type DefendantMessage = CaseMessage & {
  defendantId: string
  userId: string
}

export type CaseFileMessage = CaseMessage & { caseFileId: string }

export type PoliceCaseMessage = CaseMessage & { policeCaseNumber: string }
