export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const UPLOAD_ACCEPT = '.pdf'

export const FILE_SIZE_LIMIT = 10000000

export const VERDSKRA_LINK =
  'https://www.stjornartidindi.is/PdfVersions.aspx?recordId=0f574646-eb9d-430b-bbe7-936e7c9389a0'

export enum Routes {
  PREREQUISITES = 'prerequisites',
  NEW_CASE = 'newCase',
  ADDITIONS_AND_DOCUMENTS = 'additionsAndDocuments',
  PREVIEW = 'preview',
  ORIGINAL_DATA = 'originalData',
  PUBLISHING_PREFERENCES = 'publishingPreferences',
  SUMMARY = 'summary',
  COMPLETE = '/complete',
}

// this will be replaced with correct values once the api is ready
export const REGLUGERDIR_ID = '2'
export const GJALDSKRA_ID = '0'
export const SKIPULAGSSKRA_ID = '3'
export const UNDIRSKRIFT_RADHERRA_ID = '2'

export const Ministries = [
  'forsætisráðuneytið',
  'dómsmálaráðuneytið',
  'félags- og vinnumarksráðuneytið',
  'fjármála- og efnahagsráðuneytið',
  'háskóla-, iðnaðar- og nýsköpunarráðuneytið',
  'heilbrigðisráðuneytið',
  'innviðaráðuneytið',
  'matvælaráðuneytið',
  'menningar- og viðskiptaráðuneytið',
  'mennta- og barnamálaráðuneytið',
  'umhverfis-, orku- og loftslagsráðuneytið',
  'utanríkisráðuneytið',
]

export const MEMBER_INDEX = '{memberIndex}'
export const INSTITUTION_INDEX = '{institutionIndex}'
