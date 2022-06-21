export enum MessageType {
  CASE_COMPLETED = 'CASE_COMPLETED',
}

export type Message = {
  type: MessageType
}

export type CaseCompletedMessage = Message & {
  caseId: string
}
