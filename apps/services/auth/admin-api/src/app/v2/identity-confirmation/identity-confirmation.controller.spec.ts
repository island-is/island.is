import request from 'supertest'

import { setupApp, TestApp } from '@island.is/testing/nest'

import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import {
  IdentityConfirmation,
  IdentityConfirmationType,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { getModelToken } from '@nestjs/sequelize'
import { ZendeskService } from '@island.is/clients/zendesk'
import { SmsService } from '@island.is/nova-sms'
import { AppModule } from '../../app.module'
import { ZendeskAuthGuard } from '@island.is/auth-nest-tools'

describe('ConfirmIdentityController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  let identityConfirmationModel: typeof IdentityConfirmation
  let zendeskService: ZendeskService
  let smsService: SmsService

  const userNationalId = createNationalId('person')

  const user = createCurrentUser({
    nationalId: userNationalId,
    scope: ['@identityserver.api/authentication'],
  })

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user,
      dbType: 'postgres',
    })

    server = request(app.getHttpServer())

    identityConfirmationModel = app.get<typeof IdentityConfirmation>(
      getModelToken(IdentityConfirmation),
    )

    zendeskService = app.get(ZendeskService)
    smsService = app.get(SmsService)
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe('Access denied', () => {
    beforeAll(async () => {
      // 👇 This will override the method for all instances
      jest
        .spyOn(ZendeskAuthGuard.prototype, 'canActivate')
        .mockImplementation(() => false)
    })

    afterAll(async () => {
      jest.clearAllMocks()
    })

    it('POST to /v1/identity-confirmation should result in 403 when user does not have correct credentials', async () => {
      // Act
      const response = await server.post('/v1/identity-confirmation').send({
        id: '1',
        type: IdentityConfirmationType.CHAT,
      })

      // Assert
      expect(response.status).toBe(403)
    })
  })

  describe('Access Granted', () => {
    beforeEach(async () => {
      // 👇 This will override the method for all instances
      jest
        .spyOn(ZendeskAuthGuard.prototype, 'canActivate')
        .mockImplementation(() => true)
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
    })

    afterEach(async () => {
      jest.clearAllMocks()
    })

    afterEach(async () => {
      jest.clearAllMocks()
    })

    describe('Type = CHAT', () => {
      it('should return 200 and create identity confirmation', async () => {
        // Act
        const response = await server.post('/v1/identity-confirmation').send({
          id: '1',
          type: IdentityConfirmationType.CHAT,
        })

        // Assert
        expect(response.status).toBe(200)
        expect(smsService.sendSms).not.toBeCalled()
        expect(zendeskService.updateTicket).toBeCalled()

        // Db check
        const identityConfirmation = await identityConfirmationModel.findOne({
          where: { ticketId: '1' },
        })

        expect(identityConfirmation).not.toBeNull()
      })
    })

    describe('Type = EMAIL', () => {
      it('should return 200 and create identity confirmation', async () => {
        // Act
        const response = await server.post('/v1/identity-confirmation').send({
          id: '1',
          type: IdentityConfirmationType.EMAIL,
        })

        // Assert
        expect(response.status).toBe(200)
        expect(smsService.sendSms).not.toBeCalled()
        expect(zendeskService.updateTicket).toBeCalled()

        // Db check
        const identityConfirmation = await identityConfirmationModel.findOne({
          where: { ticketId: '1' },
        })

        expect(identityConfirmation).not.toBeNull()
        expect(smsService.sendSms).not.toBeCalled()
      })
    })

    describe('Type = PHONE', () => {
      it('should return 200 and create identity confirmation', async () => {
        // Act
        const response = await server.post('/v1/identity-confirmation').send({
          id: '1',
          type: IdentityConfirmationType.PHONE,
          number: '1234567',
        })

        // Assert
        expect(response.status).toBe(200)
        expect(smsService.sendSms).toBeCalled()
        expect(zendeskService.updateTicket).not.toBeCalled()
        // Db check
        const identityConfirmation = await identityConfirmationModel.findOne({
          where: { ticketId: '1' },
        })

        expect(identityConfirmation).not.toBeNull()
      })

      it('should return 400 since the type is 400 and phone number is missing', async () => {
        // Act
        const response = await server.post('/v1/identity-confirmation').send({
          id: '1',
          type: IdentityConfirmationType.PHONE,
        })

        // Assert
        expect(response.status).toBe(400)
        expect(zendeskService.updateTicket).not.toBeCalled()
        expect(smsService.sendSms).not.toBeCalled()
      })
    })
  })
})
