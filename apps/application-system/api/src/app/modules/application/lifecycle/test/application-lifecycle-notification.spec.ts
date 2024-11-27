import { LOGGER_PROVIDER } from '@island.is/logging'
import { FileService } from '@island.is/application/api/files'
import { NotificationsApi } from '@island.is/clients/user-notification'
import { Test } from '@nestjs/testing'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { TestApp } from '@island.is/testing/nest'
import {
  ApplicationTypes,
  PruningApplication,
} from '@island.is/application/types'

import { ApplicationLifeCycleService } from '../application-lifecycle.service'
import { ApplicationService } from '@island.is/application/api/core'
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
      ],
    }).compile()

    service = module.get<ApplicationLifeCycleService>(
      ApplicationLifeCycleService,
    )
  })

  describe('preparePrunedNotification', () => {
    it('should return notification when all required fields are present', async () => {
      const mockApplication = {
        id: '123',
        typeId: ApplicationTypes.EXAMPLE,
        state: 'draft',
        applicant: 'user123',
        answers: {},
        externalData: {},
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

      expect(result).toEqual({
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
      })
    })

    it('should handle function-based pruneMessage', async () => {
      const mockApplication = {
        id: '123',
        typeId: ApplicationTypes.EXAMPLE,
        state: 'draft',
        applicant: 'user123',
        answers: {},
        externalData: {},
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
        typeId: ApplicationTypes.EXAMPLE,
        state: 'draft',
        applicant: 'user123',
        answers: {},
        externalData: {},
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
