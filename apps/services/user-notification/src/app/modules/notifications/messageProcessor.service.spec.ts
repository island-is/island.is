import { Test, TestingModule } from '@nestjs/testing'
import { MessageProcessorService } from './messageProcessor.service'
import { LoggingModule } from '@island.is/logging'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { HnippTemplate } from './dto/hnippTemplate.response'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { BadRequestException } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import {
  UserProfile,
  UserProfileLocaleEnum,
} from '@island.is/clients/user-profile'

const mockHnippTemplate: HnippTemplate = {
  templateId: 'HNIPP.DEMO.ID',
  notificationTitle: 'Demo title ',
  notificationBody: 'Demo body {{arg1}}',
  notificationDataCopy: 'Demo data copy',
  clickAction: 'Demo click action {{arg2}}',
  category: 'Demo category',
  args: ['arg1', 'arg2'],
}
const mockTemplates = [mockHnippTemplate, mockHnippTemplate, mockHnippTemplate]

const mockCreateHnippNotificationDto: CreateHnippNotificationDto = {
  recipient: '1234567890',
  templateId: 'HNIPP.DEMO.ID',
  args: ['asdf', 'qwer'],
}

const mockProfile: UserProfile = {
  nationalId: '1234567890',
  mobilePhoneNumber: '1234567',
  email: 'rafnarnason@gmail.com',
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
}

describe('MessageProcessorService', () => {
  let service: MessageProcessorService
  let notificationsService: NotificationsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggingModule],
      providers: [
        MessageProcessorService,
        NotificationsService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile()

    service = module.get<MessageProcessorService>(MessageProcessorService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // it('process message', async () => {
  //   jest
  //     .spyOn(notificationsService, 'getTemplates')
  //     .mockImplementation(() => Promise.resolve(mockTemplates))
  //   jest
  //     .spyOn(notificationsService, 'getTemplate')
  //     .mockImplementation(() => Promise.resolve(mockHnippTemplate))

  //   const notification = await service.convertToNotification(mockCreateHnippNotificationDto,mockProfile)
  //   expect(notification).toBeInstanceOf(Notification)
  //   // expect(templates).toEqual(mockTemplates)
  // })
})
