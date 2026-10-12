import {
  AidModel,
  AidModelTypeEnum,
  MunicipalityModel,
  MunicipalityModelChildrenAidEnum,
} from '@island.is/clients/municipalities-financial-aid'
import { ForIslandisFinaidSvcSettingsResponse } from '@island.is/clients/rvk-financial-aid'

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
