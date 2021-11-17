// TODO: Add tests

import { Case, CaseType } from '@island.is/judicial-system/types'

export type Validation =
  | 'empty'
  | 'time-format'
  | 'police-casenumber-format'
  | 'national-id'
  | 'email-format'
  | 'phonenumber'
  | 'date-format'

export const validate = (value: string, validation: Validation) => {
  if (!value && validation === 'empty') {
    return { isValid: false, errorMessage: 'Reitur má ekki vera tómur' }
  } else {
    const v = getRegexByValidation(validation)

    const isValid = v.regex.test(value)
    return { isValid, errorMessage: isValid ? '' : v.errorMessage }
  }
}

export const getRegexByValidation = (validation: Validation) => {
  switch (validation) {
    case 'empty':
      return {
        regex: new RegExp('.'),
        errorMessage: 'Reitur má ekki vera tómur',
      }
    case 'time-format':
      return {
        regex: new RegExp('^((0[0-9]|1[0-9]|2[0-3])|[0-9]):[0-5][0-9]$'),
        errorMessage: 'Dæmi: 12:34 eða 1:23',
      }
    case 'police-casenumber-format':
      return {
        regex: new RegExp(
          /^[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]-\d{0,99999}$/g,
        ),
        errorMessage: 'Dæmi: 012-3456-7890',
      }
    case 'national-id':
      return {
        regex: new RegExp(/^\d{6}(-?\d{4})?$/g),
        errorMessage: 'Dæmi: 000000-0000',
      }
    case 'email-format':
      return {
        regex: new RegExp(/^$|^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g),
        errorMessage: 'Netfang ekki á réttu formi',
      }
    case 'phonenumber':
      return {
        regex: new RegExp(/^$|^(\d{3})(-?(\d{4}))$/g),
        errorMessage: 'Dæmi: 555-5555',
      }
    case 'date-format': {
      return {
        regex: new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z$/g),
        errorMessage: '',
      }
    }
  }
}

export const isAccusedStepValidRC = (workingCase: Case) => {
  return (
    validate(workingCase.policeCaseNumber, 'empty').isValid &&
    validate(workingCase.policeCaseNumber, 'police-casenumber-format')
      .isValid &&
    workingCase.accusedGender &&
    validate(workingCase.accusedNationalId, 'empty').isValid &&
    validate(workingCase.accusedNationalId, 'national-id').isValid &&
    validate(workingCase.accusedName || '', 'empty').isValid &&
    (workingCase.type === CaseType.CUSTODY
      ? validate(workingCase.defenderEmail || '', 'email-format').isValid &&
        validate(workingCase.defenderPhoneNumber || '', 'phonenumber')
          .isValid &&
        validate(workingCase.leadInvestigator || '', 'empty').isValid
      : true)
  )
}

export const isDefendantStepValidIC = (workingCase: Case) => {
  return (
    validate(workingCase.policeCaseNumber, 'empty').isValid &&
    validate(workingCase.policeCaseNumber, 'police-casenumber-format')
      .isValid &&
    workingCase.type &&
    workingCase.accusedGender &&
    validate(workingCase.accusedNationalId, 'empty').isValid &&
    validate(workingCase.accusedNationalId, 'national-id').isValid &&
    validate(workingCase.accusedName || '', 'empty').isValid
  )
}

export const isHearingArrangementsStepValidRC = (workingCase: Case) => {
  return (
    (workingCase.prosecutor ||
      ((workingCase as unknown) as { prosecutorId: string }).prosecutorId) &&
    (workingCase.court ||
      ((workingCase as unknown) as { courtId: string }).courtId) &&
    validate(workingCase.requestedCourtDate || '', 'date-format').isValid
  )
}

export const isHearingArrangementsStepValidIC = (workingCase: Case) => {
  return (
    (workingCase.prosecutor ||
      ((workingCase as unknown) as { prosecutorId: string }).prosecutorId) &&
    (workingCase.court ||
      ((workingCase as unknown) as { courtId: string }).courtId) &&
    validate(workingCase.requestedCourtDate || '', 'date-format').isValid
  )
}

export const isPoliceDemandsStepValidRC = (workingCase: Case) => {
  return (
    validate(workingCase.lawsBroken || '', 'empty').isValid &&
    validate(workingCase.requestedValidToDate || '', 'date-format').isValid &&
    workingCase.legalProvisions &&
    workingCase.legalProvisions.length > 0
  )
}

export const isPoliceReportStepValidRC = (workingCase: Case) => {
  return (
    validate(workingCase.demands || '', 'empty').isValid &&
    validate(workingCase.caseFacts || '', 'empty').isValid &&
    validate(workingCase.legalArguments || '', 'empty').isValid
  )
}

export const isPoliceDemandsStepValidIC = (workingCase: Case) => {
  return (
    validate(workingCase.demands || '', 'empty').isValid &&
    validate(workingCase.caseFacts || '', 'empty').isValid &&
    validate(workingCase.legalArguments || '', 'empty').isValid
  )
}

export const isOverviewStepValidRC = (workingCase: Case) => {
  return validate(workingCase.courtCaseNumber || '', 'empty').isValid
}

export const isOverviewStepValidIC = (workingCase: Case) => {
  return validate(workingCase.courtCaseNumber || '', 'empty').isValid
}

export const isCourtHearingArrangemenstStepValidRC = (workingCase: Case) => {
  return (
    validate(workingCase.defenderEmail || '', 'email-format').isValid &&
    validate(workingCase.defenderPhoneNumber || '', 'phonenumber').isValid &&
    validate(workingCase.courtDate || '', 'date-format').isValid &&
    workingCase.judge &&
    workingCase.registrar
  )
}

export const isCourtHearingArrangementsStepValidIC = (workingCase: Case) => {
  return (
    workingCase.judge &&
    workingCase.registrar &&
    workingCase.sessionArrangements &&
    validate(workingCase.courtDate || '', 'date-format').isValid
  )
}

export const isCourtRecordStepValidRC = (workingCase: Case) => {
  return (
    validate(workingCase.courtStartDate || '', 'date-format').isValid &&
    validate(workingCase.courtLocation || '', 'empty').isValid &&
    validate(workingCase.litigationPresentations || '', 'empty').isValid
  )
}

export const isCourtRecordStepValidIC = (workingCase: Case) => {
  return (
    validate(workingCase.courtStartDate || '', 'date-format').isValid &&
    validate(workingCase.courtLocation || '', 'empty').isValid &&
    validate(workingCase.prosecutorDemands || '', 'empty').isValid &&
    validate(workingCase.litigationPresentations || '', 'empty').isValid
  )
}

export const isRulingStepOneValidRC = (workingCase: Case) => {
  return (
    validate(workingCase.prosecutorDemands || '', 'empty').isValid &&
    validate(workingCase.courtCaseFacts || '', 'empty').isValid &&
    validate(workingCase.courtLegalArguments || '', 'empty').isValid &&
    validate(workingCase.decision || '', 'empty').isValid &&
    validate(workingCase.ruling || '', 'empty').isValid
  )
}

export const isRulingStepOneValidIC = (workingCase: Case) => {
  return (
    validate(workingCase.courtCaseFacts || '', 'empty').isValid &&
    validate(workingCase.courtLegalArguments || '', 'empty').isValid &&
    validate(workingCase.decision || '', 'empty').isValid &&
    validate(workingCase.ruling || '', 'empty').isValid
  )
}

export const isRulingStepTwoValidRC = (workingCase: Case) => {
  return (
    workingCase.accusedAppealDecision &&
    workingCase.prosecutorAppealDecision &&
    validate(workingCase.conclusion || '', 'empty').isValid &&
    validate(workingCase.courtEndTime || '', 'date-format').isValid
  )
}

export const isRulingStepTwoValidIC = (workingCase: Case) => {
  return (
    workingCase.accusedAppealDecision &&
    workingCase.prosecutorAppealDecision &&
    validate(workingCase.conclusion || '', 'empty').isValid &&
    validate(workingCase.courtEndTime || '', 'date-format').isValid
  )
}
