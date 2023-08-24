import { configure, configureMock } from '@island.is/auth/react'
import { AdminPortalScope } from '@island.is/auth/scopes'

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
    scope: [
      'openid',
      'profile',
      AdminPortalScope.delegations,
      AdminPortalScope.airDiscountScheme,
      AdminPortalScope.regulationAdmin,
      AdminPortalScope.regulationAdminManage,
      AdminPortalScope.icelandicNamesRegistry,
      AdminPortalScope.applicationSystem,
      AdminPortalScope.documentProvider,
      AdminPortalScope.idsAdmin,
      AdminPortalScope.idsAdminSuperUser,
      AdminPortalScope.petitionsAdmin,
      AdminPortalScope.serviceDesk,
    ],
    post_logout_redirect_uri: `${window.location.origin}`,
    userStorePrefix: 'ap.',
  })
}
