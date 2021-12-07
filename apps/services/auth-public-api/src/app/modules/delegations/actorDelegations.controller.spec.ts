import request from 'supertest'

import { Delegation, DelegationScope } from '@island.is/auth-api-lib'
import { TestApp } from '@island.is/testing/nest'
import {
  createCurrentUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'

import { createDelegation } from '../../../../test/fixtures'
import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../../test/setup'
import { expectMathcingObject, getRequestMethod } from '../../../../test/utils'
import { TestEndpointOptions } from '../../../../test/types'

const today = new Date('2021-11-12')
const scopes = ['@island.is/scope0', '@island.is/scope1']
const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.actorDelegations, scopes[0]],
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

    beforeAll(async () => {
      // TestApp setup with auth and database
      app = await setupWithAuth({
        user,
        userName,
        nationalRegistryUser,
        scopes,
      })
      server = request(app.getHttpServer())

      // Get reference on delegation and delegationScope models to seed DB
      delegationModel = app.get<typeof Delegation>('DelegationRepository')
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
              scopes: [scopes[0]],
              today,
            }),
            createDelegation({
              fromNationalId: nationalRegistryUser.kennitala,
              toNationalId: user.nationalId,
              scopes: [scopes[1]],
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
        expectMathcingObject(res.body[0], expectedModel)
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
