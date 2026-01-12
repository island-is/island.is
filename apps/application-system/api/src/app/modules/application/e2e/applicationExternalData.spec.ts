import request from 'supertest'
import { INestApplication } from '@nestjs/common'

import { EmailService } from '@island.is/email-service'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { ApplicationTypes } from '@island.is/application/types'
import { ContentfulRepository } from '@island.is/cms'
import { setup } from '../../../../../test/setup'
import { AppModule } from '../../../app.module'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { MockFeatureFlagService } from './mockFeatureFlagService'
import { createNationalId } from '@island.is/testing/fixtures'

let app: INestApplication

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

let server: request.SuperTest<request.Test>
// eslint-disable-next-line local-rules/disallow-kennitalas
const nationalId = createNationalId('any')
const mockAuthGuard = new MockAuthGuard({
  nationalId,
  scope: [ApplicationScope.read, ApplicationScope.write],
})

beforeAll(async () => {
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
        .useValue(mockAuthGuard),
  })

  server = request(app.getHttpServer())
})

describe('Application External Data ', () => {
  it('should return 400 when put-ing with an invalid actionId', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    const response = await server
      .put(`/applications/${creationResponse.body.id}/externalData`)
      .send({
        dataProviders: [
          {
            actionId: 'actionId',
          },
        ],
      })
      .expect(400)
    expect(response.body.detail).toBe(
      'Current user is not permitted to update external data in this state with actionId: actionId',
    )
  })

  it('should return 200 when getting external data and persist data', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    const response = await server
      .put(`/applications/${creationResponse.body.id}/externalData`)
      .send({
        dataProviders: [
          {
            actionId: 'Application.mockProvider',
          },
        ],
      })
      .expect(200)
    const expectedExternalData = {
      mocked: true,
      mockObject: {
        mockString: 'This is a mocked string',
        mockArray: ['Need to mock providers?', 'Use this handy templateApi'],
      },
    }

    expect(response.body.externalData.referenceMock.data).toEqual(
      expectedExternalData,
    )

    const getResponse = await server
      .get(`/applications/${creationResponse.body.id}`)
      .expect(200)

    expect(getResponse.body.externalData.referenceMock.data).toEqual(
      expectedExternalData,
    )
  })

  it('should get and not persist with shouldPersistToExternalData false', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    const response = await server
      .put(`/applications/${creationResponse.body.id}/externalData`)
      .send({
        dataProviders: [
          {
            actionId: 'getAnotherReferenceData',
          },
        ],
      })
      .expect(200)

    const expectedExternalData = {
      anotherData: {
        stuff: 'someDataString',
      },
    }

    expect(response.body.externalData.getAnotherReferenceData.data).toEqual(
      expectedExternalData,
    )

    const getResponse = await server
      .get(`/applications/${creationResponse.body.id}`)
      .expect(200)

    expect(
      getResponse.body.externalData.getAnotherReferenceData,
    ).toBeUndefined()
  })
})
