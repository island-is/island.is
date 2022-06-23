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

type ValidateItem = 'valid' | [string | undefined, Validation[]]
type IsValid = { isValid: boolean; errorMessage: string }

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
        regex: new RegExp(/^[\w-.+]+@([\w-]+\.)+[\w-]{2,4}$/),
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
        regex: new RegExp(/^R-[0-9]{1,5}\/[0-9]{4}$/),
        errorMessage: `Dæmi: R-1234/${new Date().getFullYear()}`,
      }
    }
  }
}

export const validate = (items: ValidateItem[]): IsValid => {
  const returnValue = items
    .map((item) => {
      if (item === 'valid') {
        return undefined
      }

      const [value, validations] = item

      const result = validations
        .map((validation) => {
          if (!value && validation === 'empty') {
            return { isValid: false, errorMessage: 'Reitur má ekki vera tómur' }
          }

          if (!value) {
            return undefined
          }

          const v = getRegexByValidation(validation)

          const isValid = v.regex.test(value)
          return isValid ? undefined : { isValid, errorMessage: v.errorMessage }
        })
        .filter(Boolean) as IsValid[]

      return result[0]
    })
    .filter(Boolean) as IsValid[]

  return returnValue.length > 0
    ? returnValue[0]
    : { isValid: true, errorMessage: '' }
}

const someDefendantIsInvalid = (workingCase: Case) => {
  return (
    workingCase.defendants &&
    workingCase.defendants.length > 0 &&
    workingCase.defendants.some(
      (defendant) =>
        (!isBusiness(defendant.nationalId) && !defendant.gender) ||
        validate([
          [
            defendant.nationalId,
            [defendant.noNationalId ? 'date-of-birth' : 'national-id'],
          ],
          [defendant.name, ['empty']],
          [defendant.address, ['empty']],
          [defendant.address, ['empty']],
          defendant.noNationalId ? 'valid' : [defendant.nationalId, ['empty']],
        ]).isValid,
    )
  )
}

export const isDefendantStepValidRC = (workingCase: Case) => {
  return (
    !someDefendantIsInvalid(workingCase) &&
    validate([
      [workingCase.policeCaseNumber, ['empty', 'police-casenumber-format']],
      [workingCase.defenderEmail, ['email-format']],
      [workingCase.defenderPhoneNumber, ['phonenumber']],
      workingCase.type === CaseType.TRAVEL_BAN
        ? 'valid'
        : [workingCase.leadInvestigator, ['empty']],
    ]).isValid
  )
}

export const isDefendantStepValidForSidebarRC = (workingCase: Case) => {
  return workingCase.id && isDefendantStepValidRC(workingCase)
}

export const isDefendantStepValidIC = (workingCase: Case) => {
  return (
    !someDefendantIsInvalid(workingCase) &&
    validate([
      [workingCase.type, ['empty']],
      [workingCase.policeCaseNumber, ['empty', 'police-casenumber-format']],
      [workingCase.defenderEmail, ['email-format']],
      [workingCase.defenderPhoneNumber, ['phonenumber']],
    ]).isValid
  )
}

export const isDefendantStepValidForSidebarIC = (workingCase: Case) => {
  return workingCase.id && isDefendantStepValidIC(workingCase)
}

export const isHearingArrangementsStepValidRC = (workingCase: Case) => {
  console.log(
    validate([
      {
        value: workingCase.requestedCourtDate,
        validations: ['empty', 'date-format'],
      },
      ...(workingCase.type !== CaseType.TRAVEL_BAN && !workingCase.parentCase
        ? [
            {
              value: workingCase.arrestDate,
              validations: ['empty', 'date-format'],
            } as ValidationItem,
          ]
        : []),
    ]),
  )
  return (
    (workingCase.prosecutor ||
      ((workingCase as unknown) as { prosecutorId: string }).prosecutorId) &&
    (workingCase.court ||
      ((workingCase as unknown) as { courtId: string }).courtId) &&
    validate([
      {
        value: workingCase.requestedCourtDate,
        validations: ['empty', 'date-format'],
      },
      ...(workingCase.type !== CaseType.TRAVEL_BAN && !workingCase.parentCase
        ? [
            {
              value: workingCase.arrestDate,
              validations: ['empty', 'date-format'],
            } as ValidationItem,
          ]
        : []),
    ]).length === 0
  )
}

export const isHearingArrangementsStepValidIC = (workingCase: Case) => {
  return (
    (workingCase.prosecutor ||
      ((workingCase as unknown) as { prosecutorId: string }).prosecutorId) &&
    (workingCase.court ||
      ((workingCase as unknown) as { courtId: string }).courtId) &&
    validate([
      {
        value: workingCase.requestedCourtDate,
        validations: ['empty', 'date-format'],
      },
    ]).length === 0
  )
}

export const isPoliceDemandsStepValidRC = (workingCase: Case) => {
  return validate([
    [workingCase.lawsBroken, ['empty']],
    [workingCase.requestedValidToDate, ['empty', 'date-format']],
    workingCase.legalProvisions && workingCase.legalProvisions.length > 0
      ? 'valid'
      : [workingCase.lawsBroken, ['empty']],
  ]).isValid
}

export const isPoliceDemandsStepValidIC = (workingCase: Case) => {
  return (
    validate([
      { value: workingCase.demands, validations: ['empty'] },
      {
        value: workingCase.lawsBroken,
        validations: ['empty'],
      },
      { value: workingCase.legalBasis, validations: ['empty'] },
    ]).length === 0
  )
}

export const isPoliceReportStepValidRC = (workingCase: Case) => {
  return (
    validate([
      { value: workingCase.demands, validations: ['empty'] },
      { value: workingCase.caseFacts, validations: ['empty'] },
      { value: workingCase.legalArguments, validations: ['empty'] },
    ]).length === 0
  )
}

export const isPoliceReportStepValidIC = (workingCase: Case) => {
  return (
    validate([
      { value: workingCase.caseFacts, validations: ['empty'] },
      { value: workingCase.legalArguments, validations: ['empty'] },
    ]).length === 0
  )
}

export const isReceptionAndAssignmentStepValidRC = (workingCase: Case) => {
  return (
    workingCase.judge &&
    validate([
      {
        value: workingCase.courtCaseNumber,
        validations: ['empty', 'court-case-number'],
      },
    ]).length === 0
  )
}

export const isReceptionAndAssignmentStepValidIC = (workingCase: Case) => {
  return (
    workingCase.judge &&
    validate([
      {
        value: workingCase.courtCaseNumber,
        validations: ['empty', 'court-case-number'],
      },
    ]).length === 0
  )
}

export const isCourtHearingArrangemenstStepValidRC = (
  workingCase: Case,
  courtDate?: string,
) => {
  const date = courtDate || workingCase.courtDate

  return (
    validate([
      { value: workingCase.defenderEmail, validations: ['email-format'] },
      { value: workingCase.defenderPhoneNumber, validations: ['phonenumber'] },
      { value: date, validations: ['empty', 'date-format'] },
    ]).length === 0
  )
}

export const isCourtHearingArrangementsStepValidIC = (
  workingCase: Case,
  courtDate?: string,
) => {
  const date = courtDate || workingCase.courtDate

  return (
    workingCase.sessionArrangements &&
    validate([
      { value: workingCase.defenderEmail, validations: ['email-format'] },
      { value: workingCase.defenderPhoneNumber, validations: ['phonenumber'] },
      { value: date, validations: ['empty', 'date-format'] },
    ]).length === 0
  )
}

export const isRulingValidRC = (workingCase: Case) => {
  return validate([
    {
      value: workingCase.prosecutorDemands,
      validations: ['empty'],
    },
    {
      value: workingCase.courtCaseFacts,
      validations: ['empty'],
    },
    {
      value: workingCase.courtLegalArguments,
      validations: ['empty'],
    },
  ])
}

export const isRulingValidIC = (workingCase: Case) => {
  return validate([
    {
      value: workingCase.prosecutorDemands,
      validations: ['empty'],
    },
    {
      value: workingCase.courtCaseFacts,
      validations: ['empty'],
    },
    {
      value: workingCase.courtLegalArguments,
      validations: ['empty'],
    },
  ])
}

export const isCourtRecordStepValidRC = (workingCase: Case) => {
  return (
    workingCase.accusedAppealDecision &&
    workingCase.prosecutorAppealDecision &&
    validate([
      {
        value: workingCase.courtStartDate,
        validations: ['empty', 'date-format'],
      },
      { value: workingCase.courtLocation, validations: ['empty'] },
      { value: workingCase.sessionBookings, validations: ['empty'] },
      {
        value: workingCase.courtEndTime,
        validations: ['empty', 'date-format'],
      },
      { value: workingCase.decision, validations: ['empty'] },
      { value: workingCase.conclusion, validations: ['empty'] },
      { value: workingCase.ruling, validations: ['empty'] },
    ]).length === 0
  )
}

export const isCourtRecordStepValidIC = (workingCase: Case) => {
  return (
    workingCase.accusedAppealDecision &&
    workingCase.prosecutorAppealDecision &&
    validate([
      {
        value: workingCase.courtStartDate,
        validations: ['empty', 'date-format'],
      },
      { value: workingCase.courtLocation, validations: ['empty'] },
      { value: workingCase.sessionBookings, validations: ['empty'] },
      {
        value: workingCase.courtEndTime,
        validations: ['empty', 'date-format'],
      },
      { value: workingCase.decision, validations: ['empty'] },
      { value: workingCase.conclusion, validations: ['empty'] },
      { value: workingCase.ruling, validations: ['empty'] },
    ]).length === 0
  )
}

export const isAdminUserFormValid = (user: User) => {
  return (
    user.institution &&
    validate([
      { value: user.name, validations: ['empty'] },
      { value: user.nationalId, validations: ['empty', 'national-id'] },
      { value: user.title, validations: ['empty'] },
      { value: user.mobileNumber, validations: ['empty'] },
      { value: user.email, validations: ['empty', 'email-format'] },
    ]).length === 0
  )
}
