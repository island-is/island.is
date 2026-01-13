import { Test, TestingModule } from '@nestjs/testing'
import { NotificationsService } from '../notifications.service'
import { LoggingModule, logger, LOGGER_PROVIDER } from '@island.is/logging'
import { HnippTemplate } from '../dto/hnippTemplate.response'
import { CreateHnippNotificationDto } from '../dto/createHnippNotification.dto'
import { CacheModule } from '@nestjs/cache-manager'
import { getModelToken } from '@nestjs/sequelize'
import { Notification } from '../notification.model'
import { ActorNotification } from '../actor-notification.model'
import { DocumentsScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'

import {
  ExtendedPaginationDto,
  UpdateNotificationDto,
  RenderedNotificationDto,
  PaginatedNotificationDto,
  PaginatedActorNotificationDto,
  UnreadNotificationsCountDto,
  UnseenNotificationsCountDto,
} from '../dto/notification.dto'
import { CmsService } from '@island.is/clients/cms'

const user: User = {
  nationalId: '1234567890',
  scope: [DocumentsScope.main],
  authorization: '',
  client: '',
}

const mockHnippTemplate: HnippTemplate = {
  templateId: 'HNIPP.DEMO.ID',
  title: 'Demo title ',
  externalBody: 'Demo body {{arg1}}',
  internalBody: 'Demo data copy',
  clickActionUrl: 'Demo click action {{arg2}}',
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

describe('NotificationsService', () => {
  let service: NotificationsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register({}), LoggingModule],
      providers: [
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

    service = module.get<NotificationsService>(NotificationsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should get templates', async () => {
    jest
      .spyOn(service, 'getTemplates')
      .mockImplementation(() => Promise.resolve(mockTemplates))

    const templates = await service.getTemplates()
    expect(templates).toBeInstanceOf(Array)
    expect(templates).toEqual(mockTemplates)
  })

  it('should get template', async () => {
    jest
      .spyOn(service, 'getTemplate')
      .mockImplementation(() => Promise.resolve(mockHnippTemplate))
    const template = await service.getTemplate(mockHnippTemplate.templateId)
    expect(template).toBeInstanceOf(Object)
  })

  it('should validate when all required arguments are provided', () => {
    expect(() => {
      service.validate(mockHnippTemplate, mockCreateHnippNotificationDto.args)
    }).not.toThrow()
  })

  it('should throw error when required arguments are missing', () => {
    const incompleteArgs = [{ key: 'arg1', value: 'hello' }] // Missing arg2
    expect(() => {
      service.validate(mockHnippTemplate, incompleteArgs)
    }).toThrow('Missing required arguments')
  })

  it('should sanitize and return only valid arguments', () => {
    const argsWithInvalid = [
      { key: 'arg1', value: 'hello' },
      { key: 'arg2', value: 'world' },
      { key: 'invalidArg', value: 'should be filtered' },
    ]
    const validArgs = service.sanitize(mockHnippTemplate, argsWithInvalid)
    expect(validArgs).toHaveLength(2)
    expect(validArgs).toEqual([
      { key: 'arg1', value: 'hello' },
      { key: 'arg2', value: 'world' },
    ])
  })

  it('should sanitize and return empty array when no valid arguments', () => {
    const invalidArgs = [
      { key: 'invalidArg1', value: 'should be filtered' },
      { key: 'invalidArg2', value: 'should be filtered' },
    ]
    const validArgs = service.sanitize(mockHnippTemplate, invalidArgs)
    expect(validArgs).toHaveLength(0)
  })

  it('should replace template {{placeholders}} with args', async () => {
    mockCreateHnippNotificationDto.args = [
      { key: 'arg1', value: 'hello' },
      { key: 'arg2', value: 'world' },
    ]
    const template = await service.formatArguments(
      mockCreateHnippNotificationDto.args,
      mockHnippTemplate,
    )
    expect(template.externalBody).toEqual('Demo body hello')
    expect(template.clickActionUrl).toEqual('Demo click action world')
  })

  describe('findMany', () => {
    it('should return a paginated list of notifications', async () => {
      const query = new ExtendedPaginationDto()
      const mockedResponse = new PaginatedNotificationDto()
      jest
        .spyOn(service, 'findMany')
        .mockImplementation(async () => mockedResponse)

      expect(await service.findMany(user.nationalId, query, [])).toBe(
        mockedResponse,
      )
    })
  })

  describe('findActorNotifications', () => {
    it('should return a paginated list of actor notifications', async () => {
      const recipient = '1234567890'
      const query = new ExtendedPaginationDto()
      const mockedResponse = new PaginatedActorNotificationDto()
      jest
        .spyOn(service, 'findActorNotifications')
        .mockImplementation(async () => mockedResponse)

      expect(await service.findActorNotifications(recipient, query)).toBe(
        mockedResponse,
      )
    })
  })

  describe('findOne', () => {
    it('should return a specific notification', async () => {
      const id = 123
      const mockedResponse = new RenderedNotificationDto()
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => mockedResponse)

      expect(await service.findOne(user, id, 'en')).toBe(mockedResponse)
    })
  })

  describe('update', () => {
    it('should update a notification', async () => {
      const id = 123
      const updateNotificationDto = new UpdateNotificationDto()
      const mockedResponse = new RenderedNotificationDto()
      jest
        .spyOn(service, 'update')
        .mockImplementation(async () => mockedResponse)

      expect(await service.update(user, id, updateNotificationDto, 'en')).toBe(
        mockedResponse,
      )
    })
  })

  describe('Seen', () => {
    it('should get all unseen notification count', async () => {
      const mockedResponse = new UnseenNotificationsCountDto()
      jest
        .spyOn(service, 'getUnseenNotificationsCount')
        .mockImplementation(async () => mockedResponse)

      expect(await service.getUnseenNotificationsCount(user)).toBe(
        mockedResponse,
      )
    })

    it('should mark all notifications as seen', async () => {
      jest
        .spyOn(service, 'markAllAsSeen')
        .mockImplementation(async () => undefined)

      expect(await service.markAllAsSeen(user)).toBe(undefined)
    })
  })

  describe('unread', () => {
    it('should get all unread notification count', async () => {
      const mockedResponse = new UnreadNotificationsCountDto()
      jest
        .spyOn(service, 'getUnreadNotificationsCount')
        .mockImplementation(async () => mockedResponse)

      expect(await service.getUnreadNotificationsCount(user)).toBe(
        mockedResponse,
      )
    })
  })
})
