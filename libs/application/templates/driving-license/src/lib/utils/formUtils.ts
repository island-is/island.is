import { NO, YES, getValueViaPath } from '@island.is/application/core'
import {
  FormValue,
  ApplicationContext,
  ExternalData,
  Application,
  BasicChargeItem,
} from '@island.is/application/types'
import { m } from '../messages'
import {
  License,
  ConditionFn,
  DrivingLicense,
  Pickup,
  CHARGE_ITEM_CODES,
  DELIVERY_FEE,
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
  (result: string | string[]) => (answers: FormValue) => {
    const strings = Array.isArray(result) ? result : [result]

    return strings.some(
      (x) => x === getValueViaPath(answers, 'applicationFor') ?? License.B_FULL,
    )
  }

export const hasNoDrivingLicenseInOtherCountry = (answers: FormValue) =>
  getValueViaPath(answers, 'otherCountry.drivingLicenseInOtherCountry') ===
    NO || true

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
  const applicationFor = getValueViaPath(application.answers, 'applicationFor')
  const pickup = getValueViaPath<Pickup>(application.answers, 'pickup')
  const codes: BasicChargeItem[] = []

  const targetCode =
    typeof applicationFor === 'string'
      ? CHARGE_ITEM_CODES[applicationFor]
        ? CHARGE_ITEM_CODES[applicationFor]
        : CHARGE_ITEM_CODES[License.B_FULL]
      : CHARGE_ITEM_CODES[License.B_FULL]

  codes.push({ code: targetCode })

  if (pickup === Pickup.POST) {
    codes.push({ code: CHARGE_ITEM_CODES[DELIVERY_FEE] })
  }

  if (!targetCode) {
    throw new Error('No selected charge item code')
  }

  return codes
}
