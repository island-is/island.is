import { Type } from '@nestjs/common'
import { getConnectionToken } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import request from 'supertest'

import { DelegationRecordDTO } from '@island.is/auth-api-lib'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { TestApp, truncate } from '@island.is/testing/nest'

import { setupWithAuth } from '../../../../../test/setup'
import {
  TestCase,
  user,
  userWithWrongScope,
} from './delegations.controller-test-types'
import {
  invalidTestCases,
  validTestCases,
} from './delegations.controller.test-cases'

const path = '/v1/delegations'

describe('DelegationsController', () => {
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

  describe.each(Object.keys(validTestCases))(
    'GET(getDelegationRecords): %s',
    (name) => {
      const { testCase, message } = validTestCases[name]

      beforeAll(async () => {
        app = await setupWithAuth({
          user,
        })

        await setup(testCase)
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it(message, async () => {
        // Act
        const response = await server
          .get(path)
          .set('X-Query-National-Id', testCase.requestUser.nationalId)
          .query({
            scopes: testCase.scopes.map((s) => s.name).join(','),
            direction: testCase.requestUser.direction,
          })

        // Assert
        expect(response.status).toBe(200)

        if (testCase.expectedTo) {
          expect(response.body.totalCount).toEqual(testCase.expectedTo?.length)
          response.body.data.forEach((record: DelegationRecordDTO) => {
            expect(testCase.expectedTo?.includes(record.toNationalId)).toBe(
              true,
            )
          })
        }

        if (testCase.expectedFrom) {
          expect(response.body.totalCount).toEqual(
            testCase.expectedFrom?.length,
          )
          response.body.data.forEach((record: DelegationRecordDTO) => {
            expect(testCase.expectedFrom?.includes(record.fromNationalId)).toBe(
              true,
            )
          })
        }
      })
    },
  )

  describe.each(Object.keys(invalidTestCases))(
    'GET(getDelegationRecords): %s',
    (name) => {
      const { testCase, message, errorMessage } = invalidTestCases[name]

      beforeAll(async () => {
        app = await setupWithAuth({
          user,
        })

        await setup(testCase)
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it(message, async () => {
        // Act
        const response = await server
          .get(path)
          .set('X-Query-National-Id', testCase.requestUser.nationalId)
          .query({
            scopes: testCase.requestUser.scope,
            direction: testCase.requestUser.direction,
          })

        // Assert
        expect(response.status).toBe(400)
        expect(response.body.detail).toEqual(errorMessage)
      })
    },
  )

  describe('GET(getDelegationRecords): wrong client scope', () => {
    const { testCase } = validTestCases.scopeWithLegalGuardianGrant
    beforeAll(async () => {
      app = await setupWithAuth({
        user: userWithWrongScope,
      })

      await setup(testCase)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('Should return 403 status if client has wrong scope', async () => {
      // Act
      const response = await server
        .get(path)
        .set('X-Query-National-Id', user.nationalId)
        .query({
          scopes: testCase.scopes.map((s) => s.name).join(','),
          direction: testCase.requestUser.direction,
        })

      // Assert
      expect(response.status).toBe(403)
    })
  })
})
