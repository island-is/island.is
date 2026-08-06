import { getValueViaPath, YES } from '@island.is/application/core'
import {
  FormValue,
  ExternalData,
  BasicChargeItem,
  Application,
} from '@island.is/application/types'
import { NationalRegistryUser } from '@island.is/api/schema'
import {
  advancedLicenseMap,
  AdvancedLicense,
  AdvancedLicenseGroup,
  AdvancedLicenseGroupCodes,
  CHARGE_ITEM_CODES,
  DELIVERY_FEE,
  DrivingLicenseFakeData,
  organizedAdvancedLicenseMap,
  Pickup,
} from './constants'

export const allowFakeCondition =
  (result = YES) =>
  (answers: FormValue) =>
    getValueViaPath(answers, 'fakeData.useFakeData') === result

// RLS exposes the photo binary (`pohto`) inconsistently — some legacy records
// return metadata + signature but a null photo blob. Submission resolves the
// photo by reference (imageId), so binary presence is irrelevant for whether
// a usable quality photo exists. Gate on the record, not the blob.
export const hasUsableRlsQualityPhoto = (externalData: ExternalData): boolean =>
  getValueViaPath<{ imageId?: number | null }>(
    externalData,
    'qualityPhotoAndSignature.data',
  )?.imageId != null

// The applicant's age, from fakeData when faking, else nationalRegistry.
// Coerced to a number so a non-numeric/empty fake value becomes 0 rather than
// NaN (NaN comparisons silently pass the `age < minAge` gates).
export const getApplicantAge = (
  externalData: ExternalData,
  fakeData?: DrivingLicenseFakeData,
): number => {
  const raw =
    fakeData?.useFakeData === YES
      ? fakeData.age
      : getValueViaPath<number>(externalData, 'nationalRegistry.data.age')
  return Number(raw) || 0
}

// Canonical, uppercased category codes the applicant already holds, from
// currentLicense (or fakeData when faking). Reads `nr` OR `name` because legacy
// RLS records carry the category letter in `name` with an empty `nr`, and
// uppercases so casing differences from RLS don't hide a held category.
export const getHeldCategories = (
  externalData: ExternalData,
  fakeData?: DrivingLicenseFakeData,
): string[] => {
  if (fakeData?.useFakeData === YES) {
    return (fakeData.advancedCategories ?? []).map((code) =>
      code.toUpperCase(),
    )
  }
  return (
    getValueViaPath<Array<{ nr?: string | null; name?: string | null }>>(
      externalData,
      'currentLicense.data.categories',
    ) ?? []
  )
    .map((category) => (category.nr || category.name)?.toUpperCase())
    .filter((code): code is string => !!code)
}

// Whether there is at least one advanced category (main or professional) the
// applicant is old enough for and does not already hold. Used both to gate the
// B-advanced option in `sectionApplicationFor` and to keep the selection screen
// from hard-blocking an applicant who has nothing left to select.
export const hasSelectableAdvancedCategories = (
  age: number,
  heldCategories: string[],
): boolean =>
  advancedLicenseMap.some((item) => {
    const held = (code?: string) => !!code && heldCategories.includes(code)
    const mainSelectable = age >= item.minAge && !held(item.code)
    const proSelectable =
      !!item.professional &&
      age >= item.professional.minAge &&
      !held(item.professional.code)
    return mainSelectable || proSelectable
  })

// Formats a national-registry address, appending postal code and city only when
// present so summaries never render `undefined`. Shared by the applicant-info
// and summary sections to keep the formatting consistent.
export const formatRegisteredAddress = (
  address: NationalRegistryUser['address'],
): string => {
  if (!address) {
    return ''
  }

  const { streetAddress, postalCode, city } = address

  const postalAndCity = [postalCode, city].filter(Boolean).join(' ')
  return [streetAddress, postalAndCity].filter(Boolean).join(', ')
}

export const getCodes = (application: Application): BasicChargeItem[] => {
  const applicationFor = getValueViaPath<'BE' | 'B-advanced'>(
    application.answers,
    'applicationFor',
  )

  const deliveryMethod = getValueViaPath<Pickup>(
    application.answers,
    'delivery.deliveryMethod',
  )

  const targetCode = applicationFor
    ? CHARGE_ITEM_CODES[applicationFor]
    : undefined

  if (!targetCode) {
    throw new Error('No selected charge item code')
  }

  const codes: BasicChargeItem[] = [{ code: targetCode }]

  if (deliveryMethod === Pickup.POST) {
    codes.push({ code: CHARGE_ITEM_CODES[DELIVERY_FEE] })
  }

  return codes
}

// Splits a flat list of selected advanced license codes (main + professional,
// e.g. ['C1', 'C1A', 'CE']) into groups, preserving the canonical group order
// (C1, C, D1, D). Groups with no selected codes are omitted.
export const groupAdvancedLicenses = (
  selected: Array<keyof typeof AdvancedLicense> = [],
): AdvancedLicenseGroup[] =>
  Object.entries(organizedAdvancedLicenseMap)
    .map(([group, items]) => ({
      group: group as keyof typeof AdvancedLicenseGroupCodes,
      codes: items
        .flatMap((item) => [item.code, item.professional?.code])
        .filter(
          (code): code is keyof typeof AdvancedLicense =>
            !!code && selected.includes(code),
        ),
    }))
    .filter((group) => group.codes.length > 0)
