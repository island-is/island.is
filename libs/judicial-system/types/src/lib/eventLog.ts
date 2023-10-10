export enum EventType {
  APPEAL_RESULT_ACCESSED = 'APPEAL_RESULT_ACCESSED',
}

export interface EventLog {
  id: string
  created: string
  caseId?: string
  eventType: EventType
  nationalId?: string
  userRole?: string
}
