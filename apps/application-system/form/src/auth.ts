import { configure, configureMock } from '@island.is/auth/react'
import { environment } from './environments'
import {
  ApplicationScope,
  UserProfileScope,
  NationalRegistryScope,
} from '@island.is/auth/scopes'

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
    scope: `openid profile api_resource.scope ${ApplicationScope.read} ${ApplicationScope.write} ${UserProfileScope.read} ${NationalRegistryScope.individuals}`,
    post_logout_redirect_uri: `${window.location.origin}`,
  })
}
