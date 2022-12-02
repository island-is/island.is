import { configure, configureMock } from '@island.is/auth/react'
import { AuthScope, UserProfileScope } from '@island.is/auth/scopes'

import environment from './environments/environment'

const userMocked = process.env.API_MOCKS === 'true'

if (userMocked) {
  configureMock({
    profile: { name: 'Mock', locale: 'is', nationalId: '0000000000' },
    scopes: [],
  })
} else {
  configure({
    baseUrl: `${window.location.origin}/stjornbord`,
    redirectPath: '/signin-oidc',
    redirectPathSilent: '/silent/signin-oidc',
    switchUserRedirectUrl: '/',
    authority: environment.identityServer.authority,
    client_id: '@admin.island.is/web',
    scope: ['openid', 'profile', UserProfileScope.read, AuthScope.delegations],
    post_logout_redirect_uri: `${window.location.origin}`,
    userStorePrefix: 'ap.',
  })
}
