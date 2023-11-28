import { Test, TestingModule } from '@nestjs/testing'
import { MessageProcessorService } from './messageProcessor.service'
import { LoggingModule } from '@island.is/logging'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { HnippTemplate } from './dto/hnippTemplate.response'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { CacheModule } from '@nestjs/cache-manager'
import { NotificationsService } from './notifications.service'
import {
  UserProfile,
  UserProfileLocaleEnum,
} from '@island.is/clients/user-profile'
import { getModelToken } from '@nestjs/sequelize'
import { Notification } from './notification.model'

const mockHnippTemplate: HnippTemplate = {
  templateId: 'HNIPP.DEMO.ID',
  notificationTitle: 'Demo title',
  notificationBody: 'Demo body {{arg1}}',
  notificationDataCopy: 'Demo data copy',
  clickAction: '//demo/{{arg2}}',
  category: 'DEMO',
  args: ['arg1', 'arg2'],
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

const mockProfile: UserProfile = {
  nationalId: '1234567890',
  mobilePhoneNumber: '1234567',
  email: 'foo@bar.com',
  locale: UserProfileLocaleEnum.Is,
  documentNotifications: true,
  created: new Date(),
  modified: new Date(),
  id: '1234567',
  emailVerified: true,
  mobilePhoneNumberVerified: true,
  profileImageUrl: '',
  emailStatus: 'VERIFIED',
  mobileStatus: 'VERIFIED',
  lastNudge: new Date(), // ... confirm this property hasright value
}

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
      mockProfile,
    )
    expect(notification.title).toMatch('Demo title')
    expect(notification.body).toMatch('Demo body hello')
    expect(notification.category).toMatch('DEMO')
    expect(notification.appURI).toMatch('//demo/world')
  })
})
