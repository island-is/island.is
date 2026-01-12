export const REQUEST_ENDPOINTS = ['request', 'request/:fileName']
export const CASE_FILES_RECORD_ENDPOINTS = [
  'caseFilesRecord/:policeCaseNumber',
  'caseFilesRecord/:policeCaseNumber/:fileName',
  'mergedCase/:mergedCaseId/caseFilesRecord/:policeCaseNumber',
  'mergedCase/:mergedCaseId/caseFilesRecord/:policeCaseNumber/:fileName',
]
export const COURT_RECORD_ENDPOINTS = [
  'courtRecord',
  'courtRecord/:fileName',
  'mergedCase/:mergedCaseId/courtRecord',
  'mergedCase/:mergedCaseId/courtRecord/:fileName',
]
export const RULING_ENDPOINTS = ['ruling', 'ruling/:fileName']
export const CUSTODY_NOTICE_ENDPOINTS = [
  'custodyNotice',
  'custodyNotice/:fileName',
]
export const INDICTMENT_ENDPOINTS = [
  'indictment',
  'indictment/:fileName',
  'mergedCase/:mergedCaseId/indictment',
  'mergedCase/:mergedCaseId/indictment/:fileName',
]
export const SUBPOENA_ENDPOINTS = [
  'subpoena/:defendantId',
  'subpoena/:defendantId/:fileName',
  'subpoena/:defendantId/:subpoenaId',
  'subpoena/:defendantId/:subpoenaId/:fileName',
]
export const RULING_SENT_TO_PRISON_ADMIN_ENDPOINTS = [
  'rulingSentToPrisonAdmin',
  'rulingSentToPrisonAdmin/:fileName',
]
export const VERDICT_SERVICE_CERTIFICATE_ENDPOINTS = [
  'verdictServiceCertificate/:defendantId',
  'verdictServiceCertificate/:defendantId/:fileName',
]
export const SUBPOENA_SERVICE_CERTIFICATE_ENDPOINTS = [
  'subpoenaServiceCertificate/:defendantId/:subpoenaId',
  'subpoenaServiceCertificate/:defendantId/:subpoenaId/:fileName',
]
export const ALL_FILES_ENDPOINTS = 'allFiles'
