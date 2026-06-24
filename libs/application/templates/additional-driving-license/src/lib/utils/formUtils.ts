import { getValueViaPath, YES } from '@island.is/application/core'
import {
  FormValue,
  ApplicationContext,
  ExternalData,
  BasicChargeItem,
  Application,
} from '@island.is/application/types'
import { m } from '../messages'
import { ConditionFn } from '../types'
import {
  B_FULL,
  B_TEMP,
  CHARGE_ITEM_CODES,
  DELIVERY_FEE,
  DrivingLicenseApplicationFor,
  Pickup,
} from '../constants'

export const allowFakeCondition =
  (result = YES) =>
  (answers: FormValue) =>
    getValueViaPath(answers, 'fakeData.useFakeData') === result

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

// RLS exposes the photo binary (`photo`) inconsistently — some legacy records
// return metadata + signature but a null photo blob. Submission resolves the
// photo by reference (imageId), so binary presence is irrelevant for whether
// a usable quality photo exists. Gate on the record, not the blob.
export const hasUsableRlsQualityPhoto = (externalData: ExternalData): boolean =>
  getValueViaPath<{ imageId?: number | null }>(
    externalData,
    'qualityPhotoAndSignature.data',
  )?.imageId != null

export const getCodes = (application: Application): BasicChargeItem[] => {
  const applicationFor = getValueViaPath<'BE' | 'B-advanced'>(
    application.answers,
    'applicationFor',
  )

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
