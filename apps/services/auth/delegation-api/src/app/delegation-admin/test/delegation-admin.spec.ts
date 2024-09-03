import { getRequestMethod, TestApp } from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { setupWithAuth } from '../../../../test/setup'
import request from 'supertest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { DelegationAdminScopes } from '@island.is/auth/scopes'

describe('With authentication', () => {
  async function createDelegationAdmin(app: TestApp, user?: User) {
    const factory = new FixtureFactory(app)

    const domain = await factory.createDomain({
      name: 'd1',
      apiScopes: [{ name: 's1' }],
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
    const user = createCurrentUser({
      scope: [DelegationAdminScopes.read],
    })
    const app = await setupWithAuth({ user })
    const delegation = await createDelegationAdmin(app, user)

    const server = request(app.getHttpServer())

    // Act
    const res = await getRequestMethod(
      server,
      'GET',
    )('/delegation-admin').set('X-Query-National-Id', user.nationalId)

    // Assert
    expect(res.status).toEqual(200)
  })
})
