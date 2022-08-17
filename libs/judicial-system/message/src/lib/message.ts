export enum MessageType {
  CASE_COMPLETED = 'CASE_COMPLETED',
  RULING_SIGNED = 'RULING_SIGNED',
}

export type Message = {
  type: MessageType
  caseId: string
}
