// TODO: Add tests
import { isIndictmentCase } from '@island.is/judicial-system/types'
import {
  CaseType,
  SessionArrangements,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { TempCase as Case } from '../types'
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
  | 'R-case-number'
  | 'S-case-number'
  | 'vehicle-registration-number'
  | 'appeal-case-number-format'

type ValidateItem = 'valid' | [string | undefined | null, Validation[]]
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
    case 'R-case-number': {
      return {
        regex: new RegExp(/^R-[0-9]{1,5}\/[0-9]{4}$/),
        errorMessage: `Dæmi: R-1234/${new Date().getFullYear()}`,
      }
    }
    case 'S-case-number': {
      return {
        regex: new RegExp(/^S-[0-9]{1,5}\/[0-9]{4}$/),
        errorMessage: `Dæmi: S-1234/${new Date().getFullYear()}`,
      }
    }
    case 'vehicle-registration-number': {
      return {
        regex: new RegExp(/^[A-Z]{2}-[A-Z]{1}[0-9]{2}|[0-9]{3}$/),
        errorMessage: 'Dæmi: AB-123',
      }
    }
    case 'appeal-case-number-format': {
      return {
        regex: new RegExp(/^[0-9]{1,4}\/[0-9]{4}$/),
        errorMessage: `Dæmi: 1234/${new Date().getFullYear()}`,
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

const someDefendantIsInvalid = (workingCase: Case): boolean => {
  return (
    (workingCase.defendants &&
      workingCase.defendants.length > 0 &&
      workingCase.defendants.some(
        (defendant) =>
          (!isBusiness(defendant.nationalId) && !defendant.gender) ||
          !validate([
            [
              defendant.nationalId,
              defendant.noNationalId
                ? ['date-of-birth']
                : ['empty', 'national-id'],
            ],
            [defendant.name, ['empty']],
            [defendant.address, ['empty']],
          ]).isValid,
      )) ||
    false
  )
}

export const isDefendantStepValidRC = (
  workingCase: Case,
  policeCaseNumbers: string[],
): boolean => {
  return (
    policeCaseNumbers.length > 0 &&
    !someDefendantIsInvalid(workingCase) &&
    (workingCase.defenderName
      ? Boolean(workingCase.requestSharedWithDefender)
      : true) &&
    validate([
      ...policeCaseNumbers.map(
        (n): ValidateItem => [n, ['empty', 'police-casenumber-format']],
      ),
      [workingCase.defenderEmail, ['email-format']],
      [workingCase.defenderPhoneNumber, ['phonenumber']],
      workingCase.type === CaseType.TRAVEL_BAN
        ? 'valid'
        : [workingCase.leadInvestigator, ['empty']],
    ]).isValid
  )
}

export const isDefendantStepValidIC = (
  workingCase: Case,
  caseType: CaseType | undefined,
  policeCaseNumbers: string[],
): boolean => {
  console.log(workingCase.defenderName)
  return (
    policeCaseNumbers.length > 0 &&
    workingCase.type === caseType &&
    !someDefendantIsInvalid(workingCase) &&
    (workingCase.defenderName
      ? Boolean(workingCase.requestSharedWithDefender)
      : true) &&
    validate([
      [workingCase.type, ['empty']],
      ...policeCaseNumbers.map(
        (n): ValidateItem => [n, ['empty', 'police-casenumber-format']],
      ),
      [workingCase.defenderEmail, ['email-format']],
      [workingCase.defenderPhoneNumber, ['phonenumber']],
    ]).isValid
  )
}

export const isDefendantStepValidIndictments = (workingCase: Case): boolean => {
  const result =
    workingCase.policeCaseNumbers.length > 0 &&
    !workingCase.policeCaseNumbers.some(
      (n) =>
        !workingCase.indictmentSubtypes ||
        !workingCase.indictmentSubtypes[n] ||
        workingCase.indictmentSubtypes[n].length === 0,
    ) &&
    !someDefendantIsInvalid(workingCase) &&
    validate([
      [workingCase.type, ['empty']],
      ...workingCase.policeCaseNumbers.map(
        (n): ValidateItem => [n, ['empty', 'police-casenumber-format']],
      ),
    ]).isValid

  return result
}

export const isHearingArrangementsStepValidRC = (
  workingCase: Case,
): boolean => {
  return (
    (workingCase.prosecutor &&
      workingCase.court &&
      validate([
        [workingCase.requestedCourtDate, ['empty', 'date-format']],
        workingCase.type !== CaseType.TRAVEL_BAN && !workingCase.parentCase
          ? [workingCase.arrestDate, ['empty', 'date-format']]
          : 'valid',
      ]).isValid) ||
    false
  )
}

export const isHearingArrangementsStepValidIC = (
  workingCase: Case,
): boolean => {
  return (
    (workingCase.prosecutor &&
      workingCase.court &&
      validate([[workingCase.requestedCourtDate, ['empty', 'date-format']]])
        .isValid) ||
    false
  )
}

export const isProcessingStepValidIndictments = (
  workingCase: Case,
): boolean => {
  return workingCase.prosecutor && workingCase.court ? true : false
}

export const isTrafficViolationStepValidIndictments = (
  workingCase: Case,
): boolean => {
  return workingCase.demands ? true : false
}

export const isPoliceDemandsStepValidRC = (workingCase: Case): boolean => {
  return validate([
    [workingCase.lawsBroken, ['empty']],
    [workingCase.requestedValidToDate, ['empty', 'date-format']],
    workingCase.legalProvisions && workingCase.legalProvisions.length > 0
      ? 'valid'
      : [workingCase.legalBasis, ['empty']],
  ]).isValid
}

export const isPoliceDemandsStepValidIC = (workingCase: Case): boolean => {
  return validate([
    [workingCase.demands, ['empty']],
    [workingCase.lawsBroken, ['empty']],
    [workingCase.legalBasis, ['empty']],
  ]).isValid
}

export const isPoliceReportStepValidRC = (workingCase: Case): boolean => {
  return validate([
    [workingCase.demands, ['empty']],
    [workingCase.caseFacts, ['empty']],
    [workingCase.legalArguments, ['empty']],
  ]).isValid
}

export const isPoliceReportStepValidIC = (workingCase: Case): boolean => {
  return validate([
    [workingCase.caseFacts, ['empty']],
    [workingCase.legalArguments, ['empty']],
  ]).isValid
}

export const isReceptionAndAssignmentStepValid = (
  workingCase: Case,
): boolean => {
  return (
    (workingCase.judge &&
      validate([
        [
          workingCase.courtCaseNumber,
          [
            'empty',
            isIndictmentCase(workingCase.type)
              ? 'S-case-number'
              : 'R-case-number',
          ],
        ],
      ]).isValid) ||
    false
  )
}

export const isCourtHearingArrangemenstStepValidRC = (
  workingCase: Case,
  courtDate?: string,
): boolean => {
  const date = courtDate || workingCase.courtDate

  return validate([
    [workingCase.defenderEmail, ['email-format']],
    [workingCase.defenderPhoneNumber, ['phonenumber']],
    [date, ['empty', 'date-format']],
  ]).isValid
}

export const isCourtHearingArrangementsStepValidIC = (
  workingCase: Case,
  courtDate?: string,
): boolean => {
  const date = courtDate || workingCase.courtDate

  return (
    (workingCase.sessionArrangements &&
      validate([
        [workingCase.defenderEmail, ['email-format']],
        [workingCase.defenderPhoneNumber, ['phonenumber']],
        [date, ['empty', 'date-format']],
      ]).isValid) ||
    false
  )
}

export const isRulingValidRC = (workingCase: Case): boolean => {
  return validate([
    [workingCase.prosecutorDemands, ['empty']],
    [workingCase.courtCaseFacts, ['empty']],
    [workingCase.courtLegalArguments, ['empty']],
  ]).isValid
}

export const isRulingValidIC = (workingCase: Case): boolean => {
  return validate([
    [workingCase.prosecutorDemands, ['empty']],
    [workingCase.courtCaseFacts, ['empty']],
    [workingCase.courtLegalArguments, ['empty']],
  ]).isValid
}

export const isCourtRecordStepValidRC = (workingCase: Case): boolean => {
  return (
    (workingCase.accusedAppealDecision &&
      workingCase.prosecutorAppealDecision &&
      validate([
        [workingCase.courtStartDate, ['empty', 'date-format']],
        [workingCase.courtLocation, ['empty']],
        [workingCase.sessionBookings, ['empty']],
        [workingCase.courtEndTime, ['empty', 'date-format']],
        [workingCase.decision, ['empty']],
        [workingCase.conclusion, ['empty']],
        [workingCase.ruling, ['empty']],
      ]).isValid) ||
    false
  )
}

export const isCourtRecordStepValidIC = (workingCase: Case): boolean => {
  const validations = [
    [workingCase.courtStartDate, ['empty', 'date-format']],
    [workingCase.courtLocation, ['empty']],
    [workingCase.courtEndTime, ['empty', 'date-format']],
    [workingCase.decision, ['empty']],
    [workingCase.conclusion, ['empty']],
    [workingCase.ruling, ['empty']],
  ] as ValidateItem[]

  if (workingCase.sessionArrangements !== SessionArrangements.NONE_PRESENT) {
    validations.push([workingCase.sessionBookings, ['empty']])
  }

  return (
    (workingCase.accusedAppealDecision &&
      workingCase.prosecutorAppealDecision &&
      validate(validations).isValid) ||
    false
  )
}

export const isSubpoenaStepValid = (
  workingCase: Case,
  courtDate?: string,
): boolean => {
  const date = courtDate || workingCase.courtDate

  return validate([[date, ['empty', 'date-format']]]).isValid || false
}

export const isDefenderStepValid = (workingCase: Case): boolean => {
  const defendantsAreValid = () =>
    workingCase.defendants?.every((defendant) => {
      return (
        defendant.defendantWaivesRightToCounsel ||
        validate([
          [defendant.defenderName, ['empty']],
          [defendant.defenderEmail, ['email-format']],
          [defendant.defenderPhoneNumber, ['phonenumber']],
        ]).isValid
      )
    })

  return workingCase.prosecutor && defendantsAreValid() ? true : false
}

export const isAdminUserFormValid = (user: User): boolean => {
  return (
    (user.institution &&
      user.role &&
      validate([
        [user.nationalId, ['empty', 'national-id']],
        [user.name, ['empty']],
        [user.title, ['empty']],
        [user.mobileNumber, ['empty']],
        [user.email, ['empty', 'email-format']],
      ]).isValid) ||
    false
  )
}

export const isCourtOfAppealCaseStepValid = (workingCase: Case): boolean => {
  return (
    (workingCase.appealJudge1 &&
      workingCase.appealJudge2 &&
      workingCase.appealJudge3 &&
      workingCase.appealAssistant &&
      validate([
        [workingCase.appealCaseNumber, ['empty', 'appeal-case-number-format']],
      ]).isValid) ||
    false
  )
}

export const isCourtOfAppealRulingStepValid = (workingCase: Case): boolean => {
  const { appealRulingDecision, appealConclusion } = workingCase

  return (
    (appealRulingDecision !== null &&
      validate([[appealConclusion, ['empty']]]).isValid) ||
    false
  )
}
