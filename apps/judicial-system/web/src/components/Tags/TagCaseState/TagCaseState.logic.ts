import { IntlShape } from 'react-intl'

import { TagVariant } from '@island.is/island-ui/core'
import {
  isDistrictCourtUser,
  isIndictmentCase,
  isInvestigationCase,
  isSuccessfulServiceStatus,
} from '@island.is/judicial-system/types'
import {
  CaseListEntry,
  CaseState,
  Defendant,
  IndictmentDecision,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './TagCaseState.strings'

export interface CaseStateTag {
  color: TagVariant
  text: string
}

const haveAllSubpoenasBeenServiced = (defendants: Defendant[]): boolean => {
  return defendants.every((defendant) => {
    // if the defendant was served by alternative means or
    // at least one subpoena for each defendant was serviced,
    // then we return true
    return (
      defendant.isAlternativeService ||
      defendant.subpoenas?.some((subpoena) =>
        isSuccessfulServiceStatus(subpoena.serviceStatus),
      )
    )
  })
}

export const mapIndictmentRulingDecisionToTagVariant = (
  formatMessage: IntlShape['formatMessage'],
  theCase: CaseListEntry,
): CaseStateTag => {
  if (
    theCase.defendants &&
    theCase.defendants.length > 0 &&
    theCase.defendants?.every((d) => d.verdict?.isDefaultJudgement)
  ) {
    return {
      color: 'purple',
      text: 'Útivistardómur',
    }
  }
  return {
    color: 'darkerBlue',
    text: formatMessage(strings.completed, {
      indictmentRulingDecision: theCase.indictmentRulingDecision,
    }),
  }
}

export const mapCaseStateToTagVariant = (
  formatMessage: IntlShape['formatMessage'],
  theCase: CaseListEntry,
  user?: User,
): CaseStateTag => {
  switch (theCase.state) {
    case CaseState.NEW:
    case CaseState.DRAFT:
    case CaseState.WAITING_FOR_CONFIRMATION:
      return { color: 'red', text: formatMessage(strings.draft) }
    case CaseState.SUBMITTED:
      return {
        color: 'purple',
        text: formatMessage(
          isDistrictCourtUser(user) ? strings.new : strings.sent,
        ),
      }
    case CaseState.RECEIVED: {
      if (
        isIndictmentCase(theCase.type) &&
        theCase.defendants &&
        theCase.courtDate &&
        !haveAllSubpoenasBeenServiced(theCase.defendants)
      ) {
        return {
          color: 'red',
          text: formatMessage(strings.notYetServiced),
        }
      }
      switch (theCase.indictmentDecision) {
        case IndictmentDecision.POSTPONING:
        case IndictmentDecision.SCHEDULING:
        case IndictmentDecision.COMPLETING:
          return { color: 'mint', text: formatMessage(strings.scheduled) }
        case IndictmentDecision.POSTPONING_UNTIL_VERDICT:
          return {
            color: 'mint',
            text: formatMessage(strings.postponedUntilVerdict),
          }
        case IndictmentDecision.REDISTRIBUTING:
          return { color: 'blue', text: formatMessage(strings.reassignment) }
      }

      return theCase.courtDate
        ? { color: 'mint', text: formatMessage(strings.scheduled) }
        : { color: 'blueberry', text: formatMessage(strings.received) }
    }

    case CaseState.ACCEPTED:
      return isIndictmentCase(theCase.type) || theCase.isValidToDateInThePast
        ? { color: 'darkerBlue', text: formatMessage(strings.inactive) }
        : {
            color: 'blue',
            text: formatMessage(
              isInvestigationCase(theCase.type)
                ? strings.accepted
                : strings.active,
            ),
          }
    case CaseState.REJECTED:
      return { color: 'rose', text: formatMessage(strings.rejected) }
    case CaseState.DISMISSED:
      return { color: 'dark', text: formatMessage(strings.dismissed) }
    case CaseState.COMPLETED: {
      // TODO: this will be fixed when we have considered ruling decision per defendant
      return mapIndictmentRulingDecisionToTagVariant(formatMessage, theCase)
    }
    case CaseState.WAITING_FOR_CANCELLATION:
      return {
        color: 'rose',
        text: formatMessage(strings.recalled),
      }
    default:
      return { color: 'white', text: formatMessage(strings.unknown) }
  }
}
