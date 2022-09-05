export enum MessageType {
  RULING_SIGNED = 'RULING_SIGNED',
}

export type Message = {
  type: MessageType
  caseId: string
}
