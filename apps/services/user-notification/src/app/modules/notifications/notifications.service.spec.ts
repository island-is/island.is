import { Test, TestingModule } from '@nestjs/testing'
import { NotificationsService } from './notifications.service'
import { LoggingModule } from '@island.is/logging'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { HnippTemplate } from './dto/hnippTemplate.response'
import { CreateHnippNotificationDto } from './dto/createHnippNotification.dto'
import { CacheModule } from '@nestjs/cache-manager'
import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { getModelToken } from '@nestjs/sequelize'
import { Notification } from './notification.model'

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
      .spyOn(service, 'getTemplates')
      .mockImplementation(() => Promise.resolve(mockTemplates))
    const template = await service.getTemplate(mockHnippTemplate.templateId)
    expect(template).toBeInstanceOf(Object)
  })

  it('should validate true argument count match', () => {
    const counts = service.validateArgCounts(
      mockCreateHnippNotificationDto,
      mockHnippTemplate,
    )
    expect(mockCreateHnippNotificationDto.args.length).toBe(2)
    expect(counts).toBeTruthy()
  })

  it('should validate false on argument count mismatch +', () => {
    mockCreateHnippNotificationDto.args = [
      { key: 'arg1', value: 'hello' },
      { key: 'arg2', value: 'world' },
      { key: 'arg3', value: 'extra' },
    ]
    const counts = service.validateArgCounts(
      mockCreateHnippNotificationDto,
      mockHnippTemplate,
    )
    expect(mockCreateHnippNotificationDto.args.length).toBe(3)
    expect(counts).toBe(false)
  })
  it('should validate false on argument count mismatch -', () => {
    mockCreateHnippNotificationDto.args = [{ key: 'arg2', value: 'world' }]
    const counts = service.validateArgCounts(
      mockCreateHnippNotificationDto,
      mockHnippTemplate,
    )
    expect(mockCreateHnippNotificationDto.args.length).toBe(1)
    expect(counts).toBe(false)
  })

  it('should validate false on argument count mismatch 0', () => {
    mockCreateHnippNotificationDto.args = []
    const counts = service.validateArgCounts(
      mockCreateHnippNotificationDto,
      mockHnippTemplate,
    )
    expect(mockCreateHnippNotificationDto.args.length).toBe(0)
    expect(counts).toBe(false)
  })

  it('should replace template {{placeholders}} with args', () => {
    mockCreateHnippNotificationDto.args = [
      { key: 'arg1', value: 'hello' },
      { key: 'arg2', value: 'world' },
    ]
    const template = service.formatArguments(
      mockCreateHnippNotificationDto,
      mockHnippTemplate,
    )
    expect(template.notificationBody).toEqual('Demo body hello')
    expect(template.clickAction).toEqual('Demo click action world')
  })
})
