import { ApiScope } from '../api.scope'
import { ApplicationScope } from '../application.scope'
import { AuthScope } from '../auth.scope'
import { DocumentsScope } from '../documents.scope'
import { EndorsementsScope } from '../endorsements.scope'
import { NationalRegistryScope } from '../nationalRegistry.scope'
import { UserProfileScope } from '../userProfile.scope'

export const servicePortalScopes = [
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
  ApiScope.intellectualProperties,
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
  ApiScope.lawAndOrder,
  ApiScope.licenses,
  ApiScope.licensesVerify,
  ApiScope.company,
  ApiScope.vehicles,
  ApiScope.workMachines,
  ApiScope.health,
  ApiScope.healthPayments,
  ApiScope.healthMedicines,
  ApiScope.healthAssistiveAndNutrition,
  ApiScope.healthTherapies,
  ApiScope.healthHealthcare,
  ApiScope.healthRightsStatus,
  ApiScope.healthDentists,
  ApiScope.healthOrganDonation,
  ApiScope.healthVaccinations,
  ApiScope.signatureCollection,
]
