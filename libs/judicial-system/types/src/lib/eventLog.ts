export enum EventType {
  APPEAL_RESULT_ACCESSED = 'APPEAL_RESULT_ACCESSED',
  LOGIN = 'LOGIN',
  LOGIN_UNAUTHORIZED = 'LOGIN_UNAUTHORIZED',
  LOGIN_BYPASS = 'LOGIN_BYPASS',
  LOGIN_BYPASS_UNAUTHORIZED = 'LOGIN_BYPASS_UNAUTHORIZED',
}

export interface EventLog {
  id: string
  created: string
  caseId?: string
  eventType: EventType
  nationalId?: string
  userRole?: string
}
