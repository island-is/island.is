import { ApiScope } from '../api.scope'
import { ApplicationScope } from '../application.scope'
import { AuthScope } from '../auth.scope'
import { EndorsementsScope } from '../endorsements.scope'
import { MunicipalitiesFinancialAidScope } from '../municipalitiesFinancialAid.scope'
import { NationalRegistryScope } from '../nationalRegistry.scope'
import { UserProfileScope } from '../userProfile.scope'

export const applicationSystemScopes = [
  'api_resource.scope',
  ApiScope.assets,
  ApiScope.carRecycling,
  ApiScope.energyFunds,
  ApiScope.fishingLicense,
  ApiScope.icelandHealth,
  ApiScope.internal,
  ApiScope.internalProcuring,
  ApiScope.licenses,
  ApiScope.meDetails,
  ApiScope.samgongustofaVehicles,
  ApiScope.signatureCollection,
  ApiScope.socialInsuranceAdministration,
  ApiScope.rsk,
  ApiScope.vinnueftirlitid,
  ApiScope.vinnueftirlitidAccident,
  ApiScope.menntamalastofnun,
  ApiScope.ojoiAdverts,
  ApiScope.hms,
  ApplicationScope.read,
  ApplicationScope.write,
  AuthScope.actorDelegations,
  EndorsementsScope.main,
  MunicipalitiesFinancialAidScope.applicant,
  MunicipalitiesFinancialAidScope.read,
  MunicipalitiesFinancialAidScope.write,
  NationalRegistryScope.individuals,
  UserProfileScope.read,
  UserProfileScope.write,
]
