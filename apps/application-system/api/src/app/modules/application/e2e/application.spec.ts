import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { DataProviderTypes } from '@island.is/application/core'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('Application system API', () => {
  it(`POST /application should register application`, async () => {
    // Act
    const response = await request(app.getHttpServer())
      .post('/applications')
      .send({
        applicant: '123456-4321',
        state: 'draft',
        attachments: {},
        typeId: 'ParentalLeave',
        assignees: ['123456-1234'],
        answers: {
          usage: 3,
        },
      })
      .expect(201)

    // Assert
    expect(response.body.id).toBeTruthy()
  })

  it('should fail when PUT-ing answers on an application where it is in a state where it is not permitted', async () => {
    const server = request(app.getHttpServer())
    const response = await server
      .post('/applications')
      .send({
        applicant: '123456-4321',
        state: 'draft',
        attachments: {},
        typeId: 'ExampleForm',
        assignees: ['123456-1234'],
        answers: {
          careerHistoryCompanies: ['government'],
          dreamJob: 'pilot',
        },
      })
      .expect(201)

    const newStateResponse = await server
      .put(`/applications/${response.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    expect(newStateResponse.body.state).toBe('inReview')

    const failedResponse = await server
      .put(`/applications/${response.body.id}`)
      .send({
        answers: {
          dreamJob: 'firefighter',
        },
      })
      .expect(400)

    expect(failedResponse.body.message).toBe(
      'Current user is not permitted to update the following answers: dreamJob',
    )
  })

  it('should be able to PUT answers when updating the state of the application', async () => {
    const server = request(app.getHttpServer())
    const response = await server
      .post('/applications')
      .send({
        applicant: '123456-4321',
        state: 'draft',
        attachments: {},
        typeId: 'ExampleForm',
        assignee: '123456-1234',
        answers: {
          careerHistoryCompanies: ['government'],
          dreamJob: 'pilot',
        },
      })
      .expect(201)

    const newStateResponse = await server
      .put(`/applications/${response.body.id}/submit`)
      .send({
        event: 'SUBMIT',
        answers: {
          careerHistoryCompanies: ['advania', 'aranja'],
        },
      })
      .expect(200)

    expect(newStateResponse.body.state).toBe('inReview')
    expect(newStateResponse.body.answers).toEqual({
      careerHistoryCompanies: ['advania', 'aranja'],
    })
  })

  it('should not update non-writable answers when PUT-ing answers while updating the state', async () => {
    const server = request(app.getHttpServer())
    const response = await server
      .post('/applications')
      .send({
        applicant: '123456-4321',
        state: 'draft',
        attachments: {},
        typeId: 'ExampleForm',
        assignee: '123456-1234',
        answers: {
          careerHistoryCompanies: ['government'],
          dreamJob: 'pilot',
        },
      })
      .expect(201)

    await server
      .put(`/applications/${response.body.id}/submit`)
      .send({
        event: 'SUBMIT',
      })
      .expect(200)

    const finalStateResponse = await server
      .put(`/applications/${response.body.id}/submit`)
      .send({
        event: 'APPROVE',
        answers: {
          careerHistoryCompanies: ['government', 'aranja', 'advania'],
          dreamJob: 'firefighter',
        },
      })
      .expect(200)

    expect(finalStateResponse.body.state).toBe('approved')
    expect(finalStateResponse.body.answers).toEqual({
      careerHistoryCompanies: ['government', 'aranja', 'advania'],
      dreamJob: 'pilot', // this answer is non-writable
    })
  })

  it('should fail when PUT-ing externalData on an application where it is in a state where it is not permitted', async () => {
    const server = request(app.getHttpServer())
    const response = await server
      .post('/applications')
      .send({
        applicant: '123456-4321',
        state: 'draft',
        attachments: {},
        typeId: 'ExampleForm',
        assignees: ['123456-1234'],
        answers: {
          careerHistoryCompanies: ['government'],
        },
      })
      .expect(201)

    const newStateResponse = await server
      .put(`/applications/${response.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    expect(newStateResponse.body.state).toBe('inReview')

    const failedResponse = await server
      .put(`/applications/${response.body.id}/externalData`)
      .send({
        dataProviders: [
          { id: 'test', type: DataProviderTypes.ExampleSucceeds },
        ],
      })
      .expect(400)

    expect(failedResponse.body.message).toBe(
      'Current user is not permitted to update external data in this state: inReview',
    )
  })

  it('should fail when PUT-ing an application that does not exist', async () => {
    const response = await request(app.getHttpServer())
      .put('/applications/98e83b8a-fd75-44b5-a922-0f76c99bdcae')
      .send({
        applicant: '123456-4321',
        attachments: {},
        assignees: ['123456-1234'],
        answers: {
          usage: 4,
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
    const response = await server.post('/applications').send({
      applicant: '123456-4321',
      state: 'draft',
      attachments: {},
      typeId: 'ParentalLeave',
      assignees: ['123456-1234'],
      answers: {
        usage: 4,
      },
    })
    expect(response.body.answers.usage).toBe(4)
    expect(response.body.answers.spread).toBe(undefined)

    const { id } = response.body
    const putResponse = await server
      .put(`/applications/${id}`)
      .send({
        answers: {
          usage: 1,
          spread: 22,
        },
      })
      .expect(200)

    // Assert
    expect(putResponse.body.answers.usage).toBe(1)
    expect(putResponse.body.answers.spread).toBe(22)
  })

  it('PUT /applications/:id should not be able to overwrite external data', async () => {
    const server = request(app.getHttpServer())
    const response = await server.post('/applications').send({
      applicant: '123456-4321',
      state: 'draft',
      attachments: {},
      typeId: 'ParentalLeave',
      assignees: ['123456-1234'],
      answers: {
        usage: 4,
      },
    })

    const { id } = response.body
    const putResponse = await server
      .put(`/applications/${id}`)
      .send({
        externalData: {
          test: { asdf: 'asdf' },
        },
      })
      .expect(400)

    // Assert
    expect(putResponse.body.error).toBe('Bad Request')
  })

  it('GET /applicants/:nationalRegistryId/applications should return a list of applications for applicant', async () => {
    const server = request(app.getHttpServer())
    const postResponse = await server.post('/applications').send({
      applicant: '123456-4321',
      state: 'draft',
      attachments: {},
      typeId: 'ParentalLeave',
      assignees: ['123456-1234'],
      answers: {
        usage: 4,
      },
    })

    const getResponse = await server
      .get('/applicants/123456-4321/applications')
      .expect(200)

    // Assert
    expect(getResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ applicant: '123456-4321' }),
      ]),
    )
  })

  it('GET /assignees/:nationalRegistryId/applications should return a list of applications for assignee', async () => {
    const server = request(app.getHttpServer())
    const postResponse = await server.post('/applications').send({
      applicant: '123456-4321',
      state: 'draft',
      attachments: {},
      typeId: 'ParentalLeave',
      assignees: ['123456-1234'],
      answers: {
        usage: 4,
      },
    })

    const getResponse = await server
      .get('/assignees/123456-1234/applications')
      .expect(200)

    // Assert
    expect(getResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ assignees: ['123456-1234'] }),
      ]),
    )
  })
})
