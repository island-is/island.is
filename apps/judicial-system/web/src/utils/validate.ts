// TODO: Add tests
import { Case, CaseType, User } from '@island.is/judicial-system/types'

import { isBusiness } from './stepHelper'

export type Validation =
  | 'empty'
  | 'time-format'
  | 'police-casenumber-format'
  | 'national-id'
  | 'date-of-birth'
  | 'email-format'
  | 'phonenumber'
  | 'date-format'
  | 'court-case-number'

const someDefendantIsInvalid = (workingCase: Case) => {
  return (
    workingCase.defendants &&
    workingCase.defendants.some(
      (defendant) =>
        (!isBusiness(defendant.nationalId) && !defendant.gender) ||
        (!defendant.noNationalId &&
          !validate(defendant.nationalId || '', 'empty').isValid) ||
        !validate(
          defendant.nationalId || '',
          defendant.noNationalId ? 'date-of-birth' : 'national-id',
        ).isValid ||
        !validate(defendant.name || '', 'empty').isValid ||
        !validate(defendant.address || '', 'empty').isValid,
    )
  )
}

const getRegexByValidation = (validation: Validation) => {
  switch (validation) {
    case 'empty':
      return {
        regex: new RegExp('.'),
        errorMessage: 'Reitur má ekki vera tómur',
      }
    case 'time-format':
      return {
        regex: new RegExp(/^((0[0-9]|1[0-9]|2[0-3])|[0-9]):[0-5][0-9]$/),
        errorMessage: 'Dæmi: 12:34 eða 1:23',
      }
    case 'police-casenumber-format':
      return {
        regex: new RegExp(/^[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]-\d{1,99999}$/),
        errorMessage: 'Dæmi: 012-3456-7890',
      }
    case 'national-id':
      return {
        regex: new RegExp(/^\d{6}(-?\d{4})?$/),
        errorMessage: 'Dæmi: 000000-0000',
      }
    case 'date-of-birth': {
      return {
        regex: new RegExp(
          /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/,
        ),
        errorMessage: 'Dæmi: 00.00.0000',
      }
    }
    case 'email-format':
      return {
        regex: new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        errorMessage: 'Netfang ekki á réttu formi',
      }
    case 'phonenumber':
      return {
        regex: new RegExp(/^(\d{3})(-?(\d{4}))$/),
        errorMessage: 'Dæmi: 555-5555',
      }
    case 'date-format': {
      return {
        regex: new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z$/),
        errorMessage: '',
      }
    }
    case 'court-case-number': {
      return {
        regex: new RegExp(/^R-[0-9]{1,4}\/[0-9]{4}$/),
        errorMessage: `Dæmi: R-1234/${new Date().getFullYear()}`,
      }
    }
  }
}

export const validate = (value: string, validation: Validation) => {
  if (!value) {
    if (validation === 'empty') {
      return { isValid: false, errorMessage: 'Reitur má ekki vera tómur' }
    } else {
      return { isValid: true, errorMessage: '' }
    }
  } else {
    const v = getRegexByValidation(validation)

    const isValid = v.regex.test(value)
    return { isValid, errorMessage: isValid ? '' : v.errorMessage }
  }
}

export const isDefendantStepValidRC = (workingCase: Case) => {
  return (
    validate(workingCase.policeCaseNumber, 'empty').isValid &&
    validate(workingCase.policeCaseNumber, 'police-casenumber-format')
      .isValid &&
    workingCase.defendants &&
    workingCase.defendants.length > 0 &&
    !someDefendantIsInvalid(workingCase) &&
    validate(workingCase.defenderEmail || '', 'email-format').isValid &&
    validate(workingCase.defenderPhoneNumber || '', 'phonenumber').isValid &&
    (workingCase.type === CaseType.TRAVEL_BAN ||
      validate(workingCase.leadInvestigator || '', 'empty').isValid)
  )
}

export const isDefendantStepValidForSidebarRC = (workingCase: Case) => {
  return workingCase.id && isDefendantStepValidRC(workingCase)
}

export const isDefendantStepValidIC = (workingCase: Case) => {
  return (
    validate(workingCase.policeCaseNumber, 'empty').isValid &&
    validate(workingCase.policeCaseNumber, 'police-casenumber-format')
      .isValid &&
    workingCase.type &&
    workingCase.defendants &&
    workingCase.defendants.length > 0 &&
    !someDefendantIsInvalid(workingCase) &&
    validate(workingCase.defenderEmail || '', 'email-format').isValid &&
    validate(workingCase.defenderPhoneNumber || '', 'phonenumber').isValid
  )
}

export const isDefendantStepValidForSidebarIC = (workingCase: Case) => {
  return workingCase.id && isDefendantStepValidIC(workingCase)
}

export const isHearingArrangementsStepValidRC = (workingCase: Case) => {
  return (
    (workingCase.prosecutor ||
      ((workingCase as unknown) as { prosecutorId: string }).prosecutorId) &&
    (workingCase.court ||
      ((workingCase as unknown) as { courtId: string }).courtId) &&
    validate(workingCase.requestedCourtDate || '', 'empty').isValid &&
    validate(workingCase.requestedCourtDate || '', 'date-format').isValid &&
    (workingCase.type !== CaseType.TRAVEL_BAN && !workingCase.parentCase
      ? validate(workingCase.arrestDate || '', 'empty').isValid &&
        validate(workingCase.arrestDate || '', 'date-format').isValid
      : true)
  )
}

export const isHearingArrangementsStepValidIC = (workingCase: Case) => {
  return (
    (workingCase.prosecutor ||
      ((workingCase as unknown) as { prosecutorId: string }).prosecutorId) &&
    (workingCase.court ||
      ((workingCase as unknown) as { courtId: string }).courtId) &&
    validate(workingCase.requestedCourtDate || '', 'empty').isValid &&
    validate(workingCase.requestedCourtDate || '', 'date-format').isValid
  )
}

export const isPoliceDemandsStepValidRC = (workingCase: Case) => {
  return (
    validate(workingCase.lawsBroken || '', 'empty').isValid &&
    validate(workingCase.requestedValidToDate || '', 'empty').isValid &&
    validate(workingCase.requestedValidToDate || '', 'date-format').isValid &&
    ((workingCase.legalProvisions && workingCase.legalProvisions.length > 0) ||
      validate(workingCase.legalBasis || '', 'empty').isValid)
  )
}

export const isPoliceDemandsStepValidIC = (workingCase: Case) => {
  return (
    validate(workingCase.demands || '', 'empty').isValid &&
    validate(workingCase.lawsBroken || '', 'empty').isValid &&
    validate(workingCase.legalBasis || '', 'empty').isValid
  )
}

export const isPoliceReportStepValidRC = (workingCase: Case) => {
  return (
    validate(workingCase.demands || '', 'empty').isValid &&
    validate(workingCase.caseFacts || '', 'empty').isValid &&
    validate(workingCase.legalArguments || '', 'empty').isValid
  )
}

export const isPoliceReportStepValidIC = (workingCase: Case) => {
  return (
    validate(workingCase.caseFacts || '', 'empty').isValid &&
    validate(workingCase.legalArguments || '', 'empty').isValid
  )
}

export const isReceptionAndAssignmentStepValidRC = (workingCase: Case) => {
  return (
    validate(workingCase.courtCaseNumber || '', 'empty').isValid &&
    validate(workingCase.courtCaseNumber || '', 'court-case-number').isValid &&
    workingCase.judge
  )
}

export const isReceptionAndAssignmentStepValidIC = (workingCase: Case) => {
  return (
    validate(workingCase.courtCaseNumber || '', 'empty').isValid &&
    validate(workingCase.courtCaseNumber || '', 'court-case-number').isValid &&
    workingCase.judge
  )
}

export const isCourtHearingArrangemenstStepValidRC = (
  workingCase: Case,
  courtDate?: string,
) => {
  const date = courtDate || workingCase.courtDate
  return (
    validate(workingCase.defenderEmail || '', 'email-format').isValid &&
    validate(workingCase.defenderPhoneNumber || '', 'phonenumber').isValid &&
    validate(date || '', 'empty').isValid &&
    validate(date || '', 'date-format').isValid
  )
}

export const isCourtHearingArrangementsStepValidIC = (
  workingCase: Case,
  courtDate?: string,
) => {
  const date = courtDate || workingCase.courtDate
  return (
    workingCase.sessionArrangements &&
    validate(date || '', 'empty').isValid &&
    validate(date || '', 'date-format').isValid &&
    validate(workingCase.defenderEmail || '', 'email-format').isValid &&
    validate(workingCase.defenderPhoneNumber || '', 'phonenumber').isValid
  )
}

export const isRulingValidRC = (workingCase: Case) => {
  return (
    validate(workingCase.prosecutorDemands || '', 'empty').isValid &&
    validate(workingCase.courtCaseFacts || '', 'empty').isValid &&
    validate(workingCase.courtLegalArguments || '', 'empty').isValid
  )
}

export const isRulingValidIC = (workingCase: Case) => {
  return (
    validate(workingCase.prosecutorDemands || '', 'empty').isValid &&
    validate(workingCase.courtCaseFacts || '', 'empty').isValid &&
    validate(workingCase.courtLegalArguments || '', 'empty').isValid &&
    validate(workingCase.ruling || '', 'empty').isValid
  )
}

export const isCourtRecordStepValidRC = (workingCase: Case) => {
  return (
    validate(workingCase.courtStartDate || '', 'empty').isValid &&
    validate(workingCase.courtStartDate || '', 'date-format').isValid &&
    validate(workingCase.courtLocation || '', 'empty').isValid &&
    validate(workingCase.sessionBookings || '', 'empty').isValid &&
    workingCase.accusedAppealDecision &&
    workingCase.prosecutorAppealDecision &&
    validate(workingCase.courtEndTime || '', 'empty').isValid &&
    validate(workingCase.courtEndTime || '', 'date-format').isValid &&
    validate(workingCase.decision || '', 'empty').isValid &&
    validate(workingCase.conclusion || '', 'empty').isValid
  )
}

export const isCourtRecordStepValidIC = (workingCase: Case) => {
  return (
    validate(workingCase.courtStartDate || '', 'empty').isValid &&
    validate(workingCase.courtStartDate || '', 'date-format').isValid &&
    validate(workingCase.courtLocation || '', 'empty').isValid &&
    validate(workingCase.sessionBookings || '', 'empty').isValid &&
    workingCase.accusedAppealDecision &&
    workingCase.prosecutorAppealDecision &&
    validate(workingCase.courtEndTime || '', 'empty').isValid &&
    validate(workingCase.courtEndTime || '', 'date-format').isValid &&
    validate(workingCase.decision || '', 'empty').isValid &&
    validate(workingCase.conclusion || '', 'empty').isValid
  )
}

export const isAdminUserFormValid = (user: User) => {
  return (
    validate(user.name, 'empty').isValid &&
    validate(user.nationalId, 'empty').isValid &&
    validate(user.nationalId, 'national-id').isValid &&
    user.institution &&
    validate(user.title, 'empty').isValid &&
    validate(user.mobileNumber, 'empty').isValid &&
    validate(user.email, 'empty').isValid &&
    validate(user.email, 'email-format').isValid
  )
}
