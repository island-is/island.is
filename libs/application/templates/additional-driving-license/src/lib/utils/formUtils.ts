import { getValueViaPath, YES } from '@island.is/application/core'
import {
  FormValue,
  ExternalData,
  BasicChargeItem,
  Application,
} from '@island.is/application/types'
import {
  advancedLicenseMap,
  CHARGE_ITEM_CODES,
  DELIVERY_FEE,
  Pickup,
} from '../constants'

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
