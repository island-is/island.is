import { Test } from '@nestjs/testing'
import { SharedTemplateApiService } from './shared.service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { EmailService } from '@island.is/email-service'
import { SmsService } from '@island.is/nova-sms'
import { ApplicationService } from '@island.is/application/api/core'
import { PaymentService } from '@island.is/application/api/payment'
import { sharedModuleConfig } from './shared.config'
import { FormValue } from '@island.is/application/types'
import {
  Application,
  ApplicationStatus,
  ActionCardMetaData,
} from '@island.is/application/types'
import { ApplicationTypes } from '@island.is/application/types'

describe('SharedTemplateApiService', () => {
  let service: SharedTemplateApiService
  let smsService: jest.Mocked<SmsService>
  let logger: jest.Mocked<Logger>

  const mockActionCard: ActionCardMetaData = {
    title: 'Sample Application',
    description: 'This is a sample application description',
    tag: {
      label: 'In Review',
      variant: 'blue',
    },
    history: [
      {
        date: new Date('2024-03-20'),
        log: 'Application submitted',
      },
    ],
  }

  const mockApplication: Application<FormValue> = {
    id: '12345-abcde',
    state: 'submitted',
    actionCard: mockActionCard,
    applicant: 'user123',
    assignees: ['reviewer1', 'reviewer2'],
    applicantActors: ['user123'],
    typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
    modified: new Date('2024-03-20T10:30:00'),
    created: new Date('2024-03-19T15:45:00'),
    answers: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
    externalData: {},
    name: 'John Doe Application',
    institution: 'Example University',
    progress: 75,
    status: ApplicationStatus.IN_PROGRESS,
    draftTotalSteps: 4,
    draftFinishedSteps: 3,
  }

  const mockConfig = {
    templateApi: {
      clientLocationOrigin: 'http://example.com',
      jwtSecret: 'secret',
      email: 'test@example.com',
    },
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SharedTemplateApiService,
        {
          provide: LOGGER_PROVIDER,
          useValue: {
            warn: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {},
        },
        {
          provide: SmsService,
          useValue: {
            sendSms: jest.fn(),
          },
        },
        {
          provide: sharedModuleConfig.KEY,
          useValue: mockConfig,
        },
        {
          provide: ApplicationService,
          useValue: {},
        },
        {
          provide: PaymentService,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<SharedTemplateApiService>(SharedTemplateApiService)
    smsService = module.get(SmsService)
    logger = module.get(LOGGER_PROVIDER)
  })

  describe('sendSms', () => {
    it('should successfully send an SMS with normalized phone number', async () => {
      // Arrange
      const mockSmsTemplateGenerator = jest.fn().mockReturnValue({
        phoneNumber: '+354 1234567',
        message: 'Test message',
      })

      // Act
      await service.sendSms(mockSmsTemplateGenerator, mockApplication)

      // Assert
      expect(mockSmsTemplateGenerator).toHaveBeenCalledWith(mockApplication, {
        clientLocationOrigin: mockConfig.templateApi.clientLocationOrigin,
      })
      expect(smsService.sendSms).toHaveBeenCalledWith('1234567', 'Test message')
      expect(logger.warn).toHaveBeenCalledTimes(2)
    })

    it('should normalize phone numbers with special characters', async () => {
      // Arrange
      const mockSmsTemplateGenerator = jest.fn().mockReturnValue({
        phoneNumber: '+354-123-4567',
        message: 'Test message',
      })

      // Act
      await service.sendSms(mockSmsTemplateGenerator, mockApplication)

      // Assert
      expect(smsService.sendSms).toHaveBeenCalledWith('1234567', 'Test message')
      expect(logger.warn).toHaveBeenCalledTimes(2)
    })

    it('should handle phone numbers longer than 7 digits', async () => {
      // Arrange
      const mockSmsTemplateGenerator = jest.fn().mockReturnValue({
        phoneNumber: '3541234567',
        message: 'Test message',
      })

      // Act
      await service.sendSms(mockSmsTemplateGenerator, mockApplication)

      // Assert
      expect(smsService.sendSms).toHaveBeenCalledWith('1234567', 'Test message')
      expect(logger.warn).toHaveBeenCalledTimes(1)
    })
  })
})
