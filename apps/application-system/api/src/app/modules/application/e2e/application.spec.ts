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
        applicant: '221290-2169',
        state: 'PENDING',
        attachments: ['https://google.com', 'https://island.is'],
        typeId: 'EXAMPLE',
        answers: {
          ['key-1']: 'some answer',
          ['key-2']: 'another answer',
        },
      })
      .expect(201)

    // Assert
    expect(response.body.id).toBeTruthy()
  })
})
