import { YesOrNo } from '@island.is/application/core'

export enum EmploymentStatus {
  UNEMPLOYED = 'unemployed',
  EMPLOYED = 'employed',
  PARTJOB = 'partjob',
  OCCASIONAL = 'occasional',
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

export interface ChildrenInAnswers {
  name: string
  nationalId: string
}

export interface PreviousJobInAnswers {
  company: {
    nationalId: string
    name: string
  }
  title: string
  percentage: number
  startDate: string
  endDate: string
}

export interface VacationDaysInAnswers {
  startDate: string
  endDate: string
}

export interface PaymentsFromPensionInAnswers {
  paymentAmount: string
  typeOfPayment: string
}

export interface PaymentsFromPrivatePensionInAnswers {
  privatePensionFund: string
  paymentAmount: string
}

export interface CapitalIncomeInAnswers {
  amount: string
}

export interface PaymentsFromSicknessAllowanceInAnswers {
  dateFrom: string
  dateTo: string
  union: string
  file: Array<string>
}

export interface EducationHistoryInAnswers {
  degree: string
  levelOfStudy: string
  courseOfStudy?: string
  studyNotCompleted: Array<YesOrNo>
}

export interface LanguagesInAnswers {
  language: string
  skill: string
}

export interface FileInAnswers {
  key: string
  name: string
}
