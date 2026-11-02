import {
  AidModel,
  AidModelTypeEnum,
  MunicipalityModel,
  MunicipalityModelChildrenAidEnum,
} from '@island.is/clients/municipalities-financial-aid'
import {
  ForIslandisApi,
  ForIslandisFinaidSvcSettingsResponse,
} from '@island.is/clients/rvk-financial-aid'
import { FetchError } from '@island.is/clients/middlewares'
import { messages } from '@island.is/application/templates/financial-aid'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'

const toAidModel = (
  municipalityId: string,
  type: AidModelTypeEnum,
  timestamp: Date,
  amounts: {
    ownPlace: number
    registeredRenting: number
    unregisteredRenting: number
    livesWithParents: number
    withOthers: number
    unknown: number
  },
): AidModel => ({
  id: `${municipalityId}-${type.toLowerCase()}`,
  municipalityId,
  type,
  created: timestamp,
  modified: timestamp,
  ...amounts,
})

export const mapVeitaSettingsToMunicipalityModel = (
  settings: ForIslandisFinaidSvcSettingsResponse,
  municipalityCode: string,
): MunicipalityModel => {
  const municipalityId = settings.municipalityCode ?? municipalityCode
  const timestamp = new Date()

  return {
    id: municipalityId,
    name: settings.municipalityName ?? '',
    municipalityId,
    active: settings.isActive ?? false,
    homepage: settings.websiteUrl ?? '',
    rulesHomepage: settings.finAidRulesUrl ?? '',
    email: settings.contactEmail ?? '',
    usingNav: Boolean(settings.navisionUrl),
    navUrl: settings.navisionUrl ?? '',
    // Veita does not expose Navision credentials.
    navUsername: '',
    navPassword: '',
    // Lossy: Veita's boolean cannot express `Institution`.
    childrenAid: settings.childBonusToApplicant
      ? MunicipalityModelChildrenAidEnum.Applicant
      : MunicipalityModelChildrenAidEnum.NotDefined,
    decemberCompensation: settings.decBonusPercentage ?? 0,
    created: timestamp,
    modified: timestamp,
    individualAidId: `${municipalityId}-individual`,
    cohabitationAidId: `${municipalityId}-cohabitation`,
    individualAid: toAidModel(
      municipalityId,
      AidModelTypeEnum.Individual,
      timestamp,
      {
        ownPlace: settings.singleOwnHouseholdAidAmount ?? 0,
        registeredRenting: settings.singleRentRegisteredLeaseAidAmount ?? 0,
        unregisteredRenting: settings.singleRentUnregisteredLeaseAidAmount ?? 0,
        livesWithParents: settings.singleLivingWithParentsAidAmount ?? 0,
        // Unconfirmed: `withOthers`/`unknown` vs Veita's RentOther/OtherLivingArrangement.
        withOthers: settings.singleRentOtherAidAmount ?? 0,
        unknown: settings.singleOtherLivingArrangementAidAmount ?? 0,
      },
    ),
    cohabitationAid: toAidModel(
      municipalityId,
      AidModelTypeEnum.Cohabitation,
      timestamp,
      {
        ownPlace: settings.cohabitingOwnHouseholdAidAmount ?? 0,
        registeredRenting: settings.cohabitingRentRegisteredLeaseAidAmount ?? 0,
        unregisteredRenting:
          settings.cohabitingRentUnregisteredLeaseAidAmount ?? 0,
        livesWithParents: settings.cohabitingLivingWithParentsAidAmount ?? 0,
        withOthers: settings.cohabitingRentOtherAidAmount ?? 0,
        unknown: settings.cohabitingOtherLivingArrangementAidAmount ?? 0,
      },
    ),
  }
}

// A missing municipality (404 or empty data) becomes null, which routes the
// applicant to MUNCIPALITYNOTREGISTERED. Other failures throw so the
// prerequisites step can be retried.
export const fetchVeitaMunicipalitySettings = async (
  api: ForIslandisApi,
  logger: Logger,
  {
    veitaTenant,
    municipalityCode,
  }: { veitaTenant: string; municipalityCode: string },
): Promise<MunicipalityModel | null> => {
  const context = { veitaTenant, municipalityCode }

  const settings = await api
    .getFinaidServiceSettingsForIslandis({
      xTenantIdentifier: veitaTenant,
      xUserPermissions: 'financialaid:read',
      municipalityCode,
    })
    .catch((error: unknown) => {
      if (error instanceof FetchError && error.status === 404) {
        logger.error('Veita has no settings for municipality', context)
        return null
      }

      logger.error('Error fetching Veita municipality settings', {
        ...context,
        error,
      })
      throw new TemplateApiError(
        {
          title: messages.serviceErrors.veita.title,
          summary: messages.serviceErrors.veita.summary,
        },
        500,
      )
    })

  if (!settings?.data) {
    logger.error('Veita returned no municipality settings', context)
    return null
  }

  return mapVeitaSettingsToMunicipalityModel(settings.data, municipalityCode)
}
