import {
  getValueViaPath,
  FormValue,
  ApplicationContext,
  Application,
  ExternalData,
} from '@island.is/application/core'
import { m } from '../messages'
import { ConditionFn } from '../types'
import { NO, YES } from '../constants'
import {
  DrivingLicenseApplicationFor,
  B_FULL,
  B_TEMP,
} from '../../shared/constants'
import { hasYes } from './hasYes'
import { CurrentLicenseProviderResult } from '../../dataProviders/CurrentLicenseProvider'

export const allowFakeCondition = (result = YES) => (answers: FormValue) =>
  getValueViaPath(answers, 'fakeData.useFakeData') === result

export const needsHealthCertificateCondition = (result = YES) => (
  answers: FormValue,
) => {
  return (
    Object.values(answers?.healthDeclaration || {}).includes(result) ||
    answers?.hasHealthRemarks === result
  )
}

export const isVisible = (...fns: ConditionFn[]) => (answers: FormValue) => {
  return fns.reduce((s, fn) => (!s ? false : fn(answers)), true)
}

export const isApplicationForCondition = (
  result: DrivingLicenseApplicationFor,
) => (answers: FormValue) => {
  const applicationFor =
    getValueViaPath<DrivingLicenseApplicationFor>(answers, 'applicationFor') ??
    B_FULL

  return applicationFor === result
}

export const hasNoDrivingLicenseInOtherCountry = (answers: FormValue) =>
  !hasYes(answers?.drivingLicenseInOtherCountry)

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
    ? m.chooseDistrictCommisionerForTempLicense.defaultMessage
    : m.chooseDistrictCommisionerForFullLicense.defaultMessage
}

export const hasCompletedPrerequisitesStep = (value = false) => ({
  application,
}: ApplicationContext) => {
  const requirementsMet =
    getValueViaPath<boolean>(application.answers, 'requirementsMet', false) ===
    true

  // TODO: check for gdpr approval as well?

  return requirementsMet === value
}

export const hasHealthRemarks = (externalData: ExternalData) => {
  return (
    (
      getValueViaPath<CurrentLicenseProviderResult>(
        externalData,
        'currentLicense.data',
      )?.healthRemarks || []
    ).length > 0
  )
}
