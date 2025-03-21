import request from 'supertest'

import { getRequestMethod, setupApp, TestApp } from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'
import { FixtureFactory } from '@island.is/services/auth/testing'
import {
  createCurrentUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { DelegationAdminScopes } from '@island.is/auth/scopes'
import addDays from 'date-fns/addDays'
import {
  CreatePaperDelegationDto,
  Delegation,
  DELEGATION_TAG,
  DelegationDelegationType,
  DelegationsIndexService,
  SequelizeConfigService,
  ZENDESK_CUSTOM_FIELDS,
} from '@island.is/auth-api-lib'

import { AppModule } from '../../../app.module'
import { AuthDelegationType } from '@island.is/shared/types'
import { getModelToken } from '@nestjs/sequelize'
import { faker } from '@island.is/shared/mocking'
import { TicketStatus, ZendeskService } from '@island.is/clients/zendesk'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { ErrorCodes } from '@island.is/shared/utils'

const currentUser = createCurrentUser({
  scope: [DelegationAdminScopes.read, DelegationAdminScopes.admin],
})

describe('DelegationAdmin - With authentication', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let factory: FixtureFactory
  let zendeskService: ZendeskService
  let nationalRegistryApi: NationalRegistryV3ClientService
  let delegationIndexServiceApi: DelegationsIndexService

  beforeEach(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: currentUser,
      dbType: 'postgres',
    })

    server = request(app.getHttpServer())
    factory = new FixtureFactory(app)

    zendeskService = app.get(ZendeskService)
    nationalRegistryApi = app.get(NationalRegistryV3ClientService)
    delegationIndexServiceApi = app.get(DelegationsIndexService)

    jest
      .spyOn(delegationIndexServiceApi, 'indexCustomDelegations')
      .mockImplementation(async () => {
        return
      })

    jest
      .spyOn(delegationIndexServiceApi, 'indexGeneralMandateDelegations')
      .mockImplementation(async () => {
        return
      })
  })

  afterEach(async () => {
    await app.cleanUp()
  })

  async function createDelegationAdmin(user?: User) {
    const domain = await factory.createDomain({
      name: 'd1',
      apiScopes: [
        { name: 's1', supportedDelegationTypes: [AuthDelegationType.Custom] },
      ],
    })

    return factory.createCustomDelegation({
      fromNationalId: user?.nationalId ?? '',
      domainName: domain.name,
      scopes: [{ scopeName: 's1' }],
      referenceId: 'ref1',
    })
  }

  describe('GET /delegation-admin', () => {
    it('GET /delegation-admin should return delegations for nationalId', async () => {
      // Arrange
      const delegation = await createDelegationAdmin(currentUser)
      // Act
      const res = await getRequestMethod(
        server,
        'GET',
      )('/delegation-admin').set('X-Query-National-Id', currentUser.nationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body['outgoing'][0].id).toEqual(delegation.id)
    })
  })

  describe('DELETE /delegation-admin/:delegation', () => {
    it('DELETE /delegation-admin/:delegation should not delete delegation that has no reference id', async () => {
      // Arrange
      const delegationModel = await app.get(getModelToken(Delegation))
      const delegation = await createDelegationAdmin(currentUser)
      // Remove the referenceId
      await delegationModel.update(
        {
          referenceId: null,
        },
        {
          where: {
            id: delegation.id,
          },
        },
      )

      // Act
      const res = await getRequestMethod(
        server,
        'DELETE',
      )(`/delegation-admin/${delegation.id}`)

      // Assert
      expect(res.status).toEqual(204)

      // Assert db
      const deletedDelegation = await delegationModel.findByPk(delegation.id)

      expect(deletedDelegation).not.toBeNull()
    })

    it('DELETE /delegation-admin/:delegation should delete delegation', async () => {
      // Arrange
      const delegation = await createDelegationAdmin(currentUser)

      // Act
      const res = await getRequestMethod(
        server,
        'DELETE',
      )(`/delegation-admin/${delegation.id}`)

      // Assert
      expect(res.status).toEqual(204)

      // Assert db
      const delegationModel = await app.get(getModelToken(Delegation))
      const deletedDelegation = await delegationModel.findByPk(delegation.id)

      expect(deletedDelegation).toBeNull()
    })

    it('DELETE /delegation-admin/:delegation should throw error since id does not exist', async () => {
      // Arrange
      await createDelegationAdmin(currentUser)

      const invalidId = faker.datatype.uuid()
      // Act
      const res = await getRequestMethod(
        server,
        'DELETE',
      )(`/delegation-admin/${invalidId}`)

      // Assert
      expect(res.status).toEqual(204)

      // Assert db
      const delegationModel = await app.get(getModelToken(Delegation))
      const deletedDelegation = await delegationModel.findAll()

      expect(deletedDelegation).not.toBeNull()
    })
  })

  describe('POST /delegation-admin', () => {
    const toNationalId = '0101302399'
    const fromNationalId = '0101307789'

    let zendeskServiceApiSpy: jest.SpyInstance
    let nationalRegistryApiSpy: jest.SpyInstance

    let delegationModel: typeof Delegation
    let delegationDelegationTypeModel: typeof DelegationDelegationType

    beforeEach(async () => {
      delegationModel = await app.get(getModelToken(Delegation))
      delegationDelegationTypeModel = await app.get(
        getModelToken(DelegationDelegationType),
      )

      await factory.createDomain({
        name: 'd1',
        apiScopes: [
          {
            name: 's1',
            supportedDelegationTypes: [
              AuthDelegationType.Custom,
              AuthDelegationType.GeneralMandate,
            ],
          },
        ],
      })

      mockZendeskService(toNationalId, fromNationalId)
      mockNationalRegistryService()
    })

    const mockNationalRegistryService = () => {
      nationalRegistryApiSpy = jest
        .spyOn(nationalRegistryApi, 'getAllDataIndividual')
        .mockImplementation(async (id) => {
          const user = createNationalRegistryUser({
            nationalId: id,
          })

          return user ?? null
        })
    }

    const mockZendeskService = (
      toNationalId: string,
      fromNationalId: string,
      info?: {
        tags?: string[]
        status?: TicketStatus
      },
    ) => {
      const { tags, status } = {
        tags: [DELEGATION_TAG],
        status: TicketStatus.Solved,
        ...info,
      }

      zendeskServiceApiSpy = jest
        .spyOn(zendeskService, 'getTicket')
        .mockImplementation((ticketId: string) => {
          return new Promise((resolve) =>
            resolve({
              id: ticketId,
              tags: tags,
              status: status,
              custom_fields: [
                {
                  id: ZENDESK_CUSTOM_FIELDS.DelegationToReferenceId,
                  value: toNationalId,
                },
                {
                  id: ZENDESK_CUSTOM_FIELDS.DelegationFromReferenceId,
                  value: fromNationalId,
                },
              ],
            }),
          )
        })
    }

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('POST /delegation-admin should create delegation', async () => {
      // Arrange
      const delegation: CreatePaperDelegationDto = {
        toNationalId,
        fromNationalId,
        referenceId: 'ref1',
        validTo: addDays(new Date(), 3),
      }

      // Act
      const res = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin').send(delegation)

      // Assert
      expect(res.status).toEqual(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body.fromNationalId).toEqual(fromNationalId)
      expect(res.body.toNationalId).toEqual(toNationalId)
      expect(res.body.referenceId).toEqual(delegation.referenceId)
      expect(res.body.validTo).toEqual(delegation.validTo?.toISOString())
    })

    it('POST /delegation-admin should create delegation with no expiration date', async () => {
      // Arrange
      const delegation: CreatePaperDelegationDto = {
        toNationalId,
        fromNationalId,
        referenceId: 'ref1',
      }

      // Act
      const res = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin').send(delegation)

      // Assert
      expect(res.status).toEqual(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body.fromNationalId).toEqual(fromNationalId)
      expect(res.body.toNationalId).toEqual(toNationalId)
      expect(res.body.referenceId).toEqual(delegation.referenceId)
      expect(res.body).not.toHaveProperty('validTo')

      // Assert db
      const createdDelegation = await delegationModel.findByPk(res.body.id)
      const createdDelegationDelegationType =
        await delegationDelegationTypeModel.findOne({
          where: {
            delegationId: res.body.id,
          },
        })

      expect(createdDelegation).not.toBeNull()
      expect(createdDelegationDelegationType).not.toBeNull()
    })

    it('POST /delegation-admin should not create delegation with company national id', async () => {
      // Arrange
      const delegation: CreatePaperDelegationDto = {
        toNationalId: '5005005001',
        fromNationalId,
        referenceId: 'ref1',
      }

      // Act
      const res = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin').send(delegation)

      // Assert
      expect(res.status).toEqual(400)
    })

    it('POST /delegation-admin should not create delegation since it already exists', async () => {
      // Arrange
      const { toNationalId, fromNationalId } = {
        toNationalId: '0101302399',
        fromNationalId: '0101307789',
      }

      mockZendeskService(toNationalId, fromNationalId)

      const existingDelegation = await factory.createCustomDelegation({
        fromNationalId,
        toNationalId,
        domainName: null,
        scopes: [{ scopeName: 's1' }],
        referenceId: 'ref1',
      })

      const delegation: CreatePaperDelegationDto = {
        toNationalId: existingDelegation.toNationalId,
        fromNationalId: existingDelegation.fromNationalId,
        referenceId: 'ref2',
      }

      // Act
      const res = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin').send(delegation)

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        status: 400,
        type: 'https://httpstatuses.org/400',
        title: ErrorCodes.COULD_NOT_CREATE_DELEGATION,
        detail: 'Could not create delegation',
      })
    })

    it('POST /delegation-admin should not create delegation since the delegation id already exists', async () => {
      // Arrange
      const { toNationalId, fromNationalId } = {
        toNationalId: '0101302399',
        fromNationalId: '0101307789',
      }

      mockZendeskService(fromNationalId, toNationalId)

      const existingDelegation = await factory.createCustomDelegation({
        fromNationalId,
        toNationalId,
        domainName: null,
        scopes: [{ scopeName: 's1' }],
        referenceId: 'ref1',
      })

      // Send in opposite national ids so they will not exist in db
      const delegation: CreatePaperDelegationDto = {
        toNationalId: existingDelegation.fromNationalId,
        fromNationalId: existingDelegation.toNationalId,
        referenceId: 'ref1',
      }

      // Act
      const res = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin').send(delegation)

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        status: 400,
        type: 'https://httpstatuses.org/400',
        title: ErrorCodes.REFERENCE_ID_ALREADY_EXISTS,
        detail: 'Delegation with the same reference id already exists',
      })
    })

    it('POST /delegation-admin should not create delegation with incorrect zendesk ticket status', async () => {
      // Arrange
      mockZendeskService(toNationalId, fromNationalId, {
        status: TicketStatus.Open,
      })

      const delegation: CreatePaperDelegationDto = {
        toNationalId,
        fromNationalId,
        referenceId: 'ref1',
      }

      // Act
      const res = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin').send(delegation)

      expect(res.status).toEqual(400)
    })


    it('POST /delegation-admin/zendesk should create delegation', async () => {
      // Arrange
      // Act
      const res = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin/zendesk').send({ id: 'ref1' })

      // Assert
      expect(res.status).toEqual(200)

      // Assert db
      const createdDelegation = await delegationModel.findOne({
        where: {
          referenceId: 'ref1',
        },
      })

      expect(createdDelegation).not.toBeNull()
    })

    it('POST /delegation-admin/revoke-zendesk should delete delegation', async () => {

      const createRes = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin/zendesk').send({ id: 'ref1' })
      // Assert
      expect(createRes.status).toEqual(200)

      // Assert db
      const createdDelegation = await delegationModel.findOne({
        where: {
          referenceId: 'ref1',
        },
      })

      expect(createdDelegation).not.toBeNull()

      // Act
      const revokeRes = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin/revoke-zendesk').send({ id: 'ref1' })

      // Assert
      expect(revokeRes.status).toEqual(200)

      // Assert db
      const deletedDelegation = await delegationModel.findOne({
        where: {
          referenceId: 'ref1',
        },
      })

      expect(deletedDelegation).toBeNull()
    })
  })
})
