import {
  getErrorMessageForMissingDocuments,
  hasMissingDocuments,
  hasReceivedAllDocuments,
} from './hasMissingDocuments'
import { WhoIsTheNotificationForEnum, AttachmentsEnum } from '../types'
import { NO, YES } from '../constants'
import { FormatMessage } from '@island.is/localization'
import { FormValue } from '@island.is/application/types'
import { AccidentNotification } from '../lib/dataSchema'

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

describe('hasReceivedAllDocuments', () => {
    it.each([
        { who: WhoIsTheNotificationForEnum.ME, fatal: NO }, 
        { who: WhoIsTheNotificationForEnum.JURIDICALPERSON, fatal: NO }, 
        { who: WhoIsTheNotificationForEnum.POWEROFATTORNEY, fatal: YES }, 
        { who: WhoIsTheNotificationForEnum.POWEROFATTORNEY, fatal: NO }])
        ('should return true when all documents are received', (data) => {
        const answers = getNoMissingDocuments() as AccidentNotification
        answers.whoIsTheNotificationFor.answer = data.who
        answers.wasTheAccidentFatal = data.fatal as unknown as 'no' | 'yes'
        expect(hasReceivedAllDocuments(answers)).toEqual(true)
    })

    it.each([
        { who: WhoIsTheNotificationForEnum.ME, fatal: NO }, 
        { who: WhoIsTheNotificationForEnum.JURIDICALPERSON, fatal: NO }, 
        { who: WhoIsTheNotificationForEnum.POWEROFATTORNEY, fatal: YES }, 
        { who: WhoIsTheNotificationForEnum.POWEROFATTORNEY, fatal: NO }])
        ('should return false when missing documents', (data) => {
        const answers = getMissingDocuments() as AccidentNotification
        answers.whoIsTheNotificationFor.answer = data.who
        answers.wasTheAccidentFatal = data.fatal as unknown as 'no' | 'yes'
        expect(hasReceivedAllDocuments(answers)).toEqual(false)
    })
})

const getMissingDocuments = (): FormValue => {
    return {
        whoIsTheNotificationFor: {
            answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY
        },
        wasTheAccidentFatal: YES,
        injuryCertificate: {
            answer: AttachmentsEnum.SENDCERTIFICATELATER
        },
        accidentStatus: {
            receivedAttachments: {
                InjuryCertificate: false,
                PoliceReport: false,
                DeathCertificate: false,
                ProxyDocument: false
            }
        },
        attachments: {
            injuryCertificateFile: {
                file: []
            },
            deathCertificateFile: {
                file: []
            },
            powerOfAttorneyFile: {
                file: []
            }
        }
    }
}

const getNoMissingDocuments = (): FormValue => {
    return {
        whoIsTheNotificationFor: {
            answer: WhoIsTheNotificationForEnum.POWEROFATTORNEY
        },
        wasTheAccidentFatal: YES,
        injuryCertificate: {
            answer: AttachmentsEnum.SENDCERTIFICATELATER
        },
        accidentStatus: {
            receivedAttachments: {
                InjuryCertificate: true,
                PoliceReport: true,
                DeathCertificate: true,
                ProxyDocument: true
            }
        },
        attachments: {
            injuryCertificateFile: {
                file: [{
                    name: 'test.pdf',
                    url: 'https://test.pdf'
                }]
            },
            deathCertificateFile: {
                file: [{
                    name: 'test.pdf',
                    url: 'https://test.pdf'
                }]
            },
            powerOfAttorneyFile: {
                file: [{
                    name: 'test.pdf',
                    url: 'https://test.pdf'
                }]
            }    
        }
    }
}
