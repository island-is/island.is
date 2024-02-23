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
      UserProfileScope.read,
      UserProfileScope.write,
      AuthScope.actorDelegations,
      NationalRegistryScope.individuals,
      EndorsementsScope.main,
      ApiScope.internal,
      ApiScope.internalProcuring,
      ApiScope.meDetails,
      ApiScope.fishingLicense,
      ApiScope.assets,
      ApiScope.samgongustofaVehicles,
      ApiScope.carRecycling,
      ApiScope.energyFunds,
      ApiScope.vinnueftirlitid,
      ApiScope.signatureCollection,
      MunicipalitiesFinancialAidScope.read,
      MunicipalitiesFinancialAidScope.write,
      MunicipalitiesFinancialAidScope.applicant,
      ApiScope.licenses,
      ApiScope.education,
      ApiScope.educationLicense,
    ],
    post_logout_redirect_uri: `${window.location.origin}`,
    userStorePrefix: 'as.',
  })
}
