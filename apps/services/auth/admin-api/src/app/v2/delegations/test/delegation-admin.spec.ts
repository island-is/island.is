import request from 'supertest'

import { getRequestMethod, setupApp, TestApp } from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { DelegationAdminScopes } from '@island.is/auth/scopes'
import { Delegation, SequelizeConfigService } from '@island.is/auth-api-lib'

import { AppModule } from '../../../app.module'
import { AuthDelegationType } from '@island.is/shared/types'
import { getModelToken } from '@nestjs/sequelize'

const currentUser = createCurrentUser({
  scope: [DelegationAdminScopes.read, DelegationAdminScopes.admin],
})

describe('DelegationAdmin - With authentication', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  beforeEach(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: currentUser,
      dbType: 'postgres',
    })

    server = request(app.getHttpServer())
  })

  afterEach(async () => {
    await app.cleanUp()
  })

  async function createDelegationAdmin(app: TestApp, user?: User) {
    const factory = new FixtureFactory(app)

    const domain = await factory.createDomain({
      name: 'd1',
      apiScopes: [
        { name: 's1', supportedDelegationTypes: [AuthDelegationType.Custom] },
      ],
    })

    return await factory.createCustomDelegation({
      fromNationalId: user?.nationalId ?? '',
      domainName: domain.name,
      scopes: [{ scopeName: 's1' }],
      referenceId: 'ref1',
    })
  }

  it('GET /delegation-admin should return delegations for nationalId', async () => {
    // Arrange
    const delegation = await createDelegationAdmin(app, currentUser)
    // Act
    const res = await getRequestMethod(
      server,
      'GET',
    )('/delegation-admin').set('X-Query-National-Id', currentUser.nationalId)

    // Assert
    expect(res.status).toEqual(200)
    expect(res.body['outgoing'][0].id).toEqual(delegation.id)
  })

  it('DELETE /delegation-admin/:delegation should delete delegation', async () => {
    // Arrange
    const delegation = await createDelegationAdmin(app, currentUser)

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
})
