import * as faker from 'faker'
import { MessageDescriptor } from 'react-intl'

type RecordObject<T = unknown> = Record<string, T>

type StaticTextObject = MessageDescriptor & {
  values?: RecordObject<any>
}

type StaticText = StaticTextObject | string

type ActionCardTag = 'red' | 'blueberry' | 'blue'

interface ActionCardMetaData {
  title?: string
  description?: string
  tag?: {
    label?: string
    variant?: ActionCardTag
  }
}

type Answer = string | number | boolean | Answer[] | FormValue

interface FormValue {
  [key: string]: Answer
}

interface DataProviderResult {
  data?: object | string | boolean | number
  date: Date
  reason?: StaticText
  status: 'failure' | 'success'
  statusCode?: number
}

interface ExternalData {
  [key: string]: DataProviderResult
}

interface ApplicationWithAttachments extends Application {
  attachments: object
}

interface Application {
  id: string
  state: string
  actionCard?: ActionCardMetaData
  applicant: string
  assignees: string[]
  typeId: ApplicationTypes
  modified: Date
  created: Date
  answers: FormValue
  externalData: ExternalData
  name?: string
  institution?: string
  progress?: number
  status: ApplicationStatus
}

enum ApplicationTypes {
  EXAMPLE = 'ExampleForm',
  PASSPORT = 'Passport',
  DRIVING_LICENSE = 'DrivingLicense',
  DRIVING_ASSESSMENT_APPROVAL = 'DrivingAssessmentApproval',
  PARENTAL_LEAVE = 'ParentalLeave',
  DOCUMENT_PROVIDER_ONBOARDING = 'DocumentProviderOnboarding',
  HEALTH_INSURANCE = 'HealthInsurance',
  CHILDREN_RESIDENCE_CHANGE = 'ChildrenResidenceChange',
  DATA_PROTECTION_AUTHORITY_COMPLAINT = 'DataProtectionAuthorityComplaint',
  LOGIN_SERVICE = 'LoginService',
  INSTITUTION_COLLABORATION = 'InstitutionCollaboration',
  FUNDING_GOVERNMENT_PROJECTS = 'FundingGovernmentProjects',
  PUBLIC_DEBT_PAYMENT_PLAN = 'PublicDebtPaymentPlan',
  COMPLAINTS_TO_ALTHINGI_OMBUDSMAN = 'ComplaintsToAlthingiOmbudsman',
  ACCIDENT_NOTIFICATION = 'AccidentNotification',
  GENERAL_PETITION = 'GeneralPetitionService',
  P_SIGN = 'PSign',
  CRIMINAL_RECORD = 'CriminalRecord',
  EXAMPLE_PAYMENT = 'ExamplePayment',
  MORTGAGE_CERTIFICATE = 'MortgageCertificate',
}

enum ApplicationStatus {
  IN_PROGRESS = 'inprogress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export const createApplication = (
  overrides?: Partial<ApplicationWithAttachments>,
): Application => ({
  applicant: faker.helpers.replaceSymbolWithNumber('##########'),
  answers: {},
  assignees: [],
  attachments: {},
  created: new Date(),
  modified: new Date(),
  externalData: {},
  id: faker.random.word(),
  state: 'DRAFT',
  typeId: ApplicationTypes.EXAMPLE,
  name: '',
  status: ApplicationStatus.IN_PROGRESS,
  ...overrides,
})
