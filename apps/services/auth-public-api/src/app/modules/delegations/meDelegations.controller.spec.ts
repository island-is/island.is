import request from 'supertest'
import addDays from 'date-fns/addDays'
import { getModelToken } from '@nestjs/sequelize'

import {
  ApiScope,
  CreateDelegationDTO,
  Delegation,
  DelegationDTO,
  DelegationScope,
  DelegationValidity,
  ScopeType,
} from '@island.is/auth-api-lib'
import { AuthDelegationType } from '@island.is/auth-nest-tools'
import { TestApp } from '@island.is/testing/nest'
import {
  createCurrentUser,
  createNationalRegistryUser,
} from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'
import {
  Scopes,
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../../test/setup'
import { createClient, createDelegation } from '../../../../test/fixtures'
import {
  expectMatchingObject,
  getRequestMethod,
  sortDelegations,
} from '../../../../test/utils'
import { TestEndpointOptions } from '../../../../test/types'

const client = createClient({ clientId: '@island.is/webapp' })
const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [
    AuthScope.readDelegations,
    AuthScope.writeDelegations,
    Scopes[0].name,
    Scopes[3].name,
    Scopes[4].name,
  ],
  client: client.clientId,
})
const userName = 'Tester Tests'
const nationalRegistryUser = createNationalRegistryUser({
  kennitala: '6677889900',
})
const today = new Date('2021-11-12')
const mockDelegations = {
  // Valid outgoing delegation
  validOutgoing: createDelegation({
    fromNationalId: user.nationalId,
    toNationalId: '1234567890',
    scopes: [Scopes[0].name],
    today,
  }),
  // Valid but becomes active in the future outgoing delegation
  futureValidOutgoing: createDelegation({
    fromNationalId: user.nationalId,
    toNationalId: '2234567890',
    scopes: [Scopes[0].name],
    today,
    expired: false,
    future: true,
  }),
  // Expired outgoing delegation
  expiredOutgoing: createDelegation({
    fromNationalId: user.nationalId,
    toNationalId: '3234567890',
    scopes: [Scopes[0].name],
    today,
    expired: true,
  }),
  // With scope that changes to be not allowed for delegation
  notAllowedOutgoing: createDelegation({
    fromNationalId: user.nationalId,
    toNationalId: '4234567890',
    scopes: [Scopes[2].name],
    today,
  }),
  // With multiple scopes where one changes to be not allowed for delegation
  withOneNotAllowedOutgoing: createDelegation({
    fromNationalId: user.nationalId,
    toNationalId: '5234567890',
    scopes: [Scopes[0].name, Scopes[2].name],
    today,
  }),
  // Valid incoming delegation
  validIncoming: createDelegation({
    fromNationalId: '1234567890',
    toNationalId: user.nationalId,
    scopes: [Scopes[0].name],
    today,
  }),
  // Valid but becomes active in the future incoming delegation
  futureValidIncoming: createDelegation({
    fromNationalId: '2234567890',
    toNationalId: user.nationalId,
    scopes: [Scopes[0].name],
    today,
    expired: false,
    future: true,
  }),
  // Expired incoming delegation
  expiredIncoming: createDelegation({
    fromNationalId: '3234567890',
    toNationalId: user.nationalId,
    scopes: [Scopes[0].name],
    today,
    expired: true,
  }),
  // Other users
  otherUsers: createDelegation({
    fromNationalId: '1234567890',
    toNationalId: '0987654321',
    scopes: [Scopes[1].name],
    today,
  }),
}

beforeAll(() => {
  jest.useFakeTimers('modern').setSystemTime(today.getTime())
})

describe('MeDelegationsController', () => {
  const path = '/v1/me/delegations'

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
        client: {
          props: client,
          scopes: Scopes.slice(0, 5).map((s) => s.name),
        },
      })
      server = request(app.getHttpServer())

      // Get reference on delegation and apiScope models to seed DB
      delegationModel = app.get<typeof Delegation>(getModelToken(Delegation))
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

    describe('GET /me/delegations', () => {
      it('should return all delegations with direction=outgoing', async () => {
        // Arrange
        await delegationModel.bulkCreate(Object.values(mockDelegations), {
          include: [
            {
              model: DelegationScope,
              as: 'delegationScopes',
            },
          ],
        })
        const expectedModels = (
          await delegationModel.findAll({
            where: {
              id: [
                mockDelegations.validOutgoing.id,
                mockDelegations.futureValidOutgoing.id,
                mockDelegations.expiredOutgoing.id,
                mockDelegations.withOneNotAllowedOutgoing.id,
              ],
            },
            include: [
              {
                model: DelegationScope,
                as: 'delegationScopes',
                include: [
                  {
                    model: ApiScope,
                    as: 'apiScope',
                    where: {
                      allowExplicitDelegationGrant: true,
                    },
                  },
                ],
              },
            ],
          })
        )?.map((delegation) => delegation.toDTO())

        // Act
        const res = await server.get(`${path}?direction=outgoing`)

        // Sort before asserting
        sortDelegations(res.body)
        sortDelegations(expectedModels)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(4)
        expectMatchingObject(res.body, expectedModels)
      })

      it('should return only delegations with scopes the user has access to', async () => {
        // Arrange
        const expectedModel = (
          await delegationModel.create(
            createDelegation({
              fromNationalId: user.nationalId,
              toNationalId: '1234567890',
              scopes: [Scopes[0].name, Scopes[5].name],
              today,
            }),
            {
              include: [
                {
                  model: DelegationScope,
                  as: 'delegationScopes',
                },
              ],
            },
          )
        ).toDTO()
        // The expected model should not contain the scope from the other org
        expectedModel.scopes = expectedModel.scopes?.filter(
          (s) => s.scopeName === Scopes[0].name,
        )

        // Act
        const res = await server.get(`${path}?direction=outgoing`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(res.body, [expectedModel])
      })

      it('should return no delegation when the client does not have access to any scope', async () => {
        // Arrange
        await delegationModel.create(
          createDelegation({
            fromNationalId: nationalRegistryUser.kennitala,
            toNationalId: user.nationalId,
            scopes: [Scopes[5].name],
            today,
          }),
          {
            include: [{ model: DelegationScope, as: 'delegationScopes' }],
          },
        )

        // Act
        const res = await server.get(`${path}?direction=outgoing`)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(0)
      })

      it('should return all valid delegations with direction=outgoing&validity=now', async () => {
        // Arrange
        await delegationModel.bulkCreate(Object.values(mockDelegations), {
          include: [
            {
              model: DelegationScope,
              as: 'delegationScopes',
            },
          ],
        })
        const expectedModels = (
          await delegationModel.findAll({
            where: {
              id: [
                mockDelegations.validOutgoing.id,
                mockDelegations.withOneNotAllowedOutgoing.id,
              ],
            },
            include: [
              {
                model: DelegationScope,
                as: 'delegationScopes',
                include: [
                  {
                    model: ApiScope,
                    as: 'apiScope',
                    where: {
                      allowExplicitDelegationGrant: true,
                    },
                  },
                ],
              },
            ],
          })
        )?.map((delegation) => delegation.toDTO())

        // Act
        const res = await server.get(
          `${path}?direction=outgoing&validity=${DelegationValidity.NOW}`,
        )

        // Sort before asserting
        sortDelegations(res.body)
        sortDelegations(expectedModels)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(2)
        expectMatchingObject(res.body, expectedModels)
      })

      it('should return all valid delegations with direction=outgoing&validity=includeFuture', async () => {
        // Arrange
        await delegationModel.bulkCreate(Object.values(mockDelegations), {
          include: [
            {
              model: DelegationScope,
              as: 'delegationScopes',
            },
          ],
        })
        const expectedModels = (
          await delegationModel.findAll({
            where: {
              id: [
                mockDelegations.validOutgoing.id,
                mockDelegations.futureValidOutgoing.id,
                mockDelegations.withOneNotAllowedOutgoing.id,
              ],
            },
            include: [
              {
                model: DelegationScope,
                as: 'delegationScopes',
                include: [
                  {
                    model: ApiScope,
                    as: 'apiScope',
                    where: {
                      allowExplicitDelegationGrant: true,
                    },
                  },
                ],
              },
            ],
          })
        )?.map((delegation) => delegation.toDTO())

        // Act
        const res = await server.get(
          `${path}?direction=outgoing&validity=${DelegationValidity.INCLUDE_FUTURE}`,
        )

        // Sort delegation before asserting
        sortDelegations(res.body)
        sortDelegations(expectedModels)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(3)
        expectMatchingObject(res.body, expectedModels)
      })

      it('should return all expired delegations with direction=outgoing&validity=past', async () => {
        // Arrange
        await delegationModel.bulkCreate(Object.values(mockDelegations), {
          include: [
            {
              model: DelegationScope,
              as: 'delegationScopes',
            },
          ],
        })
        const expectedModel = [
          (
            await delegationModel.findByPk(mockDelegations.expiredOutgoing.id, {
              include: [
                {
                  model: DelegationScope,
                  as: 'delegationScopes',
                  include: [{ model: ApiScope, as: 'apiScope' }],
                },
              ],
            })
          )?.toDTO(),
        ]

        // Act
        const res = await server.get(
          `${path}?direction=outgoing&validity=${DelegationValidity.PAST}`,
        )

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(res.body, expectedModel)
      })

      it('should return an array with single delegation when filtered to specific otherUser', async () => {
        // Arrange
        await delegationModel.bulkCreate(Object.values(mockDelegations), {
          include: [
            {
              model: DelegationScope,
              as: 'delegationScopes',
            },
          ],
        })
        const expectedModel = [
          (
            await delegationModel.findByPk(mockDelegations.validOutgoing.id, {
              include: [
                {
                  model: DelegationScope,
                  as: 'delegationScopes',
                  include: [{ model: ApiScope, as: 'apiScope' }],
                },
              ],
            })
          )?.toDTO(),
        ]

        // Act
        const res = await server.get(
          `${path}?direction=outgoing&otherUser=${mockDelegations.validOutgoing.toNationalId}`,
        )

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(1)
        expectMatchingObject(res.body, expectedModel)
      })

      it('should return no delegation for otherUser when user has access to none of the scopes', async () => {
        // Arrange
        const expectedModel = await delegationModel.create(
          createDelegation({
            fromNationalId: user.nationalId,
            toNationalId: nationalRegistryUser.kennitala,
            scopes: [Scopes[5].name],
            today,
          }),
          {
            include: [
              {
                model: DelegationScope,
                as: 'delegationScopes',
              },
            ],
          },
        )
        expectedModel.delegationScopes = []

        // Act
        const res = await server.get(
          `${path}?direction=outgoing&otherUser=${expectedModel.toNationalId}`,
        )

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(0)
        expectMatchingObject(res.body, [])
      })

      it('should return an empty array when filtered to specific otherUser and no delegation exists', async () => {
        // Act
        const res = await server.get(
          `${path}?direction=outgoing&otherUser=${mockDelegations.validOutgoing.toNationalId}`,
        )

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toHaveLength(0)
      })

      it('should return a 500 Internal Server Error when filtered to specific otherUser has two or more delegations', async () => {
        // Arrange
        await delegationModel.bulkCreate(
          [
            mockDelegations.validOutgoing,
            {
              ...mockDelegations.expiredOutgoing,
              toNationalId: mockDelegations.validOutgoing.toNationalId,
            },
          ],
          {
            include: [
              {
                model: DelegationScope,
                as: 'delegationScopes',
              },
            ],
          },
        )

        // Act
        const res = await server.get(
          `${path}?direction=outgoing&otherUser=${mockDelegations.validOutgoing.toNationalId}`,
        )

        // Assert
        expect(res.status).toEqual(500)
        expect(res.body).toMatchObject({
          status: 500,
          type: 'https://httpstatuses.com/500',
          title: 'Internal Server Error',
          detail:
            'Invalid state of delegation. User has two or more delegations with an other user.',
        })
      })

      it('should return 400 Bad Request when direction is missing', async () => {
        // Act
        const res = await server.get(path)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail: 'direction=outgoing is currently the only supported value',
        })
      })

      it('should return 400 Bad Request when direction has invalid value', async () => {
        // Act
        const res = await server.get(`${path}?direction=incoming`)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail: 'direction=outgoing is currently the only supported value',
        })
      })
    })

    describe('GET /me/delegations/:id', () => {
      it('should return a delegation that exists for auth user', async () => {
        // Arrange
        await delegationModel.bulkCreate(Object.values(mockDelegations), {
          include: [
            {
              model: DelegationScope,
              as: 'delegationScopes',
            },
          ],
        })
        const expectedModel = (
          await delegationModel.findByPk(
            mockDelegations.withOneNotAllowedOutgoing.id,
            {
              include: [
                {
                  model: DelegationScope,
                  as: 'delegationScopes',
                  include: [
                    {
                      model: ApiScope,
                      as: 'apiScope',
                      where: {
                        allowExplicitDelegationGrant: true,
                      },
                    },
                  ],
                },
              ],
            },
          )
        )?.toDTO()

        // Act
        const res = await server.get(
          `${path}/${mockDelegations.withOneNotAllowedOutgoing.id}`,
        )

        // Assert
        expect(res.status).toEqual(200)
        expect((res.body as DelegationDTO).scopes).toHaveLength(1)
        expectMatchingObject(res.body, expectedModel)
      })

      it('should return a delegation with no scopes if no scope is allowed for delegation', async () => {
        // Arrange
        await delegationModel.bulkCreate(Object.values(mockDelegations), {
          include: [
            {
              model: DelegationScope,
              as: 'delegationScopes',
            },
          ],
        })
        const expectedModel = (
          await delegationModel.findByPk(
            mockDelegations.notAllowedOutgoing.id,
            {
              include: [
                {
                  model: DelegationScope,
                  as: 'delegationScopes',
                  include: [
                    {
                      model: ApiScope,
                      as: 'apiScope',
                      where: {
                        allowExplicitDelegationGrant: true,
                      },
                    },
                  ],
                },
              ],
            },
          )
        )?.toDTO()

        // Act
        const res = await server.get(
          `${path}/${mockDelegations.notAllowedOutgoing.id}`,
        )

        // Assert
        expect(res.status).toEqual(200)
        expect((res.body as DelegationDTO).scopes).toHaveLength(0)
        expectMatchingObject(res.body, expectedModel)
      })

      it('should return a delegation with filtered scopes list by user access', async () => {
        // Arrange
        const expectedModel = (
          await delegationModel.create(
            createDelegation({
              fromNationalId: nationalRegistryUser.kennitala,
              toNationalId: user.nationalId,
              scopes: [Scopes[0].name, Scopes[5].name],
              today,
            }),
            {
              include: [{ model: DelegationScope, as: 'delegationScopes' }],
            },
          )
        ).toDTO()
        // The expected model should not contain the scope from the other org
        expectedModel.scopes = expectedModel.scopes?.filter(
          (s) => s.scopeName === Scopes[0].name,
        )

        // Act
        const res = await server.get(`${path}/${expectedModel.id}`)

        // Assert
        expect(res.status).toEqual(200)
        expectMatchingObject(res.body, expectedModel)
      })

      it('should return a delegation with empty scopes list when user does not have access to any scopes', async () => {
        // Arrange
        const expectedModel = await delegationModel.create(
          createDelegation({
            fromNationalId: nationalRegistryUser.kennitala,
            toNationalId: user.nationalId,
            scopes: [Scopes[5].name],
            today,
          }),
          {
            include: [{ model: DelegationScope, as: 'delegationScopes' }],
          },
        )
        // The expected model should not contain the scope from the other org
        expectedModel.delegationScopes = []

        // Act
        const res = await server.get(`${path}/${expectedModel.id}`)

        // Assert
        expect(res.status).toEqual(200)
        expectMatchingObject(res.body, expectedModel.toDTO())
      })

      it('should filter expired scopes for delegation that exists for auth user', async () => {
        // Arrange
        await delegationModel.bulkCreate(Object.values(mockDelegations), {
          include: [
            {
              model: DelegationScope,
              as: 'delegationScopes',
            },
          ],
        })
        const expectedModel = (
          await delegationModel.findByPk(mockDelegations.expiredOutgoing.id, {
            include: [
              {
                model: DelegationScope,
                as: 'delegationScopes',
                include: [{ model: ApiScope, as: 'apiScope' }],
              },
            ],
          })
        )?.toDTO()
        Object.assign(expectedModel, { scopes: [], validTo: undefined })

        // Act
        const res = await server.get(
          `${path}/${mockDelegations.expiredOutgoing.id}?valid=includeFuture`,
        )

        // Assert
        expect(res.status).toEqual(200)
        expectMatchingObject(res.body, expectedModel)
      })

      it('should return 404 not found if delegation does not exist or not connected to the user', async () => {
        // Arrange
        await delegationModel.bulkCreate(Object.values(mockDelegations), {
          include: [
            {
              model: DelegationScope,
              as: 'delegationScopes',
            },
          ],
        })

        // Act
        const res = await server.get(`${path}/${mockDelegations.otherUsers.id}`)

        // Assert
        expect(res.status).toEqual(404)
      })
    })

    describe('POST /me/delegations', () => {
      it.each`
        model
        ${{
  toNationalId: nationalRegistryUser.kennitala,
}}
        ${{
  toNationalId: nationalRegistryUser.kennitala,
  scopes: [],
}}
        ${{
  toNationalId: nationalRegistryUser.kennitala,
  scopes: [{
      name: Scopes[0].name,
      type: ScopeType.ApiScope,
      validTo: addDays(today, 1),
    }],
}}
      `(
        // Description logs out $model.scopes.length when scopes is undefined in the first test case
        'should return 201 Created for valid delegation with $model.scopes.length scopes',
        async ({ model }: { model: CreateDelegationDTO }) => {
          // Act
          const res = await server.post(path).send(model)

          // Assert
          const { rows, count } = await delegationModel.findAndCountAll({
            include: [DelegationScope],
          })
          expect(res.status).toEqual(201)
          expect(count).toEqual(1)
          expectMatchingObject(res.body, {
            ...rows[0].toDTO(),
            toNationalId: model.toNationalId,
            scopes: model.scopes?.map((scope) => ({
              scopeName: scope.name,
              validTo: scope.validTo?.toISOString(),
            })),
          })
        },
      )

      it('should return 400 Bad Request when scope is not allowed for delegation', async () => {
        // Arrange
        const model = {
          toNationalId: nationalRegistryUser.kennitala,
          scopes: [
            {
              name: Scopes[2].name,
              type: ScopeType.ApiScope,
              validTo: addDays(today, 1),
            },
          ],
        }
        // Act
        const res = await server.post(path).send(model)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail: 'User does not have access to the requested scopes.',
        })
      })

      it('should return 400 Bad Request when user does not have access to all the requested scopes', async () => {
        // Arrange
        const model = {
          toNationalId: nationalRegistryUser.kennitala,
          scopes: [
            {
              name: Scopes[0].name,
              type: ScopeType.ApiScope,
              validTo: addDays(today, 1),
            },
            {
              name: Scopes[1].name,
              type: ScopeType.ApiScope,
              validTo: addDays(today, 1),
            },
          ],
        }

        // Act
        const res = await server.post(path).send(model)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail: 'User does not have access to the requested scopes.',
        })
      })

      it('should return 400 Bad Request when scopes have a validTo before the current datetime', async () => {
        // Arrange
        const model = {
          toNationalId: nationalRegistryUser.kennitala,
          scopes: [
            {
              name: Scopes[0].name,
              type: ScopeType.ApiScope,
              validTo: addDays(today, -1),
            },
          ],
        }

        // Act
        const res = await server.post(path).send(model)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail:
            'When scope validTo property is provided it must be in the future',
        })
      })

      it("should return 400 Bad Request when scopes don't have validTo set", async () => {
        // Arrange
        const model = {
          toNationalId: nationalRegistryUser.kennitala,
          scopes: [
            {
              name: Scopes[0].name,
              type: ScopeType.ApiScope,
            },
          ],
        }

        // Act
        const res = await server.post(path).send(model)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail: ['0.validTo must be a Date instance'],
        })
      })

      it('should return 400 Bad Request when scopes have a invalid type', async () => {
        // Arrange
        const model = {
          toNationalId: nationalRegistryUser.kennitala,
          scopes: [
            {
              name: Scopes[0].name,
              type: 'invalidType',
              validTo: addDays(today, 1),
            },
          ],
        }

        // Act
        const res = await server.post(path).send(model)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail: ['0.type must be a valid enum value'],
        })
      })
    })

    describe('PUT /me/delegations/:id', () => {
      it('should return 200 OK for valid update', async () => {
        // Arrange
        const expectedValidTo = addDays(today, 2)
        const { id } = await delegationModel.create(
          createDelegation({
            fromNationalId: user.nationalId,
            toNationalId: nationalRegistryUser.kennitala,
            scopes: [],
            today,
          }),
        )
        const model = {
          scopes: [
            {
              name: Scopes[0].name,
              type: ScopeType.ApiScope,
              validTo: expectedValidTo,
            },
          ],
        }

        // Act
        const res = await server.put(`${path}/${id}`).send(model)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject({
          scopes: [
            {
              validTo: expectedValidTo.toISOString(),
            },
          ],
          validTo: expectedValidTo.toISOString(),
        })
      })

      it('should return 200 OK for update with no scopes', async () => {
        // Arrange
        const { id } = await delegationModel.create(
          createDelegation({
            fromNationalId: user.nationalId,
            toNationalId: nationalRegistryUser.kennitala,
            scopes: [Scopes[0].name],
            today,
          }),
          {
            include: [{ model: DelegationScope, as: 'delegationScopes' }],
          },
        )

        // Act
        const res = await server.put(`${path}/${id}`).send({})

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject({
          scopes: [],
        })
      })

      it('should only remove and update scopes the user has access to', async () => {
        // Arrange
        const expectedValidTo = addDays(today, 2)
        const model = {
          scopes: [
            {
              name: Scopes[4].name,
              type: ScopeType.ApiScope,
              validTo: expectedValidTo,
            },
          ],
        }
        const { id } = await delegationModel.create(
          createDelegation({
            fromNationalId: user.nationalId,
            toNationalId: nationalRegistryUser.kennitala,
            scopes: [Scopes[0].name, Scopes[1].name, Scopes[5].name],
            today,
          }),
          {
            include: [{ model: DelegationScope, as: 'delegationScopes' }],
          },
        )

        // Act
        const res = await server.put(`${path}/${id}`).send(model)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body.scopes.length).toEqual(1)
        expect(res.body.scopes).toMatchObject([
          {
            scopeName: Scopes[4].name,
          },
        ])

        // Check that the delegation in DB still has scope from other org
        const updatedDelegation = await delegationModel.findByPk(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id!,
          {
            include: [{ model: DelegationScope, as: 'delegationScopes' }],
            order: [
              [
                { model: DelegationScope, as: 'delegationScopes' },
                'scopeName',
                'ASC',
              ],
            ],
          },
        )
        expect(updatedDelegation?.delegationScopes?.length).toEqual(3)
        expect(updatedDelegation?.delegationScopes).toMatchObject([
          {
            scopeName: Scopes[1].name,
          },
          {
            scopeName: Scopes[4].name,
          },
          {
            scopeName: Scopes[5].name,
          },
        ])
      })

      it('should return 400 Bad Request when scope is not allowed for delegation', async () => {
        // Arrange
        const { id } = await delegationModel.create(
          createDelegation({
            fromNationalId: user.nationalId,
            toNationalId: nationalRegistryUser.kennitala,
            scopes: [],
            today,
          }),
        )
        const model = {
          scopes: [
            {
              name: Scopes[2].name,
              type: ScopeType.ApiScope,
              validTo: addDays(today, 1),
            },
          ],
        }

        // Act
        const res = await server.put(`${path}/${id}`).send(model)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail: 'User does not have access to the requested scopes.',
        })
      })

      it('should return 400 Bad Request when user does not have access to all the requested scopes', async () => {
        // Arrange
        const { id } = await delegationModel.create(
          createDelegation({
            fromNationalId: user.nationalId,
            toNationalId: nationalRegistryUser.kennitala,
            scopes: [],
            today,
          }),
        )
        const model = {
          scopes: [
            {
              name: Scopes[1].name,
              type: ScopeType.ApiScope,
              validTo: addDays(today, 1),
            },
          ],
        }

        // Act
        const res = await server.put(`${path}/${id}`).send(model)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail: 'User does not have access to the requested scopes.',
        })
      })

      it('should return 400 Bad Request when scopes have a validTo before the current datetime', async () => {
        // Arrange
        const { id } = await delegationModel.create(
          createDelegation({
            fromNationalId: user.nationalId,
            toNationalId: nationalRegistryUser.kennitala,
            scopes: [],
            today,
          }),
        )
        const model = {
          scopes: [
            {
              name: Scopes[0].name,
              type: ScopeType.ApiScope,
              validTo: addDays(today, -1),
            },
          ],
        }

        // Act
        const res = await server.put(`${path}/${id}`).send(model)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail:
            'If scope validTo property is provided it must be in the future',
        })
      })

      it('should return 400 Bad Request when scopes have a invalid type', async () => {
        // Arrange
        const { id } = await delegationModel.create(
          createDelegation({
            fromNationalId: user.nationalId,
            toNationalId: nationalRegistryUser.kennitala,
            scopes: [],
            today,
          }),
        )
        const model = {
          scopes: [
            {
              name: Scopes[0].name,
              type: 'invalidScope',
              validTo: addDays(today, 1),
            },
          ],
        }

        // Act
        const res = await server.put(`${path}/${id}`).send(model)

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          status: 400,
          type: 'https://httpstatuses.com/400',
          title: 'Bad Request',
          detail: ['0.type must be a valid enum value'],
        })
      })

      it('should return 404 Not Found when user tries to update delegation that he did not give', async () => {
        // Arrange
        const model = {
          scopes: [
            {
              name: Scopes[0].name,
              type: ScopeType.ApiScope,
              validTo: addDays(today, 1),
            },
          ],
        }
        const delegationId = '709158e8-1f86-4e3d-8576-5b13533bc42a'

        // Act
        const res = await server.put(`${path}/${delegationId}`).send(model)

        // Assert
        expect(res.status).toEqual(404)
        expect(res.body).toMatchObject({
          status: 404,
          type: 'https://httpstatuses.com/404',
          title: 'Not Found',
        })
      })
    })

    describe('DELETE /me/delegations/:id', () => {
      it('should return 204 No Content when successfully deleted delegation', async () => {
        // Arrange
        const { id } = await delegationModel.create(
          createDelegation({
            fromNationalId: user.nationalId,
            toNationalId: nationalRegistryUser.kennitala,
            scopes: [Scopes[0].name],
            today,
          }),
          {
            include: [{ model: DelegationScope, as: 'delegationScopes' }],
          },
        )

        // Act
        const res = await server.delete(`${path}/${id}`)

        // Assert
        expect(res.status).toEqual(204)
        expect(res.body).toMatchObject({})

        // Check the DB
        const model = await delegationModel.findByPk(id, {
          include: [{ model: DelegationScope, as: 'delegationScopes' }],
        })
        expect(model).not.toBeNull()
        expect(model?.delegationScopes?.length).toEqual(0)
      })

      it('should return 204 No Content when successfully only delete scopes the user has access to', async () => {
        // Arrange
        const { id } = await delegationModel.create(
          createDelegation({
            fromNationalId: user.nationalId,
            toNationalId: nationalRegistryUser.kennitala,
            scopes: [Scopes[0].name, Scopes[5].name],
            today,
          }),
          {
            include: [{ model: DelegationScope, as: 'delegationScopes' }],
          },
        )

        // Act
        const res = await server.delete(`${path}/${id}`)

        // Assert
        expect(res.status).toEqual(204)
        expect(res.body).toMatchObject({})

        // Check the DB
        const model = await delegationModel.findByPk(id, {
          include: [{ model: DelegationScope, as: 'delegationScopes' }],
        })
        expect(model).not.toBeNull()
        expect(model?.delegationScopes?.length).toEqual(1)
      })

      it('should return 404 Not Found for a delegation that user did not give', async () => {
        // Arrange
        const delegationId = '709158e8-1f86-4e3d-8576-5b13533bc42a'

        // Act
        const res = await server.delete(`${path}/${delegationId}`)

        // Assert
        expect(res.status).toEqual(404)
        expect(res.body).toMatchObject({
          status: 404,
          type: 'https://httpstatuses.com/404',
          title: 'Not Found',
        })
      })
    })
  })

  interface DelegationEachType {
    delegationType?: AuthDelegationType[]
    shouldWork: boolean
  }
  describe.each`
    delegationType                     | shouldWork
    ${[]}                              | ${false}
    ${['ProcurationHolder']}           | ${true}
    ${['ProcurationHolder', 'Custom']} | ${true}
    ${['LegalGuard', 'Custom']}        | ${false}
    ${['Custom']}                      | ${false}
    ${undefined}                       | ${false}
  `(
    'with auth (delegation=$delegationType)',
    ({ delegationType, shouldWork }: DelegationEachType) => {
      const workOrFail = shouldWork ? 'work' : 'fail'
      let app: TestApp
      let server: request.SuperTest<request.Test>

      beforeAll(async () => {
        // TestApp setup with auth and database
        const testUser =
          delegationType === []
            ? user
            : {
                ...user,
                delegationType,
                actor: {
                  nationalId: user.nationalId,
                  scope: [],
                },
              }
        app = await setupWithAuth({
          user: testUser,
          userName,
          nationalRegistryUser,
        })
        server = request(app.getHttpServer())
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      beforeEach(async () => {
        await app.get<typeof Delegation>(getModelToken(Delegation)).destroy({
          where: {},
          cascade: true,
          truncate: true,
          force: true,
        })
      })

      it(`POST /me/delegations should ${workOrFail} when scope has a special delegation rule`, async () => {
        // Arrange
        const model = {
          toNationalId: nationalRegistryUser.kennitala,
          scopes: [
            {
              name: Scopes[3].name,
              type: ScopeType.ApiScope,
              validTo: addDays(today, 1),
            },
          ],
        }
        // Act
        const res = await server.post(path).send(model)

        // Assert
        expect(res.status).toEqual(shouldWork ? 201 : 400)
      })

      it(`PUT /me/delegations/:id should ${workOrFail} when scope has a special delegation rule`, async () => {
        // Arrange
        const expectedValidTo = addDays(today, 2)
        const createModel = {
          toNationalId: nationalRegistryUser.kennitala,
          scopes: [
            {
              name: Scopes[0].name,
              type: ScopeType.ApiScope,
              validTo: addDays(today, 1),
            },
          ],
        }
        const delegation = (await server.post(path).send(createModel))
          .body as DelegationDTO
        const model = {
          scopes: [
            {
              name: Scopes[3].name,
              type: ScopeType.ApiScope,
              validTo: expectedValidTo,
            },
          ],
        }
        // Act
        const res = await server.put(`${path}/${delegation.id}`).send(model)

        // Assert
        expect(res.status).toEqual(shouldWork ? 200 : 400)
      })
    },
  )

  describe('without auth and permissions', () => {
    it.each`
      method      | endpoint
      ${'GET'}    | ${'/v1/me/delegations'}
      ${'GET'}    | ${'/v1/me/delegations/1337'}
      ${'POST'}   | ${'/v1/me/delegations'}
      ${'PUT'}    | ${'/v1/me/delegations/1337'}
      ${'DELETE'} | ${'/v1/me/delegations/1337'}
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
      method      | endpoint
      ${'GET'}    | ${'/v1/me/delegations'}
      ${'GET'}    | ${'/v1/me/delegations/1337'}
      ${'POST'}   | ${'/v1/me/delegations'}
      ${'PUT'}    | ${'/v1/me/delegations/1337'}
      ${'DELETE'} | ${'/v1/me/delegations/1337'}
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
