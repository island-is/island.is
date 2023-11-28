import { getModelToken } from '@nestjs/sequelize'
import assert from 'assert'
import addYears from 'date-fns/addYears'
import startOfDay from 'date-fns/startOfDay'
import faker from 'faker'
import differenceWith from 'lodash/differenceWith'
import { Op } from 'sequelize'
import request from 'supertest'

import {
  CreateDelegationDTO,
  Delegation,
  DelegationScope,
  Domain,
  NamesService,
  PatchDelegationDTO,
} from '@island.is/auth-api-lib'
import { isDefined } from '@island.is/shared/utils'
import { createNationalId } from '@island.is/testing/fixtures'
import { TestApp } from '@island.is/testing/nest'

import { accessOutgoingTestCases } from '../../../../test/access-outgoing-test-cases'
import { setupWithAuth } from '../../../../test/setup'
import { partitionDomainsByScopeAccess } from './utils'
import { FixtureFactory } from '@island.is/services/auth/testing'

describe.each(Object.keys(accessOutgoingTestCases))(
  'MeDelegationsController Outgoing Access with test case: %s',
  (caseName) => {
    const testCase = accessOutgoingTestCases[caseName]
    const invalidDomains = differenceWith(
      testCase.domains,
      testCase.expected,
      (a, b) => a.name === b.name,
    ).map((domain) => domain.name)
    const [accessible, inaccessible] = partitionDomainsByScopeAccess(testCase)
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let factory: FixtureFactory
    let domains: Domain[]
    let delegations: Delegation[]

    beforeAll(async () => {
      // Arrange
      app = await setupWithAuth({
        user: testCase.user,
      })
      server = request(app.getHttpServer())
      const namesService = app.get(NamesService)
      jest
        .spyOn(namesService, 'getPersonName')
        .mockResolvedValue(faker.name.findName())
      jest
        .spyOn(namesService, 'getUserName')
        .mockResolvedValue(faker.name.findName())

      factory = new FixtureFactory(app)
      domains = await Promise.all(
        testCase.domains.map((domain) => factory.createDomain(domain)),
      )
      await Promise.all(
        (testCase.accessTo ?? []).map((scope) =>
          factory.createApiScopeUserAccess({
            nationalId: testCase.user.nationalId,
            scope,
          }),
        ),
      )
      await Promise.all(
        (testCase.delegations ?? []).map((delegation) =>
          factory.createCustomDelegation({
            fromNationalId: testCase.user.nationalId,
            toNationalId: testCase.user.actor?.nationalId,
            ...delegation,
          }),
        ),
      )
    })

    beforeEach(async () => {
      if (delegations) {
        await Delegation.destroy({
          where: {
            id: { [Op.in]: delegations.map((delegation) => delegation.id) },
          },
        })
      }

      // Create custom delegations for testing.
      delegations = await Promise.all(
        domains
          .map((domain) => {
            const customDelegationScopes = domain.scopes
              ?.filter((scope) => scope.allowExplicitDelegationGrant)
              .map(({ name }) => ({ scopeName: name }))

            if (customDelegationScopes && customDelegationScopes.length > 0) {
              return factory.createCustomDelegation({
                fromNationalId: testCase.user.nationalId,
                domainName: domain.name,
                scopes: customDelegationScopes,
              })
            }
          })
          .filter(isDefined),
      )
    })

    it('GET /v1/me/delegations filters delegations and scopes by access', async () => {
      // Act
      const res = await server.get('/v1/me/delegations')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject(
        delegations
          .map((delegation) => {
            const expectedScopes = testCase.expected
              .find((domain) => domain.name === delegation.domainName)
              ?.scopes.map(({ name }) => ({ scopeName: name }))
            if (expectedScopes?.length) {
              return {
                id: delegation.id,
                domainName: delegation.domainName,
                scopes: expectedScopes,
              }
            }
          })
          .filter(isDefined),
      )
    })

    if (accessible.length > 0) {
      it.each(accessible)(
        'GET /v1/me/delegation/:id filters scopes by access in domain $name',
        async (domain) => {
          // Arrange
          const delegation = delegations.find(
            (delegation) => delegation.domainName === domain.name,
          )
          assert(delegation)

          // Act
          const res = await server.get(`/v1/me/delegations/${delegation.id}`)

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toMatchObject({
            scopes: domain.scopes.map((scope) => ({ scopeName: scope.name })),
          })
        },
      )
    }

    if (invalidDomains.length > 0) {
      it.each(invalidDomains)(
        'GET /v1/me/delegation/:id fails without access to domain %s',
        async (domainName) => {
          // Arrange
          const delegation = delegations.find(
            (delegation) => delegation.domainName === domainName,
          )
          if (!delegation) {
            return
          }

          // Act
          const res = await server.get(`/v1/me/delegations/${delegation.id}`)

          // Assert
          expect(res.status).toEqual(204)
        },
      )
    }

    if (accessible.length > 0) {
      it.each(accessible)(
        'POST /v1/me/delegations works for scopes you have access to in $name',
        async (domain) => {
          // Arrange
          const delegationScopeDtos = domain.scopes.map(({ name }) => ({
            name: name,
            validTo: startOfDay(addYears(new Date(), 1)),
          }))
          const delegationDto: CreateDelegationDTO = {
            toNationalId: createNationalId('person'),
            domainName: domain.name,
            scopes: delegationScopeDtos,
          }

          // Act
          const res = await server
            .post('/v1/me/delegations')
            .send(delegationDto)

          // Assert
          expect(res.status).toEqual(201)
          expect(res.body).toMatchObject({
            scopes: delegationScopeDtos.map((scope) => ({
              scopeName: scope.name,
              validTo: scope.validTo.toISOString(),
            })),
          })
        },
      )

      it.each(accessible)(
        'PATCH /v1/me/delegations/:id can update scopes you have access to in $name',
        async (domain) => {
          // Arrange
          const delegation = delegations.find(
            (delegation) => delegation.domainName === domain.name,
          )
          assert(delegation)
          const delegationScopeDtos = domain.scopes.map(({ name }) => ({
            name: name,
            validTo: startOfDay(addYears(new Date(), 1)),
          }))
          const delegationDto: PatchDelegationDTO = {
            updateScopes: delegationScopeDtos,
          }

          // Act
          const res = await server
            .patch(`/v1/me/delegations/${delegation.id}`)
            .send(delegationDto)

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toMatchObject({
            scopes: delegationScopeDtos.map((scope) => ({
              scopeName: scope.name,
              validTo: scope.validTo.toISOString(),
            })),
          })
        },
      )

      it.each(accessible)(
        'PATCH /v1/me/delegations/:id can delete scopes you have access to in $name',
        async (domain) => {
          // Arrange
          const delegation = delegations.find(
            (delegation) => delegation.domainName === domain.name,
          )
          assert(delegation)
          const delegationDto: PatchDelegationDTO = {
            deleteScopes: domain.scopes.map(({ name }) => name),
          }

          // Act
          const res = await server
            .patch(`/v1/me/delegations/${delegation.id}`)
            .send(delegationDto)

          // Assert
          expect(res.status).toEqual(200)
          expect(res.body).toMatchObject({
            scopes: [],
          })
        },
      )

      it.each(accessible)(
        'DELETE /v1/me/delegations/:id works and removes scopes you have access to in $name',
        async (domain) => {
          // Arrange
          const delegationScopeModel = await app.get<typeof DelegationScope>(
            getModelToken(DelegationScope),
          )
          const delegation = delegations.find(
            (delegation) => delegation.domainName === domain.name,
          )
          assert(delegation)

          // Act
          const res = await server.delete(`/v1/me/delegations/${delegation.id}`)

          // Assert
          expect(res.status).toEqual(204)
          const after = await delegationScopeModel.findAll({
            where: {
              delegationId: delegation.id,
              scopeName: domain.scopes.map(({ name }) => name),
            },
          })
          expect(after).toHaveLength(0)
        },
      )
    }

    if (inaccessible.length > 0) {
      it.each(inaccessible)(
        "POST /v1/me/delegations fails for scopes you don't have access to in $name",
        async (domain) => {
          // Arrange
          const delegationScopeDtos = domain.scopes.map(({ name }) => ({
            name: name,
            validTo: startOfDay(addYears(new Date(), 1)),
          }))
          const delegationDto: CreateDelegationDTO = {
            toNationalId: createNationalId('person'),
            domainName: domain.name,
            scopes: delegationScopeDtos,
          }

          // Act
          const res = await server
            .post('/v1/me/delegations')
            .send(delegationDto)

          // Assert
          expect(res.status).toEqual(400)
          expect(res.body).toEqual({
            detail: 'User does not have access to the requested scopes.',
            status: 400,
            title: 'Bad Request',
            type: 'https://httpstatuses.org/400',
          })
        },
      )
    }

    if (
      inaccessible.length > 0 &&
      testCase !== accessOutgoingTestCases.noExplicitDelegationGrant &&
      testCase !== accessOutgoingTestCases.notForAuthenticatedUser
    ) {
      it.each(inaccessible)(
        "PATCH /v1/me/delegations/:id fails updating scopes you don't have access to in $name",
        async (domain) => {
          // Arrange
          const delegation = delegations.find(
            (delegation) => delegation.domainName === domain.name,
          )
          assert(delegation)
          const delegationScopeDtos = domain.scopes.map(({ name }) => ({
            name: name,
            validTo: startOfDay(addYears(new Date(), 1)),
          }))
          const delegationDto: PatchDelegationDTO = {
            updateScopes: delegationScopeDtos,
          }

          // Act
          const res = await server
            .patch(`/v1/me/delegations/${delegation.id}`)
            .send(delegationDto)

          // Assert
          expect(res.status).toEqual(400)
          expect(res.body).toEqual({
            detail: 'User does not have access to the requested scopes.',
            status: 400,
            title: 'Bad Request',
            type: 'https://httpstatuses.org/400',
          })
        },
      )

      it.each(inaccessible)(
        "PATCH /v1/me/delegations/:id fails deleting scopes you don't have access to in $name",
        async (domain) => {
          // Arrange
          const delegation = delegations.find(
            (delegation) => delegation.domainName === domain.name,
          )
          assert(delegation)
          const delegationDto: PatchDelegationDTO = {
            deleteScopes: domain.scopes.map(({ name }) => name),
          }

          // Act
          const res = await server
            .patch(`/v1/me/delegations/${delegation.id}`)
            .send(delegationDto)

          // Assert
          expect(res.status).toEqual(400)
          expect(res.body).toEqual({
            detail: 'User does not have access to the requested scopes.',
            status: 400,
            title: 'Bad Request',
            type: 'https://httpstatuses.org/400',
          })
        },
      )
    }
  },
)
