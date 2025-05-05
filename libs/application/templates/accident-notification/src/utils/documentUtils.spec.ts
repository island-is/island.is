import { FormatMessage } from '@island.is/localization'

import { AccidentNotification } from '../lib/dataSchema'
import {
  getAttachmentTitles,
  isUploadNow,
  returnMissingDocumentsList,
} from './documentUtils'
import {
  getErrorMessageForMissingDocuments,
  hasMissingDocuments,
  hasReceivedAllDocuments,
} from './documentUtils'
import { FormValue } from '@island.is/application/types'
import { YesOrNoEnum } from '@island.is/application/core'
import {
  AttachmentsEnum,
  PowerOfAttorneyUploadEnum,
  WhoIsTheNotificationForEnum,
} from './enums'

describe('hasMissingDocuments', () => {
  it('should return true when missing documents', () => {
    expect(hasMissingDocuments(getMissingDocuments())).toEqual(true)
  })

  it('should return false when no missing documents', () => {
    expect(hasMissingDocuments(getNoMissingDocuments())).toEqual(false)
  })
})

describe('getErrorMessageForMissingDocuments', () => {
  const formatMessage: FormatMessage = jest.fn().mockReturnValue('test.pdf')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return error message for missing documents', () => {
    const result = getErrorMessageForMissingDocuments(
      getMissingDocuments(),
      formatMessage,
      false,
    )
    expect(result).toEqual('test.pdf, test.pdf, test.pdf')
    expect(formatMessage).toHaveBeenCalledTimes(3)
  })

  it('should return empty string when no documents are missing', () => {
    const docs = getNoMissingDocuments()
    const result = getErrorMessageForMissingDocuments(docs, formatMessage, true)
    expect(result).toBe('')
    expect(formatMessage).not.toHaveBeenCalled()
  })
})

describe('hasReceivedAllDocuments', () => {
  const testCases = [
    { who: WhoIsTheNotificationForEnum.ME, fatal: YesOrNoEnum.NO },
    { who: WhoIsTheNotificationForEnum.JURIDICALPERSON, fatal: YesOrNoEnum.NO },
    {
      who: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
      fatal: YesOrNoEnum.YES,
    },
    { who: WhoIsTheNotificationForEnum.POWEROFATTORNEY, fatal: YesOrNoEnum.NO },
  ]
  it.each(testCases)(
    'should return true when all documents are received',
    (data) => {
      const answers = getNoMissingDocuments() as AccidentNotification
      if (!answers.whoIsTheNotificationFor) {
        return
      }
      answers.whoIsTheNotificationFor.answer = data.who
      answers.wasTheAccidentFatal = data.fatal
      expect(hasReceivedAllDocuments(answers)).toEqual(true)
    },
  )

  it.each(testCases)('should return false when missing documents', (data) => {
    const answers = getMissingDocuments() as AccidentNotification
    if (!answers.whoIsTheNotificationFor) {
      return
    }
    answers.whoIsTheNotificationFor.answer = data.who
    answers.wasTheAccidentFatal = data.fatal
    expect(hasReceivedAllDocuments(answers)).toEqual(false)
  })
})

const EMPTY_FILE: never[] = []

const SAMPLE_FILE = {
  name: 'test.pdf',
  url: 'https://test.pdf',
} as const
const createAttachment = () => ({ file: [SAMPLE_FILE] })

const getMissingDocuments = (): FormValue => ({
  whoIsTheNotificationFor: {
    answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
  },
  wasTheAccidentFatal: YesOrNoEnum.YES,
  injuryCertificate: {
    answer: AttachmentsEnum.SENDCERTIFICATELATER,
  },
  accidentStatus: {
    receivedAttachments: {
      InjuryCertificate: false,
      PoliceReport: false,
      DeathCertificate: false,
      ProxyDocument: false,
    },
  },
  attachments: {
    injuryCertificateFile: { file: EMPTY_FILE },
    deathCertificateFile: { file: EMPTY_FILE },
    powerOfAttorneyFile: { file: EMPTY_FILE },
  },
})

const getNoMissingDocuments = (): FormValue => ({
  whoIsTheNotificationFor: {
    answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
  },
  wasTheAccidentFatal: YesOrNoEnum.YES,
  injuryCertificate: {
    answer: AttachmentsEnum.SENDCERTIFICATELATER,
  },
  accidentStatus: {
    receivedAttachments: {
      InjuryCertificate: true,
      PoliceReport: true,
      DeathCertificate: true,
      ProxyDocument: true,
    },
  },
  attachments: {
    injuryCertificateFile: {
      file: [createAttachment()],
    },
    deathCertificateFile: {
      file: [createAttachment()],
    },
    powerOfAttorneyFile: {
      file: [createAttachment()],
    },
  },
})

describe('getAttachmentTitles', () => {
  it.each([
    AttachmentsEnum.SENDCERTIFICATELATER,
    AttachmentsEnum.HOSPITALSENDSCERTIFICATE,
  ])('should return attachment titles', (injuryCertificate) => {
    const answers = {
      injuryCertificate: {
        answer: injuryCertificate,
      },
      attachments: {
        deathCertificateFile: {
          file: [
            {
              name: 'test.pdf',
              url: 'https://test.pdf',
            },
          ],
        },
        injuryCertificateFile: {
          file: [
            {
              name: 'test.pdf',
              url: 'https://test.pdf',
            },
          ],
        },
        powerOfAttorneyFile: {
          file: [
            {
              name: 'test.pdf',
              url: 'https://test.pdf',
            },
          ],
        },
        additionalFiles: {
          file: [
            {
              name: 'test.pdf',
              url: 'https://test.pdf',
            },
          ],
        },
        additionalFilesFromReviewer: {
          file: [
            {
              name: 'test.pdf',
              url: 'https://test.pdf',
            },
          ],
        },
      },
    }

    // Semi annoying push stuff here because order matters for strict equals
    const isHospitalSendsCertificate =
      injuryCertificate === AttachmentsEnum.HOSPITALSENDSCERTIFICATE
    const expectedResults = []
    expectedResults.push({
      id: 'an.application:attachments.documentNames.deathCertificate',
      defaultMessage: 'Lögregluskýrsla',
      description: 'Name of police report for in review',
    })
    if (!isHospitalSendsCertificate) {
      expectedResults.push({
        id: 'an.application:attachments.documentNames.injuryCertificate',
        defaultMessage: 'Áverkavottorð',
        description: 'Name of injury certificate for in review',
      })
    }
    expectedResults.push({
      id: 'an.application:attachments.documentNames.powerOfAttorney',
      defaultMessage: 'Umboð',
      description: 'Name of power of attorney document for in review',
    })
    if (isHospitalSendsCertificate) {
      expectedResults.push({
        id: 'an.application:overview.labels.hospitalSendsCertificate',
        defaultMessage:
          'Bráðamóttökuskrá - Ég mun óska eftir því að Landspítalinn sendi bráðamóttökuskrá til Sjúkratrygginga Íslands',
        description: 'Label for hospital sends certificate in document list',
      })
    }
    expectedResults.push({
      id: 'an.application:attachments.documentNames.additionalDocumentsFromApplicant',
      defaultMessage: 'Auka fylgiskjöl frá umsækjanda',
      description:
        'Name of additional attachments for in review from applicant',
    })
    expectedResults.push({
      id: 'an.application:attachments.documentNames.additionalDocumentsFromReviewer',
      defaultMessage: 'Auka fylgiskjöl frá forsvarsmanni',
      description: 'Name of additional attachments for in review from reviewer',
    })

    const result = getAttachmentTitles(
      answers as unknown as AccidentNotification,
    )
    expect(result).toStrictEqual(expectedResults)
  })
})

describe('returnMissingDocumentsList', () => {
  it('should return missing documents list', () => {
    const formatMessage: FormatMessage = jest.fn().mockReturnValue('test.pdf')
    const missingDocuments = {
      whoIsTheNotificationFor: {
        answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
      },
      wasTheAccidentFatal: YesOrNoEnum.YES,
      injuryCertificate: {
        answer: AttachmentsEnum.SENDCERTIFICATELATER,
      },
      attachments: {
        injuryCertificateFile: {
          file: [],
        },
        deathCertificateFile: {
          file: [],
        },
        powerOfAttorneyFile: {
          file: [],
        },
      },
    }
    const result = returnMissingDocumentsList(
      missingDocuments as unknown as AccidentNotification,
      formatMessage,
    )
    expect(result).toEqual('test.pdf, test.pdf, test.pdf')
  })
})

describe('isUploadNow', () => {
  const powerOfAttorneyReporterWithUploadNow: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    },
    powerOfAttorney: {
      type: PowerOfAttorneyUploadEnum.UPLOADNOW,
    },
  }

  const powerOfAttorneyReporterWithUploadLater: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    },
    powerOfAttorney: {
      type: PowerOfAttorneyUploadEnum.UPLOADLATER,
    },
  }

  const reportingForSelf: FormValue = {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.ME,
    },
  }

  const emptyObject = {}

  it('should return true for power of attorney reporter with upload now', () => {
    expect(isUploadNow(powerOfAttorneyReporterWithUploadNow)).toEqual(true)
  })

  it('should return false for power of attorney reporter with upload later', () => {
    expect(isUploadNow(powerOfAttorneyReporterWithUploadLater)).toEqual(false)
  })

  it('should return false for reporting for yourself', () => {
    expect(isUploadNow(reportingForSelf)).toEqual(false)
  })

  it('should return false for empty object', () => {
    expect(isUploadNow(emptyObject)).toEqual(false)
  })
})
