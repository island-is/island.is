import request from 'supertest'
import { getConnectionToken } from '@nestjs/sequelize'
import { Type } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'

import { TestApp, truncate } from '@island.is/testing/nest'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { DelegationRecordDTO } from '@island.is/auth-api-lib'

import { user, TestCase } from './delegations.controller-test-types'
import { setupWithAuth } from '../../../../../test/setup'
import {
  invalidTestCases,
  validTestCases,
} from './delegations.controller.test-cases'

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

      afterAll(() => {
        app.cleanUp()
      })

      it(message, async () => {
        // Act
        const response = await server
          .get('/delegations')
          .set('X-Query-From-National-Id', testCase.requestUser.fromNationalId)
          .query({ scope: testCase.requestUser.scope })

        // Assert
        expect(response.status).toBe(200)
        expect(response.body.totalCount).toEqual(testCase.expectedFrom.length)
        response.body.data.forEach((record: DelegationRecordDTO) => {
          expect(testCase.expectedFrom.includes(record.toNationalId)).toBe(true)
        })
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

      afterAll(() => {
        app.cleanUp()
      })

      it(message, async () => {
        // Act
        const response = await server
          .get('/delegations')
          .set('X-Query-From-National-Id', testCase.requestUser.fromNationalId)
          .query({ scope: testCase.requestUser.scope })

        // Assert
        expect(response.status).toBe(400)
        expect(response.body.detail).toEqual(errorMessage)
      })
    },
  )
})
