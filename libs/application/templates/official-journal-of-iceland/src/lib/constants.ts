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
