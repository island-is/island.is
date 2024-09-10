import { getValueViaPath } from '@island.is/application/core'
import {
  FormValue,
  ApplicationContext,
  ExternalData,
} from '@island.is/application/types'
import { m } from '../messages'
import { ConditionFn, DrivingLicense } from '../types'
import {
  B_FULL,
  B_TEMP,
  DrivingLicenseApplicationFor,
  DrivingLicenseFakeData,
  NO,
  YES,
} from '../constants'
import { NationalRegistryUser } from '@island.is/api/schema'
import { info } from 'kennitala'

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
  (result: DrivingLicenseApplicationFor) => (answers: FormValue) => {
    const applicationFor =
      getValueViaPath<DrivingLicenseApplicationFor>(
        answers,
        'applicationFor',
      ) ?? B_FULL

    return applicationFor === result
  }

export const hasNoDrivingLicenseInOtherCountry = (answers: FormValue) =>
  getValueViaPath(answers, 'otherCountry.drivingLicenseInOtherCountry') ===
    NO || true

export const isYoungerThan65 = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const fakeData = getValueViaPath<DrivingLicenseFakeData>(answers, 'fakeData')
  const age = info(
    (externalData.nationalRegistry.data as NationalRegistryUser).nationalId,
  )?.age

  return fakeData && fakeData.age ? fakeData.age < 65 : age < 65
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
