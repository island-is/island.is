import request from 'supertest'

import { TestApp } from '@island.is/testing/nest'
import { defaultScopes, setupWithAuth } from '../../../../test/setup'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { uuid } from 'uuidv4'
import addDays from 'date-fns/addDays'
import {
  IdentityConfirmation,
  IdentityConfirmationService,
  IdentityConfirmationType,
  LIFE_TIME_DAYS,
} from '@island.is/auth-api-lib'
import { getModelToken } from '@nestjs/sequelize'
import { ZendeskService } from '@island.is/clients/zendesk'
import { SmsService } from '@island.is/nova-sms'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'

describe('ConfirmIdentityController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  let identityConfirmationModel: typeof IdentityConfirmation
  let identityConfirmationService: IdentityConfirmationService
  let zendeskService: ZendeskService
  let smsService: SmsService
  let nationalRegistryClient: NationalRegistryV3ClientService

  const userNationalId = createNationalId('person')

  const user = createCurrentUser({
    nationalId: userNationalId,
    scope: [defaultScopes.testUserHasAccess.name],
  })

  const validDate = addDays(new Date(), -1)
  const invalidDate = addDays(new Date(), -(2 * LIFE_TIME_DAYS))

  const identityConfirmations = {
    valid1: {
      id: uuid(),
      created: validDate,
      ticketId: '1',
      type: IdentityConfirmationType.CHAT,
    },
    valid2: {
      id: uuid(),
      created: validDate,
      ticketId: '1',
      type: IdentityConfirmationType.CHAT,
    },
    expired: {
      id: uuid(),
      created: invalidDate,
      ticketId: '2',
      type: IdentityConfirmationType.CHAT,
    },
  }

  beforeAll(async () => {
    app = await setupWithAuth({
      user,
    })

    server = request(app.getHttpServer())

    identityConfirmationModel = app.get<typeof IdentityConfirmation>(
      getModelToken(IdentityConfirmation),
    )

    identityConfirmationService = app.get(IdentityConfirmationService)
    nationalRegistryClient = app.get(NationalRegistryV3ClientService)
    zendeskService = app.get(ZendeskService)
    smsService = app.get(SmsService)
  })

  beforeEach(async () => {
    // Mock get ticket to return a ticket
    zendeskService.getTicket = jest.fn().mockImplementation(async () => {
      return {
        id: '1',
        status: 'open',
        custom_fields: [],
        tags: [],
      }
    })

    // Mock update ticket to do nothing
    zendeskService.updateTicket = jest.fn().mockImplementation(() => {
      return Promise.resolve(true)
    })

    // Mock send sms to do nothing
    smsService.sendSms = jest.fn().mockImplementation(() => {
      return Promise.resolve({})
    })

    // Mock national registry client to return a user
    nationalRegistryClient.getAllDataIndividual = jest.fn().mockResolvedValue({
      kennitala: createNationalId('person'),
      nafn: 'Test Testsson',
      heimilisfang: {
        husHeiti: 'Testgata 1',
        postnumer: '101',
        sveitarfelag: 'Reykjavík',
      },
    })

    // Clear the database
    await identityConfirmationModel.destroy({
      where: {},
      truncate: true,
    })

    // Create the identity confirmations
    await Promise.all(
      Object.values(identityConfirmations).map(
        async ({ id, created, type, ticketId }) => {
          await identityConfirmationModel.create({
            id,
            created,
            type,
            ticketId,
          })
        },
      ),
    )
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  it('GET identity-confirmation for ID 123 should not exist and should therefor return 204 ', async () => {
    // Act
    const response = await server.get('/confirm-identity/123')

    // Assert
    expect(response.status).toBe(204)
  })

  it('GET identity-confirmation for valid1 should exist and should therefor return 200 ', async () => {
    // Act
    const response = await server.get(
      `/confirm-identity/${identityConfirmations.valid1.id}`,
    )

    // Assert
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: identityConfirmations.valid1.id,
      ticketId: identityConfirmations.valid1.ticketId,
      type: identityConfirmations.valid1.type,
      isExpired: false,
    })
  })

  it('deleteExpiredIdentityConfirmations should delete 1 identity confirmations since mock db contains 1 that has been expired for a while', async () => {
    // Act
    const deleted =
      await identityConfirmationService.deleteExpiredIdentityConfirmations()

    expect(deleted).toBe(1)
  })

  it('GET request for expired identity confirmation should return 200 with isExpired flag set to true', async () => {
    // Act
    const response = await server.get(
      `/confirm-identity/${identityConfirmations.expired.id}`,
    )

    // Assert
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: identityConfirmations.expired.id,
      ticketId: identityConfirmations.expired.ticketId,
      type: identityConfirmations.expired.type,
      isExpired: true,
    })
  })

  it('POST identity-confirmation/id should call zendesk updateTicket and delete the identity confirmation, then return 200', async () => {
    // Act
    const response = await server.post(
      `/confirm-identity/${identityConfirmations.valid1.id}`,
    )

    // Assert
    expect(response.status).toBe(200)
    expect(nationalRegistryClient.getAllDataIndividual).toBeCalledTimes(1)

    // Db assertion
    const ic = await identityConfirmationModel.findOne({
      where: {
        id: identityConfirmations.valid1.id,
      },
    })

    expect(ic).toBe(null)
  })

  it('POST identity-confirmation/id should return 400 Bad request when user is not found', async () => {
    // Arrange
    // Mock national registry client to return a user
    nationalRegistryClient.getAllDataIndividual = jest
      .fn()
      .mockResolvedValue(null)

    // Act
    const response = await server.post(
      `/confirm-identity/${identityConfirmations.valid2.id}`,
    )

    // Assert
    expect(response.status).toBe(400)
    expect(nationalRegistryClient.getAllDataIndividual).toBeCalledTimes(1)

    // Db assertion
    const ic = await identityConfirmationModel.findOne({
      where: {
        id: identityConfirmations.valid2.id,
      },
    })

    expect(ic).not.toBeNull()
    expect(ic?.id).toBe(identityConfirmations.valid2.id)
  })
})
