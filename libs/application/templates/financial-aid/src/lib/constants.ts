import { getStaticEnv } from '@island.is/shared/utils'

export enum ApplicationStates {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  SPOUSE = 'spouse',
  PREREQUISITESSPOUSE = 'prerequisitesSpouse',
  MUNCIPALITYNOTREGISTERED = 'muncipalityNotRegistered',
}

export enum Roles {
  APPLICANT = 'applicant',
  SPOUSE = 'spouse',
}

export const ONE_MONTH = 24 * 3600 * 1000 * 31
export const ONE_DAY = 24 * 3600 * 1000

export enum Routes {
  ACCECPTCONTRACT = 'acceptContract',
  INRELATIONSHIP = 'inRelationship',
  INRELATIONSHIPMULTIFIELD = 'inRelationshipMultiField',
  UNKNOWNRELATIONSHIP = 'unknownRelationship',
  UNKNOWNRELATIONSHIPMULTIFIELD = 'unknownRelationshipMultiField',
  HOMECIRCUMSTANCES = 'homeCircumstances',
  HOMECIRCUMSTANCESMULTIFIELD = 'homeCircumstancesMultiField',
  STUDENT = 'student',
  STUDENTMULTIFIELD = 'studentMultiField',
  EMPLOYMENT = 'employment',
  EMPLOYMENTMULTIFIELD = 'employmentMultiField',
  INCOME = 'income',
  INCOMEMULTIFIELD = 'incomeMultiField',
  PERSONALTAXCREDIT = 'personalTaxCredit',
  BANKINFO = 'bankInfo',
  BANKINFOMULTIFIELD = 'bankInfoMultiField',
  CONTACTINFO = 'contactInfo',
  CONTACTINFOMULTIFIELD = 'contactInfoMultiField',
  TAXRETURNFILES = 'taxReturnFiles',
  RVKTAXRETURNFILESDESCRIPTION = 'rvkTaxReturnFilesDescription',
  RVKFINDTAXRETURNDESCRIPTION = 'rvkFindTaxReturnDescription',
  RVKFINDDIRECTTAXPAYMENTSDESCRIPTION = 'rvkFindDirectTaxPaymentsDescription',
  RVKTAXRETURNFILESALERT = 'rvkTaxReturnFilesAlert',
  RVKTAXRETURNFILES = 'rvkTaxReturnFiles',
  RVKTAXRETURNFILESMULTIFIELD = 'rvkTaxReturnFilesMultiField',
  INCOMEFILES = 'incomeFiles',
  RVKINCOMEFILES = 'rvkIncomeFiles',
  INCOMEFILESTAXSUCCESS = 'incomeFilesTaxSuccess',
  SUMMARY = 'summary',
  CONFIRMATION = 'confirmation',
  CHILDRENSCHOOLINFO = 'childrenSchoolInfo',
  CHILDRENFILES = 'childrenFiles',
  RVKCHILDRENFILES = 'rvkChildrenFiles',
  SPOUSEACCECPTCONTRACT = 'spouseAcceptContract',
  SPOUSEINCOME = 'spouseIncome',
  SPOUSEINCOMEFILES = 'spouseIncomeFiles',
  RVKSPOUSEINCOMEFILES = 'rvkSpouseIncomeFiles',
  SPOUSETAXRETURNFILES = 'spouseTaxReturnFiles',
  RVKSPOUSETAXRETURNFILES = 'rvkSpouseTaxReturnFiles',
  RVKSPOUSETAXRETURNFILESMULTIFIELD = 'rvkSpouseTaxReturnFilesMultiField',
  RVKSPOUSETAXRETURNFILESDESCRIPTION = 'rvkSpouseTaxReturnFilesDescription',
  RVKSPOUSETAXRETURNFILESALERT = 'rvkSpouseTaxReturnFilesAlert',
  RVKSPOUSEFINDTAXRETURNDESCRIPTION = 'rvkSpouseFindTaxReturnDescription',
  RVKSPOUSEFINDDIRECTTAXPAYMENTSDESCRIPTION = 'rvkSpouseFindDirectTaxPaymentsDescription',
  SPOUSECONTACTINFO = 'spouseContactInfo',
  SPOUSESUMMARY = 'spouseSummary',
  SPOUSECONFIRMATION = 'spouseConfirmation',
  MISSINGFILES = 'missingFiles',
  APPLICANTSTATUS = 'applicantStatus',
  RVKAPPLICANTSTATUS = 'rvkApplicantStatus',
  MISSINGFILESCONFIRMATION = 'missingFilesConfirmation',
  SPOUSESTATUS = 'spouseStatus',
  RVKSPOUSESTATUS = 'rvkSpouseStatus',
  SERVICECENTER = 'serviceCenter',
}

export enum ApiActions {
  CREATEAPPLICATION = 'createApplication',
  CURRENTAPPLICATION = 'currentApplication',
  MUNICIPALITY = 'municipality',
  TAXDATA = 'taxData',
  SENDSPOUSEEMAIL = 'sendSpouseEmail',
}

export const UPLOAD_ACCEPT = [
  '.pdf',
  '.doc',
  '.docx',
  '.rtf',
  '.jpg',
  '.jpeg',
  '.png',
  '.heic',
]
export const FILE_SIZE_LIMIT = 10000000 // 10MB

export const VEITA_TENANTS_ENV_VAR = 'SI_PUBLIC_FINANCIAL_AID_VEITA_TENANTS'

// Municipality code -> Veita tenant identifier, used to select the backend when
// municipality data is first fetched. Existing applications use their stored route.
// An empty map selects the municipalities backend for all new applications.
// Read in the browser and in the template api, and exposed in page source via the
// SI_PUBLIC_ prefix, so never put secrets in this value.
const readRawVeitaTenants = (): string | undefined => {
  if (typeof document !== 'undefined') {
    return getStaticEnv(VEITA_TENANTS_ENV_VAR)
  }

  return typeof process !== 'undefined'
    ? process.env[VEITA_TENANTS_ENV_VAR]
    : undefined
}

const parseVeitaTenants = (raw?: string): Record<string, string> => {
  if (!raw) {
    return {}
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Expected an object of municipality code to tenant')
    }

    // Dropping blank tenants keeps "code is present" equivalent to "tenant is usable".
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        (entry): entry is [string, string] =>
          typeof entry[1] === 'string' && entry[1].length > 0,
      ),
    )
  } catch (error) {
    console.error(`Could not parse ${VEITA_TENANTS_ENV_VAR}`, error)
    return {}
  }
}

let veitaTenants: Record<string, string> | undefined

export const getVeitaTenants = (): Record<string, string> => {
  if (!veitaTenants) {
    veitaTenants = parseVeitaTenants(readRawVeitaTenants())
  }

  return veitaTenants
}

export const getVeitaTenant = (municipalityCode?: string | null) =>
  municipalityCode ? getVeitaTenants()[municipalityCode] : undefined

export const isVeitaMunicipalityCode = (
  municipalityCode?: string | null,
): municipalityCode is string => getVeitaTenant(municipalityCode) !== undefined
