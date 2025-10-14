// TODO: Add tests
import {
  isIndictmentCase,
  isTrafficViolationIndictmentCount,
} from '@island.is/judicial-system/types'
import {
  Case,
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseType,
  CourtSessionResponse,
  CourtSessionRulingType,
  DateLog,
  Defendant,
  DefenderChoice,
  IndictmentCount,
  IndictmentCountOffense,
  IndictmentDecision,
  SessionArrangements,
  User,
  Victim,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { isBusiness } from './utils'

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
  | 'appeal-case-number-format'

type ValidateItem = 'valid' | [string | undefined | null, Validation[]]
type IsValid = { isValid: boolean; errorMessage: string }

const getRegexByValidation = (validation: Validation) => {
  switch (validation) {
    case 'empty':
      return {
        regex: /./,
        errorMessage: 'Reitur má ekki vera tómur',
      }
    case 'time-format':
      return {
        regex: /^((0[0-9]|1[0-9]|2[0-3])|[0-9]):[0-5][0-9]$/,
        errorMessage: 'Dæmi: 12:34 eða 1:23',
      }
    case 'police-casenumber-format':
      return {
        regex: /^[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]-\d{1,99999}$/,
        errorMessage: 'Dæmi: 012-3456-7890',
      }
    case 'national-id':
      return {
        regex: /^\d{6}(-?\d{4})?$/,
        errorMessage: 'Dæmi: 000000-0000',
      }
    case 'date-of-birth':
      return {
        regex: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/,
        errorMessage: 'Dæmi: 00.00.0000',
      }
    case 'email-format':
      return {
        regex: /^[\w-.+]+@([\w-]+\.)+[\w-]{2,4}$/,
        errorMessage: 'Netfang ekki á réttu formi',
      }
    case 'phonenumber':
      return {
        regex: /^(\d{3})(-?(\d{4}))$/,
        errorMessage: 'Dæmi: 555-5555',
      }
    case 'date-format':
      return {
        regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z$/,
        errorMessage: '',
      }
    case 'R-case-number':
      return {
        regex: /^R-[0-9]{1,5}\/[0-9]{4}$/,
        errorMessage: `Dæmi: R-1234/${new Date().getFullYear()}`,
      }
    case 'S-case-number':
      return {
        regex: /^S-[0-9]{1,5}\/[0-9]{4}$/,
        errorMessage: `Dæmi: S-1234/${new Date().getFullYear()}`,
      }
    case 'appeal-case-number-format':
      return {
        regex: /^[0-9]{1,4}\/[0-9]{4}$/,
        errorMessage: `Dæmi: 1234/${new Date().getFullYear()}`,
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

          const config = getRegexByValidation(validation)

          const isValid = config.regex.test(value)
          return isValid
            ? undefined
            : { isValid, errorMessage: config.errorMessage }
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
  return Boolean(
    workingCase.defendants &&
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
      ),
  )
}

const areVictimsValid = (victims?: Victim[] | null): boolean => {
  if (!victims) return true

  return victims?.every((victim) => {
    return validate([
      [
        victim.nationalId,
        victim.hasNationalId ? ['empty', 'national-id'] : ['date-of-birth'],
      ],
      [victim.name, ['empty']],
      [victim.lawyerAccessToRequest, victim.lawyerNationalId ? ['empty'] : []],
    ]).isValid
  })
}

export const isRegistrationStepValid = (
  workingCase: Case,
  caseType?: CaseType | null,
  policeCaseNumbers?: string[] | null,
): boolean => {
  return Boolean(
    policeCaseNumbers &&
      policeCaseNumbers.length > 0 &&
      workingCase.type === caseType &&
      validate([
        [workingCase.type, ['empty']],
        ...policeCaseNumbers.map(
          (n): ValidateItem => [n, ['empty', 'police-casenumber-format']],
        ),
      ]).isValid,
  )
}

export const isDefendantStepValidRC = (
  workingCase: Case,
  policeCaseNumbers?: string[] | null,
): boolean => {
  return Boolean(
    policeCaseNumbers &&
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
      ]).isValid,
  )
}

export const isDefendantStepValidIC = (workingCase: Case): boolean => {
  return Boolean(
    !someDefendantIsInvalid(workingCase) &&
      areVictimsValid(workingCase.victims) &&
      (workingCase.defenderName
        ? Boolean(workingCase.requestSharedWithDefender)
        : true) &&
      validate([
        [workingCase.defenderEmail, ['email-format']],
        [workingCase.defenderPhoneNumber, ['phonenumber']],
      ]).isValid,
  )
}

export const isDefendantStepValidIndictments = (workingCase: Case): boolean => {
  return Boolean(
    workingCase.policeCaseNumbers &&
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
      ]).isValid,
  )
}

export const isHearingArrangementsStepValidRC = (
  workingCase: Case,
): boolean => {
  return Boolean(
    workingCase.prosecutor &&
      workingCase.court &&
      validate([
        [workingCase.requestedCourtDate, ['empty', 'date-format']],
        workingCase.type !== CaseType.TRAVEL_BAN && !workingCase.parentCase
          ? [workingCase.arrestDate, ['empty', 'date-format']]
          : 'valid',
      ]).isValid,
  )
}

export const isHearingArrangementsStepValidIC = (
  workingCase: Case,
): boolean => {
  return Boolean(
    workingCase.prosecutor &&
      workingCase.court &&
      validate([[workingCase.requestedCourtDate, ['empty', 'date-format']]])
        .isValid,
  )
}

export const isProcessingStepValidIndictments = (
  workingCase: Case,
): boolean => {
  const defendantsAreValid = workingCase.defendants?.every(
    (defendant) => validate([[defendant.defendantPlea, ['empty']]]).isValid,
  )

  const hasCivilClaimSelected =
    workingCase.hasCivilClaims !== null &&
    workingCase.hasCivilClaims !== undefined

  const allCivilClaimantsAreValid = workingCase.hasCivilClaims
    ? workingCase.civilClaimants?.every(
        (civilClaimant) =>
          civilClaimant.name &&
          validate([
            [
              civilClaimant.nationalId,
              civilClaimant.noNationalId
                ? ['date-of-birth']
                : ['empty', 'national-id'],
            ],
          ]).isValid,
      )
    : true

  return Boolean(
    workingCase.court &&
      hasCivilClaimSelected &&
      allCivilClaimantsAreValid &&
      defendantsAreValid,
  )
}

export const isIndictmentStepValid = (workingCase: Case): boolean => {
  const hasValidDemands = Boolean(
    workingCase.demands &&
      (!workingCase.hasCivilClaims || workingCase.civilDemands),
  )

  if (!workingCase.indictmentSubtypes || !hasValidDemands) {
    return false
  }

  const isValidSpeedingIndictmentCount = (indictmentCount: IndictmentCount) => {
    return indictmentCount.offenses?.some(
      (o) => o.offense === IndictmentCountOffense.SPEEDING,
    )
      ? Boolean(indictmentCount.recordedSpeed) &&
          Boolean(indictmentCount.speedLimit)
      : true
  }

  const hasOffenses = (indictmentCount: IndictmentCount) => {
    return Boolean(
      indictmentCount.offenses && indictmentCount.offenses?.length > 0,
    )
  }

  const isValidTrafficViolation = (indictmentCount: IndictmentCount) =>
    Boolean(indictmentCount.policeCaseNumber) &&
    hasOffenses(indictmentCount) &&
    Boolean(indictmentCount.vehicleRegistrationNumber) &&
    Boolean(indictmentCount.lawsBroken) &&
    Boolean(indictmentCount.incidentDescription) &&
    Boolean(indictmentCount.legalArguments) &&
    isValidSpeedingIndictmentCount(indictmentCount)

  const isValidNonTrafficViolation = (indictmentCount: IndictmentCount) =>
    Boolean(indictmentCount.incidentDescription) &&
    Boolean(indictmentCount.legalArguments)

  const isTrafficViolation = (indictmentCount: IndictmentCount) =>
    isTrafficViolationIndictmentCount(
      indictmentCount.indictmentCountSubtypes,
      indictmentCount.policeCaseNumber &&
        workingCase.indictmentSubtypes[indictmentCount.policeCaseNumber],
    )

  if (!workingCase.indictmentCounts?.length) {
    return false
  }

  return workingCase.indictmentCounts.every((indictmentCount) =>
    isTrafficViolation(indictmentCount)
      ? isValidTrafficViolation(indictmentCount)
      : isValidNonTrafficViolation(indictmentCount),
  )
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
  return Boolean(
    workingCase.judge &&
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
      ]).isValid,
  )
}

export const isCourtHearingArrangemenstStepValidRC = (
  workingCase: Case,
  arraignmentDate?: DateLog,
): boolean => {
  return validate([
    [workingCase.defenderEmail, ['email-format']],
    [workingCase.defenderPhoneNumber, ['phonenumber']],
    [
      arraignmentDate
        ? arraignmentDate.date
        : workingCase.arraignmentDate?.date,
      ['empty', 'date-format'],
    ],
  ]).isValid
}

export const isCourtHearingArrangementsStepValidIC = (
  workingCase: Case,
  arraignmentDate?: DateLog,
): boolean => {
  return Boolean(
    workingCase.sessionArrangements &&
      validate([
        [workingCase.defenderEmail, ['email-format']],
        [workingCase.defenderPhoneNumber, ['phonenumber']],
        [
          arraignmentDate
            ? arraignmentDate.date
            : workingCase.arraignmentDate?.date,
          ['empty', 'date-format'],
        ],
      ]).isValid,
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
  if (workingCase.isCompletedWithoutRuling) {
    return true
  }

  return validate([
    [workingCase.prosecutorDemands, ['empty']],
    [workingCase.courtCaseFacts, ['empty']],
    [workingCase.courtLegalArguments, ['empty']],
  ]).isValid
}

export const isCourtRecordStepValidRC = (workingCase: Case): boolean => {
  return Boolean(
    workingCase.accusedAppealDecision &&
      workingCase.prosecutorAppealDecision &&
      validate([
        [workingCase.courtStartDate, ['empty', 'date-format']],
        [workingCase.courtLocation, ['empty']],
        [workingCase.sessionBookings, ['empty']],
        [workingCase.courtEndTime, ['empty', 'date-format']],
        [workingCase.decision, ['empty']],
        [workingCase.conclusion, ['empty']],
        [workingCase.ruling, ['empty']],
      ]).isValid,
  )
}

export const isCourtRecordStepValidIC = (workingCase: Case): boolean => {
  const validationsWithRuling = !workingCase.isCompletedWithoutRuling
    ? [
        [workingCase.conclusion, ['empty']],
        [workingCase.ruling, ['empty']],
      ]
    : []

  const validations = [
    [workingCase.courtStartDate, ['empty', 'date-format']],
    [workingCase.courtLocation, ['empty']],
    [workingCase.courtEndTime, ['empty', 'date-format']],
    [workingCase.decision, ['empty']],
    ...validationsWithRuling,
  ] as ValidateItem[]

  if (workingCase.sessionArrangements !== SessionArrangements.NONE_PRESENT) {
    validations.push([workingCase.sessionBookings, ['empty']])
  }

  return Boolean(
    workingCase.accusedAppealDecision &&
      workingCase.prosecutorAppealDecision &&
      validate(validations).isValid,
  )
}

export const isSubpoenaStepValid = (
  workingCase: Case,
  updatedDefendants?: Defendant[] | null,
  updatedArraignmentDate?: DateLog | null,
): boolean => {
  const arraignmentDate = updatedArraignmentDate || workingCase.arraignmentDate
  const defendants = updatedDefendants || workingCase.defendants

  const validateDefendants = (defendants?: Defendant[] | null) => {
    return defendants?.every((defendant) =>
      defendant.isAlternativeService
        ? defendant.alternativeServiceDescription
        : defendant.subpoenaType,
    )
  }

  return (
    validate([
      [arraignmentDate?.date, ['empty', 'date-format']],
      [arraignmentDate?.location, ['empty']],
    ]).isValid && Boolean(validateDefendants(defendants))
  )
}

export const isDefenderStepValid = (workingCase: Case): boolean => {
  const defendantsAreValid = () =>
    workingCase.defendants?.every((defendant) => {
      return (
        defendant.defenderChoice === DefenderChoice.WAIVE ||
        defendant.defenderChoice === DefenderChoice.DELAY ||
        !defendant.defenderChoice ||
        validate([
          [defendant.defenderName, ['empty']],
          [defendant.defenderEmail, ['email-format']],
          [defendant.defenderPhoneNumber, ['phonenumber']],
        ]).isValid
      )
    })

  return Boolean(workingCase.prosecutor && defendantsAreValid())
}

export const isCourtSessionValid = (courtSession: CourtSessionResponse) => {
  return (
    (courtSession.isClosed
      ? courtSession.closedLegalProvisions &&
        courtSession.closedLegalProvisions.length > 0
      : true) &&
    (courtSession.rulingType === CourtSessionRulingType.JUDGEMENT ||
    courtSession.rulingType === CourtSessionRulingType.ORDER
      ? !!courtSession.ruling
      : true) &&
    (courtSession.isAttestingWitness
      ? courtSession.attestingWitnessId
      : true) &&
    validate([
      [courtSession.startDate, ['empty', 'date-format']],
      [courtSession.location, ['empty']],
      [courtSession.judgeId, ['empty']],
      [courtSession.entries, ['empty']],
      [courtSession.rulingType, ['empty']],
      [courtSession.endDate, ['empty', 'date-format']],
    ]).isValid
  )
}

export const isIndictmentCourtRecordStepValid = (
  courtSessions?: CourtSessionResponse[] | null,
) => {
  if (!Array.isArray(courtSessions) || courtSessions.length === 0) {
    return false
  }

  return courtSessions.every(isCourtSessionValid)
}

const isIndictmentRulingDecisionValid = (workingCase: Case) => {
  const isCourtRecordValid = () =>
    Boolean(
      (workingCase.courtSessions &&
        workingCase.courtSessions.length > 0 &&
        workingCase.courtSessions.every((session) => session.endDate)) ||
        workingCase.caseFiles?.some(
          (file) => file.category === CaseFileCategory.COURT_RECORD,
        ),
    )

  switch (workingCase.indictmentRulingDecision) {
    case CaseIndictmentRulingDecision.RULING:
    case CaseIndictmentRulingDecision.DISMISSAL:
      return (
        isCourtRecordValid() &&
        Boolean(
          workingCase.caseFiles?.some(
            (file) => file.category === CaseFileCategory.RULING,
          ),
        )
      )
    case CaseIndictmentRulingDecision.FINE:
    case CaseIndictmentRulingDecision.CANCELLATION:
      return isCourtRecordValid()
    default:
      return false
  }
}

export const isConclusionStepValid = (workingCase: Case): boolean => {
  switch (workingCase.indictmentDecision) {
    case IndictmentDecision.POSTPONING:
      return Boolean(workingCase.postponedIndefinitelyExplanation)
    case IndictmentDecision.SCHEDULING:
      return Boolean(
        workingCase.courtSessionType && workingCase.courtDate?.date,
      )
    case IndictmentDecision.COMPLETING:
      return isIndictmentRulingDecisionValid(workingCase)
    case IndictmentDecision.POSTPONING_UNTIL_VERDICT:
    case IndictmentDecision.REDISTRIBUTING:
      return true
    default:
      return false
  }
}

export const isAdminUserFormValid = (user: User): boolean => {
  return Boolean(
    user.institution &&
      user.role &&
      validate([
        [user.nationalId, ['empty', 'national-id']],
        [user.name, ['empty']],
        [user.title, ['empty']],
        [user.mobileNumber, ['empty']],
        [user.email, ['empty', 'email-format']],
      ]).isValid,
  )
}

export const isCourtOfAppealCaseStepValid = (workingCase: Case): boolean => {
  return Boolean(
    (workingCase.appealState === CaseAppealState.WITHDRAWN ||
      (workingCase.appealJudge1 &&
        workingCase.appealJudge2 &&
        workingCase.appealJudge3 &&
        workingCase.appealAssistant)) &&
      validate([
        [workingCase.appealCaseNumber, ['empty', 'appeal-case-number-format']],
      ]).isValid,
  )
}

export const isCourtOfAppealRulingStepFieldsValid = (
  workingCase: Case,
): boolean => {
  return Boolean(
    workingCase.appealRulingDecision &&
      (workingCase.appealRulingDecision ===
        CaseAppealRulingDecision.DISCONTINUED ||
        validate([[workingCase.appealConclusion, ['empty']]]).isValid),
  )
}

export const isCourtOfAppealRulingStepValid = (workingCase: Case): boolean => {
  return Boolean(
    isCourtOfAppealRulingStepFieldsValid(workingCase) &&
      (workingCase.appealRulingDecision ===
        CaseAppealRulingDecision.DISCONTINUED ||
        workingCase.caseFiles?.some(
          (file) => file.category === CaseFileCategory.APPEAL_RULING,
        )),
  )
}

export const isCourtOfAppealWithdrawnCaseStepValid = (
  workingCase: Case,
): boolean => {
  return validate([
    [workingCase.appealCaseNumber, ['empty', 'appeal-case-number-format']],
  ]).isValid
}
