import { LOGGER_PROVIDER } from '@island.is/logging'
import { FileService } from '@island.is/application/api/files'
import { NotificationsApi } from '@island.is/clients/user-notification'
import { Test } from '@nestjs/testing'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import {
  ApplicationTypes,
  PruningApplication,
} from '@island.is/application/types'

import { ApplicationLifeCycleService } from '../application-lifecycle.service'
import { ApplicationService } from '@island.is/application/api/core'
import { HistoryService } from '@island.is/application/api/history'
import { ApplicationChargeService } from '../../charge/application-charge.service'

jest.mock('@island.is/application/template-loader')

describe('ApplicationLifeCycleService', () => {
  let service: ApplicationLifeCycleService

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    child: () => mockLogger,
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ApplicationLifeCycleService,
        {
          provide: LOGGER_PROVIDER,
          useValue: mockLogger,
        },
        {
          provide: ApplicationService,
          useValue: {},
        },
        {
          provide: FileService,
          useValue: {},
        },
        {
          provide: ApplicationChargeService,
          useValue: {},
        },
        {
          provide: NotificationsApi,
          useValue: {},
        },
        {
          provide: HistoryService,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<ApplicationLifeCycleService>(
      ApplicationLifeCycleService,
    )
  })

  describe('preparePrunedNotification', () => {
    it('should return notification when all required fields are present and no applicantActors are present', async () => {
      const mockApplication = {
        id: '123',
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
        state: 'draft',
        applicant: 'user123',
        answers: {},
        externalData: {},
        attachments: [],
        applicantActors: [],
      }

      const mockTemplate = {
        stateMachineConfig: {
          states: {
            draft: {
              meta: {
                lifecycle: {
                  shouldBePruned: true,
                  pruneMessage: {
                    externalBody: 'external message',
                    internalBody: 'internal message',
                    notificationTemplateId: 'template123',
                  },
                },
              },
            },
          },
        },
      }

      ;(getApplicationTemplateByTypeId as jest.Mock).mockResolvedValue(
        mockTemplate,
      )

      const result = await service['preparePrunedNotification'](mockApplication)

      expect(result).toEqual([
        {
          recipient: 'user123',
          templateId: 'template123',
          args: [
            {
              key: 'externalBody',
              value: 'external message',
            },
            {
              key: 'internalBody',
              value: 'internal message',
            },
          ],
        },
      ])
    })

    it('should return notifications when all required fields are present and applicantActors are present', async () => {
      const mockApplication = {
        id: '123',
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
        state: 'draft',
        applicant: 'user123',
        answers: {},
        externalData: {},
        attachments: [],
        applicantActors: ['user345', 'user678'],
      }

      const mockTemplate = {
        stateMachineConfig: {
          states: {
            draft: {
              meta: {
                lifecycle: {
                  shouldBePruned: true,
                  pruneMessage: {
                    externalBody: 'external message',
                    internalBody: 'internal message',
                    notificationTemplateId: 'template123',
                  },
                },
              },
            },
          },
        },
      }

      ;(getApplicationTemplateByTypeId as jest.Mock).mockResolvedValue(
        mockTemplate,
      )

      const result = await service['preparePrunedNotification'](mockApplication)

      expect(result).toEqual([
        {
          recipient: 'user345',
          templateId: 'template123',
          args: [
            {
              key: 'externalBody',
              value: 'external message',
            },
            {
              key: 'internalBody',
              value: 'internal message',
            },
          ],
        },
        {
          recipient: 'user678',
          templateId: 'template123',
          args: [
            {
              key: 'externalBody',
              value: 'external message',
            },
            {
              key: 'internalBody',
              value: 'internal message',
            },
          ],
        },
      ])
    })

    it('should handle function-based pruneMessage', async () => {
      const mockApplication = {
        id: '123',
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
        state: 'draft',
        applicant: 'user123',
        answers: {},
        externalData: {},
        attachments: [],
        applicantActors: [],
      }

      const mockTemplate = {
        stateMachineConfig: {
          states: {
            draft: {
              meta: {
                lifecycle: {
                  shouldBePruned: true,
                  pruneMessage: (app: PruningApplication) => ({
                    externalBody: `external message for ${app.id}`,
                    internalBody: `internal message for ${app.id}`,
                    notificationTemplateId: 'template123',
                  }),
                },
              },
            },
          },
        },
      }

      ;(getApplicationTemplateByTypeId as jest.Mock).mockResolvedValue(
        mockTemplate,
      )

      const result = await service['preparePrunedNotification'](mockApplication)

      expect(result).toEqual({
        recipient: 'user123',
        templateId: 'template123',
        args: [
          {
            key: 'externalBody',
            value: 'external message for 123',
          },
          {
            key: 'internalBody',
            value: 'internal message for 123',
          },
        ],
      })
    })

    it('should return null when required fields are missing', async () => {
      const mockApplication = {
        id: '123',
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
        state: 'draft',
        applicant: 'user123',
        answers: {},
        externalData: {},
        attachments: [],
        applicantActors: [],
      }

      const mockTemplate = {
        stateMachineConfig: {
          states: {
            draft: {
              meta: {
                lifecycle: {
                  shouldBePruned: false, // Missing required field
                },
              },
            },
          },
        },
      }

      ;(getApplicationTemplateByTypeId as jest.Mock).mockResolvedValue(
        mockTemplate,
      )

      const result = await service['preparePrunedNotification'](mockApplication)

      expect(result).toBeNull()
    })
  })
})

describe('ApplicationLifeCycleService', () => {
  let service: ApplicationLifeCycleService
  let notificationApi: jest.Mocked<NotificationsApi>
  let mockLogger: jest.Mocked<any>

  beforeEach(async () => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      child: jest.fn().mockReturnThis(),
    }

    notificationApi = {
      notificationsControllerCreateHnippNotification: jest.fn(),
    } as any

    const module = await Test.createTestingModule({
      providers: [
        ApplicationLifeCycleService,
        {
          provide: LOGGER_PROVIDER,
          useValue: mockLogger,
        },
        {
          provide: ApplicationService,
          useValue: {},
        },
        {
          provide: FileService,
          useValue: {},
        },
        {
          provide: ApplicationChargeService,
          useValue: {},
        },
        {
          provide: NotificationsApi,
          useValue: notificationApi,
        },
        {
          provide: HistoryService,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<ApplicationLifeCycleService>(
      ApplicationLifeCycleService,
    )
  })

  describe('reportResults', () => {
    it('should successfully send notification when API call succeeds', async () => {
      // Setup
      const mockNotification = {
        recipient: 'test-user',
        templateId: 'test-template',
        args: [],
      }
      const mockApplicationId = 'test-id'

      const mockResponse = { id: '123' }

      notificationApi.notificationsControllerCreateHnippNotification.mockResolvedValue(
        mockResponse,
      )

      // Execute
      await service['sendPrunedNotification'](
        mockNotification,
        mockApplicationId,
      )

      // Assert
      expect(
        notificationApi.notificationsControllerCreateHnippNotification,
      ).toHaveBeenCalledWith({
        createHnippNotificationDto: mockNotification,
      })
      expect(mockLogger.info).toHaveBeenCalledWith(
        `Prune notification sent with response: ${JSON.stringify(
          mockResponse,
        )}`,
      )
    })

    it('should log error when notification API call fails', async () => {
      // Setup
      const mockNotification = {
        recipient: 'test-user',
        templateId: 'test-template',
        args: [],
      }
      const mockApplicationId = 'test-id'
      const mockError = new Error('API Error')

      notificationApi.notificationsControllerCreateHnippNotification.mockRejectedValue(
        mockError,
      )

      // Execute
      await service['sendPrunedNotification'](
        mockNotification,
        mockApplicationId,
      )

      // Assert
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Failed to send pruning notification with error: ${mockError} for application ${mockApplicationId}`,
      )
    })

    it('should handle malformed pruneMessage function', async () => {
      const mockApplication = {
        id: '123',
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
        state: 'draft',
        applicant: 'user123',
        answers: {},
        externalData: {},
        attachments: [],
        applicantActors: [],
      }

      const mockTemplate = {
        stateMachineConfig: {
          states: {
            draft: {
              meta: {
                lifecycle: {
                  shouldBePruned: true,
                  pruneMessage: () => {
                    throw new Error('Unexpected error')
                  },
                },
              },
            },
          },
        },
      }

      ;(getApplicationTemplateByTypeId as jest.Mock).mockResolvedValue(
        mockTemplate,
      )

      const result = await service['preparePrunedNotification'](mockApplication)
      expect(result).toBeNull()
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })
})
