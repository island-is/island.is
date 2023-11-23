import { configure, configureMock } from '@island.is/auth/react'
import {
  ApiScope,
  ApplicationScope,
  AuthScope,
  DocumentsScope,
  EndorsementsScope,
  NationalRegistryScope,
  UserProfileScope,
} from '@island.is/auth/scopes'
import { ProjectBasePath } from '@island.is/shared/constants'

import { environment } from './environments'

const SERVICE_PORTAL_SCOPES = [
  'openid',
  'profile',
  'api_resource.scope',
  ApplicationScope.read,
  ApplicationScope.write,
  UserProfileScope.read,
  UserProfileScope.write,
  AuthScope.actorDelegations,
  AuthScope.delegations,
  AuthScope.consents,
  NationalRegistryScope.individuals,
  DocumentsScope.main,
  EndorsementsScope.main,
  EndorsementsScope.admin,
  ApiScope.assets,
  ApiScope.education,
  ApiScope.educationLicense,
  ApiScope.financeOverview,
  ApiScope.financeSalary,
  ApiScope.financeSchedule,
  ApiScope.financeLoans,
  ApiScope.internal,
  ApiScope.internalProcuring,
  ApiScope.meDetails,
  ApiScope.licenses,
  ApiScope.licensesVerify,
  ApiScope.company,
  ApiScope.vehicles,
  ApiScope.health,
  ApiScope.workMachines,
  ApiScope.health,
]

const userMocked = process.env.API_MOCKS === 'true'

if (userMocked) {
  configureMock({
    profile: { name: 'Mock', locale: 'is', nationalId: '0000000000' },
    scopes: SERVICE_PORTAL_SCOPES,
  })
} else {
  configure({
    baseUrl: `${window.location.origin}${ProjectBasePath.ServicePortal}`,
    redirectPath: '/signin-oidc',
    redirectPathSilent: '/silent/signin-oidc',
    initiateLoginPath: '/login',
    switchUserRedirectUrl: '/',
    authority: environment.identityServer.authority,
    client_id: '@island.is/web',
    scope: SERVICE_PORTAL_SCOPES,
    post_logout_redirect_uri: `${window.location.origin}`,
    userStorePrefix: 'sp.',
  })
}
