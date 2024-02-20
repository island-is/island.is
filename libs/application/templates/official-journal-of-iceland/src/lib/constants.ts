export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const UPLOAD_ACCEPT = '.pdf'

export const FILE_SIZE_LIMIT = 10000000

export const VERDSKRA_LINK =
  'https://www.stjornartidindi.is/PdfVersions.aspx?recordId=0f574646-eb9d-430b-bbe7-936e7c9389a0'

export enum Routes {
  PREREQUISITES = 'prerequisites',
  ADVERT = 'advert',
  SIGNATURE = 'signature',
  ADDITIONS_AND_DOCUMENTS = 'additionsAndDocuments',
  PREVIEW = 'preview',
  ORIGINAL_DATA = 'originalData',
  PUBLISHING_PREFERENCES = 'publishingPreferences',
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
export const INSTITUTION_INDEX = '{institutionIndex}'

export const INITAL_ANSWERS = {
  [Routes.PREREQUISITES]: {
    approveExternalData: false,
  },
  [Routes.ADVERT]: {
    department: '',
    type: '',
    subType: '',
    title: '',
    template: '',
    documentContents: '',
  },
  [Routes.SIGNATURE]: {
    signatureType: '',
    signatureContents: '',
    signature: {
      regular: {
        institution: '',
        date: '',
        members: [
          {
            textAbove: '',
            name: '',
            textBelow: '',
            textAfter: '',
          },
        ],
      },
      committee: {
        institution: '',
        date: '',
        chairman: {
          textAbove: '',
          name: '',
          textAfter: '',
          textBelow: '',
        },
        members: [
          {
            name: '',
            textBelow: '',
          },
        ],
      },
      additonalSignature: '',
    },
  },
  [Routes.ADDITIONS_AND_DOCUMENTS]: {
    files: [],
    fileNames: [],
  },
  [Routes.PUBLISHING_PREFERENCES]: {
    date: '',
    fastTrack: false,
    contentCategories: [],
    communicationChannels: [],
    message: '',
  },
}
