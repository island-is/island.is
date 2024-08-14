export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const UPLOAD_ACCEPT = '.pdf'

export const FILE_SIZE_LIMIT = 10000000

export const VERDSKRA_LINK =
  'https://www.stjornartidindi.is/PdfVersions.aspx?recordId=0f574646-eb9d-430b-bbe7-936e7c9389a0'

export enum AnswerOption {
  YES = 'yes',
  NO = 'no',
}

export const MINIMUM_WEEKDAYS = 10

export enum Routes {
  REQUIREMENTS = 'requirements',
  COMMENTS = 'comments',
  ADVERT = 'advert',
  SIGNATURE = 'signature',
  ATTACHMENTS = 'attachments',
  PREVIEW = 'preview',
  ORIGINAL = 'original',
  PUBLISHING = 'publishing',
  SUMMARY = 'summary',
  COMPLETE = 'complete',
}

// this will be replaced with correct values once the api is ready

export enum TypeIds {
  GJALDSKRA = '0',
  AUGLYSING = '1',
  REGLUGERDIR = '2',
  SKIPULAGSSKRA = '3',
}

export const MEMBER_INDEX = '{memberIndex}'
export const SIGNATURE_INDEX = '{institutionIndex}'

export const INTERVAL_TIMER = 3000
export const DEBOUNCE_INPUT_TIMER = 333

export enum FileNames {
  DOCUMENT = 'document',
  ADDITIONS = 'additions',
}

export const OJOJ_INPUT_HEIGHT = 64
