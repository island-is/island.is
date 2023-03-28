import { configure, configureMock } from '@island.is/auth/react'
import {
  ApplicationScope,
  AuthScope,
  UserProfileScope,
  NationalRegistryScope,
  EndorsementsScope,
  DocumentsScope,
  ApiScope,
} from '@island.is/auth/scopes'

import { environment } from './environments'

const SERVICE_PORTAL_SCOPES = [
  'openid',
  'profile',
  'email',
  'phone',
  UserProfileScope.read,
  UserProfileScope.write,
  DocumentsScope.main,
  ApiScope.assets,
  ApiScope.licenses,
  ApiScope.vehicles,
]

const userMocked = process.env.API_MOCKS === 'true'

if (userMocked) {
  configureMock({
    profile: { name: 'Mock', locale: 'is', nationalId: '0000000000' },
    scopes: SERVICE_PORTAL_SCOPES,
  })
} else {
  configure({
    baseUrl: `${window.location.origin}/minarsidur`,
    redirectPath: '/signin-oidc',
    redirectPathSilent: '/silent/signin-oidc',
    initiateLoginPath: '/login',
    switchUserRedirectUrl: '/',
    authority: environment.identityServer.authority,
    client_id: '@valure',
    scope: SERVICE_PORTAL_SCOPES,
    post_logout_redirect_uri: `${window.location.origin}`,
    userStorePrefix: 'sp.',
  })
}
