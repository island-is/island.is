import request from 'supertest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { INestApplication } from '@nestjs/common'
import { setup } from '../../../../../../test/setup'
import { ApplicationLifeCycleService } from '../application-lifecycle.service'
import { ApplicationTypes } from '@island.is/application/types'
import * as utils from '../../utils/application'
import { S3Service } from '@island.is/nest/aws'
import { EmailService } from '@island.is/email-service'
import { ContentfulRepository } from '@island.is/cms'
import { ApplicationLifecycleModule } from '../application-lifecycle.module'
import { AppModule } from '../../../../app.module'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { MockFeatureFlagService } from '../../e2e/mockFeatureFlagService'

let app: INestApplication
let server: request.SuperTest<request.Test>
let lifeCycleService: ApplicationLifeCycleService
let s3Service: S3Service
const sendMail = () => ({
  messageId: 'some id',
})

class MockEmailService {
  getTransport() {
    return { sendMail }
  }

  sendEmail() {
    return sendMail()
  }
}

class MockContentfulRepository {
  async getLocalizedEntries() {
    return {
      items: [
        {
          fields: [
            {
              fields: {
                strings: {
                  en: {},
                  'is-IS': {},
                },
              },
            },
          ],
        },
      ],
    }
  }
}

beforeAll(async () => {
  const currentUser = createCurrentUser()
  const { nationalId } = currentUser
  app = await setup(AppModule, {
    override: (builder) =>
      builder
        .overrideProvider(ContentfulRepository)
        .useClass(MockContentfulRepository)
        .overrideProvider(FeatureFlagService)
        .useClass(MockFeatureFlagService)
        .overrideProvider(EmailService)
        .useClass(MockEmailService)
        .overrideGuard(IdsUserGuard)
        .useValue(
          new MockAuthGuard({
            nationalId,
            scope: [ApplicationScope.read, ApplicationScope.write],
          }),
        ),
  })

  const lifeCycleApp = await setup(ApplicationLifecycleModule)

  lifeCycleService = lifeCycleApp.get<ApplicationLifeCycleService>(
    ApplicationLifeCycleService,
  )
  s3Service = app.get<S3Service>(S3Service)

  jest.spyOn(s3Service, 'deleteObject').mockResolvedValue()
  server = request(app.getHttpServer())
})
describe('ApplicationLifecycleService', () => {
  it('should prune answers on applications correctly by lifecycle preset.', async () => {
    //PREPARE
    const date = new Date()
    date.setDate(date.getDate() - 2)
    mockLifecycleOnce(date)
    const firstCreate = await createApplication()
    const updateResponse = await updateApplication(firstCreate.body.id)
    expect(updateResponse.body.answers.usage).toBe(4)

    mockLifecycleOnce(new Date())
    const secondCreate = await createApplication()
    const secondUpdateResponse = await updateApplication(secondCreate.body.id)
    expect(secondUpdateResponse.body.answers.usage).toBe(4)

    // Use the templates own lifecycle and not mocking it.
    const thirdCreate = await createApplication()
    const thirdUpdateResponse = await updateApplication(thirdCreate.body.id)
    expect(thirdUpdateResponse.body.answers.usage).toBe(4)

    //ACT
    await lifeCycleService.run()

    //ASSERT
    const shouldBeEmpty = await server
      .get(`/applications/${firstCreate.body.id}`)
      .expect(200)

    const shouldBeEmpty2 = await server
      .get(`/applications/${secondCreate.body.id}`)
      .expect(200)

    const shouldNotBeEmpty = await server
      .get(`/applications/${thirdCreate.body.id}`)
      .expect(200)

    expect(shouldBeEmpty.body.answers).toEqual({})
    expect(shouldBeEmpty.body.pruned).toEqual(true)

    expect(shouldBeEmpty2.body.answers).toEqual({})
    expect(shouldBeEmpty2.body.pruned).toBe(true)

    expect(shouldNotBeEmpty.body.answers).toEqual({ usage: 4 })
    expect(shouldNotBeEmpty.body.pruned).toBe(false)
  })

  it('should not try to prune anything when all applications have been pruned.', async () => {
    //PREPARE
    const date = new Date()
    date.setDate(date.getDate() - 2)
    mockLifecycleOnce(date)

    const firstCreate = await createApplication()
    const updateResponse = await await server
      .put(`/applications/${firstCreate.body.id}`)
      .send({
        answers: {
          usage: 4,
        },
      })
      .expect(200)

    expect(updateResponse.body.answers.usage).toBe(4)

    //ACT
    await lifeCycleService.run()

    //ASSERT
    const shouldBeEmpty = await server
      .get(`/applications/${firstCreate.body.id}`)
      .expect(200)

    expect(shouldBeEmpty.body.answers).toEqual({})
    expect(shouldBeEmpty.body.pruned).toBe(true)

    //create a new application with its default lifecycle that should not be pruned
    await createApplication()

    await lifeCycleService.run()

    const processedApplications = lifeCycleService.getProcessingApplications()

    expect(processedApplications).toEqual([])
  })
})

export const mockLifecycleOnce = (pruneDate: Date) => {
  jest.spyOn(utils, 'getApplicationLifecycle').mockImplementationOnce(() => {
    return {
      isListed: true,
      pruneAt: pruneDate,
    }
  })
}

export const createApplication = async () => {
  const response = await server
    .post('/applications')
    .send({
      typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
    })
    .expect(201)
  return response
}

export const updateApplication = async (applicationId: string) => {
  const response = await server
    .put(`/applications/${applicationId}`)
    .send({
      answers: {
        usage: 4,
      },
    })
    .expect(200)
  return response
}
