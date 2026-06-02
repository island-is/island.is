import { ApplicationService } from '@island.is/application/api/core'
import { createApplication } from '@island.is/application/testing'
import {
  ApplicationWithAttachments,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
} from '@island.is/application/types'
import { S3Service } from '@island.is/nest/aws'
import { setup } from '../../../../../../test/setup'
import { ApplicationChargeService } from '../../charge/application-charge.service'
import { ApplicationLifecycleModule } from '../application-lifecycle.module'
import { ApplicationLifeCycleService } from '../application-lifecycle.service'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import addMonths from 'date-fns/addMonths'
import { createDailyCompletionNotifications } from '@island.is/application/api/payment'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import { FileService } from '@island.is/application/api/files'
import { NotificationsApi } from '@island.is/clients/user-notification'
import { HistoryService } from '@island.is/application/api/history'

let lifeCycleService: ApplicationLifeCycleService
let s3Service: S3Service

jest.mock('@island.is/application/template-loader')

jest.mock('@island.is/application/api/payment', () => ({
  ...jest.requireActual('@island.is/application/api/payment'),
  createDailyCompletionNotifications: jest.fn(),
}))

beforeEach(() => {
  ;(getApplicationTemplateByTypeId as jest.Mock).mockResolvedValue({
    adminDataConfig: undefined,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

export const createApplications = () => [
  createApplication({
    state: 'draft',
    answers: {
      question: 'yes',
      isAnotherQuestion: 'yes',
      attachments: {
        files: {
          file: [
            {
              key: 'key',
              name: 'doc.pdf',
            },
            {
              key: 'anotherkey',
              name: 'anotherDoc.pdf',
            },
          ],
        },
      },
    },
    attachments: {
      key: 's3://example-bucket/path/to/object',
      anotherkey: 's3://example-bucket/path/to/object1',
    },
    externalData: {
      nationalRegistry: {
        data: {
          age: 35,
        },
        date: new Date(),
        status: 'success',
      },
      submitApplication: {
        data: {
          id: 11,
        },
        date: new Date(),
        status: 'success',
      },
    },
  }),
  createApplication({
    state: 'draft',
    answers: { question: 'yes', keepThis: 'admin' },
    externalData: {
      nationalRegistry: {
        data: { age: 42 },
        date: new Date(),
        status: 'success',
      },
    },
    attachments: {},
  }),
]

export const createPostPruneApplications = () => [
  createApplication({
    state: 'draft',
    answers: { keepThis: 'admin' },
    externalData: {},
    attachments: {},
  }),
]

class ApplicationServiceMock {
  findAllDueToBePruned(): ApplicationWithAttachments[] {
    return createApplications()
  }

  findAllDueToBePostPruned(): ApplicationWithAttachments[] {
    return createPostPruneApplications()
  }

  async findCurrentScheduledNotifications() {
    return []
  }

  async cancelScheduledNotifications(id: string) {
    // do nothing
  }

  async findOneById(id: string) {
    return null
  }
  async markScheduledNotificationsSent(ids: string[]) {
    return Promise.resolve()
  }
  async markScheduledNotificationsFailed(ids: string[]) {
    return Promise.resolve()
  }

  update(
    id: string,
    application: Partial<
      Pick<
        ApplicationWithAttachments,
        'attachments' | 'answers' | 'externalData' | 'status'
      >
    >,
  ) {
    return { numberOfAffectedRows: 1, updatedApplication: application }
  }
}

class ApplicationChargeServiceMock {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteCharge(application: Pick<ApplicationWithAttachments, 'id'>) {
    // do nothing
  }
  async getInvoicePaymentApplicationIds() {
    return new Set<string>()
  }
  async getApplicationLink() {
    return 'https://example.is/umsoknir/test/app-id'
  }
}

describe('ApplicationLifecycleService Unit tests', () => {
  beforeAll(async () => {
    const app = await setup(ApplicationLifecycleModule, {
      override: (builder) =>
        builder
          .overrideProvider(ApplicationService)
          .useClass(ApplicationServiceMock)
          .overrideProvider(ApplicationChargeService)
          .useClass(ApplicationChargeServiceMock),
    })

    s3Service = app.get<S3Service>(S3Service)
    lifeCycleService = app.get<ApplicationLifeCycleService>(
      ApplicationLifeCycleService,
    )
  })

  it('should prune answers and prune true.', async () => {
    //PREPARE
    const deleteObjectSpy = jest
      .spyOn(s3Service, 'deleteObject')
      .mockResolvedValue(true)

    //ACT
    await lifeCycleService.run()

    //ASSERT
    const result = lifeCycleService.getProcessingApplications()
    expect(deleteObjectSpy).toHaveBeenCalledTimes(2)

    expect(result[0].application.attachments).toEqual({})
    expect(result[0].application.answers).toEqual({})
    expect(result[0].application.externalData).toEqual({})
    expect(result[0].pruned).toEqual(true)
  })

  it('should prune answers leave one attachment on exist true.', async () => {
    //PREPARE
    const deleteObjectSpy = jest
      .spyOn(s3Service, 'deleteObject')
      .mockReset()
      .mockImplementationOnce(() => {
        throw new Error('Error')
      })
      .mockResolvedValueOnce(true)

    //ACT
    await lifeCycleService.run()

    //ASSERT
    const result = lifeCycleService.getProcessingApplications()
    expect(deleteObjectSpy).toHaveBeenCalledTimes(2)

    expect(result[0].application.attachments).toEqual({
      key: 's3://example-bucket/path/to/object',
    })

    expect(result[0].application.answers).toEqual({})
    expect(result[0].application.externalData).toEqual({})
    expect(result[0].pruned).toEqual(false)
  })

  it('should not remove attachments if deleteObject throws Error.', async () => {
    //PREPARE
    const deleteObjectSpy = jest
      .spyOn(s3Service, 'deleteObject')
      .mockReset()
      .mockImplementation(() => {
        throw new Error('Error')
      })

    //ACT
    await lifeCycleService.run()

    //ASSERT
    const result = lifeCycleService.getProcessingApplications()
    expect(deleteObjectSpy).toHaveBeenCalled()

    expect(result[0].application.attachments).toEqual({
      key: 's3://example-bucket/path/to/object',
      anotherkey: 's3://example-bucket/path/to/object1',
    })

    expect(result[0].application.answers).toEqual({})
    expect(result[0].application.externalData).toEqual({})
    expect(result[0].pruned).toEqual(false)
  })

  it('should retain adminDataConfig fields when pruning', async () => {
    //PREPARE
    const mockTemplate = {
      adminDataConfig: {
        answers: [{ key: 'keepThis', isListed: false }],
        whenToPostPrune: 24 * 3600 * 1000, // one day
      },
    }
    ;(getApplicationTemplateByTypeId as jest.Mock).mockResolvedValue(
      mockTemplate,
    )

    //ACT
    await lifeCycleService.run()
    const result = lifeCycleService.getProcessingApplications()

    //ASSERT
    expect(result[1].application.answers).toEqual({ keepThis: 'admin' })
    expect(result[1].application.externalData).toEqual({})
  })

  it('should handle post-pruning', async () => {
    //ACT
    await lifeCycleService.run()
    const postPruned = lifeCycleService.getProcessingApplicationsPostPruning()

    //ASSERT
    expect(postPruned[0].application.answers).toEqual({})
    expect(postPruned[0].application.externalData).toEqual({})
    expect(postPruned[0].postPruned).toEqual(true)
  })

  describe('filterInvoicesFromPruning', () => {
    let service: ApplicationLifeCycleService
    let applicationService: {
      cancelScheduledNotifications: jest.Mock
      createScheduledNotifications: jest.Mock
      update: jest.Mock
    }
    let applicationChargeService: {
      getInvoicePaymentApplicationIds: jest.Mock
      getApplicationLink: jest.Mock
    }
    let mockLogger: { info: jest.Mock; error: jest.Mock; child: jest.Mock }

    const createPruningEntry = (
      overrides: Partial<
        ApplicationWithAttachments & {
          id: string
          status: ApplicationStatus
          createChargeStatus: 'success' | 'failure' | undefined
          state: string
        }
      > = {},
    ) => ({
      pruned: true,
      failedAttachments: {},
      application: {
        id: overrides.id ?? 'app-id',
        state: overrides.state ?? 'draft',
        status: overrides.status ?? ApplicationStatus.IN_PROGRESS,
        typeId: overrides.typeId ?? ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
        applicant: overrides.applicant ?? 'user123',
        applicantActors: overrides.applicantActors ?? ['user345', 'user678'],
        assignees: overrides.assignees ?? ['user345'],
        modified: new Date(),
        created: new Date(),
        answers: overrides.answers ?? {},
        attachments: {},
        externalData: overrides.createChargeStatus
          ? {
              createCharge: {
                status: overrides.createChargeStatus,
                data: {},
                date: new Date(),
              },
            }
          : ({} as ExternalData),
      } as ApplicationWithAttachments,
    })

    beforeEach(async () => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2026-01-15T12:00:00.000Z'))

      mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
        child: jest.fn().mockReturnThis(),
      }

      applicationService = {
        cancelScheduledNotifications: jest.fn(),
        createScheduledNotifications: jest.fn(),
        update: jest.fn().mockImplementation((_id, app) =>
          Promise.resolve({
            numberOfAffectedRows: 1,
            updatedApplication: app,
          }),
        ),
      }

      applicationChargeService = {
        getInvoicePaymentApplicationIds: jest.fn().mockResolvedValue(new Set()),
        getApplicationLink: jest
          .fn()
          .mockResolvedValue('https://island.is/umsoknir/test/app-id'),
      }
      ;(createDailyCompletionNotifications as jest.Mock).mockReturnValue([
        {
          template: 'completion-reminder',
          schedule_time: new Date(),
          args: [],
        },
      ])

      const module = await Test.createTestingModule({
        providers: [
          ApplicationLifeCycleService,
          { provide: LOGGER_PROVIDER, useValue: mockLogger },
          { provide: ApplicationService, useValue: applicationService },
          { provide: FileService, useValue: {} },
          {
            provide: ApplicationChargeService,
            useValue: applicationChargeService,
          },
          { provide: NotificationsApi, useValue: {} },
          { provide: HistoryService, useValue: {} },
        ],
      }).compile()

      service = module.get(ApplicationLifeCycleService)
    })

    afterEach(() => {
      jest.useRealTimers()
      jest.clearAllMocks()
    })

    it('should keep completed applications with successful charge in the prune queue', async () => {
      const entry = createPruningEntry({
        status: ApplicationStatus.COMPLETED,
        createChargeStatus: 'success',
      })
      service['processingApplications'] = [entry]

      await service['filterInvoicesFromPruning']()

      expect(service['processingApplications']).toEqual([entry])
      expect(
        applicationChargeService.getInvoicePaymentApplicationIds,
      ).not.toHaveBeenCalled()
    })

    it('should keep incomplete applications without successful charge in the prune queue', async () => {
      const entry = createPruningEntry({ createChargeStatus: undefined })
      service['processingApplications'] = [entry]

      await service['filterInvoicesFromPruning']()

      expect(service['processingApplications']).toEqual([entry])
      expect(
        applicationChargeService.getInvoicePaymentApplicationIds,
      ).not.toHaveBeenCalled()
    })

    it('should keep incomplete applications with charge but no invoice payment in the prune queue', async () => {
      const entry = createPruningEntry({
        id: 'no-invoice-app',
        createChargeStatus: 'success',
      })
      service['processingApplications'] = [entry]

      await service['filterInvoicesFromPruning']()

      expect(
        applicationChargeService.getInvoicePaymentApplicationIds,
      ).toHaveBeenCalledWith(['no-invoice-app'])
      expect(service['processingApplications']).toEqual([entry])
      expect(
        applicationService.createScheduledNotifications,
      ).not.toHaveBeenCalled()
    })

    it('should extend prune date and schedule notifications for incomplete invoice applications', async () => {
      const entry = createPruningEntry({
        id: 'invoice-app',
        createChargeStatus: 'success',
        state: 'paymentPending',
      })
      service['processingApplications'] = [entry]

      applicationChargeService.getInvoicePaymentApplicationIds.mockResolvedValue(
        new Set(['invoice-app']),
      )

      await service['filterInvoicesFromPruning']()

      expect(service['processingApplications']).toEqual([])

      const expectedPruneAt = addMonths(new Date('2026-01-15T12:00:00.000Z'), 1)

      expect(applicationChargeService.getApplicationLink).toHaveBeenCalledWith(
        entry.application,
      )
      expect(createDailyCompletionNotifications).toHaveBeenCalledWith(
        'https://island.is/umsoknir/test/app-id',
        new Date('2026-01-15T12:00:00.000Z'),
        expectedPruneAt,
      )
      expect(
        applicationService.cancelScheduledNotifications,
      ).toHaveBeenCalledWith('invoice-app')
      expect(
        applicationService.createScheduledNotifications,
      ).toHaveBeenCalledWith('invoice-app', 'paymentPending', [
        {
          template: 'completion-reminder',
          schedule_time: expect.any(Date),
          args: [],
        },
      ])
      expect(applicationService.update).toHaveBeenCalledWith('invoice-app', {
        ...entry.application,
        pruneAt: expectedPruneAt,
      })
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Found 1 applications with invoice payments to be extended.',
      )
    })

    it('should handle a mixed batch correctly', async () => {
      const completedWithCharge = createPruningEntry({
        id: 'completed',
        status: ApplicationStatus.COMPLETED,
        createChargeStatus: 'success',
      })
      const incompleteNoInvoice = createPruningEntry({
        id: 'card-app',
        createChargeStatus: 'success',
      })
      const incompleteWithInvoice = createPruningEntry({
        id: 'invoice-app',
        createChargeStatus: 'success',
      })
      const normalApp = createPruningEntry({ id: 'normal-app' })

      service['processingApplications'] = [
        completedWithCharge,
        incompleteNoInvoice,
        incompleteWithInvoice,
        normalApp,
      ]

      applicationChargeService.getInvoicePaymentApplicationIds.mockResolvedValue(
        new Set(['invoice-app']),
      )

      await service['filterInvoicesFromPruning']()

      expect(service['processingApplications']).toEqual([
        completedWithCharge,
        normalApp,
        incompleteNoInvoice,
      ])
      expect(
        applicationChargeService.getInvoicePaymentApplicationIds,
      ).toHaveBeenCalledWith(['card-app', 'invoice-app'])
      expect(applicationService.update).toHaveBeenCalledTimes(1)
      expect(applicationService.update).toHaveBeenCalledWith(
        'invoice-app',
        expect.objectContaining({
          pruneAt: addMonths(new Date('2026-01-15T12:00:00.000Z'), 1),
        }),
      )
    })
  })
})
