import { AppealEventType } from './eventLog'

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

// Whether the party has filed its statement in the appeal, read from the
// event the statement upload writes. A row naming no party is the
// prosecution's; a court user uploading on a party's behalf, when that
// arrives, has to name the party the same way.
export const hasFiledAppealStatement = (
  eventLogs:
    | (AppealStatementParty & { eventType?: string | null })[]
    | null
    | undefined,
  party: AppealStatementParty,
): boolean =>
  Boolean(
    eventLogs?.some(
      (eventLog) =>
        eventLog.eventType === AppealEventType.APPEAL_STATEMENT_SENT &&
        isSameAppealStatementParty(eventLog, party),
    ),
  )
