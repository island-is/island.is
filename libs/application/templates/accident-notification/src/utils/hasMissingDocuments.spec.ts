import {
  getErrorMessageForMissingDocuments,
  hasMissingDocuments,
} from './hasMissingDocuments'
import { WhoIsTheNotificationForEnum, AttachmentsEnum } from '../types'
import { YES } from '../constants'
import { FormatMessage } from '@island.is/localization'
import { FormValue } from '@island.is/application/types'

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
  it('should return error message for missing documents', () => {
    const result = getErrorMessageForMissingDocuments(
      getMissingDocuments(),
      formatMessage,
      false,
    )
    expect(result).toEqual('test.pdf, test.pdf, test.pdf')
  })
})

const getMissingDocuments = (): FormValue => {
  return {
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
}

const getNoMissingDocuments = (): FormValue => {
  return {
    whoIsTheNotificationFor: {
      answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    },
    wasTheAccidentFatal: YES,
    injuryCertificate: {
      answer: AttachmentsEnum.SENDCERTIFICATELATER,
    },
    attachments: {
      injuryCertificateFile: {
        file: [
          {
            name: 'test.pdf',
            url: 'https://test.pdf',
          },
        ],
      },
      deathCertificateFile: {
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
    },
  }
}
