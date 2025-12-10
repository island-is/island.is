import request from 'supertest'
import { INestApplication } from '@nestjs/common'

import { EmailService } from '@island.is/email-service'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { ContentfulRepository } from '@island.is/cms'
import { setup } from '../../../../../test/setup'
import { environment } from '../../../../environments'
import { AppModule } from '../../../app.module'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { MockFeatureFlagService } from './mockFeatureFlagService'
import * as uuid from 'uuidv4'
import jwt from 'jsonwebtoken'
import { coreHistoryMessages } from '@island.is/application/core'
import { sharedModuleConfig } from '@island.is/application/template-api-modules'

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

const mockConfig = {
  clientLocationOrigin: 'http://localhost:4242',
  baseApiUrl: 'http://localhost:4444',
  attachmentBucket: 'attachmentBucket',
  templateApi: {
    clientLocationOrigin: 'http://localhost:4242/umsoknir',
    email: {
      sender: 'Devland.is',
      address: 'development@island.is',
    },
    jwtSecret: 'supersecret',
    xRoadBasePathWithEnv: '',
    baseApiUrl: 'http://localhost:4444',
    presignBucket: '',
    attachmentBucket: 'island-is-dev-storage-application-system',
    generalPetition: {
      endorsementApiBasePath: 'http://localhost:4246',
    },
    userProfile: {
      serviceBasePath: 'http://localhost:3366',
    },
  },
}

let server: request.SuperTest<request.Test>
// eslint-disable-next-line local-rules/disallow-kennitalas
const nationalId = '1234564321'
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
        .overrideProvider(sharedModuleConfig.KEY)
        .useValue(mockConfig)
        .overrideGuard(IdsUserGuard)
        .useValue(mockAuthGuard),
  })

  server = request(app.getHttpServer())
})

describe('Application system API', () => {
  it(`POST /application should register application`, async () => {
    // Act
    const response = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.PARENTAL_LEAVE,
      })
      .expect(201)

    // Assert
    expect(response.body.id).toBeTruthy()
  })

  it('should set and return a pending action for an application', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers: {
          careerHistoryDetails: {
            careerHistoryCompanies: ['government'],
          },
          dreamJob: 'pilot',
        },
      })
      .expect(200)

    // Advance from prerequisites state
    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const newStateResponse = await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    expect(newStateResponse.body.state).toBe('inReview')

    expect(newStateResponse.body.actionCard.pendingAction.title).toBe(
      'Verið er að fara yfir umsóknina',
    )
    expect(newStateResponse.body.actionCard.pendingAction.content).toBe(
      'Example stofnun fer núna yfir umsóknina og því getur þetta tekið nokkra daga',
    )
  })

  it('should fetch Application History for overview', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers: {
          careerHistoryDetails: {
            careerHistoryCompanies: ['government'],
          },
          dreamJob: 'pilot',
        },
      })
      .expect(200)

    // Advance from prerequisites state
    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const list = await server
      .get(`/users/${nationalId}/applications`)
      .expect(200)

    const historyLog = list?.body[0]?.actionCard?.history[0]?.log

    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const listAgain = await server
      .get(`/users/${nationalId}/applications`)
      .expect(200)

    expect(historyLog).toBe(coreHistoryMessages.applicationSent.defaultMessage)
    expect(listAgain.body[0].actionCard.history).toHaveLength(2)
  })

  // This template does not have readyForProduction: false
  it.skip('should succeed when POST-ing an application that has an undefined readyforproduction flag, on production environment', async () => {
    const envBefore = environment.environment
    environment.environment = 'production'

    const failedResponse = await server
      .post('/applications')
      .send({
        applicant: nationalId,
        state: 'draft',
        attachments: {},
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
        assignees: [nationalId],
        answers: {
          careerHistoryDetails: {
            careerHistoryCompanies: ['government'],
          },
          dreamJob: 'pilot',
        },
        status: ApplicationStatus.DRAFT,
      })
      .expect(400)

    expect(failedResponse.body.message).toBe(
      'Template ExampleForm is not ready for production',
    )

    environment.environment = envBefore
  })

  it('should fail when PUT-ing answers on an application which dont comply the dataschema', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers: {
          careerHistoryDetails: {
            careerHistoryCompanies: ['government'],
          },
          dreamJob: 'pilot',
        },
      })
      .expect(200)

    const putResponse = await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers: {
          careerHistoryDetails: {
            careerHistoryCompanies: ['this', 'is', 'not', 'allowed'],
          },
        },
      })
      .expect(400)

    // Assert
    expect(putResponse.body).toMatchInlineSnapshot(`
      Object {
        "detail": "Found issues in these fields: careerHistoryDetails",
        "fields": Object {
          "careerHistoryDetails": Object {
            "careerHistoryCompanies": Array [
              "Ógilt gildi",
              "Ógilt gildi",
              "Ógilt gildi",
              "Ógilt gildi",
            ],
          },
        },
        "status": 400,
        "title": "Validation Failed",
        "type": "https://docs.devland.is/reference/problems/validation-failed",
      }
    `)
  })

  it('should fail when PUT-ing answers in a very deep nested schema which doesnt comply', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers: {
          deepNestedValues: {
            something: {
              very: {
                deep: {
                  so: {
                    so: {
                      very: {
                        very: {
                          deep: {
                            nested: {
                              value: 6,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          dreamJob: 'pilot',
        },
      })
      .expect(400)

    await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers: {
          deepNestedValues: {
            something: {
              very: {
                deep: {
                  so: {
                    so: {
                      very: {
                        very: {
                          deep: {
                            nested: {
                              value: 'hello',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          dreamJob: 'pilot',
        },
      })
      .expect(200)
  })

  it('should fail when PUT-ing answers on an application where it is in a state where it is not permitted', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers: {
          careerHistoryDetails: {
            careerHistoryCompanies: ['government'],
          },
          dreamJob: 'pilot',
        },
      })
      .expect(200)

    // Advance from prerequisites state
    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const newStateResponse = await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    expect(newStateResponse.body.state).toBe('inReview')

    const failedResponse = await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers: {
          dreamJob: 'firefighter',
        },
      })
      .expect(403)

    expect(failedResponse.body.detail).toBe(
      'Current user is not permitted to update the following answers: dreamJob',
    )
  })

  it('should be able to PUT answers when updating the state of the application', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    // Advance from prerequisites state
    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const response = await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers: {
          careerHistoryDetails: {
            careerHistoryCompanies: ['government'],
          },
          dreamJob: 'pilot',
        },
      })
      .expect(200)

    const newStateResponse = await server
      .put(`/applications/${response.body.id}/submit`)
      .send({
        event: 'SUBMIT',
        answers: {
          careerHistoryDetails: {
            careerHistoryCompanies: ['advania', 'aranja'],
          },
        },
      })
      .expect(200)

    expect(newStateResponse.body.state).toBe('waitingToAssign')
    expect(newStateResponse.body.answers).toEqual({
      careerHistoryDetails: {
        careerHistoryCompanies: ['advania', 'aranja'],
      },
      dreamJob: 'pilot',
    })
  })

  it('should not update non-writable answers when PUT-ing answers while updating the state', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    // Advance from prerequisites state
    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const response = await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers: {
          careerHistoryCompanies: ['government'],
          dreamJob: 'pilot',
        },
      })
      .expect(200)

    await server
      .put(`/applications/${response.body.id}/submit`)
      .send({
        event: 'SUBMIT',
      })
      .expect(200)

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
      careerHistoryCompanies: ['government'],
      dreamJob: 'pilot', // this answer is non-writable
    })
  })

  it('should fail when PUT-ing anything else than answers', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    const response = await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        applicant: '1111',
        assignees: ['1234'],
        attachments: {
          someAttachment: 'asdf',
        },
      })
      .expect(400)

    expect(response.body).toMatchInlineSnapshot(`
      Object {
        "detail": Array [
          "property applicant should not exist",
          "property assignees should not exist",
          "property attachments should not exist",
        ],
        "status": 400,
        "title": "Bad Request",
        "type": "https://httpstatuses.org/400",
      }
    `)
  })

  it('should fail when PUT-ing externalData on an application where it is in a state where it is not permitted', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    // Advance from prerequisites state
    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const response = await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers: {
          careerHistoryDetails: {
            careerHistoryCompanies: ['government'],
          },
        },
      })
      .expect(200)

    await server
      .put(`/applications/${response.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const newStateResponse = await server
      .put(`/applications/${response.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    expect(newStateResponse.body.state).toBe('inReview')

    const failedResponse = await server
      .put(`/applications/${response.body.id}/externalData`)
      .send({
        dataProviders: [{ actionId: 'test' }],
      })
      .expect(400)

    expect(failedResponse.body.detail).toBe(
      `Current user is not permitted to update external data in this state with actionId: test`,
    )
  })

  it('should fail when PUT-ing an application that does not exist', async () => {
    const response = await server
      .put('/applications/98e83b8a-fd75-44b5-a922-0f76c99bdcae')
      .send({
        answers: {
          usage: 4,
        },
      })
      .expect(404)

    // Assert
    expect(response.body).toMatchObject({
      title: 'Not Found',
      detail:
        'An application with the id 98e83b8a-fd75-44b5-a922-0f76c99bdcae does not exist',
    })
  })

  it('should successfully PUT answers to an existing application if said answers comply to the schema', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.PARENTAL_LEAVE,
      })
      .expect(201)

    const response = await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
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
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.PARENTAL_LEAVE,
      })
      .expect(201)

    const response = await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
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
    expect(putResponse.body.title).toBe('Bad Request')
  })

  it('GET /users/:nationalId/applications should not return applications that are in an unlisted state', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    const getResponse = await server
      .get(`/users/${nationalId}/applications`)
      .expect(200)

    expect(getResponse.body).toEqual([])

    // Advance from prerequisites state
    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const updatedGetResponse = await server
      .get(`/users/${nationalId}/applications`)
      .expect(200)

    expect(updatedGetResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          applicant: nationalId,
          typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
        }),
      ]),
    )
  })

  it('GET /users/:nationalId/applications should return a list of applications of the user', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.PARENTAL_LEAVE,
      })
      .expect(201)

    // Advance from prerequisites state
    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    await server.put(`/applications/${creationResponse.body.id}`).send({
      answers: {
        usage: 4,
      },
    })

    const getResponse = await server
      .get(`/users/${nationalId}/applications`)
      .expect(200)

    // Assert
    expect(getResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ applicant: nationalId }),
      ]),
    )
  })

  it(`GET /users/:nationalId/applications?typeId=ParentalLeave should return the list of applications of the user by typeId`, async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.PARENTAL_LEAVE,
      })
      .expect(201)

    // Advance from prerequisites state
    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const getResponse = await server
      .get(
        `/users/${nationalId}/applications?typeId=${ApplicationTypes.PARENTAL_LEAVE}`,
      )
      .expect(200)

    // Assert
    expect(getResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          applicant: nationalId,
          typeId: ApplicationTypes.PARENTAL_LEAVE,
        }),
      ]),
    )
  })

  it('GET /users/:nationalId/applications?typeId=ParentalLeave&status=inprogress should return the list of applications of the user by typeId and status', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.PARENTAL_LEAVE,
      })
      .expect(201)

    // Advance from prerequisites state
    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const getResponse = await server
      .get(
        `/users/${nationalId}/applications?typeId=${ApplicationTypes.PARENTAL_LEAVE}&status=${ApplicationStatus.DRAFT}`,
      )
      .expect(200)

    // Assert
    expect(getResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          applicant: nationalId,
          typeId: ApplicationTypes.PARENTAL_LEAVE,
          status: ApplicationStatus.DRAFT,
        }),
      ]),
    )
  })

  it('should update external data with template api module action response', async () => {
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)

    // Advance from prerequisites state
    await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    const answers = {
      person: {
        name: 'Tester',
        nationalId: '1234567890',
        age: '30',
        email: 'tester@island.is',
        phoneNumber: '+3548234567',
      },
      dreamJob: 'Yes',
      attachments: [],
      careerHistory: 'yes',
      careerHistoryDetails: {
        careerHistoryCompanies: ['aranja'],
      },
    }

    const draftStateResponse = await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers,
      })
      .expect(200)

    expect(draftStateResponse.body.state).toBe('draft')
    expect(draftStateResponse.body.externalData).toEqual({})

    await server
      .put(`/applications/${draftStateResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

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

  const mockExampleApplicationInAssignableState = async (
    includeNonce = true,
  ): Promise<{
    token: string
    applicationId: string
  }> => {
    const secret = environment.templateApi.jwtSecret

    const nonce = uuid.uuid()
    const uuidSpy = jest.spyOn(uuid, 'uuid')
    uuidSpy.mockImplementationOnce(() => nonce)
    //create applications in assign state.
    const creationResponse = await server
      .post('/applications')
      .send({
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
      })
      .expect(201)
    const answers = {
      assigneeEmail: 'email@email.com',
      person: {
        age: '3123',
        name: '123123',
        email: 'another@email.com',
        nationalId: '123',
        phoneNumber: '+3545555555',
      },
    }

    await server
      .put(`/applications/${creationResponse.body.id}`)
      .send({
        answers,
      })
      .expect(200)

    const draftStateResponse = await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    expect(draftStateResponse.body.state).toBe('draft')
    expect(draftStateResponse.body.externalData).toEqual({})

    const token = jwt.sign(
      {
        applicationId: creationResponse.body.id,
        state: 'waitingToAssign',
        ...(includeNonce && { nonce }),
      },
      secret,
      { expiresIn: 100 },
    )

    console.log(
      {
        applicationId: creationResponse.body.id,
        state: 'waitingToAssign',
        ...(includeNonce && { nonce }),
      },
      secret,
      { expiresIn: 100 },
    )

    const jwtspy = jest.spyOn(jwt, 'sign')
    jwtspy.mockImplementationOnce(() => token)

    const employerWaitingToAssignResponse = await server
      .put(`/applications/${creationResponse.body.id}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    expect(employerWaitingToAssignResponse.body.state).toBe('waitingToAssign')
    expect(employerWaitingToAssignResponse.body.assignNonces).toStrictEqual([
      nonce,
    ])

    return { token, applicationId: creationResponse.body.id }
  }

  it('PUT applications/assign should work just once', async () => {
    const { token } = await mockExampleApplicationInAssignableState()

    await server
      .put('/applications/assign')
      .send({
        token,
      })
      .expect(200)

    //switch to another user
    mockAuthGuard.auth.nationalId = '1234567890'

    const assignAgain = await server
      .put('/applications/assign')
      .send({
        token,
      })
      .expect(404)
    expect(assignAgain.body.detail).toBe('Token no longer usable.')
  })

  it('PUT applications/assign returns to draft and creates a new token. Old token should be invalid', async () => {
    const { token, applicationId } =
      await mockExampleApplicationInAssignableState()

    await server
      .put(`/applications/${applicationId}/submit`)
      .send({ event: 'EDIT' })
      .expect(200)

    const employerWaitingToAssignResponse = await server
      .put(`/applications/${applicationId}/submit`)
      .send({ event: 'SUBMIT' })
      .expect(200)

    expect(employerWaitingToAssignResponse.body.state).toBe('waitingToAssign')

    const assignAgain = await server
      .put('/applications/assign')
      .send({
        token,
      })
      .expect(404)

    expect(assignAgain.body.detail).toBe('Token no longer usable.')
  })

  it('PUT applications/assign supports legacy tokens', async () => {
    const { token } = await mockExampleApplicationInAssignableState(false)

    await server
      .put('/applications/assign')
      .send({
        token,
      })
      .expect(200)
  })

  // TODO: Validate that an application that is in a state that should be pruned
  // is not listed when (mocked) Date.now > application.pruneAt
})
