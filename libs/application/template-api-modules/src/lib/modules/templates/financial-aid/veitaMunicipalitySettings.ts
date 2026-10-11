import {
  AidModel,
  AidModelTypeEnum,
  MunicipalityModel,
  MunicipalityModelChildrenAidEnum,
} from '@island.is/clients/municipalities-financial-aid'

/**
 * Temporary hand-written shape of `GET /islandis/settings`.
 *
 * Veita's OpenAPI spec declares the 200 response without a schema, so the
 * generated client types it as `void`. Transcribed from a live response and
 * should be deleted once Veita adds `ProducesResponseType` and we regenerate.
 */
export interface VeitaMunicipalitySettings {
  municipalityCode: string
  municipalityName: string
  isActive: boolean
  year: number
  identifier: string
  logoUrl: string
  themeColor: string
  navisionUrl: string
  contactEmail: string
  websiteUrl: string
  finAidRulesUrl: string
  decBonusPercentage: number
  childBonusToApplicant: boolean
  personalTaxAllowance: number
  baseTaxPercentage: number
  amountPerChild: number
  singleOwnHouseholdAidAmount: number
  singleRentRegisteredLeaseAidAmount: number
  singleRentUnregisteredLeaseAidAmount: number
  singleRentOtherAidAmount: number
  singleLivingWithParentsAidAmount: number
  singleOtherLivingArrangementAidAmount: number
  cohabitingOwnHouseholdAidAmount: number
  cohabitingRentRegisteredLeaseAidAmount: number
  cohabitingRentUnregisteredLeaseAidAmount: number
  cohabitingRentOtherAidAmount: number
  cohabitingLivingWithParentsAidAmount: number
  cohabitingOtherLivingArrangementAidAmount: number
}

export interface VeitaMunicipalitySettingsResponse {
  data: VeitaMunicipalitySettings
}

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
  settings: VeitaMunicipalitySettings,
): MunicipalityModel => {
  const municipalityId = settings.municipalityCode
  const timestamp = new Date()

  return {
    id: municipalityId,
    name: settings.municipalityName,
    municipalityId,
    active: settings.isActive,
    homepage: settings.websiteUrl,
    rulesHomepage: settings.finAidRulesUrl,
    email: settings.contactEmail,
    usingNav: Boolean(settings.navisionUrl),
    navUrl: settings.navisionUrl,
    // Veita does not expose Navision credentials.
    navUsername: '',
    navPassword: '',
    // Lossy: Veita's boolean cannot express `Institution`.
    childrenAid: settings.childBonusToApplicant
      ? MunicipalityModelChildrenAidEnum.Applicant
      : MunicipalityModelChildrenAidEnum.NotDefined,
    decemberCompensation: settings.decBonusPercentage,
    created: timestamp,
    modified: timestamp,
    individualAidId: `${municipalityId}-individual`,
    cohabitationAidId: `${municipalityId}-cohabitation`,
    individualAid: toAidModel(
      municipalityId,
      AidModelTypeEnum.Individual,
      timestamp,
      {
        ownPlace: settings.singleOwnHouseholdAidAmount,
        registeredRenting: settings.singleRentRegisteredLeaseAidAmount,
        unregisteredRenting: settings.singleRentUnregisteredLeaseAidAmount,
        livesWithParents: settings.singleLivingWithParentsAidAmount,
        // Unconfirmed: `withOthers`/`unknown` vs Veita's RentOther/OtherLivingArrangement.
        withOthers: settings.singleRentOtherAidAmount,
        unknown: settings.singleOtherLivingArrangementAidAmount,
      },
    ),
    cohabitationAid: toAidModel(
      municipalityId,
      AidModelTypeEnum.Cohabitation,
      timestamp,
      {
        ownPlace: settings.cohabitingOwnHouseholdAidAmount,
        registeredRenting: settings.cohabitingRentRegisteredLeaseAidAmount,
        unregisteredRenting: settings.cohabitingRentUnregisteredLeaseAidAmount,
        livesWithParents: settings.cohabitingLivingWithParentsAidAmount,
        withOthers: settings.cohabitingRentOtherAidAmount,
        unknown: settings.cohabitingOtherLivingArrangementAidAmount,
      },
    ),
  }
}
