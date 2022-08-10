import { getValueViaPath } from '@island.is/application/core'
import {
  FormValue,
  ApplicationContext,
  ExternalData,
} from '@island.is/application/types'
import { applicationForMessages, m } from '../messages'
import { ApplicationInfoMessage, ConditionFn } from '../types'
import { YES, DrivingLicenseFakeData } from '../constants'
import {
  DrivingLicenseApplicationFor,
  B_FULL,
  B_TEMP,
  B_RENEW,
} from '../../shared/constants'
import { hasYes } from './hasYes'
import { CurrentLicenseProviderResult } from '../../dataProviders/CurrentLicenseProvider'
import { NationalRegistryUser } from '../../types/schema'

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
  result: DrivingLicenseApplicationFor | DrivingLicenseApplicationFor[],
) => (answers: FormValue) => {
  const applicationFor =
    getValueViaPath<DrivingLicenseApplicationFor>(answers, 'applicationFor') ??
    B_FULL
  return applicationFor === result || result.includes(applicationFor)
}

export const hasNoDrivingLicenseInOtherCountry = (answers: FormValue) =>
  !hasYes(answers?.drivingLicenseInOtherCountry)

export const needsHealthDeclaration = () => (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const age = getValueViaPath<NationalRegistryUser>(
    externalData,
    'nationalRegistry.data',
  )?.age
  return age ? age <= 65 : true
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

export const getFakeCurrentLicense = (currentLicense?: string) => {
  if (currentLicense === 'temp') {
    return 'B'
  } else if (currentLicense === 'full') {
    return B_FULL
  } else {
    return null
  }
}
export type ApplictionInfo = {
  applicationFor: DrivingLicenseApplicationFor
  currentM: ApplicationInfoMessage
  nextM: ApplicationInfoMessage
}
export const getApplicationInfo = (
  currentLicense?: CurrentLicenseProviderResult,
): ApplictionInfo => {
  const applicationFor = !currentLicense?.currentLicense
    ? B_TEMP
    : currentLicense?.currentLicense === 'B'
    ? B_FULL
    : B_RENEW

  switch (applicationFor) {
    case B_TEMP:
      return {
        applicationFor,
        currentM: applicationForMessages.NONE,
        nextM: applicationForMessages.B_TEMP,
      }
    case B_FULL:
      return {
        applicationFor,
        currentM: applicationForMessages.B_TEMP,
        nextM: applicationForMessages.B_FULL,
      }
    case B_RENEW:
      return {
        applicationFor,
        currentM: applicationForMessages.B_FULL,
        nextM: applicationForMessages.B_RENEW,
      }
  }
}

export const isExpiring =(exp?: string): boolean => {
  return exp ? new Date(exp).getFullYear() <= new Date().getFullYear() : false
}
