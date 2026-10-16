import { ApplicationService } from '@island.is/application/api/core'
import { FileService } from '@island.is/application/api/files'
import { HistoryService } from '@island.is/application/api/history'
import { NotificationsApi } from '@island.is/clients/user-notification'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import { ApplicationChargeService } from '../../charge/application-charge.service'
import { ApplicationLifeCycleService } from '../application-lifecycle.service'

jest.mock('@island.is/application/template-loader')

describe('ApplicationLifeCycleService scheduled notifications', () => {
  let service: ApplicationLifeCycleService
  let applicationService: {
    findCurrentScheduledNotifications: jest.Mock
    findOneById: jest.Mock
    markScheduledNotificationsSent: jest.Mock
    markScheduledNotificationsFailed: jest.Mock
  }
  let notificationApi: {
    notificationsControllerCreateHnippNotification: jest.Mock
  }

  const application = {
    id: 'app-id',
    applicant: '0101302989',
    applicantActors: [] as string[],
  }

  const sentDtos = () =>
    notificationApi.notificationsControllerCreateHnippNotification.mock.calls.map(
      ([{ createHnippNotificationDto }]) => createHnippNotificationDto,
    )

  beforeEach(async () => {
    applicationService = {
      findCurrentScheduledNotifications: jest.fn(),
      findOneById: jest.fn().mockResolvedValue(application),
      markScheduledNotificationsSent: jest.fn(),
      markScheduledNotificationsFailed: jest.fn(),
    }
    notificationApi = {
      notificationsControllerCreateHnippNotification: jest.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        ApplicationLifeCycleService,
        {
          provide: LOGGER_PROVIDER,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            child: jest.fn().mockReturnThis(),
          },
        },
        { provide: ApplicationService, useValue: applicationService },
        { provide: FileService, useValue: {} },
        { provide: ApplicationChargeService, useValue: {} },
        { provide: NotificationsApi, useValue: notificationApi },
        { provide: HistoryService, useValue: {} },
      ],
    }).compile()

    service = module.get(ApplicationLifeCycleService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should send to the applicant when the notification has no recipients', async () => {
    applicationService.findCurrentScheduledNotifications.mockResolvedValue([
      {
        id: 'n1',
        application_id: application.id,
        template: 'HNIPP.TEST',
        args: [{ key: 'a', value: 'b' }],
        recipients: null,
      },
    ])

    await service['fetchAndSendCurrentScheduledNotifications']()

    expect(sentDtos()).toEqual([
      {
        recipient: application.applicant,
        templateId: 'HNIPP.TEST',
        args: [{ key: 'a', value: 'b' }],
      },
    ])
    expect(
      applicationService.markScheduledNotificationsSent,
    ).toHaveBeenCalledWith(['n1'])
  })

  it('should send to each stored recipient instead of the applicant', async () => {
    applicationService.findOneById.mockResolvedValue({
      ...application,
      applicantActors: ['1212121212'],
    })
    applicationService.findCurrentScheduledNotifications.mockResolvedValue([
      {
        id: 'n1',
        application_id: application.id,
        template: 'HNIPP.ASSIGNEE',
        args: [],
        recipients: ['1111111111', '2222222222'],
      },
    ])

    await service['fetchAndSendCurrentScheduledNotifications']()

    expect(sentDtos()).toEqual([
      { recipient: '1111111111', templateId: 'HNIPP.ASSIGNEE', args: [] },
      { recipient: '2222222222', templateId: 'HNIPP.ASSIGNEE', args: [] },
    ])
    expect(
      applicationService.markScheduledNotificationsSent,
    ).toHaveBeenCalledWith(['n1', 'n1'])
  })
})
