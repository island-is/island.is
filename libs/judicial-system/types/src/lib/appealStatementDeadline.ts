import { AppealEventType } from './eventLog'
import { UserRole } from './user'

// The party a statement deadline belongs to: a defendant, a civil claimant,
// or - when neither is named - the prosecution. The same shape the appeal
// event log uses to name a party, so the two can be matched directly.
export interface AppealStatementParty {
  defendantId?: string | null
  civilClaimantId?: string | null
}

export const isSameAppealStatementParty = (
  a: AppealStatementParty,
  b: AppealStatementParty,
): boolean =>
  (a.defendantId ?? null) === (b.defendantId ?? null) &&
  (a.civilClaimantId ?? null) === (b.civilClaimantId ?? null)

// The deadline that stands for the party, if the court has given one.
export const findAppealStatementDeadline = <T extends AppealStatementParty>(
  deadlines: T[] | null | undefined,
  party: AppealStatementParty,
): T | undefined =>
  deadlines?.find((deadline) => isSameAppealStatementParty(deadline, party))

interface AppealStatementEvent extends AppealStatementParty {
  eventType?: string | null
  userRole?: string | null
}

// The events backfilled from the appeal case's legacy statement dates name
// no party at all; a defender's is told by the role it carries.
const isLegacyDefenderEvent = (eventLog: AppealStatementEvent): boolean =>
  !eventLog.defendantId &&
  !eventLog.civilClaimantId &&
  eventLog.userRole === UserRole.DEFENDER

// Whether the party has filed its statement in the appeal, read from the
// event the statement upload writes. A row naming no party is the
// prosecution's, unless it is a legacy defender's; a court user uploading on
// a party's behalf names the party the same way.
export const hasFiledAppealStatement = (
  eventLogs: AppealStatementEvent[] | null | undefined,
  party: AppealStatementParty,
): boolean =>
  Boolean(
    eventLogs?.some(
      (eventLog) =>
        eventLog.eventType === AppealEventType.APPEAL_STATEMENT_SENT &&
        isSameAppealStatementParty(eventLog, party) &&
        !isLegacyDefenderEvent(eventLog),
    ),
  )
