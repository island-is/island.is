import { configure, configureMock } from '@island.is/auth/react'
import { ApplicationIdentityServerScope } from '@island.is/application/core'

import { environment } from './environments'

const userMocked = process.env.API_MOCKS === 'true'

if (userMocked) {
  configureMock({
    profile: { name: 'Mock', locale: 'is', nationalId: '0000000000' },
  })
} else {
  configure({
    baseUrl: `${window.location.origin}/umsoknir`,
    redirectPath: '/signin-oidc',
    redirectPathSilent: '/silent/signin-oidc',
    authority: environment.identityServer.authority,
    client_id: 'island-is-1',
    scope: `openid profile api_resource.scope ${ApplicationIdentityServerScope.read} ${ApplicationIdentityServerScope.write}`,
    post_logout_redirect_uri: `${window.location.origin}`,
  })
}
