import request from 'supertest'

import {
  ApiScope,
  Delegation,
  DelegationDTO,
  DelegationScope,
} from '@island.is/auth-api-lib'
import { AuthScope } from '@island.is/auth/scopes'
import {
  createCurrentUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { createDelegation } from '../../../../test/fixtures'
import {
  Scopes,
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../../test/setup'
import { TestEndpointOptions } from '../../../../test/types'
import { expectMatchingObject, getRequestMethod } from '../../../../test/utils'

const today = new Date('2021-11-12')
const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.actorDelegations, Scopes[0].name],
})
const userName = 'Tester Tests'
const nationalRegistryUser = createNationalRegistryUser({
  kennitala: '6677889900',
})

beforeAll(() => {
  jest.useFakeTimers('modern').setSystemTime(today.getTime())
})

describe('ActorDelegationsController', () => {
  describe('with auth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let delegationModel: typeof Delegation
    let apiScopeModel: typeof ApiScope

    beforeAll(async () => {
      // TestApp setup with auth and database
      app = await setupWithAuth({
        user,
        userName,
        nationalRegistryUser,
      })
      server = request(app.getHttpServer())

      // Get reference on Delegation and ApiScope models to seed DB
      delegationModel = app.get<typeof Delegation>('DelegationRepository')
      apiScopeModel = app.get<typeof ApiScope>('ApiScopeRepository')
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    beforeEach(async () => {
      await delegationModel.destroy({
        where: {},
        cascade: true,
        truncate: true,
        force: true,
      })
    })

    describe('GET /actor/delegations', () => {
      const path = '/v1/actor/delegations'
      const query = '?direction=incoming'

      it('returns only valid delegations', async () => {
        // Arrange
        const models = await delegationModel.bulkCreate(
          [
            createDelegation({
              fromNationalId: nationalRegistryUser.kennitala,
              toNationalId: user.nationalId,
              scopes: [Scopes[0].name],
              today,
            }),
            createDelegation({
              fromNationalId: nationalRegistryUser.kennitala,
              toNationalId: user.nationalId,
              scopes: [Scopes[1].name],
              today,
              expired: true,
            }),
          ],
          {
            include: [{ model: DelegationScope, as: 'delegationScopes' }],
          },
        )
        const expectedModel = models[0].toDTO()

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(res.body[0], expectedModel)
      })

      it('returns 400 BadRequest if required query paramter is missing', async () => {
        // Act
        const res = await server.get(path)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail:
            "'direction' can only be set to incoming for the /actor alias",
        })
      })

      it('should not return delegation when all the scopes are no longer allowed for delegation', async () => {
        // Arrange
        await delegationModel.create(
          createDelegation({
            fromNationalId: nationalRegistryUser.kennitala,
            toNationalId: user.nationalId,
            scopes: [Scopes[1].name],
            today,
          }),
          {
            include: [{ model: DelegationScope, as: 'delegationScopes' }],
          },
        )
        // Disable the scope for delegation after it has been used in delegation
        await apiScopeModel.update(
          { allowExplicitDelegationGrant: false } as ApiScope,
          { where: { name: Scopes[1].name } },
        )
        const expectedModels: DelegationDTO[] = []

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(0)
        expectMatchingObject(res.body, expectedModels)

        // Clean up
        await apiScopeModel.update(
          { allowExplicitDelegationGrant: true } as ApiScope,
          { where: { name: Scopes[1].name } },
        )
      })

      it('should not return scopes in delegation that are no longer allowed for delegation', async () => {
        // Arrange
        const model = (
          await delegationModel.create(
            createDelegation({
              fromNationalId: nationalRegistryUser.kennitala,
              toNationalId: user.nationalId,
              scopes: [Scopes[0].name, Scopes[2].name],
              today,
            }),
            {
              include: [{ model: DelegationScope, as: 'delegationScopes' }],
            },
          )
        ).toDTO()
        const scope = model.scopes?.find(
          ({ scopeName }) => scopeName === Scopes[0].name,
        )
        const expectedModels: DelegationDTO[] = [
          {
            ...model,
            scopes: scope ? [scope] : undefined,
          },
        ]

        // Act
        const res = await server.get(`${path}${query}`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(res.body, expectedModels)
      })
    })
  })

  describe('without auth and permission', () => {
    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/actor/delegations'}
    `(
      '$method $endpoint should return 401 when user is not authenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutAuth()
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(401)
        expect(res.body).toMatchObject({
          status: 401,
          type: 'https://httpstatuses.com/401',
          title: 'Unauthorized',
        })

        // CleanUp
        app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/actor/delegations'}
    `(
      '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutPermission()
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(403)
        expect(res.body).toMatchObject({
          status: 403,
          type: 'https://httpstatuses.com/403',
          title: 'Forbidden',
          detail: 'Forbidden resource',
        })

        // CleanUp
        app.cleanUp()
      },
    )
  })
})
