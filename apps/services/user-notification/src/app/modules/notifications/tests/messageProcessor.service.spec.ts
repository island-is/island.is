import { Test, TestingModule } from '@nestjs/testing'
import { MessageProcessorService } from '../messageProcessor.service'
import { LoggingModule } from '@island.is/logging'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { HnippTemplate } from '../dto/hnippTemplate.response'
import { CreateHnippNotificationDto } from '../dto/createHnippNotification.dto'
import { CacheModule } from '@nestjs/cache-manager'
import { NotificationsService } from '../notifications.service'
import { getModelToken } from '@nestjs/sequelize'
import { Notification } from '../notification.model'
import { ActorNotification } from '../actor-notification.model'
import { CmsService } from '@island.is/clients/cms'

const mockHnippTemplate: HnippTemplate = {
  templateId: 'HNIPP.DEMO.ID',
  title: 'Demo title',
  externalBody: 'Demo body {{arg1}}',
  internalBody: 'Demo data copy',
  clickActionUrl: '//demo/{{arg2}}',
  args: ['arg1', 'arg2'],
  scope: '@island.is/documents',
}
const mockTemplates = [mockHnippTemplate, mockHnippTemplate, mockHnippTemplate]

const mockCreateHnippNotificationDto: CreateHnippNotificationDto = {
  recipient: '1234567890',
  templateId: 'HNIPP.DEMO.ID',
  args: [
    { key: 'arg1', value: 'hello' },
    { key: 'arg2', value: 'world' },
  ],
}

const mockLocale = 'is'

describe('MessageProcessorService', () => {
  let service: MessageProcessorService
  let notificationsService: NotificationsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({}), LoggingModule],

      providers: [
        MessageProcessorService,
        NotificationsService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
        {
          provide: getModelToken(Notification),
          useClass: jest.fn(() => ({})),
        },
        {
          provide: getModelToken(ActorNotification),
          useClass: jest.fn(() => ({})),
        },
        {
          provide: CmsService,
          useValue: {
            fetchData: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<MessageProcessorService>(MessageProcessorService)
    notificationsService =
      module.get<NotificationsService>(NotificationsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should process message', async () => {
    jest
      .spyOn(notificationsService, 'getTemplates')
      .mockImplementation(() => Promise.resolve(mockTemplates))
    jest
      .spyOn(notificationsService, 'getTemplate')
      .mockImplementation(() => Promise.resolve(mockHnippTemplate))

    const notification = await service.convertToNotification(
      mockCreateHnippNotificationDto,
      mockLocale,
    )
    expect(notification.title).toMatch('Demo title')
    expect(notification.externalBody).toMatch('Demo body hello')
    expect(notification.clickActionUrl).toMatch('//demo/world')
  })

  it('should not leak value replacement of template keys to the template cache', async () => {
    // This test is added to verify that the template cache is not modified
    jest
      .spyOn(notificationsService, 'getTemplates')
      .mockImplementation(() => Promise.resolve(mockTemplates))
    jest
      .spyOn(notificationsService, 'getTemplate')
      .mockImplementation(() => Promise.resolve(mockHnippTemplate))

    const notification1 = await service.convertToNotification(
      mockCreateHnippNotificationDto,
      mockLocale,
    )
    const notification2 = await service.convertToNotification(
      {
        ...mockCreateHnippNotificationDto,
        args: [
          { key: 'arg1', value: 'hello2' },
          { key: 'arg2', value: 'world2' },
        ],
      },
      mockLocale,
    )

    expect(notification1.title).toMatch('Demo title')
    expect(notification1.externalBody).toMatch('Demo body hello')
    expect(notification1.clickActionUrl).toMatch('//demo/world')

    expect(notification2).toMatchObject({
      title: 'Demo title',
      externalBody: 'Demo body hello2',
      internalBody: 'Demo data copy',
      clickActionUrl: '//demo/world2',
    })
  })
})
