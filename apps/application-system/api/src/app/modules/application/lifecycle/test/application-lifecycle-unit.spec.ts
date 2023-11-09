import { ApplicationService } from '@island.is/application/api/core'
import { createApplication } from '@island.is/application/testing'
import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { AwsService } from '@island.is/nest/aws'
import { TestApp } from '@island.is/testing/nest'

import { setup } from '../../../../../../test/setup'
import { ApplicationChargeService } from '../../charge/application-charge.service'
import { ApplicationLifecycleModule } from '../application-lifecycle.module'
import { ApplicationLifeCycleService } from '../application-lifecycle.service'

let lifeCycleService: ApplicationLifeCycleService
let awsService: AwsService

export const createApplications = () => {
  return [
    createApplication({
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
  ]
}

class ApplicationServiceMock {
  findAllDueToBePruned(): Application[] {
    return createApplications()
  }
  update(
    id: string,
    application: Partial<
      Pick<Application, 'attachments' | 'answers' | 'externalData'>
    >,
  ) {
    return { numberOfAffectedRows: 1, updatedApplication: application }
  }
}

class ApplicationChargeServiceMock {
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

    awsService = app.get<AwsService>(AwsService)
    lifeCycleService = app.get<ApplicationLifeCycleService>(
      ApplicationLifeCycleService,
    )
  })

  it('should prune answers and prune true.', async () => {
    //PREPARE
    const deleteObjectSpy = jest
      .spyOn(awsService, 'deleteObject')
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
      .spyOn(awsService, 'deleteObject')
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
      .spyOn(awsService, 'deleteObject')
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
})
