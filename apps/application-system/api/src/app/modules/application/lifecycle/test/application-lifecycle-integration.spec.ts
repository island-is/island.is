import request from 'supertest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { INestApplication } from '@nestjs/common'
import { setup } from '../../../../../../test/setup'
import { ApplicationLifeCycleService } from '../application-lifecycle.service'
import { ApplicationTypes } from '@island.is/application/core'
import * as utils from '../../utils/application'
import { AwsService } from '../../files/aws.service'
import { EmailService } from '@island.is/email-service'
import { ContentfulRepository } from '@island.is/cms'

let app: INestApplication
let server: request.SuperTest<request.Test>
let lifeCycleService: ApplicationLifeCycleService
let awsService: AwsService
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
  app = await setup({
    override: (builder) =>
      builder
        .overrideProvider(ContentfulRepository)
        .useClass(MockContentfulRepository)
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
  lifeCycleService = app.get<ApplicationLifeCycleService>(
    ApplicationLifeCycleService,
  )
  awsService = app.get<AwsService>(AwsService)

  jest.spyOn(awsService, 'deleteObjects').mockResolvedValue()
  jest.spyOn(awsService, 'fileExists').mockResolvedValue(false)
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
    expect(shouldBeEmpty2.body.answers).toEqual({})
    expect(shouldNotBeEmpty.body.answers).toEqual({ usage: 4 })
  })

  it('should prune answers on applications correctly by lifecycle preset.', async () => {
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
  console.log('creating application')
  const response = await server
    .post('/applications')
    .send({
      typeId: ApplicationTypes.EXAMPLE,
    })
    .expect(201)
  return response
}

export const updateApplication = async (applicationId: string) => {
  console.log('updating application')
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
