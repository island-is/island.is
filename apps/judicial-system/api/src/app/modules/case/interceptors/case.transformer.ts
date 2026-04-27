import {
  CaseIndictmentRulingDecision,
  getDefendantServiceDate,
  getIndictmentAppealDeadline,
  getIndictmentVerdictAppealDeadlineStatus,
  hasDatePassed,
  isRequestCase,
} from '@island.is/judicial-system/types'

import { Defendant } from '../../defendant'
import { Case } from '../models/case.model'

interface IndictmentInfo {
  indictmentAppealDeadline?: string
  indictmentVerdictViewedByAll?: boolean
  indictmentVerdictAppealDeadlineExpired?: boolean
}

interface IndictmentInfoParams {
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  rulingDate?: string
  defendants?: Defendant[]
}

const transformRequestCase = (theCase: Case): Case => {
  // Appeal-info fields (hasBeenAppealed, canBeAppealed, appealDeadline,
  // isAppealDeadlineExpired, etc., plus per-appeal fields on case.appealCase)
  // are now computed in the backend's CaseInterceptor and arrive populated.
  return {
    ...theCase,
    requestProsecutorOnlySession: theCase.requestProsecutorOnlySession ?? false,
    isClosedCourtHidden: theCase.isClosedCourtHidden ?? false,
    isHeightenedSecurityLevel: theCase.isHeightenedSecurityLevel ?? false,
    isValidToDateInThePast: theCase.validToDate
      ? hasDatePassed(new Date(theCase.validToDate))
      : theCase.isValidToDateInThePast,
  }
}

export const getIndictmentInfo = ({
  indictmentRulingDecision,
  rulingDate,
  defendants,
}: IndictmentInfoParams): IndictmentInfo => {
  const isFine = indictmentRulingDecision === CaseIndictmentRulingDecision.FINE
  const isRuling =
    indictmentRulingDecision === CaseIndictmentRulingDecision.RULING

  if (!rulingDate) {
    return {}
  }

  const theRulingDate = new Date(rulingDate)
  const indictmentAppealDeadline = getIndictmentAppealDeadline({
    baseDate: theRulingDate,
    isFine,
  }).deadlineDate.toISOString()

  const defendantVerdictInfo = defendants?.map((defendant) => ({
    canAppealVerdict: isRuling || isFine,
    serviceDate: getDefendantServiceDate({
      verdict: defendant.verdict,
      fallbackDate: rulingDate,
    }),
  }))

  const {
    isVerdictViewedByAllRequiredDefendants,
    hasVerdictAppealDeadlineExpiredForAll,
  } = getIndictmentVerdictAppealDeadlineStatus(defendantVerdictInfo, isFine)

  return {
    indictmentAppealDeadline,
    indictmentVerdictViewedByAll: isVerdictViewedByAllRequiredDefendants,
    indictmentVerdictAppealDeadlineExpired:
      hasVerdictAppealDeadlineExpiredForAll,
  }
}

export const getIndictmentDefendantsInfo = (theCase: Case) => {
  return theCase.defendants?.map((defendant) => {
    const baseDate = getDefendantServiceDate({
      verdict: defendant.verdict,
      fallbackDate: theCase.rulingDate,
    })
    const verdictAppealDeadline = baseDate
      ? getIndictmentAppealDeadline({
          baseDate,
          isFine:
            theCase.indictmentRulingDecision ===
            CaseIndictmentRulingDecision.FINE,
        })
      : undefined

    return {
      ...defendant,
      // represents both verdicts and fines
      verdictAppealDeadline: verdictAppealDeadline?.deadlineDate?.toISOString(),
      isVerdictAppealDeadlineExpired: verdictAppealDeadline?.isDeadlineExpired,
    }
  })
}

const transformIndictmentCase = (theCase: Case): Case => {
  const { rulingDate, defendants, indictmentRulingDecision } = theCase

  // Verdict-appeal info (indictmentAppealDeadline, indictmentVerdictViewedByAll,
  // indictmentVerdictAppealDeadlineExpired) is computed here.
  // Case-level dismissal-appeal info is computed in the backend and arrives
  // pre-populated.
  return {
    ...theCase,
    ...getIndictmentInfo({
      indictmentRulingDecision,
      rulingDate,
      defendants,
    }),
  }
}

export const transformCase = (theCase: Case): Case => {
  if (isRequestCase(theCase.type)) {
    return transformRequestCase(theCase)
  }

  return transformIndictmentCase(theCase)
}
