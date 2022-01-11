import { TestApp } from '@island.is/testing/nest'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import {
  createApplication,
  createCurrentUser,
} from '@island.is/testing/fixtures'
import { INestApplication } from '@nestjs/common'
import { setup } from '../../../../../../test/setup'
import { ApplicationLifeCycleService } from '../application-lifecycle.service'
import { ApplicationService } from '../../application.service'
import { Application } from '@island.is/application/core'
import { AwsService } from '../../files/aws.service'
import {
  ApplicationConfig,
  APPLICATION_CONFIG,
} from '../../application.configuration'
import { LoggingModule } from '@island.is/logging'
import AmazonS3URI from 'amazon-s3-uri'

jest.mock('amazon-s3-uri')

let app: INestApplication
let lifeCycleService: ApplicationLifeCycleService
let awsService: AwsService

export const createApplications = () => {
  const newApplication = createApplication()

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

describe('ApplicationLifecycleService Unit tests', () => {
  beforeAll(async () => {
    const currentUser = createCurrentUser()
    const { nationalId } = currentUser

    const mockAmazonS3URI = AmazonS3URI as jest.Mock
    mockAmazonS3URI.mockReturnValue({ key: 'sdfsf' })
    /*app = await setup({
    override: (builder) =>
      builder
        .overrideProvider(ApplicationService)
        .useClass(ApplicationServiceMock)
        .overrideProvider(AwsService)
        .useClass(AwsService),
  })*/

    const config: ApplicationConfig = {
      presignBucket: 'bucket',
      attachmentBucket: 'bucket2',
    }
    const module = await Test.createTestingModule({
      imports: [LoggingModule],
      providers: [
        AwsService,
        {
          provide: ApplicationService,
          useClass: ApplicationServiceMock,
        },
        ApplicationLifeCycleService,
        { provide: APPLICATION_CONFIG, useValue: config },
      ],
    }).compile()

    awsService = module.get<AwsService>(AwsService)
    lifeCycleService = module.get<ApplicationLifeCycleService>(
      ApplicationLifeCycleService,
    )
  })
  it('should prune answers correctly.', async () => {
    //PREPARE
    const deleteObjectsSpy = jest
      .spyOn(awsService, 'deleteObjects')
      .mockResolvedValue()
    const fileExistsSpy = jest
      .spyOn(awsService, 'fileExists')
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)

    //ACT
    await lifeCycleService.run()

    const res = lifeCycleService.getProcessingApplications()

    //ASSERT
    expect(deleteObjectsSpy).toHaveBeenCalled()
    expect(fileExistsSpy).toHaveBeenCalledTimes(2)
    expect(res[0].messages).toEqual([
      'Failed to delete attachment of s3://example-bucket/path/to/object',
    ])
    expect(res[0].application.attachments).toEqual({
      key: 's3://example-bucket/path/to/object',
    })
    expect(res[0].application.answers).toEqual({})
    expect(res[0].application.externalData).toEqual({})
  })
})
