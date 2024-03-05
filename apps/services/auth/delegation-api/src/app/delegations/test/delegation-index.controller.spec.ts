import { TestApp } from '@island.is/testing/nest'
import request from 'supertest'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'
import { setupWithAuth } from '../../../../test/setup'
import {
  DelegationIndex,
  DelegationsIndexService,
} from '@island.is/auth-api-lib'
import { getModelToken } from '@nestjs/sequelize'

const currentUser = createCurrentUser({
  nationalIdType: 'person',
  scope: [AuthScope.delegations],
})

describe('DelegationIndexController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let factory: FixtureFactory
  let delegationIndexService: DelegationsIndexService
  let delegationIndexModel: typeof DelegationIndex

  beforeAll(async () => {
    app = await setupWithAuth({
      user: currentUser,
    })
    server = request(app.getHttpServer())

    delegationIndexService = app.get(DelegationsIndexService)
    delegationIndexModel = app.get(getModelToken(DelegationIndex))
  })

  it('should return status 400 if delegation information is missing', async () => {
    // Act
    const response = await server.put('/delegation-index/.id').send({})

    // Assert
    expect(response.status).toBe(400)
  })

  it('should return status 400 if some delegation information is missing (1)', async () => {
    // Act
    const response = await server
      .put('/delegation-index/.id')
      .set('X-Param-Id', 'type')
      .send({})

    // Assert
    expect(response.status).toBe(400)
  })

  it('should return status 400 if some delegation information is missing (2)', async () => {
    // Act
    const response = await server
      .put('/delegation-index/.id')
      .set('X-Param-Id', 'type_fromNationalId')
      .send({})

    // Assert
    expect(response.status).toBe(400)
  })

  it('should return status 400 ', async () => {
})
