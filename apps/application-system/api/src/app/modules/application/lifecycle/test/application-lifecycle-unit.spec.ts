import { ApplicationService } from '@island.is/application/api/core'
import { createApplication } from '@island.is/application/testing'
import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { S3Service } from '@island.is/nest/aws'
import { setup } from '../../../../../../test/setup'
import { ApplicationChargeService } from '../../charge/application-charge.service'
import { ApplicationLifecycleModule } from '../application-lifecycle.module'
import { ApplicationLifeCycleService } from '../application-lifecycle.service'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'

let lifeCycleService: ApplicationLifeCycleService
let s3Service: S3Service

jest.mock('@island.is/application/template-loader')

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
  findAllDueToBePruned(): Application[] {
    return createApplications()
  }

  findAllDueToBePostPruned(): Application[] {
    return createPostPruneApplications()
  }

  update(
    id: string,
    application: Partial<
      Pick<
        Application,
        | 'attachments'
        | 'answers'
        | 'externalData'
        | 'pruned'
        | 'postPruneAt'
        | 'postPruned'
      >
    >,
  ) {
    return { numberOfAffectedRows: 1, updatedApplication: application }
  }
}

class ApplicationChargeServiceMock {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteCharge(application: Pick<Application, 'id'>) {
    // do nothing
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
      .mockResolvedValue()

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
      .mockResolvedValueOnce()

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
    expect(result[1].application.postPruneAt).toBeInstanceOf(Date)
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
})
