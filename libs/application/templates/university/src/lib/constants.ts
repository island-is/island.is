import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT | DefaultEvents.ABORT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
  PENDING_SCHOOL = 'pendingSchool',
  PENDING_STUDENT = 'pendingStudent',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum Routes {
  USERINFORMATION = 'userInformation',
  PROGRAMINFORMATION = 'programInformation',
  MODEOFDELIVERYINFORMATION = 'modeOfDeliveryInformation',
  EDUCATIONDETAILS = 'educationDetails',
  EDUCATIONOPTIONS = 'educationOptions',
  OTHERDOCUMENTS = 'otherDocuments',
}
