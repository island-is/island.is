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

const userMocked = process.env.API_MOCKS === 'true'

if (userMocked) {
  configureMock({
    profile: { name: 'Mock', locale: 'is', nationalId: '0000000000' },
    scopes: [
      ApiScope.assets,
      ApiScope.education,
      ApiScope.financeOverview,
      ApiScope.financeSalary,
      ApiScope.internal,
      ApiScope.meDetails,
    ],
  })
} else {
  configure({
    baseUrl: `${window.location.origin}/minarsidur`,
    redirectPath: '/signin-oidc',
    redirectPathSilent: '/silent/signin-oidc',
    switchUserRedirectUrl: '/',
    authority: environment.identityServer.authority,
    client_id: '@island.is/web',
    scope: [
      'openid',
      'profile',
      'api_resource.scope',
      ApplicationScope.read,
      ApplicationScope.write,
      UserProfileScope.read,
      UserProfileScope.write,
      AuthScope.actorDelegations,
      AuthScope.readDelegations,
      AuthScope.writeDelegations,
      NationalRegistryScope.individuals,
      DocumentsScope.main,
      EndorsementsScope.main,
      EndorsementsScope.admin,
      ApiScope.assets,
      ApiScope.education,
      ApiScope.financeOverview,
      ApiScope.financeSalary,
      ApiScope.financeSchedule,
      ApiScope.internal,
      ApiScope.meDetails,
      ApiScope.licensesVerify,
    ],
    post_logout_redirect_uri: `${window.location.origin}`,
    userStorePrefix: 'sp.',
  })
}
