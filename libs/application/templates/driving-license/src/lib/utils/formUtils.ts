import { getValueViaPath, NO, YES } from '@island.is/application/core'
import {
  FormValue,
  ApplicationContext,
  ExternalData,
  BasicChargeItem,
  Application,
} from '@island.is/application/types'
import { m } from '../messages'
import { ConditionFn, DrivingLicense } from '../types'
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

export const needsHealthCertificateCondition =
  (result = YES) =>
  (answers: FormValue, externalData: ExternalData) => {
    return (
      Object.values(answers?.healthDeclaration || {}).includes(result) ||
      answers?.hasHealthRemarks === result ||
      externalData.glassesCheck?.data === true
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

export const hasHealthRemarks = (externalData: ExternalData) => {
  return (
    (
      getValueViaPath<DrivingLicense>(externalData, 'currentLicense.data')
        ?.remarks || []
    ).length > 0
  )
}

export const getCodes = (application: Application): BasicChargeItem[] => {
  const applicationFor = getValueViaPath<
    'B-full' | 'B-temp' | 'BE' | 'B-full-renewal-65' | 'B-advanced'
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
