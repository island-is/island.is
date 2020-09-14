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
        attachments: {},
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

  it('should fail when PUT-ing an application that does not exist', async () => {
    const response = await request(app.getHttpServer())
      .put('/application/98e83b8a-fd75-44b5-a922-0f76c99bdcae')
      .send({
        applicant: '123456-4321',
        state: 'PENDING',
        attachments: {},
        assignee: '123456-1234',
        externalId: '123',
        answers: {
          person: { age: '19' },
        },
      })
      .expect(404)

    // Assert
    expect(response.body.error).toBe('Not Found')
    expect(response.body.message).toBe(
      'An application with the id 98e83b8a-fd75-44b5-a922-0f76c99bdcae does not exist',
    )
  })

  it('should successfully PUT answers to an existing application if said answers comply to the schema', async () => {
    const server = request(app.getHttpServer())
    const response = await server.post('/application').send({
      applicant: '123456-4321',
      state: 'PENDING',
      attachments: {},
      typeId: 'ExampleForm',
      assignee: '123456-1234',
      externalId: '123',
      answers: {
        person: { age: '19' },
      },
    })

    expect(response.body.answers.person.age).toBe('19')
    expect(response.body.answers.careerHistory).toBe(undefined)

    const { id } = response.body
    const putResponse = await server
      .put(`/application/${id}`)
      .send({
        answers: {
          careerHistory: 'yes',
          person: { age: '22' },
        },
      })
      .expect(200)

    // Assert
    expect(putResponse.body.answers.person.age).toBe('22')
    expect(putResponse.body.answers.careerHistory).toBe('yes')
  })

  it('PUT /application/:id should not be able to overwrite external data', async () => {
    const server = request(app.getHttpServer())
    const response = await server.post('/application').send({
      applicant: '123456-4321',
      state: 'PENDING',
      attachments: {},
      typeId: 'ExampleForm',
      assignee: '123456-1234',
      externalId: '123',
      answers: {
        person: { age: '19' },
      },
    })

    const { id } = response.body
    const putResponse = await server
      .put(`/application/${id}`)
      .send({
        externalData: {
          test: { asdf: 'asdf' },
        },
      })
      .expect(400)

    // Assert
    expect(putResponse.body.error).toBe('Bad Request')
  })
})
