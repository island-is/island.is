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

export const UPLOAD_ACCEPT = '.pdf, .doc, .docx, .png, .jpg, .jpeg'

export const FILE_SIZE_LIMIT = 10000000 // 10MB

export enum PaymentTypeIds {
  SUPPLEMENTARY_FUND_TYPE_ID = 'db8e9763-d3b4-4365-aa15-62da6a522035', // Greiðslur frá séreignasjóð
  PENSION_FUND_TYPE_ID = '3f42d28e-0962-4ebd-b64d-6abfe1dd2350', // Greiðslur frá lífeyrissjóð
  SICKNESS_PAYMENTS_TYPE_ID = 'CA2BB626-F1DD-49AE-A541-08DE07DD3794', // Greiðslur sjúkradagpeninga
  INSURANCE_PAYMENTS_TYPE_ID = '40f3f704-668c-4dd2-8a41-87657da9daef', // Greiðslur frá Tryggingastofnun
  REHAB_PENSION_ID = 'b3b47559-87c1-4ebe-a6e9-08d7e532c7e6', // Sjúkra og endurhæfingalífeyrir
  SPOUSE_PENSION = '4bf573f4-51ed-4c1f-882e-08d680850aba', // Makalífeyrir
  CAPITAL_GAINT = 'B84E57B2-3D8F-45B7-8831-08D680850ABA', // Fjármagnstekjuskattur
}

export enum LanguageIds {
  ICELANDIC = 'a18e3090-6afb-4afb-a055-1f83bbe498e3',
  ENGLISH = '6d3edede-8951-4621-a835-e04323300fa0',
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

export enum WorkingAbilityIds {
  ABLE = '6f0ffdff-0329-468e-363e-08d6805d9266',
  PARTLY_ABLE = 'e8dbad24-f687-412d-363f-08d6805d9266',
  DISABILITY = '1e1ce6c2-2385-409e-3640-08d6805d9266',
}

export enum EducationType {
  CURRENT = 'current',
  LAST_SEMESTER = 'lastSemester',
  LAST_YEAR = 'lastYear',
}
