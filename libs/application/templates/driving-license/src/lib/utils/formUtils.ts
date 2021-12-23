import { getValueViaPath, FormValue } from '@island.is/application/core'
import { m } from '../messages'
import { ConditionFn } from '../types'
import { NO, YES } from '../constants'
import {
  DrivingLicenseApplicationFor,
  B_FULL,
  B_TEMP,
} from '../../shared/constants'
import { hasYes } from '../utils'

export const allowFakeCondition = (result = YES) => (answers: FormValue) =>
  getValueViaPath(answers, 'fakeData.useFakeData') === result

export const needsHealthCertificateCondition = (result = YES) => (
  answers: FormValue,
) => {
  return Object.values(answers?.healthDeclaration || {}).includes(result)
}

export const isVisible = (...fns: ConditionFn[]) => (answers: FormValue) =>
  fns.reduce((s, fn) => (!s ? false : fn(answers)), true)

export const isApplicationForCondition = (
  result: DrivingLicenseApplicationFor,
) => (answers: FormValue) => {
  const applicationFor: string[] = getValueViaPath(answers, 'applicationFor', [
    B_FULL,
  ]) as string[]
  return applicationFor.includes(result)
}

export const hasNoDrivingLicenseInOtherCountry = (answers: FormValue) =>
  !hasYes(answers?.drivingLicenseInOtherCountry)

export const chooseDistrictCommissionerDescription = ({
  answers,
}: {
  answers: FormValue
}) => {
  const applicationFor = getValueViaPath(
    answers,
    'applicationFor',
    B_FULL,
  ) as string

  switch (applicationFor) {
    case B_TEMP:
      return m.chooseDistrictCommisionerForTempLicense.defaultMessage
    case B_FULL:
      return m.chooseDistrictCommisionerForFullLicense.defaultMessage
    default:
      return ''
  }
}
