import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.ABORT
    | DefaultEvents.APPROVE
    | DefaultEvents.REJECT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
  PENDING_SCHOOL = 'pendingSchool',
  PENDING_STUDENT = 'pendingStudent',
  SCHOOL_REJECTED = 'schoolRejected',
  STUDENT_REJECTED = 'studentRejected',
}

export enum Roles {
  APPLICANT = 'applicant',
  UNIVERSITY_GATEWAY = 'universityGateway',
}

export enum Routes {
  USERINFORMATION = 'userInformation',
  PROGRAMINFORMATION = 'programInformation',
  MODEOFDELIVERYINFORMATION = 'modeOfDeliveryInformation',
  EDUCATIONDETAILS = 'educationDetails',
  EDUCATIONDETAILSFINISHED = 'educationDetails.finishedDetails',
  EDUCATIONDETAILSEXEMPTION = 'educationDetails.exemptionDetails',
  EDUCATIONDETAILSTHIRDLEVEL = 'educationDetails.thirdLevelDetails',
  EDUCATIONDETAILSNOTFINISHED = 'educationDetails.notFinishedDetails',
  EDUCATIONOPTIONS = 'educationOptions',
  OTHERDOCUMENTS = 'otherDocuments',
}
