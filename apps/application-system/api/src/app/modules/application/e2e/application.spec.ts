import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('Application', () => {
  it(`POST /application should register application`, async () => {
    // Act
    const response = await request(app.getHttpServer())
      .post('/application')
      .send({
        applicant: '123456-4321',
        state: 'PENDING',
        attachments: ['https://island.is'],
        typeId: 'ExampleForm',
        assignee: '123456-1234',
        externalId: '123',
        answers: {
          person: { age: '19' },
        },
      })
      .expect(201)

    // Assert
    expect(response.body.id).toBeTruthy()
  })
})
