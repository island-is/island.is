import { FormatMessage } from '@island.is/localization'
import { YES } from '../constants'
import { AccidentNotification } from '../lib/dataSchema'
import { AttachmentsEnum, WhoIsTheNotificationForEnum } from '../types'
import {
  isValid24HFormatTime,
  formatPhonenumber,
  getAttachmentTitles,
  returnMissingDocumentsList,
} from './index'

describe('isValid24HFormatTime', () => {
  it.each(['0000', '2359', '1234'])(
    'should return true for valid time',
    (time) => {
      const result = isValid24HFormatTime(time)
      expect(result).toBeTruthy()
    },
  )

  it.each([
    '2534',
    '1265',
    '2360',
    '2400',
    '12:34',
    '',
    '1',
    '12',
    '123',
    '12345',
  ])('should return false for invalid time', (time) => {
    const result = isValid24HFormatTime(time)
    expect(result).toBeFalsy()
  })
})

describe('formatPhonenumber', () => {
  it.each([
    { input: '1234567', expected: '123-4567' },
    { input: '1234567891011', expected: '123-4567891011' },
    { input: 'ABCDEF@!()', expected: 'ABC-DEF@!()' },
    { input: '123', expected: '123' },
  ])('should format phone number', ({ input, expected }) => {
    const result = formatPhonenumber(input)
    expect(result).toBe(expected)
  })
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
      wasTheAccidentFatal: YES,
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
