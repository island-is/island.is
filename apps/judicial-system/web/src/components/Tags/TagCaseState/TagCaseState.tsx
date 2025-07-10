import { FC, useContext } from 'react'
import { IntlShape, useIntl } from 'react-intl'

import { Tag, TagVariant } from '@island.is/island-ui/core'
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

import { UserContext } from '../../UserProvider/UserProvider'
import { strings } from './TagCaseState.strings'

interface CaseStateTag {
  color: TagVariant
  text: string
}

interface Props {
  theCase: CaseListEntry
  customMapCaseStateToTag?: (
    formatMessage: IntlShape['formatMessage'],
    theCase: CaseListEntry,
  ) => CaseStateTag
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
    case CaseState.COMPLETED:
      return {
        color: 'darkerBlue',
        text: formatMessage(strings.completed, {
          indictmentRulingDecision: theCase.indictmentRulingDecision,
        }),
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

const TagCaseState: FC<Props> = (props) => {
  const { formatMessage } = useIntl()
  const { theCase, customMapCaseStateToTag } = props
  const { user } = useContext(UserContext)

  const tagVariant = customMapCaseStateToTag
    ? customMapCaseStateToTag(formatMessage, theCase)
    : mapCaseStateToTagVariant(formatMessage, theCase, user)

  if (!tagVariant) return null

  return (
    <Tag variant={tagVariant?.color} outlined disabled truncate>
      {tagVariant.text}
    </Tag>
  )
}

export default TagCaseState
