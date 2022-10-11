export enum MessageType {
  CASE_COMPLETED = 'CASE_COMPLETED',
}

export type Message = {
  type: MessageType
  caseId: string
}
