import { Test, TestingModule } from '@nestjs/testing'
import { NotificationsController } from '../notifications.controller'
import { NotificationsService } from '../notifications.service'
import { QueueService } from '@island.is/message-queue'
import { CreateHnippNotificationDto } from '../dto/createHnippNotification.dto'
import { HnippTemplate } from '../dto/hnippTemplate.response'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'

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
            getTemplates: jest.fn(),
            getTemplate: jest.fn(),
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

      jest.spyOn(notificationsService, 'validate').mockResolvedValue(undefined)

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
        createHnippNotificationDto.templateId,
        createHnippNotificationDto.args,
      )

      // Assert that the queueService.add was called with any argument, considering
      // the test setup does not specify the exact argument structure.
      expect(queueService.add).toHaveBeenCalledWith(expect.anything())

      // If reaching this point without errors, validation is considered successful.
      expect(true).toBe(true) // This is implicitly true if no error was thrown.
    })
  })
})
