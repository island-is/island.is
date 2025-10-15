import { DefaultEvents } from '@island.is/application/types'

export enum ApiActions {
  submitApplication = 'submitApplication',
}

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  PAYMENT = 'payment',
  REVIEW = 'review',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export const UPLOAD_ACCEPT = 'pdf, .doc, .docx, .png, .jpg, .jpeg'

export const FILE_SIZE_LIMIT = 10000000 // 10MB

export enum PaymentTypeIds {
  SUPPLEMENTARY_FUND_TYPE_ID = 'db8e9763-d3b4-4365-aa15-62da6a522035', // Greiðslur frá séreignasjóð
  PENSION_FUND_TYPE_ID = '3f42d28e-0962-4ebd-b64d-6abfe1dd2350', // Greiðslur frá lífeyrissjóð
  SICKNESS_PAYMENTS_TYPE_ID = 'e960485c-e878-437a-9a68-0d6d16dbe3e7', // Greiðslur sjúkradagpeninga
  INSURANCE_PAYMENTS_TYPE_ID = '40f3f704-668c-4dd2-8a41-87657da9daef', // Greiðslur frá Tryggingastofnun
  REHAB_PENSION_ID = 'b3b47559-87c1-4ebe-a6e9-08d7e532c7e6', // Sjúkra og endurhæfingalífeyrir
  SPOUSE_PENSION = '4bf573f4-51ed-4c1f-882e-08d680850aba', // Makalífeyrir
}

export enum EmploymentStatus {
  UNEMPLOYED = 'unemployed',
  EMPLOYED = 'employed',
  PARTJOB = 'partjob',
  OCCASIONAL = 'occasional',
}

export const EmploymentStatusIds: Record<EmploymentStatus, number> = {
  [EmploymentStatus.UNEMPLOYED]: 1,
  [EmploymentStatus.EMPLOYED]: 4,
  [EmploymentStatus.PARTJOB]: 2,
  [EmploymentStatus.OCCASIONAL]: 3,
}

export enum WorkingAbility {
  ABLE = 'able',
  PARTLY_ABLE = 'partlyAble',
  DISABILITY = 'disability',
}

export enum EducationType {
  CURRENT = 'current',
  LAST_SEMESTER = 'lastSemester',
  LAST_YEAR = 'lastYear',
}
