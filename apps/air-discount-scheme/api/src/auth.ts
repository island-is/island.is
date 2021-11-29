import { configure, configureMock } from '@island.is/auth/react'
import { LoftbruScope } from '@island.is/auth/scopes'
import { environment } from './environments'

const userMocked = process.env.API_MOCKS === 'true'

if (userMocked) {
  configureMock({
    profile: { name: 'Mock', locale: 'is', nationalId: '0000000000' },
  })
} else {
  configure({
    baseUrl: `${window.location.origin}/min-rettindi`,
    redirectPath: '/signin-oidc',
    redirectPathSilent: '/silent/signin-oidc',
    authority: 'https://identity-server.dev01.devland.is',
    client_id: 'vegagerdin.is/air-discount-scheme',
    scope: [
      'openid',
      'profile',
      'api_resource.scope',
      LoftbruScope.main,
      LoftbruScope.admin,
    ],
    post_logout_redirect_uri: `${window.location.origin}`,
    userStorePrefix: 'sp.',
  })
}
