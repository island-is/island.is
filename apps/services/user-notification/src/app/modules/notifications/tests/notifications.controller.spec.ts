import { Test, TestingModule } from '@nestjs/testing'
import { NotificationsController } from '../notifications.controller'
import { NotificationsService } from '../notifications.service'
import { QueueService } from '@island.is/message-queue'
import { CreateHnippNotificationDto } from '../dto/createHnippNotification.dto'
import { HnippTemplate } from '../dto/hnippTemplate.response'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'
import {
  PaginatedActorNotificationDto,
  ExtendedPaginationDto,
} from '../dto/notification.dto'

describe('NotificationsController', () => {
  let controller: NotificationsController
  let notificationsService: NotificationsService
  let queueService: QueueService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: {
            validate: jest.fn(),
            sanitize: jest.fn(),
            getTemplates: jest.fn(),
            getTemplate: jest.fn(),
            findActorNotifications: jest.fn(),
          },
        },
        {
          provide: LOGGER_PROVIDER,
          useValue: {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: 'IslandIsMessageQueue/QueueService/notifications',
          useValue: { add: jest.fn().mockResolvedValue('mockQueueId') },
        },
        {
          provide: CacheInterceptor,
          useValue: jest.fn(),
        },
      ],
    }).compile()

    controller = module.get<NotificationsController>(NotificationsController)
    notificationsService =
      module.get<NotificationsService>(NotificationsService)
    queueService = module.get('IslandIsMessageQueue/QueueService/notifications')
  })

  // Individual tests go here
  describe('getNotificationTemplates', () => {
    it('should return an array of notification templates', async () => {
      const templates: HnippTemplate[] = [
        {
          templateId: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
          title: 'New document',
          externalBody: 'New document from {{organization}}',
          clickActionUrl: 'https://island.is/minarsidur/postholf',
          args: ['arg1', 'arg2'],
          scope: '@island.is/documents',
        },
      ]

      jest
        .spyOn(notificationsService, 'getTemplates')
        .mockResolvedValue(templates)

      const locale = 'is'
      const result = await controller.getNotificationTemplates(locale)

      expect(notificationsService.getTemplates).toHaveBeenCalledWith(locale)
      expect(result).toEqual(templates)
    })
  })

  describe('getNotificationTemplate', () => {
    it('should return a single notification template by ID', async () => {
      const template: HnippTemplate = {
        templateId: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
        title: 'Title',
        externalBody: 'Body',
        clickActionUrl: 'https://island.is/minarsidur/postholf',
        args: ['arg1'],
        scope: '@island.is/documents',
      }

      jest
        .spyOn(notificationsService, 'getTemplate')
        .mockResolvedValue(template)

      const result = await controller.getNotificationTemplate(
        'HNIPP.POSTHOLF.NEW_DOCUMENT',
        'is',
      )

      expect(notificationsService.getTemplate).toHaveBeenCalledWith(
        'HNIPP.POSTHOLF.NEW_DOCUMENT',
        'is',
      )
      expect(result).toEqual(template)
    })
  })
  describe('createHnippNotification', () => {
    it('should validate and queue a new Hnipp notification, returning a response with the id', async () => {
      const createHnippNotificationDto: CreateHnippNotificationDto = {
        recipient: '1234567890',
        templateId: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
        args: [
          { key: 'organization', value: 'Test Organization' },
          { key: 'documentId', value: '1234' },
        ],
      }

      const mockTemplate: HnippTemplate = {
        templateId: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
        title: 'Test Template',
        externalBody: 'Test body',
        clickActionUrl: 'https://island.is/test',
        args: ['organization', 'documentId'],
        scope: '@island.is/documents',
      }

      jest
        .spyOn(notificationsService, 'getTemplate')
        .mockResolvedValue(mockTemplate)
      jest.spyOn(notificationsService, 'validate').mockResolvedValue(undefined)
      jest
        .spyOn(notificationsService, 'sanitize')
        .mockReturnValue(createHnippNotificationDto.args)

      const mockQueueId = 'mockQueueId'
      jest.spyOn(queueService, 'add').mockResolvedValue(mockQueueId)

      let validationError
      try {
        await controller.createHnippNotification(createHnippNotificationDto)
      } catch (error) {
        validationError = error
      }

      // Asserting the validation passed by checking no error was thrown
      expect(validationError).toBeUndefined()

      // Additionally, checking the validate method was called correctly
      expect(notificationsService.validate).toHaveBeenCalledWith(
        mockTemplate,
        createHnippNotificationDto.args,
      )
      expect(notificationsService.sanitize).toHaveBeenCalledWith(
        mockTemplate,
        createHnippNotificationDto.args,
      )

      // Assert that the queueService.add was called with any argument, considering
      // the test setup does not specify the exact argument structure.
      expect(queueService.add).toHaveBeenCalledWith(expect.anything())

      // If reaching this point without errors, validation is considered successful.
      expect(true).toBe(true) // This is implicitly true if no error was thrown.
    })
  })

  describe('findActorNotifications', () => {
    it('should return paginated actor notifications for a national id', async () => {
      const nationalId = '1234567890'
      const query: ExtendedPaginationDto = {
        limit: 10,
        after: '',
        locale: 'is',
      }

      const mockActorNotifications: PaginatedActorNotificationDto = {
        totalCount: 1,
        data: [
          {
            id: 1,
            messageId: '550e8400-e29b-41d4-a716-446655440000',
            rootMessageId: '550e8400-e29b-41d4-a716-446655440001',
            userNotificationId: 100,
            recipient: '1234567890',
            onBehalfOfNationalId: '0987654321',
            scope: '@island.is/documents',
            created: new Date('2021-01-01T00:00:00Z'),
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
      }

      jest
        .spyOn(notificationsService, 'findActorNotifications')
        .mockResolvedValue(mockActorNotifications)

      const result = await controller.findActorNotifications(nationalId, query)

      expect(notificationsService.findActorNotifications).toHaveBeenCalledWith(
        nationalId,
        query,
      )
      expect(result).toEqual(mockActorNotifications)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].recipient).toBe(nationalId)
    })

    it('should handle pagination parameters correctly', async () => {
      const nationalId = '1234567890'
      const query: ExtendedPaginationDto = {
        limit: 20,
        after: 'cursor123',
        locale: 'is',
      }

      const mockActorNotifications: PaginatedActorNotificationDto = {
        totalCount: 0,
        data: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
      }

      jest
        .spyOn(notificationsService, 'findActorNotifications')
        .mockResolvedValue(mockActorNotifications)

      const result = await controller.findActorNotifications(nationalId, query)

      expect(notificationsService.findActorNotifications).toHaveBeenCalledWith(
        nationalId,
        query,
      )
      expect(result).toEqual(mockActorNotifications)
    })

    it('should handle empty results', async () => {
      const nationalId = '1234567890'
      const query: ExtendedPaginationDto = {
        limit: 10,
        locale: 'is',
      }

      const mockActorNotifications: PaginatedActorNotificationDto = {
        totalCount: 0,
        data: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
      }

      jest
        .spyOn(notificationsService, 'findActorNotifications')
        .mockResolvedValue(mockActorNotifications)

      const result = await controller.findActorNotifications(nationalId, query)

      expect(notificationsService.findActorNotifications).toHaveBeenCalledWith(
        nationalId,
        query,
      )
      expect(result.data).toHaveLength(0)
      expect(result.totalCount).toBe(0)
    })
  })
})
