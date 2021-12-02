import { configure, configureMock } from '@island.is/auth/react'
import { LoftbruScope, UserProfileScope, AuthScope } from '@island.is/auth/scopes'
//import environment from './environments/environment'
import { createMemoryHistory, createLocation } from 'history';


const userMocked = process.env.API_MOCKS === 'true'

if (userMocked) {
  configureMock({
    profile: { name: 'Mock', locale: 'is', nationalId: '0000000000' },
  })
} else {
  let location = createLocation
  configure({
    //baseUrl: `${window.location.origin}/min-rettindi`,
    //baseUrl: `http://localhost:4200/min-rettindi`,
    baseUrl: `${location}/min-rettindi`,
    redirectPath: '/signin-oidc',
    redirectPathSilent: '/silent/signin-oidc',
    authority: 'https://identity-server.dev01.devland.is',
    client_id: 'vegagerdin.is/air-discount-scheme',
    scope: [
      'openid',
      'profile',
      'api_resource.scope',
      UserProfileScope.read,
      UserProfileScope.write,
      AuthScope.actorDelegations,
      AuthScope.readDelegations,
      AuthScope.writeDelegations,
      LoftbruScope.main,
      LoftbruScope.admin,
    ],
    //post_logout_redirect_uri: `${window.location.origin}`,
    post_logout_redirect_uri: `http://localhost:4200`,
    userStorePrefix: 'sp.',
  })
}
