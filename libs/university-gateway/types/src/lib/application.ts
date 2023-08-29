import { ModeOfDelivery } from './program'

export function universityGatewayTypes(): string {
  return 'university-gateway-types'
}

export enum ApplicationStatus {
  IN_REVIEW = 'IN_REVIEW',
  IN_PROGRESS = 'IN_PROGRESS',
  ACCEPTED_BY_UNIVERSITY = 'ACCEPTED_BY_UNIVERSITY',
  ACCEPTED_BY_UNIVERSITY_AND_STUDENT = 'ACCEPTED_BY_UNIVERSITY_AND_STUDENT',
  REJECTED_BY_STUDENT_REASON_CANCELLED = 'REJECTED_BY_STUDENT_REASON_CANCELLED',
  REJECTED_BY_STUDENT_REASON_OTHER_ACCEPTED = 'REJECTED_BY_STUDENT_REASON_OTHER_ACCEPTED',
  REJECTED_BY_UNIVERSITY_REASON_INSUFFICIENT = 'REJECTED_BY_UNIVERSITY_REASON_INSUFFICIENT',
  REJECTED_BY_UNIVERSITY_REASON_NO_AVAILABILITY = 'REJECTED_BY_UNIVERSITY_REASON_NO_AVAILABILITY',
  CANCELLED_BY_STUDENT = 'PAYMENT_COMPLETE',
}

export type Application = {
  id: string
  nationalId: string
  universityId: string
  programId: string
  modeOfDelivery: ModeOfDelivery
  status: ApplicationStatus
  created: Date
  modified: Date
  data: Application
}
