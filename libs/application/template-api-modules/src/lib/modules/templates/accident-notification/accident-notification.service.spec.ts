import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { EmailService } from '@island.is/email-service'
import { SharedTemplateApiService } from '../../shared'
import { BaseTemplateApiApplicationService } from '../../../types'
import { AccidentNotificationService } from './accident-notification.service'
import { AccidentNotificationAttachmentProvider } from './attachments/applicationAttachmentProvider'
import { ApplicationAttachmentService } from './attachments/applicationAttachment.service'
import { ACCIDENT_NOTIFICATION_CONFIG } from './config'
import { DocumentApi } from '@island.is/clients/icelandic-health-insurance/health-insurance'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { S3 } from 'aws-sdk'
import type { Locale } from '@island.is/shared/types'
import { createApplication } from '@island.is/application/testing'
import get from 'lodash/get'
import set from 'lodash/set'
import { S3Service } from './attachments/s3.service'
import { SmsService } from '@island.is/nova-sms'
import { PaymentService } from '@island.is/application/api/payment'
const nationalId = '1234564321'
let id = 0

const sendMail = () => ({
  messageId: 'some id',
})

class MockEmailService {
  getTransport() {
    return { sendMail }
  }

  sendEmail() {
    return sendMail()
  }
}
class MockSmsService {
  getTransport() {
    return { sendMail }
  }

  sendSms() {
    return sendMail()
  }
}

const S3Instance = {
  upload: jest.fn().mockReturnThis(),
  promise: jest.fn(),
  deleteObject: jest.fn().mockReturnThis(),
  getObject: jest.fn().mockReturnThis(),
}

describe('AccidentNotificationService', () => {
  let accidentNotificationService: AccidentNotificationService
  let s3Service: S3Service
  let documentApi: DocumentApi

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccidentNotificationService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        ApplicationAttachmentService,
        {
          provide: DocumentApi,
          useClass: jest.fn(() => ({
            documentDocumentAttachment: () => {
              Promise.resolve({
                success: 1,
                numberIHI: 12313,
              })
            },
          })),
        },
        {
          provide: S3,
          useFactory: () => S3Instance,
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: PaymentService,
          useValue: {}, //not used
        },
        {
          provide: EmailService,
          useClass: MockEmailService,
        },
        {
          provide: SmsService,
          useClass: MockSmsService,
        },
        {
          provide: S3Service,
          useClass: jest.fn(() => ({
            getFilecontentAsBase64: jest.fn(),
          })),
        },
        {
          provide: BaseTemplateApiApplicationService,
          useValue: {},
        },
        {
          provide: ACCIDENT_NOTIFICATION_CONFIG,
          useValue: {
            applicationRecipientName: '',
            applicationRecipientEmail: '',
            applicationSenderName: '',
            applicationSenderEmail: '',
          },
        },
        AccidentNotificationAttachmentProvider,
        SharedTemplateApiService,
      ],
    }).compile()

    accidentNotificationService = module.get(AccidentNotificationService)
    s3Service = module.get(S3Service)
    documentApi = module.get(DocumentApi)
  })

  describe('addAdditionalAttachment', () => {
    it('should send 2 files and no files on second call', async () => {
      const application = createApplication({
        answers: {
          applicant: {
            email: 'applicant@applicant.test',
            phoneNumber: '8888888',
          },
          accidentStatus: {
            recievedAttachments: {},
          },
          attachments: {},
        },
        applicant: nationalId,
        assignees: [],
        applicantActors: [],
        attachments: {
          attachment1: 'somattachment',
        },
        created: new Date(),
        modified: new Date(),
        externalData: {
          submitApplication: {
            data: {
              documentId: 123456789,
              sendtDocuments: [''],
            },
            date: new Date('2021-06-10T11:31:02.641Z'),
            status: 'success',
          },
          addAdditionalAttachment: {
            data: {
              sentDocuments: [
                '9fe9172af1528d46bcac061f910bc89fa801ca031b35ee25ee6a31ee1d0365b3',
              ],
            },
            date: new Date('2021-06-10T11:31:02.641Z'),
            status: 'success',
          },
        },
        id: (id++).toString(),
        state: '',
        typeId: ApplicationTypes.ACCIDENT_NOTIFICATION,
        name: '',
        status: ApplicationStatus.IN_PROGRESS,
      })
      const user = createCurrentUser()

      const answerAttachments = get(
        application.answers,
        'attachments',
      ) as object

      set(answerAttachments, 'injuryCertificateFile.file', [
        { name: 'file1', key: 'somekey1', url: 's3://somebucket' },
      ])
      set(answerAttachments, 'deathCertificateFile.file', [
        { name: 'file2', key: 'somekey2', url: 's3://somebucket' },
      ])

      set(application, 'attachments', {
        somekey2: 'https://bucket.s3-aws-region.amazonaws.com/file2-somekey2',
        somekey1: 'https://bucket.s3-aws-region.amazonaws.com/file1-somekey1',
      })

      const attachmentStatus = get(
        application.answers,
        'accidentStatus',
      ) as object

      set(attachmentStatus, 'recievedAttachments', {
        InjuryCertificate: false,
        ProxyDocument: null,
        PoliceReport: false,
        Unknown: false, //assuming will always be false
      })

      const props = {
        application,
        auth: user,
        currentUserLocale: 'is' as Locale,
      }

      jest
        .spyOn(s3Service, 'getFilecontentAsBase64')
        .mockResolvedValueOnce(
          Buffer.from('some content', 'utf-8') as unknown as string,
        )
        .mockResolvedValueOnce(
          Buffer.from('some dsfsf', 'utf-8') as unknown as string,
        ) //reset resolved value to return same values again for the next request 2 times each with the same content
        .mockResolvedValueOnce(
          Buffer.from('some content', 'utf-8') as unknown as string,
        )
        .mockResolvedValueOnce(
          Buffer.from('some dsfsf', 'utf-8') as unknown as string,
        )
      const send = jest.spyOn(documentApi, 'documentDocumentAttachment')
      const res = await accidentNotificationService.addAdditionalAttachment(
        props,
      )

      const sentDocs = [
        '9fe9172af1528d46bcac061f910bc89fa801ca031b35ee25ee6a31ee1d0365b3',
        '290f493c44f5d63d06b374d0a5abd292fae38b92cab2fae5efefe1b0e9347f56',
        'c28cbc8c78fbe6ee77df1fced5f03ffb6e367458f5f094c4685e41b5b31d06fb',
      ]

      expect(send).toHaveBeenCalledTimes(2)
      expect(res).toEqual({
        sentDocuments: sentDocs,
      })

      //update application external data with sent documents
      const attachmentSendExternalData = get(
        application.externalData,
        'addAdditionalAttachment.data',
      ) as object

      set(attachmentSendExternalData, 'sentDocuments', sentDocs)

      const res2 = await accidentNotificationService.addAdditionalAttachment(
        props,
      )

      //response should be identical to earlier response
      expect(send).toHaveBeenCalledTimes(2)
      expect(res2).toEqual({
        sentDocuments: sentDocs,
      })
    })
  })
})
