import request from 'supertest'
import { INestApplication } from '@nestjs/common'

import { EmailService } from '@island.is/email-service'

import { setup } from '../../../../../test/setup'
import { environment } from '../../../../environments'
import * as tokenUtils from '../utils/tokenUtils'
import { FileService } from '../files/file.service'

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

const nationalId = '123456-4321'
let server: request.SuperTest<request.Test>

beforeAll(async () => {
  app = await setup({
    override: (builder) => {
      builder
        .overrideProvider(EmailService)
        .useClass(MockEmailService)
        .compile()
    },
  })

  server = request(app.getHttpServer())
})

describe('Application system API', () => {
  let spy: jest.SpyInstance<
    string | undefined,
    [import('@nestjs/common').ExecutionContext]
  >
  beforeEach(() => {
    spy = jest.spyOn(tokenUtils, 'getNationalIdFromToken')
    spy.mockImplementation(() => {
      return nationalId
    })
  })
  afterAll(() => {
    spy.mockRestore()
  })
  it(`POST /application should register application`, async () => {
    // Act
    const response = await server
      .post('/applications')
      .send({
        applicant: nationalId,
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

  // This template does not have readyForProduction: false
  it('should fail when POST-ing an application whose template is not ready for production, on production environment', async () => {
    const envBefore = environment.environment
    environment.environment = 'production'

    const failedResponse = await server
      .post('/applications')
      .send({
        applicant: nationalId,
        state: 'draft',
        attachments: {},
        typeId: 'ExampleForm',
        assignees: ['123456-1234'],
        answers: {
          careerHistoryCompanies: ['government'],
          dreamJob: 'pilot',
        },
      })
      .expect(400)

    expect(failedResponse.body.message).toBe(
      'Template ExampleForm is not ready for production',
    )

    environment.environment = envBefore
  })

  it('should fail when trying to POST when not logged in', async () => {
    spy.mockRestore()

    const failedResponse = await server
      .post('/applications')
      .send({
        applicant: nationalId,
        state: 'draft',
        attachments: {},
        typeId: 'ExampleForm',
        assignees: ['123456-1234'],
        answers: {
          careerHistoryCompanies: ['government'],
          dreamJob: 'pilot',
        },
      })
      .expect(401)

    expect(failedResponse.body.message).toBe('You are not authenticated')
  })

  it('should fail when PUT-ing answers on an application which dont comply the dataschema', async () => {
    const response = await server
      .post('/applications')
      .send({
        applicant: nationalId,
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

    const putResponse = await server
      .put(`/applications/${response.body.id}`)
      .send({
        answers: {
          careerHistoryCompanies: ['this', 'is', 'not', 'allowed'],
        },
      })
      .expect(403)

    // Assert
    expect(putResponse.body.message).toBe('Schema validation has failed')
  })

  it('should fail when PUT-ing answers on an application where it is in a state where it is not permitted', async () => {
    const response = await server
      .post('/applications')
      .send({
        applicant: nationalId,
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
      .expect(403)

    expect(failedResponse.body.message).toBe(
      'Current user is not permitted to update the following answers: dreamJob',
    )
  })

  it('should be able to PUT answers when updating the state of the application', async () => {
    const response = await server
      .post('/applications')
      .send({
        applicant: nationalId,
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
      dreamJob: 'pilot',
    })
  })

  it('should not update non-writable answers when PUT-ing answers while updating the state', async () => {
    const response = await server
      .post('/applications')
      .send({
        applicant: nationalId,
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
    const response = await server
      .post('/applications')
      .send({
        applicant: nationalId,
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
        dataProviders: [{ id: 'test', type: 'ExampleSucceeds' }],
      })
      .expect(400)

    expect(failedResponse.body.message).toBe(
      'Current user is not permitted to update external data in this state: inReview',
    )
  })

  it('should fail when PUT-ing an application that does not exist', async () => {
    const response = await server
      .put('/applications/98e83b8a-fd75-44b5-a922-0f76c99bdcae')
      .send({
        applicant: nationalId,
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
    const response = await server.post('/applications').send({
      applicant: nationalId,
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
    const response = await server.post('/applications').send({
      applicant: nationalId,
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
    await server.post('/applications').send({
      applicant: nationalId,
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
        expect.objectContaining({ applicant: nationalId }),
      ]),
    )
  })

  it('GET /assignees/:nationalRegistryId/applications should return a list of applications for assignee', async () => {
    await server.post('/applications').send({
      applicant: nationalId,
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

  it('PUT application/:id/createPdf should return a presigned url', async () => {
    const expectPresignedUrl = 'presignedurl'
    const type = 'ChildrenResidenceChange'

    const fileService: FileService = app.get<FileService>(FileService)
    jest
      .spyOn(fileService, 'createPdf')
      .mockImplementation(() => Promise.resolve(expectPresignedUrl))

    const postResponse = await server.post('/applications').send({
      applicant: nationalId,
      state: 'draft',
      attachments: {},
      typeId: 'ChildrenResidenceChange',
      assignees: [],
      answers: {
        usage: 4,
      },
    })

    const newState = await server
      .put(`/application/${postResponse.body.id}/createPdf`)
      .send({
        type: type,
      })
      .expect(200)

    // Assert
    expect(newState.body.attachments).toEqual({
      ChildrenResidenceChange: 'presignedurl',
    })
  })

  it('should update external data with template api module action response', async () => {
    const answers = {
      person: {
        name: 'Tester',
        nationalId: '1234567890',
        age: '30',
        email: 'tester@island.is',
        phoneNumber: '8234567',
      },
      dreamJob: 'Yes',
      attachments: [],
      careerHistory: 'yes',
      careerHistoryCompanies: ['aranja'],
    }

    const draftStateResponse = await server
      .post('/applications')
      .send({
        applicant: nationalId,
        state: 'draft',
        attachments: {},
        typeId: 'ExampleForm',
        assignees: ['123456-1234'],
        answers,
      })
      .expect(201)

    expect(draftStateResponse.body.state).toBe('draft')
    expect(draftStateResponse.body.externalData).toEqual({})

    const inReviewStateResponse = await server
      .put(`/applications/${draftStateResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    expect(inReviewStateResponse.body.state).toBe('inReview')

    const inReviewExternalDataKeys = Object.keys(
      inReviewStateResponse.body.externalData,
    )
    expect(inReviewExternalDataKeys).toContain('createApplication')
    expect(
      inReviewStateResponse.body.externalData.createApplication.data,
    ).toEqual({ id: 1337 })

    const approvedStateResponse = await server
      .put(`/applications/${draftStateResponse.body.id}/submit`)
      .send({
        event: 'APPROVE',
        answers: {
          ...answers,
          approvedByReviewer: 'APPROVE',
        },
      })
      .expect(200)

    expect(approvedStateResponse.body.state).toBe('approved')

    const approvedExternalDataKeys = Object.keys(
      approvedStateResponse.body.externalData,
    )
    expect(approvedExternalDataKeys).toContain('completeApplication')
    expect(
      approvedStateResponse.body.externalData.completeApplication.data,
    ).toEqual({ id: 1337 })
  })
})
