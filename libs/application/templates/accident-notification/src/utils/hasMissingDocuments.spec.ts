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
    { who: WhoIsTheNotificationForEnum.ME, fatal: NO },
    { who: WhoIsTheNotificationForEnum.JURIDICALPERSON, fatal: NO },
    { who: WhoIsTheNotificationForEnum.POWEROFATTORNEY, fatal: YES },
    { who: WhoIsTheNotificationForEnum.POWEROFATTORNEY, fatal: NO },
  ]
  it.each(testCases)(
    'should return true when all documents are received',
    (data) => {
      const answers = getNoMissingDocuments() as AccidentNotification
      answers.whoIsTheNotificationFor.answer = data.who
      answers.wasTheAccidentFatal = data.fatal as unknown as 'no' | 'yes'
      expect(hasReceivedAllDocuments(answers)).toEqual(true)
    },
  )

  it.each(testCases)('should return false when missing documents', (data) => {
    const answers = getMissingDocuments() as AccidentNotification
    answers.whoIsTheNotificationFor.answer = data.who
    answers.wasTheAccidentFatal = data.fatal as unknown as 'no' | 'yes'
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
  wasTheAccidentFatal: YES,
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
  wasTheAccidentFatal: YES,
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
