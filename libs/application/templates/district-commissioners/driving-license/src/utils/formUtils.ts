import { getValueViaPath, NO, YES } from '@island.is/application/core'
import {
  FormValue,
  ApplicationContext,
  ExternalData,
  BasicChargeItem,
  Application,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import { ConditionFn, DrivingLicense, Remark } from '../types'
import {
  B_FULL,
  B_TEMP,
  CHARGE_ITEM_CODES,
  codesRequiringHealthCertificate,
  DELIVERY_FEE,
  DrivingLicenseApplicationFor,
  DrivingLicenseFakeData,
  Pickup,
} from './constants'

export const allowFakeCondition =
  (result = YES) =>
  (answers: FormValue) =>
    getValueViaPath(answers, 'fakeData.useFakeData') === result

export const needsHealthCertificateCondition =
  (result = YES) =>
  (answers: FormValue, externalData: ExternalData) => {
    return (
      Object.values(answers?.healthDeclaration || {}).includes(result) ||
      answers?.hasHealthRemarks === result ||
      externalData.glassesCheck?.data === true
    )
  }

// Whether the applicant's vision answers contradict what their current license
// records. `glassesCheck.data === true` means the license carries a glasses
// code: answering "no" to using glasses — or "yes" when the license has no such
// code — is a change of vision since the last application and requires a
// certificate from the family doctor. Previously computed as a side effect in
// the `HealthDeclaration` custom field and stored in `contactGlassesMismatch`;
// now derived directly so the questions can be plain radio fields, and read
// straight from the glasses-mismatch alert's condition.
export const hasContactGlassesMismatch = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const licenseRequiresGlasses =
    getValueViaPath<boolean>(externalData, 'glassesCheck.data') === true

  const isMismatch = (value: string | undefined) =>
    !!value &&
    ((licenseRequiresGlasses && value === NO) ||
      (!licenseRequiresGlasses && value === YES))

  return (
    isMismatch(
      getValueViaPath(answers, 'healthDeclaration.usesContactGlasses'),
    ) ||
    isMismatch(
      getValueViaPath(answers, 'healthDeclaration.hasReducedPeripheralVision'),
    )
  )
}

export const isVisible =
  (...fns: ConditionFn[]) =>
  (answers: FormValue) => {
    return fns.reduce((s, fn) => (!s ? false : fn(answers)), true)
  }

export const isApplicationForCondition =
  (result: DrivingLicenseApplicationFor | DrivingLicenseApplicationFor[]) =>
  (answers: FormValue) => {
    const strings = Array.isArray(result) ? result : [result]

    return strings.some((x) => x === getValueViaPath(answers, 'applicationFor'))
  }

export const hasNoDrivingLicenseInOtherCountry = (answers: FormValue) =>
  getValueViaPath(answers, 'otherCountry.drivingLicenseInOtherCountry') ===
    NO || true

export const chooseDistrictCommissionerDescription = ({
  answers,
}: {
  answers: FormValue
}) => {
  const applicationForTemp =
    getValueViaPath<DrivingLicenseApplicationFor>(
      answers,
      'applicationFor',
      B_FULL,
    ) === B_TEMP

  return applicationForTemp
    ? m.chooseDistrictCommissionerForTempLicense
    : m.chooseDistrictCommissionerForFullLicense
}

export const hasCompletedPrerequisitesStep =
  (value = false) =>
  ({ application }: ApplicationContext) => {
    const requirementsMet =
      getValueViaPath<boolean>(
        application.answers,
        'requirementsMet',
        false,
      ) === true
    return requirementsMet === value
  }

// Returns only the remarks whose code is on the health-certificate allowlist
// (vision / hearing / prosthesis). Used both to decide whether the health-remarks
// alert renders and to filter what is shown inside it, so administrative remarks
// (e.g. `71` samrit) never appear in a "health" warning.
export const getHealthCertificateRemarks = (
  remarks: Remark[] | undefined,
): Remark[] =>
  (remarks ?? []).filter((r) =>
    codesRequiringHealthCertificate.includes(r.code),
  )

export const hasHealthRemarks = (externalData: ExternalData) =>
  getHealthCertificateRemarks(
    getValueViaPath<DrivingLicense>(externalData, 'currentLicense.data')
      ?.remarks,
  ).length > 0

// Fake data can explicitly turn remarks off (useFakeData = yes, remarks = no),
// in which case the license's real remarks are ignored.
const fakeHealthRemarksDisabled = (answers: FormValue) => {
  const fakeData = getValueViaPath<DrivingLicenseFakeData>(answers, 'fakeData')
  return fakeData?.useFakeData === YES && fakeData?.remarks === NO
}

// Whether the health-remarks alert should show: the current license carries a
// health-related remark and fake data hasn't turned remarks off. Also drives
// the `hasHealthRemarks` answer (via the hidden input) that
// `needsHealthCertificateCondition` and the submission service read. Replaces
// the render + `setValue` the old `HealthRemarks` custom field did.
export const shouldShowHealthRemarks = (
  answers: FormValue,
  externalData: ExternalData,
) => !fakeHealthRemarksDisabled(answers) && hasHealthRemarks(externalData)

// The comma-separated remark descriptions appended to the alert body.
export const getHealthRemarkDescriptions = (
  externalData: ExternalData,
): string =>
  getHealthCertificateRemarks(
    getValueViaPath<DrivingLicense>(externalData, 'currentLicense.data')
      ?.remarks,
  )
    .map((r) => r.description)
    .join(', ')

// RLS exposes the photo binary (`pohto`) inconsistently — some legacy records
// return metadata + signature but a null photo blob. Submission resolves the
// photo by reference (imageId), so binary presence is irrelevant for whether
// a usable quality photo exists. Gate on the record, not the blob.
export const hasUsableRlsQualityPhoto = (externalData: ExternalData): boolean =>
  getValueViaPath<{ imageId?: number | null }>(
    externalData,
    'qualityPhotoAndSignature.data',
  )?.imageId != null

export const getCodes = (application: Application): BasicChargeItem[] => {
  const applicationFor = getValueViaPath<
    'B-full' | 'B-temp' | 'B-full-renewal-65'
  >(application.answers, 'applicationFor', 'B-full')

  const deliveryMethod = getValueViaPath<Pickup>(
    application.answers,
    'delivery.deliveryMethod',
  )

  const codes: BasicChargeItem[] = []

  const DEFAULT_ITEM_CODE = CHARGE_ITEM_CODES[B_FULL]

  const targetCode =
    typeof applicationFor === 'string'
      ? CHARGE_ITEM_CODES[applicationFor]
        ? CHARGE_ITEM_CODES[applicationFor]
        : DEFAULT_ITEM_CODE
      : DEFAULT_ITEM_CODE

  codes.push({ code: targetCode })

  if (deliveryMethod === Pickup.POST) {
    codes.push({ code: CHARGE_ITEM_CODES[DELIVERY_FEE] })
  }

  if (!targetCode) {
    throw new Error('No selected charge item code')
  }

  return codes
}
