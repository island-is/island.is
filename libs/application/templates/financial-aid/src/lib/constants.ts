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
  UNKNOWNRELATIONSHIP = 'unknownRelationship',
  HOMECIRCUMSTANCES = 'homeCircumstances',
  STUDENT = 'student',
  EMPLOYMENT = 'employment',
  INCOME = 'income',
  PERSONALTAXCREDIT = 'personalTaxCredit',
  BANKINFO = 'bankInfo',
  CONTACTINFO = 'contactInfo',
  TAXRETURNFILES = 'taxReturnFiles',
  INCOMEFILES = 'incomeFiles',
  SUMMARY = 'summary',
  CONFIRMATION = 'confirmation',
  SPOUSEACCECPTCONTRACT = 'spouseAcceptContract',
  SPOUSEINCOME = 'spouseIncome',
  SPOUSEINCOMEFILES = 'spouseIncomeFiles',
  SPOUSETAXRETURNFILES = 'spouseTaxReturnFiles',
  SPOUSECONTACTINFO = 'spouseContactInfo',
  SPOUSESUMMARY = 'spouseSummary',
  SPOUSECONFIRMATION = 'spouseConfirmation',
  MISSINGFILES = 'missingFiles',
  APPLICANTSTATUS = 'applicantStatus',
  MISSINGFILESCONFIRMATION = 'missingFilesConfirmation',
  SPOUSESTATUS = 'spouseStatus',
  SERVICECENTER = 'serviceCenter',
}

export enum ApiActions {
  CREATEAPPLICATION = 'createApplication',
}
