import { formatDate } from '@island.is/judicial-system/formatters'
import {
  findAppealStatementDeadline,
  hasFiledAppealStatement,
  isSameAppealStatementParty,
} from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  type AppealCaseRulingDecision,
  AppealCaseState,
  AppealEventType,
  type User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  type DefenceUserPartyIds,
  getDefenceUserMatchingPartyIds,
} from '@island.is/judicial-system-web/src/utils/utils'

export interface VerdictAppealOverviewBanner {
  title: string
  description?: string
  /** Landsréttur ruling decision, for completed appeals — formatted by the UI. */
  appealRulingDecision?: AppealCaseRulingDecision | null
  /** Shown when this party has already filed its statement. */
  statementSentText?: string
}

export interface VerdictAppealOverviewConclusion {
  title: string
  conclusionText: string
}

const findEarliestPartyDeadline = (
  statementDeadlines: NonNullable<
    WorkingCase['verdictAppealCase']
  >['statementDeadlines'],
  parties: DefenceUserPartyIds[],
): { party: DefenceUserPartyIds; deadline: string } | undefined => {
  let earliest: { party: DefenceUserPartyIds; deadline: string } | undefined

  for (const party of parties) {
    const deadline = findAppealStatementDeadline(
      statementDeadlines,
      party,
    )?.deadline

    if (!deadline) {
      continue
    }

    if (
      !earliest ||
      new Date(deadline).getTime() < new Date(earliest.deadline).getTime()
    ) {
      earliest = { party, deadline }
    }
  }

  return earliest
}

/**
 * Banner for a confirmed appeal advocate (or matching district defender) on
 * the indictment overview: greinargerðarfrest while the appeal is open, or
 * Landsréttur's ruling once the appeal is completed.
 */
export const getVerdictAppealOverviewBanner = (
  workingCase: Pick<
    WorkingCase,
    'type' | 'defendants' | 'civilClaimants' | 'verdictAppealCase'
  >,
  user: User | undefined,
  now: Date = new Date(),
): VerdictAppealOverviewBanner | undefined => {
  const appeal = workingCase.verdictAppealCase

  if (!appeal) {
    return undefined
  }

  if (appeal.appealState === AppealCaseState.COMPLETED) {
    const rulingDate = formatDate(appeal.appealRulingDate, 'PPP')

    return {
      title: rulingDate
        ? `Niðurstaða Landsréttar ${rulingDate}`
        : 'Niðurstaða Landsréttar',
      appealRulingDecision: appeal.appealRulingDecision,
    }
  }

  if (appeal.appealState === AppealCaseState.WITHDRAWN) {
    return {
      title: 'Dómur áfrýjaður',
      description: 'Afturkallað',
    }
  }

  const parties = getDefenceUserMatchingPartyIds(workingCase, user)

  // An empty party matches the prosecution deadline row (null/null). Never
  // look up a deadline until we know which party the user acts for.
  if (parties.length === 0) {
    return undefined
  }

  // Prefer parties that have not filed yet, so a filed earlier deadline does
  // not hide another party's outstanding greinargerðarfrest.
  const outstandingParties = parties.filter(
    (party) => !hasFiledAppealStatement(appeal.appealEventLogs, party),
  )
  const match = findEarliestPartyDeadline(
    appeal.statementDeadlines,
    outstandingParties.length > 0 ? outstandingParties : parties,
  )

  if (!match) {
    return undefined
  }

  const { party, deadline } = match
  const isExpired = new Date(deadline).getTime() < now.getTime()
  const statementEvent = appeal.appealEventLogs?.find(
    (eventLog) =>
      eventLog.eventType === AppealEventType.APPEAL_STATEMENT_SENT &&
      isSameAppealStatementParty(eventLog, party),
  )

  return {
    title: 'Dómur áfrýjaður',
    description: `Frestur til að skila greinargerð ${
      isExpired ? 'rann' : 'rennur'
    } út ${formatDate(deadline, 'PPPp')}`,
    statementSentText:
      hasFiledAppealStatement(appeal.appealEventLogs, party) &&
      statementEvent?.created
        ? `Greinargerð send ${formatDate(statementEvent.created, 'PPPp')}`
        : undefined,
  }
}

/**
 * Landsréttur's written conclusion for a verdict appeal, once the appeal is
 * completed. Draft conclusions stay off the overview until then.
 */
export const getVerdictAppealOverviewConclusion = (
  verdictAppealCase: WorkingCase['verdictAppealCase'],
): VerdictAppealOverviewConclusion | undefined => {
  const conclusionText = verdictAppealCase?.appealConclusion

  if (
    verdictAppealCase?.appealState !== AppealCaseState.COMPLETED ||
    !conclusionText
  ) {
    return undefined
  }

  return {
    title: 'Dómsorð Landsréttar',
    conclusionText,
  }
}
