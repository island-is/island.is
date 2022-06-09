import request from 'supertest'
import { INestApplication } from '@nestjs/common'

import { EmailService } from '@island.is/email-service'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { ApplicationTypes } from '@island.is/application/core'
import { ContentfulRepository } from '@island.is/cms'
import { setup } from '../../../../../test/setup'

import { AppModule } from '../../../app.module'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { MockFeatureFlagService } from './mockFeatureFlagService'
import * as uuid from 'uuidv4'

import { getRequestMethod, TestEndpointOptions } from '@island.is/testing/nest'
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
const nationalId = createNationalId()
const mockAuthGuard = new MockAuthGuard({
  nationalId,
  delegationType: ['LegalGuardian'],
  scope: [ApplicationScope.read, ApplicationScope.write],
  actor: {
    nationalId: createNationalId(),
    scope: [],
  },
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

describe('Application system API delegation guard', () => {
  it.each([
    {
      method: 'POST',
      endpoint: '/applications',
      send: {
        typeId: ApplicationTypes.EXAMPLE,
      },
    },
    {
      method: 'GET',
      endpoint: `/applications/${uuid.uuid()}`,
      send: {},
    },
    {
      method: 'PUT',
      endpoint: `/applications/${uuid.uuid()}`,
      send: {
        answers: {
          careerHistoryCompanies: ['government'],
          dreamJob: 'pilot',
        },
      },
    },
    {
      method: 'PUT',
      endpoint: `/applications/${uuid.uuid()}/submit`,
      send: { event: 'SUBMIT' },
    },
    {
      method: 'PUT',
      endpoint: `/applications/${uuid.uuid()}/externalData`,
      send: {
        dataProviders: [{ id: 'test', type: 'ExampleSucceeds' }],
      },
    },
    {
      method: 'GET',
      endpoint: `/users/${nationalId}/applications`,
      send: {
        dataProviders: [{ id: 'test', type: 'ExampleSucceeds' }],
      },
    },
    {
      method: 'PUT',
      endpoint: `/applications/${uuid.uuid()}/attachments`,
      send: {
        key: '',
        url: '',
      },
    },
    {
      method: 'DELETE',
      endpoint: `/applications/${uuid.uuid()}/attachments`,
      send: {
        key: '',
      },
    },
    {
      method: 'PUT',
      endpoint: `/applications/${uuid.uuid()}/generatePdf`,
      send: {
        type: '',
      },
    },
    {
      method: 'PUT',
      endpoint: `/applications/${uuid.uuid()}/requestFileSignature`,
      send: {
        type: '',
      },
    },
    {
      method: 'GET',
      endpoint: `/applications/${uuid.uuid()}/test/presignedUrl`,
      send: {},
    },
    {
      method: 'PUT',
      endpoint: `/applications/${uuid.uuid()}/uploadSignedFile`,
      send: {
        type: '',
        documentToken: '0000',
      },
    },
    {
      method: 'PUT',
      endpoint: `/applications/assign`,
      send: {
        token: '0000',
      },
    },
    {
      method: 'DELETE',
      endpoint: `/applications/${uuid.uuid()}`,
      send: {},
    },
  ])(
    '$method $endpoint should return 403 when user is delegated requesting an application that does not support delegations',
    async ({ method, endpoint, send }: TestEndpointOptions) => {
      // Act
      const res = await getRequestMethod(server, method)(endpoint).send(send)

      // Assert
      expect(res.status).toEqual(403)
      expect(res.body).toMatchObject({
        status: 403,
        title: 'Bad Subject',
        type: 'https://docs.devland.is/reference/problems/bad-subject',
      })
    },
  )
})
