import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { EmailService } from '@island.is/email-service'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import { ContentfulRepository } from '@island.is/api/domains/cms'

import { setup } from '../../../../../test/setup'
import { environment } from '../../../../environments'

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

const nationalId = '1234564321'
let server: request.SuperTest<request.Test>

beforeAll(async () => {
  app = await setup({
    override: (builder) => {
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
        )
        .compile()
    },
  })

  server = request(app.getHttpServer())
})

describe('Application system payments API', () => {
  it(`POST /application/:id/payment should create a payment object`, async () => {
    // Act
    const response = await server
      .post('/applications/1/payment')
      .expect(201)

    // Assert
    expect(response.body.id).toBeTruthy()
  })
})
