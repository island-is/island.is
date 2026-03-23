import { getValueViaPath, YES, YesOrNo } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { isReportingOnBehalfOfEmployee as isReportingOnBehalfOfEmployeeOrginal } from './reportingUtils'
import {
  getInjuredPersonInformation as getInjuredPersonInformationOrginal,
  isHomeActivitiesAccident,
} from './accidentUtils'
import { AccidentNotificationAnswers } from '..'
import {
  getWorkplaceData as getWorkplaceDataOrginal,
  isOfWorkAccidentType,
} from './occupationUtils'
import {
  GeneralWorkplaceAccidentLocationEnum,
  ProfessionalAthleteAccidentLocationEnum,
  StudiesAccidentLocationEnum,
  WhoIsTheNotificationForEnum,
  WorkAccidentTypeEnum,
} from './enums'

export const formatPhonenumber = (value: string) => {
  const splitAt = (index: number) => (x: string) =>
    [x.slice(0, index), x.slice(index)]
  if (value.length > 3) return splitAt(3)(value).join('-')
  return value
}

export const hasReceivedConfirmation = (answers: FormValue) => {
  // The fetched value is actually typed as AccidentNotificationConfirmation, but importing that type breaks when codegen is run after cleanup
  const accidentConfirmations = getValueViaPath(
    answers,
    'accidentStatus.receivedConfirmations',
  ) as {
    InjuredOrRepresentativeParty: boolean | undefined
    CompanyParty: boolean | undefined
  }

  // if juridical person then the injured or the power of attorney holder has to confirm
  if (isReportingOnBehalfOfEmployee(answers)) {
    return !!accidentConfirmations.InjuredOrRepresentativeParty
  }

  // as there isn't an juridical person reporting, this must be someone reporting for the injured
  // or the injured himself and that requires the companies confirmation
  return !!accidentConfirmations.CompanyParty
}

// Location and purpose of accident only relevant in work and studies and never in home
// activities
export const hideLocationAndPurpose = (formValue: FormValue) => {
  const answer = getValueViaPath(formValue, 'accidentLocation.answer') as
    | GeneralWorkplaceAccidentLocationEnum
    | StudiesAccidentLocationEnum
    | ProfessionalAthleteAccidentLocationEnum

  if (isHomeActivitiesAccident(formValue)) {
    return true
  }
  return (
    answer === GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE ||
    answer === StudiesAccidentLocationEnum.ATTHESCHOOL ||
    answer === ProfessionalAthleteAccidentLocationEnum.SPORTCLUBSFACILITES
  )
}

export const isHealthInsured = (formValue: FormValue) => {
  const isHealthInsured = getValueViaPath<YesOrNo>(
    formValue,
    'accidentDetails.isHealthInsured',
  )
  if (isHealthInsured === undefined) return true
  return isHealthInsured === 'yes'
}

export const isPowerOfAttorney = (formValue: FormValue) => {
  const reportingOnBehalfType = getValueViaPath<WhoIsTheNotificationForEnum>(
    formValue,
    'whoIsTheNotificationFor.answer',
  )
  return reportingOnBehalfType === WhoIsTheNotificationForEnum.POWEROFATTORNEY
}

export const isRepresentativeOfCompanyOrInstitute = (formValue: FormValue) => {
  return (
    getValueViaPath<WhoIsTheNotificationForEnum>(
      formValue,
      'whoIsTheNotificationFor.answer',
    ) === WhoIsTheNotificationForEnum.JURIDICALPERSON
  )
}

export const isInjuredAndRepresentativeOfCompanyOrInstitute = (
  formValue: FormValue,
) => {
  return formValue.isRepresentativeOfCompanyOrInstitute?.toString() === YES
}

export const isUniqueAssignee = (
  formValue: FormValue,
  isAssignee: boolean,
): boolean => {
  const applicant = getValueViaPath<string>(formValue, 'applicant.nationalId')
  const assignee = getValueViaPath<string>(
    formValue,
    'representative.nationalId',
  )
  const isSamePerson = applicant === assignee

  return !isSamePerson && isAssignee
}

export const shouldRequestReview = (
  answers: Partial<AccidentNotificationAnswers>,
): boolean => {
  const ishome = isHomeActivitiesAccident(answers)
  const isAgriculture = isOfWorkAccidentType(
    answers,
    WorkAccidentTypeEnum.AGRICULTURE,
  )

  const isEitherHomeOrAgriculture = ishome || isAgriculture

  return !isEitherHomeOrAgriculture
}

export const isReportingOnBehalfOfEmployee = (answers: FormValue) => {
  return isReportingOnBehalfOfEmployeeOrginal(answers)
}

export const getWorkplaceData = (answers: FormValue) => {
  return getWorkplaceDataOrginal(answers)
}

export const getInjuredPersonInformation = (answers: FormValue) => {
  return getInjuredPersonInformationOrginal(answers)
}
