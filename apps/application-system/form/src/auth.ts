import { configure, configureMock } from '@island.is/auth/react'
import { environment } from './environments'
import {
  ApiScope,
  ApplicationScope,
  NationalRegistryScope,
  UserProfileScope,
  EndorsementsScope,
  AuthScope,
  MunicipalitiesFinancialAidScope,
} from '@island.is/auth/scopes'

// Are users mocked?
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
    client_id: '@island.is/web',
    scope: [
      'openid',
      'profile',
      'api_resource.scope',
      ApplicationScope.read,
      ApplicationScope.write,
      AuthScope.actorDelegations,
      UserProfileScope.read,
      UserProfileScope.write,
      NationalRegistryScope.individuals,
      EndorsementsScope.main,
      ApiScope.internal,
      ApiScope.internalProcuring,
      ApiScope.meDetails,
      ApiScope.fishingLicense,
      MunicipalitiesFinancialAidScope.read,
      MunicipalitiesFinancialAidScope.write,
      MunicipalitiesFinancialAidScope.applicant,
      ApiScope.assets,
      ApiScope.samgongustofaVehicles,
    ],
    post_logout_redirect_uri: `${window.location.origin}`,
    userStorePrefix: 'as.',
  })
}
