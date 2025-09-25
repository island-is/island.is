import { YesOrNo } from '@island.is/application/core'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { PaymentInfo as CorePaymentInfo } from '@island.is/application/templates/social-insurance-administration-core/types'

export interface EducationLevels {
  code: string
  description: string
}

export interface Country {
  country: string
  countryDisplay: string
  abroadNationalId: string
}

export interface SchemaPaymentInfo
  extends Omit<
    CorePaymentInfo,
    'bank' | 'bankNumber' | 'ledger' | 'accountNumber'
  > {
  bankAccountType: BankAccountType
  bank?: {
    ledger: string
    accountNumber: string
    bankNumber: string
  }
  iban?: string
  swift?: string
  bankName?: string
  bankAddress?: string
  currency?: string
}

export interface PreviousEmployment {
  hasEmployment: YesOrNo
  when: string
  job: string
  jobOther?: string
  field: string
  fieldOther?: string
}

export interface SelfAssessmentQuestionnaireAnswers {
  answer: number
  id: string
}

export interface LivedAbroad {
  country: string
  countryDisplay: string
  abroadNationalId?: string
  periodStart: string
  periodEnd: string
}

export interface EmploymentStatusResponse {
  languageCode: string
  employmentStatuses: EmploymentStatusItem[]
}

export interface EmploymentStatusItem {
  value: number
  displayName: string
}

export interface Language {
  code: string
  nameEn: string
  nameIs: string
}

export interface SelfAssessmentQuestionnaire {
  questionnaireName: string
  questionnaireCode: string
  versionNumber: string
  scale: Array<{
    value: number
    display: string
    order: number
  }>
  questions: SelfAssessmentQuestion[]
  language: string
}

export interface CountryValue {
  label: string
  value: string
}

export interface SelfAssessmentQuestion {
  questionCode: string
  questionTitle: string
  explanationText: string
  question: string
  icfCode: string
}
