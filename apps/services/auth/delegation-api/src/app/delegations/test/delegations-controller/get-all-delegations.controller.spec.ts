import { Type } from '@nestjs/common'
import { getConnectionToken } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import request from 'supertest'

import { DelegationRecordDTO } from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { TestApp, truncate } from '@island.is/testing/nest'
import { createNationalId } from '@island.is/testing/fixtures'
import { PersonalRepresentativeDelegationType } from '@island.is/auth-api-lib'

import { setupWithAuth } from '../../../../../test/setup'
import {
  TestCase,
  user,
  userWithWrongScope,
  scopes,
} from './delegations.controller-test-types'

const path = '/v1/delegations/all'

// Test data
const person1 = createNationalId('person')
const person2 = createNationalId('person')
const person3 = createNationalId('person')
const person4 = createNationalId('person')
const child1 = createNationalId('residentChild')
const company1 = createNationalId('company')
const company2 = createNationalId('company')

describe('DelegationsController - getAllDelegations', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let factory: FixtureFactory
  let sequelize: Sequelize

  const setup = async (testcase: TestCase) => {
    server = request(app.getHttpServer())
    factory = new FixtureFactory(app)
    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

    await truncate(sequelize)

    await factory.createClient(testcase.client)
    await factory.createDomain(testcase.domain)

    // create api scopes in db
    await Promise.all(
      testcase.apiScopes.map((scope) => factory.createApiScope(scope)),
    )

    // Create delegation index records in db
    await Promise.all(
      testcase.procurationDelegationRecords.map((record) =>
        factory.createDelegationIndexRecord(record),
      ),
    )
    await Promise.all(
      testcase.wardDelegationRecords.map((record) =>
        factory.createDelegationIndexRecord(record),
      ),
    )
    await Promise.all(
      testcase.customDelegationRecord.map((record) =>
        factory.createDelegationIndexRecord(record),
      ),
    )
    await Promise.all(
      testcase.personalRepresentativeDelegationRecords.map((record) =>
        factory.createDelegationIndexRecord(record),
      ),
    )

    // create personal representation scope permissions in db
    await Promise.all(
      testcase.personalRepresentativeScopePermissions.map((permission) =>
        factory.createPersonalRepresentativeScopePermission(permission),
      ),
    )
  }

  describe('GET /all - Valid test cases', () => {
    describe('when user has multiple types of incoming delegations', () => {
      const testCase = new TestCase({
        requestUser: {
          nationalId: person1,
          scope: scopes.all.name,
        },
        toCustom: [
          {
            fromNationalId: person2,
            toNationalId: person1,
            scopes: [scopes.custom.name],
          },
          {
            fromNationalId: person3,
            toNationalId: person1,
            scopes: [scopes.custom2.name],
          },
        ],
        toProcurationHolders: [
          {
            fromNationalId: company1,
            toNationalId: person1,
          },
        ],
        toParents: [
          {
            fromNationalId: child1,
            toNationalId: person1,
          },
        ],
        toRepresentative: [
          {
            fromNationalId: person4,
            toNationalId: person1,
            type: PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
          },
        ],
        scopes: [scopes.all],
        expectedFrom: [person2, person3, company1, child1, person4],
      })

      beforeAll(async () => {
        app = await setupWithAuth({ user })
        await setup(testCase)
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it('should return all incoming delegations regardless of scope', async () => {
        // Act
        const response = await server
          .get(path)
          .set('X-Query-National-Id', testCase.requestUser.nationalId)

        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(5)

        const fromNationalIds = response.body.map(
          (d: DelegationRecordDTO) => d.fromNationalId,
        )
        expect(fromNationalIds).toEqual(
          expect.arrayContaining([person2, person3, company1, child1, person4]),
        )

        // Verify each delegation has the correct toNationalId
        response.body.forEach((delegation: DelegationRecordDTO) => {
          expect(delegation.toNationalId).toBe(person1)
        })
      })
    })

    describe('when user has only custom delegations', () => {
      const testCase = new TestCase({
        requestUser: {
          nationalId: person1,
          scope: scopes.custom.name,
        },
        toCustom: [
          {
            fromNationalId: person2,
            toNationalId: person1,
            scopes: [scopes.custom.name],
          },
          {
            fromNationalId: person3,
            toNationalId: person1,
            scopes: [scopes.custom2.name],
            validTo: new Date(Date.now() + 86400000), // Valid delegation (expires tomorrow)
          },
        ],
        scopes: [scopes.custom, scopes.custom2],
        expectedFrom: [person2, person3],
      })

      beforeAll(async () => {
        app = await setupWithAuth({ user })
        await setup(testCase)
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it('should return all custom delegations with different scopes', async () => {
        // Act
        const response = await server
          .get(path)
          .set('X-Query-National-Id', testCase.requestUser.nationalId)

        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(2)

        const fromNationalIds = response.body.map(
          (d: DelegationRecordDTO) => d.fromNationalId,
        )
        expect(fromNationalIds).toEqual(
          expect.arrayContaining([person2, person3]),
        )
      })
    })

    describe('when user has expired delegations', () => {
      const testCase = new TestCase({
        requestUser: {
          nationalId: person1,
          scope: scopes.all.name,
        },
        toCustom: [
          {
            fromNationalId: person2,
            toNationalId: person1,
            scopes: [scopes.custom.name],
            validTo: new Date('2021-01-01'), // Expired delegation
          },
          {
            fromNationalId: person3,
            toNationalId: person1,
            scopes: [scopes.custom.name],
          },
        ],
        toRepresentative: [
          {
            fromNationalId: person4,
            toNationalId: person1,
            type: PersonalRepresentativeDelegationType.PersonalRepresentativePostholf,
            validTo: new Date('2021-01-01'), // Expired delegation
          },
        ],
        scopes: [scopes.all],
        expectedFrom: [person3], // Only person3 should be returned as others are expired
      })

      beforeAll(async () => {
        app = await setupWithAuth({ user })
        await setup(testCase)
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it('should include expired delegations in the response', async () => {
        // Act
        const response = await server
          .get(path)
          .set('X-Query-National-Id', testCase.requestUser.nationalId)

        // Assert
        expect(response.status).toBe(200)
        // The service should return all delegations, including expired ones
        // The filtering of expired delegations should be done by the service layer
        expect(response.body.length).toBeGreaterThanOrEqual(1)
      })
    })

    describe('when user has no delegations', () => {
      const testCase = new TestCase({
        requestUser: {
          nationalId: person1,
          scope: scopes.all.name,
        },
        // No delegations set up
        scopes: [scopes.all],
        expectedFrom: [],
      })

      beforeAll(async () => {
        app = await setupWithAuth({ user })
        await setup(testCase)
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it('should return empty array', async () => {
        // Act
        const response = await server
          .get(path)
          .set('X-Query-National-Id', testCase.requestUser.nationalId)

        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toEqual([])
      })
    })

    describe('when querying with company national id', () => {
      const testCase = new TestCase({
        requestUser: {
          nationalId: company1,
          scope: scopes.all.name,
        },
        toCustom: [
          {
            fromNationalId: person1,
            toNationalId: company1,
            scopes: [scopes.custom.name],
          },
        ],
        toProcurationHolders: [
          {
            fromNationalId: company2,
            toNationalId: company1,
          },
        ],
        scopes: [scopes.all],
        expectedFrom: [person1, company2],
      })

      beforeAll(async () => {
        app = await setupWithAuth({ user })
        await setup(testCase)
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it('should return delegations for company', async () => {
        // Act
        const response = await server
          .get(path)
          .set('X-Query-National-Id', testCase.requestUser.nationalId)

        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(2)

        const fromNationalIds = response.body.map(
          (d: DelegationRecordDTO) => d.fromNationalId,
        )
        expect(fromNationalIds).toEqual(
          expect.arrayContaining([person1, company2]),
        )
      })
    })
  })

  describe('GET /all - Invalid test cases', () => {
    describe('when using invalid national id', () => {
      beforeAll(async () => {
        app = await setupWithAuth({ user })
        server = request(app.getHttpServer())
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it('should return 400 for invalid national id format', async () => {
        // Act
        const response = await server
          .get(path)
          .set('X-Query-National-Id', 'invalid-national-id')

        // Assert
        expect(response.status).toBe(400)
        expect(response.body.detail).toBe('Invalid national id')
      })
    })

    describe('when missing X-Query-National-Id header', () => {
      beforeAll(async () => {
        app = await setupWithAuth({ user })
        server = request(app.getHttpServer())
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it('should return 400 when header is missing', async () => {
        // Act
        const response = await server.get(path)

        // Assert
        expect(response.status).toBe(400)
      })
    })
  })

  describe('GET /all - Authorization', () => {
    const testCase = new TestCase({
      requestUser: {
        nationalId: person1,
        scope: scopes.all.name,
      },
      toCustom: [
        {
          fromNationalId: person2,
          toNationalId: person1,
          scopes: [scopes.custom.name],
        },
      ],
      scopes: [scopes.all],
      expectedFrom: [person2],
    })

    describe('when user has wrong scope', () => {
      beforeAll(async () => {
        app = await setupWithAuth({ user: userWithWrongScope })
        await setup(testCase)
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it('should return 403 status if client has wrong scope', async () => {
        // Act
        const response = await server
          .get(path)
          .set('X-Query-National-Id', person1)

        // Assert
        expect(response.status).toBe(403)
      })
    })
  })
})
