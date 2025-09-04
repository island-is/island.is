import {
  ApplicantApi,
  ApplicationApi,
  DocumentsApi,
  GeneralApi,
  IncomePlanApi,
  PaymentPlanApi,
  PensionCalculatorApi,
  DeathBenefitsApi,
  TestApi,
  MedicalDocumentsApi,
  QuestionnairesApi,
} from '../../gen/fetch'

export type Scope =
  | '@tr.is/umsaekjandi:read'
  | '@tr.is/umsoknir:read'
  | '@tr.is/umsoknir:write'
  | '@tr.is/stadgreidsla:read'
  | '@tr.is/tekjuaetlun:read'
  | '@tr.is/greidsluaetlun:read'
  | '@tr.is/almennt:read'
  | '@tr.is/fylgiskjol:write'
  | '@tr.is/danarbaetur:read'
  | '@tr.is/sjukraogendurhaefingargreidslur:read'

export type Api =
  | typeof ApplicationApi
  | typeof ApplicationWriteApi
  | typeof ApplicantApi
  | typeof DocumentsApi
  | typeof GeneralApi
  | typeof IncomePlanApi
  | typeof PaymentPlanApi
  | typeof PensionCalculatorApi
  | typeof DeathBenefitsApi
  | typeof TestApi
  | typeof MedicalDocumentsApi
  | typeof QuestionnairesApi

export class ApplicationWriteApi extends ApplicationApi {}

export interface Period {
  year: number
  month: number
}

export interface DomesticBankInfo {
  bank: string
}

export interface ForeignBankInfo {
  iban: string
  swift: string
  foreignBankName: string
  foreignBankAddress: string
  foreignCurrency: string
}

export interface TaxInfo {
  personalAllowance: boolean
  personalAllowanceUsage?: number
  taxLevel: number
}

export interface ApplicantInfo {
  email: string
  phonenumber: string
}

export interface Employer {
  email: string
  phoneNumber?: string
  ratio: number
  ratioMonthly?: Months
}

export interface SpouseTaxCardUsage {
  usecard: boolean
  ratio: number
}

export interface Months {
  january?: number
  february?: number
  march?: number
  april?: number
  may?: number
  june?: number
  july?: number
  august?: number
  september?: number
  october?: number
  november?: number
  december?: number
}

export interface IncomePlanInfo {
  incomeYear: number
  distributeIncomeByMonth: boolean
  incomeTypes: Array<IncomeTypes>
}

export interface IncomeTypes {
  incomeTypeNumber: number
  incomeTypeCode: string
  incomeTypeName: string
  currencyCode: string
  incomeCategoryNumber: number
  incomeCategoryCode: string
  incomeCategoryName: string
  amountJan: number
  amountFeb: number
  amountMar: number
  amountApr: number
  amountMay: number
  amountJun: number
  amountJul: number
  amountAug: number
  amountSep: number
  amountOct: number
  amountNov: number
  amountDec: number
}

export enum DocumentTypeEnum {
  PENSION = 'pension',
  OTHER = 'other',
  RETIREMENT = 'retirement',
  SAILOR = 'sailor',
  SELF_EMPLOYED = 'selfEmployed',
  SCHOOL_CONFIRMATION = 'schoolConfirmation',
  ASSISTED_CARE_AT_HOME = 'assistedCareAtHome',
  PURCHASE_OF_HEARING_AIDS = 'purchaseOfHearingAids',
  ASSISTED_LIVING = 'assistedLiving',
  HALFWAY_HOUSE = 'halfwayHouse',
  HOUSE_RENT_AGREEMENT = 'houseRentAgreement',
  HOUSE_RENT_ALLOWANCE = 'houseRentAllowance',
  EXPECTING_CHILD = 'expectingChild',
  DEATH_CERTIFICATE = 'deathCertificate',
}

export type IncomePlanStatus = 'Accepted' | 'Cancelled' | 'InProgress'

export interface ForeignPayment {
  countryName: string
  countryCode: string
  foreignNationalId: string
}

export interface Occupation {
  isSelfEmployed?: boolean
  isStudying: boolean
  educationalInstitution?: string
  isPartTimeEmployed: boolean
  calculatedRemunerationDate?: string
  currentSemesterEcts?: string
  receivesForeignPayments?: boolean
  foreignPayments?: ForeignPayment[]
}

export interface EmployeeSickPay {
  hasUtilizedEmployeeSickPayRights: number | null
  employeeSickPayEndDate?: string
}

export interface UnionSickPay {
  hasUtilizedUnionSickPayRights: number | null
  unionNationalId?: string
  unionName?: string
  unionSickPayEndDate?: string
}

export interface Answer {
  questionId: string
  answer: string | null
}
export interface SelfAssessment {
  hadAssistance: boolean
  answers: Answer[]
}

export interface PreQuestionnaire {
  highestEducation: string
  currentEmploymentStatus: string // TODO: Smári needs to change to an array
  currentEmploymentStatusExplanation?: string
  lastJobTitle?: string
  lastJobYear?: number
  disabilityReason: string
  hasParticipatedInRehabilitationBefore: boolean
  rehabilitationDetails?: string
  previousRehabilitationSuccessful?: boolean
  additionalRehabilitationInformation?: string
}
