import { configure, configureMock } from '@island.is/auth/react'

import environment from './environments/environment'

const userMocked = process.env.API_MOCKS === 'true'

if (userMocked) {
  configureMock({
    profile: { name: 'Mock', locale: 'is', nationalId: '0000000000' },
    scopes: [],
  })
} else {
  configure({
    baseUrl: `${window.location.origin}/form`,
    redirectPath: '/signin-oidc',
    redirectPathSilent: '/silent/signin-oidc',
    switchUserRedirectUrl: '/',
    authority: environment.identityServer.authority,
    client_id: '@admin.island.is/web', // TODO: Change this to the correct client id
    scope: ['openid', 'profile'],
    post_logout_redirect_uri: `${window.location.origin}`,
    userStorePrefix: 'ap.',
  })
}
