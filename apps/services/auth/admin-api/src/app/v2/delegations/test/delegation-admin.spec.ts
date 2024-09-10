import request from 'supertest'

import { getRequestMethod, setupApp, TestApp } from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { DelegationAdminScopes } from '@island.is/auth/scopes'
import { SequelizeConfigService } from '@island.is/auth-api-lib'

import { AppModule } from '../../../app.module'
import { AuthDelegationType } from '@island.is/shared/types'

const currentUser = createCurrentUser({
  scope: [DelegationAdminScopes.read, DelegationAdminScopes.admin],
})

describe('DelegationAdmin - With authentication', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: currentUser,
      dbType: 'postgres',
    })

    server = request(app.getHttpServer())
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
    })
  }

  async function formatUrl(app: TestApp, endpoint: string, user?: User) {
    if (!endpoint.includes(':delegation')) {
      return endpoint
    }

    const delegation = await createDelegationAdmin(app, user)

    return endpoint.replace(':delegation', encodeURIComponent(delegation.id))
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
})
